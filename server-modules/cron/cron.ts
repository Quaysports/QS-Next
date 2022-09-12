const CronJob = require('cron').CronJob;
import ftp = require('../ftp/ftp')
const {postToWorker} = require("../workers/worker");
const { spawn } = require('child_process');
const config = require("../../../config/config.json");

export const init = ()=> {
        // auto backup cron job
        new CronJob('00 00 9 * * *', ()=> {
            let backup = spawn('mongodump', [
                '--host', `"${config.dbAddress}:${config.dbPort}/"`,
                '--db', "ItemDB",
                '--out', "/home/sbt/node-server/backups/",
                '--gzip'])
            backup.stdout.on('data', (data:string) => {
                console.log(`stdout: ${data}`);
              });
              
              backup.stderr.on('error', (data: Error) => {
                console.error(`stderr: ${data}`);
              });
              
              backup.on('close', (code:string) => {
                console.log(`child process exited with code ${code}`);
                  // export backup to remote server: bargainsworld
                  ftp.backup();
              });
        }, null, true, 'Europe/London');

        new CronJob('00 00 4 * * *', async ()=> {
            console.log("cron update all!")
            let result = await postToWorker("update",{type: "updateAll", data:{}})
            console.dir(result)
        }, null, true, 'Europe/London');

        new CronJob('00 00 5 * * *', async ()=> {
            let eodReport = await postToWorker("shop", {type: "endOfDayReport", data: {}, id: new Date().getTime()})
            console.log('shop worker all done!')
            console.log(eodReport)

            let olsReport = postToWorker("shop", {type: "onlineSalesReport", data: {}, id: new Date().getTime()})
            console.log('online worker all done!')
            console.log(olsReport)
        }, null, true, 'Europe/London');
}