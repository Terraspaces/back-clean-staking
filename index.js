const cron = require("node-cron");
const { Clean_Staking, Clean_Farming } = require("./script");

let executionCount = 0;
const task = cron.schedule("* */60 * * *", async (d) => {
  console.log("date: ", d.toISOString());
  await Clean_Staking();
});

const init = async () => {
  // await Clean_Farming();
  // await Clean_Staking();
  task.start();
};

init();
