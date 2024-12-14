const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');


class TrimLogic {

    constructor(config, multerConfig, sqliteRepo, helper) {
        this.config = config;
        this.multerConfig = multerConfig;
        this.uploadHandler = this.multerConfig.single('video');
        this.sqliteRepo = sqliteRepo;
        this.helper = helper;
    }

    async trimVideo(data) {
        let [err, videoRecord] = await this.helper.invoker(this.sqliteRepo.getVideoRecord(data.video_id));
        if(err) {
            throw err;
        } else if (data.user_id != videoRecord.userid) {
            throw new Error('Video does not exist');
        }

        const [videoLenErr, videoLen] = await this.helper.invoker(this.getVideoDurationInSeconds(videoRecord.location))
        if (videoLenErr) {
            throw videoLenErr;
        } else if(parseFloat(data.start) > videoLen) {
            throw new Error('trimming duration should be lesser than video length!');
        }

        let outputPath = `uploads/${Date.now()}_${videoRecord.title.split('_')[1]}`
        let [trimError, trimMsg] = await this.helper.invoker(this.getVideoTrimFromBeginning(videoRecord.location, outputPath, data.start));
        if(trimError) {
            throw trimError
        }

        // remove older video and update new path
        let [updateError, updateMsg] = await this.helper.invoker(this.sqliteRepo.updateVideoPath(videoRecord.id, outputPath.split('/')[1], outputPath));
        if (updateError) {
            throw err;
        }
        fs.unlinkSync(videoRecord.location)

        return "sucess";
    }

    async getVideoTrimFromBeginning(inputPath, outputPath, startTimeInSeconds) {
        return new Promise(async (resolve, reject) => {
            await ffmpeg(inputPath)
                .setStartTime(startTimeInSeconds)  // Start trimming from this time
                .output(outputPath)
                .on('end', () => {
                    return resolve('Video trimming finished.');
                })
                .on('error', (err) => {
                    return reject(`Error during trimming: ${err}`);
                })
                .run();
        });
    }

    async getVideoDurationInSeconds(filePath) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err, metadata) => {
                if (err) {
                    reject(err);
                } else {
                    const durationInSeconds = metadata.format.duration;
                    resolve(parseFloat(durationInSeconds));
                }
            });
        });
    }
}

module.exports = TrimLogic;