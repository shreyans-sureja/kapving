const fs = require('fs');
const path = require('path');

// citation : https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
// and https://nodejs.org/api/fs.html
class ShareLinkLogic {

    constructor(helper, sqliteRepo) {
        this.helper = helper;
        this.sqliteRepo = sqliteRepo;
    }

    async getVideoFromLink(req, res, linkId) {
        let [linkErr, linkData] = await this.helper.invoker(this.sqliteRepo.getLinkDetails(linkId));
        if (linkErr) {
            throw linkErr;
        } else if(!linkData) {
            throw new Error(`${linkId} does not exist`);
        }

        // check link expiry status
        if(linkData.expiry_time && new Date() > new Date(linkData.expiry_time)){
            throw new Error(`Link has expired`);
        }

        const videoPath = `./${linkData.location}`
        if (!fs.existsSync(videoPath)) {
            return res.status(404).send('Video file not found');
        }
        const videoStat = fs.statSync(videoPath);
        const fileSize = videoStat.size;
        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        });
        fs.createReadStream(videoPath).pipe(res);
        return;
    }
}

module.exports = ShareLinkLogic;