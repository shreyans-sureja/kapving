const ffmpeg = require('fluent-ffmpeg');

// citation : https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
class StichLogic {

    constructor(sqliteRepo, helper) {
        this.sqliteRepo = sqliteRepo;
        this.helper = helper;
    }

    async stichVideos(userId, videoIds) {
        let [recordsErr, recordsData] = await this.helper.invoker(this.sqliteRepo.getVideoRecordsForUser(userId, videoIds));
        const videoPaths = recordsData.map(item => item.location);
        if (videoIds.length !== videoPaths.length){
            throw new Error("Invalid video ids");
        }

        let videoFormat = videoPaths[0].split('.')[1]
        let outputPath = `uploads/${Date.now()}_${userId}.${videoFormat}`;

        let [stichErr, stichData] = await this.helper.invoker(this.stichAllVideos(videoPaths, outputPath));
        if (stichErr) {
            throw stichErr;
        }

        // add merge video in database
        let outputFileName = outputPath.split('/')[1]
        let [mergeErr, mergeMsg] = await this.helper.invoker(this.sqliteRepo.addVideoRecord(userId, outputFileName, outputPath));
        if (mergeErr) {
            throw mergeErr;
        }
        return "success";
    }

    async stichAllVideos(paths, outputPath) {
        return new Promise((resolve, reject) => {
            try{
                let command = ffmpeg();
                paths.forEach((video) => {
                    command = command.input(video);
                });
                command
                    .on('end', () => {
                        return resolve('Videos merged successfully!');
                    })
                    .on('error', (err) => {
                        return reject(new Error(`Error merging videos: ${err.message}`));
                    })
                    .mergeToFile(outputPath);
            }catch (err) {
                return reject(err);
            }
        });
    }

}

module.exports = StichLogic;