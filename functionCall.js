// Welcome to the Mass Key Deletion recipe.

const nearAPI = require("near-api-js"); // imports near api js
const { parseNearAmount } = require("near-api-js/lib/utils/format");

// Standard setup to connect to NEAR While using Node
const { keyStores, KeyPair, connect } = nearAPI;
const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = require("path").join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

let config;

const configSetting = "mainnet";

const GAS_FOR_NFT_APPROVE = "20000000000000";
const GAS_FOR_RESOLVE_TRANSFER = "10000000000000";
const GAS_FOR_NFT_TRANSFER = "30000000000000";
const MAX_GAS = "300000000000000";
const DEPOSIT = "450000000000000000000";

// setting configuration based on input
switch (configSetting) {
  case "mainnet":
    config = {
      networkId: "mainnet",
      keyStore, // optional if not signing transactions
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://wallet.near.org",
      helperUrl: "https://helper.mainnet.near.org",
      explorerUrl: "https://explorer.mainnet.near.org",
    };
    console.log("configuration set to mainnet ");

    break;

  case "testnet":
    config = {
      networkId: "testnet",
      keyStore, // optional if not signing transactions
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    console.log("configuration set to testnet ");
    break;
  default:
    console.log(`please choose a configuration `);
}

const NFT_CONTRACT_ID = "asac.near";

const viewFunction = async () => {
  //Load Your Account
  const near = await connect(config);
  const account = await near.account("xuguangxia.near");

  let nft_list;
  nft_list = await account.functionCall({
    contractId: NFT_CONTRACT_ID,
    methodName: "nft_transfer",
    args: {
      receiver_id: "formaldeid.near",
      token_id: "5",
    },
    gas: GAS_FOR_NFT_TRANSFER,
    attachedDeposit: parseNearAmount("0")
  });
  console.log("NFT LIST:", nft_list);
};

viewFunction();
