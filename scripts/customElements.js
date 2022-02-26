class NavComponent extends HTMLElement {
    constructor() {
      super();
    }
    
    connectedCallback() {
      this.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-light">
      <a class="navbar-brand" href="#">
        <img src="./images/favicon.png" class="d-inline-block align-top" alt="">
        Decentralized Degens
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <i class='bx bx-menu'></i>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li>
            <a class="nav-link icon" href="https://www.decentralizeddegen.com">Home</a>
          </li>
          <li>
            <a class="nav-link icon" href="#">Mint</a>
          </li>
          <li>
            <a class="nav-link icon disabled" href="#">View</a>
          </li>
          <li>
            <a class="nav-link icon" href="terminal">Terminal</a>
          </li>
          <li>
            <a class="nav-link icon" href="#" id="wallet-connect">
              <i class="bx bx-wallet split"></i>
              <span class="nav-text" id="wallet-text">Connect Wallet</span>
            </a>
          </li>
          <li>
            <a class="nav-link icon" href="#" id="wallet-disconnect">
              <i class="bx bx-log-out split"></i>
              <span class="nav-text">Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
      `;
    }
  }

customElements.define('nav-component', NavComponent);
  