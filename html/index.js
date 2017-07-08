web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var abi = [{"constant":false,"inputs":[],"name":"gameQuery","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"koETHHost","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"endHill","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"hillNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"inputAddress","type":"address"}],"name":"getWithdrawlMapping","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"checkGameEnd","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"inputAddress","type":"address"}],"name":"forceWithdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getDataArray","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"hillTotal","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"climbAttempts","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"theKing","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"currentHill","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hillNumber","type":"uint256"},{"indexed":false,"name":"starthillNumber","type":"uint256"},{"indexed":false,"name":"endHillTime","type":"uint256"}],"name":"hillBuilt","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"attemptAmount","type":"uint256"},{"indexed":false,"name":"player","type":"address"}],"name":"ClimbAttempt","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newHill","type":"uint256"},{"indexed":false,"name":"newKing","type":"address"}],"name":"ClaimedHill","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hillNumber","type":"uint256"},{"indexed":false,"name":"king","type":"address"},{"indexed":false,"name":"hillHeight","type":"uint256"}],"name":"crownKing","type":"event"}];

KoETHContract = web3.eth.contract(abi);
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
contractInstance = KoETHContract.at("0x361bbf16992f12fb2c498320f9be4a029b4c1dc7");


function voteForCandidate(candidate) {
  let dataArray = contractInstance.getDataArray.call();
  let theKingName = dataArray;
  let ether = " ether"
  let currentHill = dataArray[1]/1000000000000000000;
  let ch = currentHill + ether;
  document.getElementById('KoETH').innerText = theKingName;
  document.getElementById('currentHill').innerText = ch;
  // contractInstance.voteForCandidate(candidateName, {from: web3.eth.accounts[0]}, function() {
  //   // let div_id = candidates[candidateName];
  //   // $("#" + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString());
  // });
}


$(document).ready(function() {
  let dataArray = contractInstance.getDataArray.call();
  let name = dataArray[0];
  let ether = " ether"
  let currentHill = dataArray[1]/1000000000000000000;
  let ch = currentHill + ether;
  document.getElementById('KoETH').innerText = name;
  document.getElementById('currentHill').innerText = ch;
});
