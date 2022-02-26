// Set the font to the users default font selection stored in cookie
if(!localStorage.getItem('fonts')) localStorage.setItem('fonts', 'JetBrains Mono');
document.getElementById("term").style.fontFamily = localStorage.getItem('fonts');

function fauxTerm(config) {
  
    var term = config.el || document.getElementById('term');
    var termBuffer = config.initialMessage || '';
    var lineBuffer = config.initialLine || '';
    var cwd = config.cwd || "~/";
    var tags = ['red', 'blue', 'white', 'bold'];
    var colors = ['red', 'blue', 'green', 'purple', 'orange'];
    var processCommand = config.cmd || false;
    var maxBufferLength = config.maxBufferLength || 8192;
    var commandHistory = [];
    var currentCommandIndex = -1;
    var maxCommandHistory = config.maxCommandHistory || 100;
    var autoFocus = config.autoFocus || false;
    var coreCmds = {
      "cmds": cmds,
      "clear": clear,
      "help": help,
      "author": author,
      "webapp": webapp,
      "login": login,
      "mint": mint,
      "doge": doge,
      "font": font,
      "color": color,
      "donate": donate,
    };
    
    var fauxInput = document.createElement('textarea');
    fauxInput.className = "faux-input";
    document.body.appendChild(fauxInput);
    if ( autoFocus ) {
      fauxInput.focus();
    }
    afterLine("Type {white}{bold}help{/bold}{/white} or {white}{bold}cmds{/bold}{/white} to get starting\n");
  
    function getLeader() {
      return cwd + "$ ";
    }
  
    function renderTerm() {
      var bell = '<span class="bell"></span>';
      var ob = termBuffer + getLeader() + lineBuffer;
      term.innerHTML = ob;
      term.innerHTML += bell;
      term.scrollTop = term.scrollHeight;
    }
    
    function writeToBuffer(str) {
      termBuffer += str;
      
      //Stop the buffer getting massive.
      if ( termBuffer.length > maxBufferLength ) {
        var diff = termBuffer.length - maxBufferLength;
        termBuffer = termBuffer.substr(diff);
      }
      
    }
    
    function renderStdOut(str) {
      var i = 0, max = tags.length;
      for ( i; i<max; i++ ) {
        var start = new RegExp('{' + tags[i] + '}', 'g');
        var end = new RegExp('{/' + tags[i] + '}', 'g');
        str = str.replace(start, '<span class="' + tags[i] + '">');
        str = str.replace(end, '</span>');
      }
      return str;
    }
    
    const func_desc = {
      'clear': "  => 'Clear all text'\n",
      'login': "  => 'Login with Metamask'\n",
      'donate': " => 'Donate 0.1 MATIC to the treasury'\n",
      'webapp': " => 'Opens the simplified webapp gui'\n",
      'doge': "   => 'Show your love for doge'\n",
      'author': " => 'Creator's page'\n",
      'color': "  => 'Font colors: default, red, blue, green, purple, orange'\n",
      'font': "   => 'Font styles: default, linux, ibm, astro'\n"
    }

    function cmds(argv, argc) {
      return "Commands: "+Object.keys(func_desc)+"\n";
    }

    function clear(argv, argc) {
      termBuffer = "";
      return "";
    }

    function help(argv, argc) {
      s= "Command  => 'Description'\n==========================\n"
      for (const [key, value] of Object.entries(func_desc)) {
        s+= `${key}: ${value}`
      }
      return s;
    }

    function author(argv, argc) {
      return "software => 'Matt t 👨‍💻'\n"+
              "design   => 'Kj3d 🎨🖌'\n";
    }

    function webapp(argv, argc) {
      window.location.href = "index";
      return;
    }

    function login(argv, argc) {
      loginWeb3();
      return "Attempting login...\n";
    }

    function donate(argv, argc) {
      makeDonation();
      return "Processing transaction...\n";
    }

    function mint(argv, argc) {
      return "Minting coming soon\n";
    }

    function doge(argv, argc) {
      return "🐕🐕🐕\n";
    }

    function color(argv, argc) {
      if (argc === 1){
        return 'color'+ func_desc['color'];
      }

      if(argv[1] === 'default')
      {
        changeStylesheetRule('.term-focus', 'color' ,'#ccc');
        return "Color changed to default\n";
      }
 
      for(let i = 0; i < colors.length; i++)
      {
        if(colors[i] === argv[1])
        {
          changeStylesheetRule('.term-focus', 'color' ,colors[i]);
          return "Color changed to " + colors[i] +"\n";
        }
      }
      return "Color not valid 🖍\n"
    }

    function font(argv, argc) {
      if (argc === 1){
        return 'font'+ func_desc['font'];
      }
      if (!["default","linux","ibm", "astro"].includes(argv[1])){return "Font not valid\n";}
      if (argv[1] === "default"){
        document.getElementById("term").style.fontFamily = 'JetBrains Mono';
        localStorage.fonts = 'JetBrains Mono';
      }
      if (argv[1] == "linux"){
        document.getElementById("term").style.fontFamily = 'Ubuntu Mono';
        localStorage.fonts = 'Ubuntu Mono';
      }
      if (argv[1] == "ibm"){
        document.getElementById("term").style.fontFamily = 'IBM Plex Mono';
        localStorage.fonts = 'IBM Plex Mono';
      }
      if (argv[1] == "astro"){
        document.getElementById("term").style.fontFamily = 'Major Mono Display';
        localStorage.fonts = 'Major Mono Display';
      }
      return "Font changed to "+document.getElementById("term").style.fontFamily+"\n";
    }

    async function loginWeb3(argv, argc){
      user = await Moralis.Web3.authenticate({ signingMessage: "Log in" })
        .then(function (user) {
          // Get user Address
         cwd = user.get('ethAddress').slice(0,6) + '@D:/';
         afterLine('Login was successful 👍')
        })
        .catch(err => {
          afterLine('Error logging in 👎');
        });
    }

    async function makeDonation() {
      if(!Moralis.User.current()) { afterLine('Please login before making contract calls') }
      await Moralis.Web3.authenticate({ signingMessage: "Donate" }).then(function () {
        Moralis.executeFunction(options).then(text => {
          afterLine('Thank you for the donation! 😎');
        })
        .catch(err => {
          afterLine('Error transaction failed ✖');
        });
      })
      .catch(err => {
        afterLine('Error transaction failed ✖');
      });
    }
    
    function isCoreCommand(line) {
      if ( coreCmds.hasOwnProperty(line) ) {
        return true;
      }
      return false;
    }
    
    function coreCommand(argv, argc) {
      
      var cmd = argv[0];
      return coreCmds[cmd](argv, argc);
      
    }

    function afterLine(str) {
      writeToBuffer( getLeader() + lineBuffer );
      lineBuffer = "";
      stdout = str +'\n'
      stdout = renderStdOut(stdout);
      writeToBuffer(stdout);
      renderTerm();
    }
  
    function processLine() {
      
      //Dispatch command
      var stdout, line = lineBuffer, argv = line.split(" "), argc = argv.length;
      
      var cmd = argv[0];
      
      lineBuffer += "\n";
      writeToBuffer( getLeader() + lineBuffer );
      lineBuffer = "";
       
      //If it's not a blank line.
      if ( cmd !== "" ) {
        
        //If the command is not registered by the core.
        if ( !isCoreCommand(cmd) ) {
          
          //User registered command
          if ( processCommand ) {
            stdout = processCommand(argv,argc);
          } else {
            stdout = "{white}{bold}" + cmd + "{/bold}{/white}: command not found\n";
          }
        } else {
          //Execute a core command
          stdout = coreCommand(argv,argc);
        }
  
        //If an actual command happened.
        if ( stdout === false ) {
          stdout = "{white}{bold}" + cmd + "{/bold}{/white}: command not found\n";
        }
      
        stdout = renderStdOut(stdout);
        writeToBuffer(stdout);
        
        addLineToHistory(line);
      
      }
  
      renderTerm();
    }
    
    function addLineToHistory(line) {
      commandHistory.unshift( line );
      currentCommandIndex = -1;
      if ( commandHistory.length > maxCommandHistory ) {
        console.log('reducing command history size');
        console.log(commandHistory.length);
        var diff = commandHistory.length - maxCommandHistory;
        commandHistory.splice(commandHistory.length -1, diff);
        console.log(commandHistory.length);
      }
    }
    
    function isInputKey(keyCode) {
      var inputKeyMap = [32,190,192,189,187,220,221,219,222,186,188,191];
      if ( inputKeyMap.indexOf(keyCode) > -1 ) {
        return true;
      }
      return false;
    }
    
    function toggleCommandHistory(direction) {
      
      var max = commandHistory.length -1;
      var newIndex = currentCommandIndex + direction;
      
      if ( newIndex < -1 ) newIndex = -1;
      if ( newIndex >= commandHistory.length) newIndex = commandHistory.length -1;
      
      if ( newIndex !== currentCommandIndex ) {
        currentCommandIndex = newIndex;
      }
      
      if ( newIndex > -1 ) {
        //Change line to something from history.
        lineBuffer = commandHistory[newIndex];
      } else {
        //Blank line...
        lineBuffer = "";
      }
    }
  
    function acceptInput(e) {
      e.preventDefault();
      
       fauxInput.value = "";
      
      if ( e.keyCode >= 48 && e.keyCode <= 90 || isInputKey(e.keyCode) ) {
        if (! e.ctrlKey ) {
          //Character input
          lineBuffer += e.key;
        } else {
          //Hot key input? I.e Ctrl+C
        }
      } else if ( e.keyCode === 13 ) {
        processLine();
      } else if ( e.keyCode === 9 ) {
        lineBuffer += "\t";
      } else if ( e.keyCode === 38 ) {
        toggleCommandHistory(1);
      } else if ( e.keyCode === 40 ) {
        toggleCommandHistory(-1);
      }
      else if ( e.key === "Backspace" ) {
        lineBuffer = lineBuffer.substr(0, lineBuffer.length -1);
      }
  
      renderTerm();
    }
  
    term.addEventListener('click', function(e){
      fauxInput.focus();
      term.classList.add('term-focus');
      renderTerm();
    });
    fauxInput.addEventListener('keydown', acceptInput);
    fauxInput.addEventListener('blur', function(e){
      term.classList.remove('term-focus');
    });
    renderTerm();
    
  }

  var myTerm = new fauxTerm({
    el: document.getElementById("term"),
    cwd: "guest@D:/",
    initialMessage: "System Degenerate [Version 69.420.9000]\n---------------------------------------\n",
    //initialLine: "help",
  });

  function changeStylesheetRule(selector, property, value) {
    var s = document.styleSheets[1];
    selector = selector.toLowerCase();
    property = property.toLowerCase();
    value = value.toLowerCase();
  
    for(var i = 0; i < s.cssRules.length; i++) {
      var rule = s.cssRules[i];
      if(rule.selectorText === selector) {
        rule.style[property] = value;
        return;
      }
    }
    stylesheet.insertRule(selector + " { " + property + ": " + value + "; }", 0);
  }
