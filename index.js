const cron = require("node-cron");
const { Clean_Staking, Clean_Farming } = require("./script");

let executionCount = 0;
const clean_staking_task = cron.schedule("*/10 * * * *", async (d) => {
  console.time(Clean_Staking.name);
  await Clean_Staking();
  console.timeEnd(Clean_Staking.name);
});

const clean_farming_task = cron.schedule("*/10 * * * *", async (d) => {
  console.time(Clean_Farming.name);
  await Clean_Farming();
  console.timeEnd(Clean_Farming.name);
});

const init = () => {
  clean_staking_task.start();
  clean_farming_task.start();
};

init();
