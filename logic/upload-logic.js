const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

class UploadLogic {

    constructor(config, multerConfig, sqliteRepo) {
        this.config = config;
        this.multerConfig = multerConfig;
        this.uploadHandler = this.multerConfig.single('video');
        this.sqliteRepo = sqliteRepo;
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

            try{
                await this.sqliteRepo.addVideoRecord(user_id, videoName, videoPath);
            }
            catch (err) {
                fs.unlinkSync(videoPath);
                return res.status(500).send({ message: err.message });
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