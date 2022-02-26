var serverUrl;
var appId;

/*Get from project files*/
$.ajax({
  async: false,
  type: "GET",
  url: "settings.json",
  success: function(response)
  {
    serverUrl = response.serverUrl;
    appId = response.appId;
  },
  error: function(response){console.log('Server appId not found');}
});

// Moralis init code
Moralis.start({ serverUrl, appId });
serverUrl='';
appId='';

ABI =[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Donate",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "newDonation",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
]
const contract_address = "0x6B7723753442241cb4fe24854f319E21129D9ACf";
// Contract options
const options = {
	contractAddress: contract_address,
	functionName: "newDonation",
	abi: ABI,
	params: {},
	msgValue: Moralis.Units.ETH("0.1"),
	awaitReceipt: false
}