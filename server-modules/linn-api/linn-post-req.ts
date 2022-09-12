import * as https from 'https';
import * as LinnAuth  from './linn-auth'
export const agent = new https.Agent();
agent.maxSockets = 10;

const postOpts = async (path: string) => {
    let serverDetails = await LinnAuth.getAuthDetails()
    return {
        hostname: serverDetails.server,
        method: 'POST',
        path: path,
        headers: {
            'Authorization': serverDetails.token,
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        }
    }
}
export const postReq = (path: string, postData: string) => {
    return new Promise<object>(async(resolve) => {
        let str = '';
        let postReq = https.request(await postOpts(path), res => {
            res.setEncoding('utf8');
            res.on('data', chunk => str += chunk);
            res.on('end', () => {
                resolve(str ? JSON.parse(str) : {})
            });
        });

        postReq.on('error', (err) => {
            console.error('--------- Linnworks Connection Error ---------')
            console.dir(err)
            console.error(path + ' error')
            console.error('----------------------------------------------')
        });

        postReq.write(postData);
        postReq.end()
    })
}
