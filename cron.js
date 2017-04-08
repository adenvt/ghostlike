const CronJob = require('cron').CronJob;
const spawn = require('child_process').spawn;

let job = new CronJob({
  cronTime: '*/5 * * * * *',
  timeZone: 'Asia/Jakarta',
  onTick() {
    spawn('node', ['index.js'], {
      stdio: 'inherit'
    })
  }
})

job.start();
