var HelloWorld=artifacts.require('./OpenTrade.sol');
module.exports = function(deployer) {
    deployer.deploy(HelloWorld);
}
