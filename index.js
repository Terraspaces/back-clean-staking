const cron = require("node-cron");
const { Clean_Staking } = require("./script");

let executionCount = 0;
const task = cron.schedule("0 * * * *", async (d) => {
  console.log("date: ", d.toISOString());
  await Clean_Staking();
});

const init = async () => {
  task.start();
};

init();
