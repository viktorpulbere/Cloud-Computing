export const config = {
  apiUrl: 'https://open-trade-vav.azurewebsites.net',
  // apiUrl: 'http://localhost:3000',
  apiKey: 'AIzaSyABI62zN62V-GKBX0lGcfcWQjxNs5XM_tc',
  geocodeUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
  geocodeUrlMicrosoft: 'https://atlas.microsoft.com/search/address/json',
  apiKeyMicrosoft: 'Nj6aE_DSvmkSJqABRiLQKA9eyXUaeTkQdG3j1L0FF68',
  blockchainUrl: 'http://20.50.160.165:8545',
  abi: '[{"constant":false,"inputs":[{"internalType":"string","name":"productKey","type":"string"},{"internalType":"string","name":"destination","type":"string"},{"internalType":"string","name":"hash","type":"string"}],"name":"addTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"origin","type":"string"},{"internalType":"string","name":"hash","type":"string"}],"name":"createProduct","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"string","name":"productKey","type":"string"}],"name":"getLastTransaction","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"string","name":"productKey","type":"string"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getTransaction","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]',
  contract_address: '0xc87b974306B789C6ACba82F4BB3670A88B6685f2',
};
