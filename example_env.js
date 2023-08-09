import accounts from "./scripts/accounts";

export default {
  outputFile: "output.txt",
  confirmationPollingTimeoutSecond: 500000,
  syncInterval: 15000, // 0 for tests, 5000 for deploying
  confirmTimeout: 180000, // 90000 for tests, 180000 for deploying
  network: "ghostnet",
  networks: {
    mainnet: {
      rpc: "https://mainnet.smartpy.io",
      port: 443,
      network_id: "*",
      secretKey: accounts.admin.sk,
    },
    ghostnet: {
        rpc: "https://ghostnet.ecadinfra.com",
        port: 443,
        network_id: "*",
        secretKey: accounts.admin.sk,
      },
  },
  fa12contract: 'KTXXXXX',
  fa12initstate: {
    admin: {
      
      single: 1000,
      tokenId: [0],
      amount: [1000]
    
    },
  },
};
