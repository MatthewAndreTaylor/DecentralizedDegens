// Smart Contract Buttons
donateButton = document.querySelector('#donate');
donateButton.addEventListener("click" , () =>{ makeDonation() });


// Wallet Buttons
walletConnect = document.querySelector('#wallet-connect');
walletDisconnect = document.querySelector('#wallet-disconnect');
walletConnect.addEventListener("click" , () =>{ login() });
walletDisconnect.addEventListener("click" , () =>{ logout() });

/* Authentication code */
async function login(){
  if(Moralis.User.current()){ return }
  user = await Moralis.Web3.authenticate({ signingMessage: "Log in" })
    .then(function (user) {
		createToast('generic','Logged in 🎯');
      	// Get user Address
	 	add = user.get('ethAddress');
		document.getElementById("wallet-text").innerHTML = add.slice(0,13)+ "...";
    })
}

// Logout a user
async function logout(){
	Moralis.User.logOut().then(() => {
	  // Check if there was a user was signed in
	  if(document.getElementById("wallet-text").innerHTML != "Connect Wallet"){
		document.getElementById("wallet-text").innerHTML = "Connect Wallet"
		createToast('generic','Logged out 🙋‍♂️');
	  }
	  const currentUser = Moralis.User.current();  // this will now be null
	});
}

// On page ready check for user
$(document).ready(function() {
	const currentUser = Moralis.User.current()
  	if(!currentUser){ return }
  	// Get user address
  	add = currentUser.get('ethAddress');
  	document.getElementById("wallet-text").innerHTML = add.slice(0,13)+ "...";
});

async function makeDonation() {
	if(!Moralis.User.current()) {
		createToast('generic','Please Log in 📝');
		return;
	}
  	await Moralis.Web3.authenticate({ signingMessage: "Donate" }).then(function () {
		Moralis.executeFunction(options).then(text => {
			createToast('success','Thank you for the donation! 😎');
		})
		.catch(err => {
			createToast('error','Error transaction failed ✖');
		});
  	})
	.catch(err => {
		createToast('error','Error transaction failed ✖');
	});
}