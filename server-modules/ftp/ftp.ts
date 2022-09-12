import fs = require('fs');
import FtpClient = require('ftp');
import config = require("../../../config/config.json")

const buFolder = '/home/sbt/node-server/backups/ItemDB/';
export const backup = () => {
    let c = new FtpClient();
    console.log('backup started')
    c.on('greeting', (msg:string) => {
        console.log(msg)
    })
    c.on('ready', () => {
        const files = fs.readdirSync(buFolder)
        console.dir(files, {color: true, depth: 2})
        for (let item of files) {
            c.put(buFolder + item, item, (err) => {
                if (err) throw err;
                console.log(item + ' uploaded')
            });
        }
        c.end();
    })
    c.connect(config.ftpDetails);
}
