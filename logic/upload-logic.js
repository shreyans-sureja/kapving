const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

// citation : https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
// and https://nodejs.org/api/fs.html
class UploadLogic {

    constructor(config, multerConfig, sqliteRepo, helper) {
        this.config = config;
        this.multerConfig = multerConfig;
        this.uploadHandler = this.multerConfig.single('video');
        this.sqliteRepo = sqliteRepo;
        this.helper = helper;
    }

    async uploadVideo(req, res, user_id) {
         this.uploadHandler(req, res, async (err) => {
            if (err) {
                return res.status(500).send({ message: err.message });
            }

            // Check video duration
            const videoPath = req.file.path;
            const videoName = req.file.filename;
            const durationInSeconds = await this.getVideoDurationInSeconds(videoPath);

            if(durationInSeconds > this.config.max_video_length || durationInSeconds < this.config.min_video_length) {
                 // Delete the uploaded file if duration is invalid
                 fs.unlinkSync(videoPath);
                 return res.status(400).send({ message: 'Video duration must be in 5-120 seconds range!' });
            }

            let [videoRecordErr, videoRecordRes] = await this.helper.invoker(this.sqliteRepo.addVideoRecord(user_id, videoName, videoPath));
            if (videoRecordErr) {
                fs.unlinkSync(videoPath);
                return res.status(500).send({ message: videoRecordErr.message });
            }

             res.status(200).send({message: 'Video uploaded successfully!' });
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

module.exports = UploadLogic;