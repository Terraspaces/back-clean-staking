const nearAPI = require("near-api-js"); // imports near api js
const homedir = require("os").homedir();
const { keyStores, connect } = nearAPI;

const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = require("path").join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
  networkId: "mainnet",
  keyStore,
  nodeUrl: "https://rpc.mainnet.near.org",
  walletUrl: "https://wallet.mainnet.near.org",
  helperUrl: "https://helper.mainnet.near.org",
  explorerUrl: "https://explorer.mainnet.near.org",
};

const doFetch = async () => {
  const near = await connect(config);

  let response = await near.connection.provider.query({
    request_type: "call_function",
    finality: "final",
    account_id: "asac.near",
    method_name: "nft_total_supply",
    args_base64: "e30=",
  });

  let results = JSON.parse(Buffer.from(response.result).toString())
  console.log("total_supply", results);

  response = await near.connection.provider.query({
    request_type: "call_function",
    finality: "final",
    account_id: "asac.near",
    method_name: "nft_tokens",
    args_base64: btoa(`{"from_index" : "0", "limit" : 5}`),
  });

  results = JSON.parse(Buffer.from(response.result).toString())
  console.log(results);
}


doFetch();