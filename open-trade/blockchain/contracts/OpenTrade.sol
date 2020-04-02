pragma solidity ^0.5.16;

contract OpenTrade {
    struct Transaction {
        string destination;
        string hash;
    }
    struct Product {
        string origin;
        string hash;
        Transaction[] transactions;
    }

    mapping (string => Product) private products;


    function createProduct(string memory key, string memory origin,string memory hash) public {
        products[key].origin = origin;
        products[key].hash = hash;
    }

    function addTransaction(string memory productKey, string memory destination,string memory hash) public {
        Transaction memory t;
        t.destination = destination;
        t.hash = hash;
        products[productKey].transactions.push(t);
    }

    function getLastTransaction(string memory productKey) public view returns (string memory,string memory) {
        Transaction[] memory transactions = products[productKey].transactions;
        if (transactions.length==0){
            return ('','');
        }
        Transaction memory lastTransaction = transactions[transactions.length-1];
        return (lastTransaction.destination, lastTransaction.hash);
    }
}
