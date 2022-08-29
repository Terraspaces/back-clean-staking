// Welcome to the Mass Key Deletion recipe.

const nearAPI = require("near-api-js"); // imports near api js

// Standard setup to connect to NEAR While using Node
const { keyStores, KeyPair, connect } = nearAPI;
const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = require("path").join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);
let config;
const X_PARAS_COLLECTIONS = [
  "flipped-face-by-taiternnear",
  "the-wooks-by-nearwooksnear",
  "near-nomad-by-puunboynear",
  "mara-gen-0-by-maranftnear",
  "boo-monster-by-omarbibznear",
  "starry-night-by-markoethnear",
];
// STEP 2 Choose your configuration.
// set this variable to either "testnet" or "mainnet"
// if you haven't used this before use testnet to experiment so you don't lose real tokens by deleting all your access keys
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

const STAKING_CONTRACT_ID = "terraspaces-staking.near";
const FARMING_CONTRACT_ID = "terraspaces-farming.near";
const NFT_CONTRACT_ID = "terraspaces.near";

const Clean_Staking = async () => {
  //Load Your Account
  const near = await connect(config);

  // STEP 4 enter your mainnet or testnet account name here!
  const account = await near.account("xuguangxia.near");

  // let stake_info = await account.viewFunction(
  //   STAKING_CONTRACT_ID,
  //   "get_staking_informations_by_owner_id",
  //   {
  //     account_id: "xuguangxia.near",
  //     from_index: "0",
  //     limit: 10,
  //   },
  // );

  // console.log(stake_info)

  let nft_list;
  nft_list = await account.viewFunction(
    STAKING_CONTRACT_ID,
    "get_nft_contract_ids",
    {
      account_id: NFT_CONTRACT_ID,
      from_index: "0",
      limit: 500,
    }
  );

  nft_list.push("x.paras.near");

  console.log("NFT LIST:", JSON.stringify(nft_list));

  for (let i = 0; i < nft_list.length * 2; i++) {
    if (X_PARAS_COLLECTIONS.includes(nft_list[Math.floor(i / 2)])) continue;

    console.log("STARTING ....:", nft_list[Math.floor(i / 2)]);

    let result;
    result = await account.viewFunction(
      STAKING_CONTRACT_ID,
      "get_staking_informations_by_contract_id",
      {
        account_id: nft_list[Math.floor(i / 2)],
        from_index: i % 2 == 0 ? "0" : "500",
        limit: 500,
      }
    );

    for (let index = 0; index < result.length; index++) {
      let stake_info = await account.viewFunction(
        STAKING_CONTRACT_ID,
        "get_staking_information",
        {
          nft_contract_id: nft_list[Math.floor(i / 2)],
          token_id: result[index],
        }
      );

      let token_info = await account.viewFunction(
        nft_list[Math.floor(i / 2)],
        "nft_token",
        {
          token_id: stake_info.token_id,
        }
      );

      if (stake_info.owner_id != token_info.owner_id) {
        let remove_result = await account.functionCall({
          contractId: STAKING_CONTRACT_ID,
          methodName: "remove_stake_info",
          args: {
            nft_contract_id: nft_list[Math.floor(i / 2)],
            token_id: stake_info.token_id,
            account_id: stake_info.owner_id,
            is_revoke: false,
          },
          gas: "300000000000000",
        });
        console.log(
          "Remove Stake Info",
          JSON.stringify({
            stake_info_nft_contract_id: stake_info.nft_contract_id,
            stake_info_token_id: stake_info.token_id,
            stake_info_owner_id: stake_info.owner_id,
            token_info_owner_id: token_info.owner_id,
          })
        );
      }
    }
  }
};

const Clean_Farming = async () => {
  const clean_farming_label = Clean_Farming.name;
  console.time(clean_farming_label);
  //Load Your Account
  const near = await connect(config);

  console.timeLog(clean_farming_label, "near connect");
  // STEP 4 enter your mainnet or testnet account name here!
  const account = await near.account("xuguangxia.near");

  console.timeLog(clean_farming_label, "account");
  let staker_count = await account.viewFunction(
    FARMING_CONTRACT_ID,
    "get_supply_stakers",
    {}
  );

  console.timeLog(clean_farming_label, `staker_count: ${staker_count}`);
  let farm_ids = await account.viewFunction(
    FARMING_CONTRACT_ID,
    "get_farm_contract_ids",
    {}
  );

  console.timeLog(clean_farming_label, "farm_ids");
  for (let i = 0; i <= staker_count / 100; i++) {
    let count = 100;
    if (i == parseInt(staker_count / 100)) {
      count = staker_count % 100;
    }

    let stakers = await account.viewFunction(
      FARMING_CONTRACT_ID,
      "get_staker_ids",
      {
        from_index: (i * 100).toString(),
        limit: count,
      }
    );

    console.timeLog(clean_farming_label, `stakers: ${stakers.length}`);
    for (let j = 0; j < stakers.length; j++) {
      for (let k = 0; k < farm_ids.length; k++) {
        let stakeInfo = await account.viewFunction(
          FARMING_CONTRACT_ID,
          "get_staking_informations_by_owner_id",
          {
            account_id: stakers[j],
            nft_contract_id: farm_ids[k],
          }
        );

        console.timeLog(
          clean_farming_label,
          `stakeInfo.token_ids.length: ${stakeInfo.token_ids.length}`
        );
        for (let p = 0; p < stakeInfo.token_ids.length; p++) {
          let token_info = await account.viewFunction(
            farm_ids[k],
            "nft_token",
            {
              token_id: stakeInfo.token_ids[p],
            }
          );

          console.timeLog(
            clean_farming_label,
            `token_info.owner_id: ${token_info.owner_id}`
          );
          if (stakers[j] != token_info.owner_id) {
            let remove_result = await account.functionCall({
              contractId: FARMING_CONTRACT_ID,
              methodName: "remove_stake_info",
              args: {
                nft_contract_id: farm_ids[k],
                token_id: stakeInfo.token_ids[p],
                account_id: stakers[j],
                is_revoke: false,
              },
              gas: "300000000000000",
            });
            console.log(
              "Remove Stake Info",
              JSON.stringify({
                farm_ids: farm_ids[k],
                stakeInfo_token_ids: stakeInfo.token_ids[p],
                stakers: stakers[j],
                token_info_owner_id: token_info.owner_id,
              })
            );
          }
        }
      }
    }
  }
  console.timeEnd(clean_farming_label);
};

module.exports = { Clean_Staking, Clean_Farming };
