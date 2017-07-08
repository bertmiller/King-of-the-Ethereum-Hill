pragma solidity ^0.4.4;

contract KoETH{
    uint constant firstGameTimeStamp = 1499114388;
    uint constant gameTimeInterval = 168 hours; //7 days

    /* Config */

    address public koETHHost;
    address public theKing;

    uint public currentHill;
    uint public hillTotal;
    uint public climbAttempts;
    uint public hillNumber = 0;

    uint public fee = 10;
    uint endHillTime;

    event hillBuilt(uint hillNumber, uint starthillNumber, uint endHillTime);
    event ClimbAttempt(uint attemptAmount, address player);
    event ClaimedHill(uint newHill, address newKing);
    event crownKing(uint hillNumber, address king, uint hillHeight);


    /* Builds the game */
    function KoETH() {
      koETHHost = msg.sender;

      buildHill();

    }

    /* Handles payments and checks if someone has claimed the hill */
    function hillAttempt() private {
        if (msg.value > currentHill){
          theKing = msg.sender;
          currentHill = msg.value;

          ClaimedHill(currentHill, theKing);
        }

        hillTotal += msg.value;
        ClimbAttempt(msg.value, msg.sender);
        climbAttempts++;
    }

    function() payable public {
      require(checkGameEnd());
      hillAttempt();
    }


    /* Deals with checking whether the game should be over */
    function checkGameEnd() public returns(bool) {
        if (now >= firstGameTimeStamp) {
          return gameQuery() ? false : true;
        } else {
          return false;
        }
    }

    function gameQuery() public returns(bool) {
        return now > endHillTime;
    }

    /* A function for building hills and ending hills */
    function buildHill() private {
      hillNumber++;

      currentHill = 0;
      climbAttempts = 0;

      theKing = address(0);

      endHillTime = now + gameTimeInterval;

      hillBuilt(hillNumber, now, endHillTime);
    }

    function endHill() public {
      require (checkGameEnd());
      uint maintenanceFee = currentHill/fee;

      if (theKing == address(0)){

      } else {
        withdrawlsMapping[theKing] += currentHill - maintenanceFee;
      }

      withdrawlsMapping[koETHHost] += maintenanceFee;

      crownKing(hillNumber, theKing, (currentHill - maintenanceFee));

      buildHill();
    }

    /* Some functions for getting data */
    function getDataArray() public returns(address, uint, uint, uint, uint, uint){
      return (
        theKing,
        currentHill,
        hillTotal,
        climbAttempts,
        endHillTime,
        hillNumber
        );
    }


    /* A method for withdrawaling money. */

    mapping (address => uint) withdrawlsMapping;

    function getWithdrawlMapping(address inputAddress) public returns(uint){
      return withdrawlsMapping[inputAddress];
    }

    function withdraw() public {
      forceWithdraw(msg.sender);
    }

    function forceWithdraw(address inputAddress) isHost public {
      uint amountOwed = withdrawlsMapping[inputAddress];
      if (amountOwed == 0 ) return;
      withdrawlsMapping[inputAddress] = 0;
      if (!inputAddress.send(amountOwed)) withdrawlsMapping[inputAddress] = amountOwed;
    }

    modifier isHost() {
      if (msg.sender != koETHHost) throw;
      _;
    }


}
