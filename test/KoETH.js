var KoETH = artifacts.require("./KoETH.sol");
var firstGameTime = 1499203533;
var gameTime = 60;


contract('KoETH', function(accounts) {
  var host = web3.eth.accounts[0];
  var bidder1 = web3.eth.accounts[1];
  var bidder2 = web3.eth.accounts[2];
  var bidder3 = web3.eth.accounts[3];
  var bidder4 = web3.eth.accounts[4];



  it('Should not start until the first game time', function() {
    return KoETH.deployed().then(function(instance){
      instance.checkGameEnd.call();
    });
  });

  it("Should have a new hill", function() {
    return KoETH.deployed().then(function(instance){
      return forceNewHill(instance);
    });
  });


  it("Should handle a first bet // alternative", function() {
    return KoETH.deployed().then(function(instance) {
      return getData(instance)
      .then(function (state) {
        return instance.sendTransaction({
          from: bidder1,
          to: instance.address,
          gas: 1000000,
          value: web3.toWei(1, "ether")
        });
      });
     var block = web3.eth.getBlock('latest');

     return updateData(instance, {
        theKing: bidder1,
        currentHill: web3.toWei(1, "ether"),
        climbAttempts: 1
      });
    });
  });

  it("Should handle a first bet", function() {
    return KoETH.deployed().then(function(instance) {
      web3.eth.sendTransaction({
        from: bidder1,
        to: instance.address,
        gas: 1000000,
        value: web3.toWei(1, "ether")
      })

     var block = web3.eth.getBlock('latest');

     return updateData(instance, {
        theKing: bidder1,
        currentHill: web3.toWei(1, "ether"),
        climbAttempts: 2
      });
    });
  });

  it("Should handle a followup, larger bet", function() {
    return KoETH.deployed().then(function(instance) {
      web3.eth.sendTransaction({
        from: bidder2,
        to: instance.address,
        gas: 0x0196e6,
        value: web3.toWei(2, "ether")
      });

      var block = web3.eth.getBlock('latest');

      return updateData(instance, {
         theKing: bidder2,
         currentHill: web3.toWei(2, "ether"),
         climbAttempts: 3
       });
    });
  });

  it("Should handle a followup, smaller bet", function() {
    return KoETH.deployed().then(function(instance) {
      web3.eth.sendTransaction({
        from: bidder3,
        to: instance.address,
        gas: 0x0196e6,
        value: web3.toWei(1, "ether")
      });

      var block = web3.eth.getBlock('latest');

      return updateData(instance, {
         theKing: bidder2,
         currentHill: web3.toWei(2, "ether"),
         climbAttempts: 4
       });
    });
  });

  it("Should be able to end the hill when needed", function() {
    return KoETH.deployed().then(function(instance) {
      return getData(instance)
      .then(function(state) {
        return instance.gameQuery.call()
        .then(function (shouldEnd) {
          assert.equal(shouldEnd, false, "hill should be over but it is not");
        });
      });
    });
  });

  it("Should handle pending withdrawals", function () {
    return KoETH.deployed().then(function(instance) {
      return getData(instance)
      .then(function (state) {
        return instance.endHill.sendTransaction({
          from: bidder4
        })
        .then(function () {
          var currentHill = state.currentHill;
          var hostFee = currentHill.dividedBy(10).floor();
          var eKingPrize = currentHill.minus(hostFee);

          return Promise.all([
           instance.getWithdrawlMapping.call(host),
           instance.getWithdrawlMapping.call(state.theKing)
         ])
         .then(function (withdrawlsMapping) {
           assert.isTrue(hostFee.equals(withdrawlsMapping[0]), "Host fee is not " + hostFee);
           assert.isTrue(eKingPrize.equals(withdrawlsMapping[1]), "King prize is not " + eKingPrize);
         });
        });
      });
    });
  });

  it("Should pay out the right amount to the King", function () {
    return KoETH.deployed().then(function(instance) {
      return instance.getWithdrawlMapping.call(bidder2)
      .then(function (withdrawlsMapping) {
        var initialBalance = web3.eth.getBalance(bidder2);

        return instance.forceWithdraw.sendTransaction(bidder2, {
          from: host
        })
        .then(function () {
          var eKingPrize = initialBalance.add(withdrawlsMapping);

          assert.isTrue(web3.eth.getBalance(bidder2).equals(eKingPrize), "King's balance is unexpected");
        });
      });
    });
  });

  it("Should be ready for a new hill", function () {
    return KoETH.deployed().then(function(instance) {
      return forceNewHill(instance)
      .then(function (){
        return instance.checkGameEnd.call();

      }).then(function (active) {
        assert.equal(active, true, "game is not active");
      });
    });
  });

  it("Should handle a first bet on new game // alternative", function() {
    return KoETH.deployed().then(function(instance) {
      return getData(instance)
      .then(function (state) {
        return instance.sendTransaction({
          from: bidder1,
          to: instance.address,
          gas: 1000000,
          value: web3.toWei(1, "ether")
        });
      });
     var block = web3.eth.getBlock('latest');

     return updateData(instance, {
        theKing: bidder1,
        currentHill: web3.toWei(1, "ether"),
        climbAttempts: 1
      });
    });
  });


});

function getData (instance) {
  return instance.getDataArray.call()
  .then(function (data) {
    return {
      theKing: data[0].valueOf(),
      currentHill: data[1],
      hillTotal: data[2],
      climbAttempts: data[3],
      endHillTime: data[4],
      hillNumber: data[5]
    }
  });
}

function forceNewHill (instance) {
  return getData(instance)
  .then(function (data){
    assert.equal(data.theKing, '0x0000000000000000000000000000000000000000', 'The hill has a king');
    assert.isTrue(data.currentHill.equals(0), 'Their is a hill when there should not be');
  });
}

function updateData (instance, state) {
  return getData(instance)
    .then(function (data) {
      Object.keys(state).forEach(function (key) {
        if (data[key].equals) {
          assert.isTrue(data[key].equals(state[key]), key + " != " + state[key].valueOf());
        } else {
          assert.equal(data[key], state[key], key + " != " + state[key]);
        }
      });
    });
}
