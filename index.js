import tablemark from "tablemark"
// import { torrent1337x } from "./133x.js";
import {getTorrentsListAsArrayFromPuppeteer} from "./133x-puppeteer.js";
import {convertToByte, fileSizeConverter, formatBytes, quantileSorted} from "./utils.js";

let [, , search, n] = process.argv;

n = n || 3;

function calculateTorrentHealthWeight(a, q, avg) {
    return Math.min(a.se, q.se) + Math.min(a.se, avg.se) + a.le % q.le + a.sizeGB % q.sizeGB;
}

(async () => {
    let list = await getTorrentsListAsArrayFromPuppeteer(search);
    // console.log(await torrent1337x(search));

    list = list.map(a => ({
        ...a,
        sizeGB: fileSizeConverter(convertToByte(a.size), 'B', 'GB'),
    }));

    let q = {
        se: quantileSorted(list, .33, a => a.se),
        le: quantileSorted(list, .95, a => a.le),
        sizeGB: quantileSorted(list, .8, a => a.sizeGB),
    }

    let avg = {
        se: list.reduce((b, a) => ++a.se + b, 0) / list.length,
        le: list.reduce((b, a) => ++a.le + b, 0) / list.length,
        sizeGB: list.reduce((b, a) => ++a.sizeGB + b, 0) / list.length,
    };

    list = list
        .map(a => ({
            ...a,
            weight: calculateTorrentHealthWeight(a, q, avg),
        }))
        .filter(a => !a.link.includes('720p'))
        .sort((a, b) => a.weight - b.weight)
        .slice(-n)
        .reverse()
        .map(a => ({
            link: a.link,
            size: formatBytes(convertToByte(a.size)),
            se: a.se,
        }));

    if (list.length) {
        console.log(tablemark(list || []));
    } else {
        console.log('nothing found');
    }

})();
