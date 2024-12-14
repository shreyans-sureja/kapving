class LinkLogic {

    constructor(helper, sqliteRepo) {
        this.helper = helper;
        this.sqliteRepo = sqliteRepo;
    }

    async generateLink(userId, videoId) {
        let [err, videoRecord] = await this.helper.invoker(this.sqliteRepo.getVideoRecord(videoId));
        if(err) {
            throw err;
        } else if (!videoRecord || userId != videoRecord.userid) {
            throw new Error('Video does not exist');
        }

        let expiry_time = videoRecord.expire_time;
        // check link is expired or not
        if(expiry_time && new Date() > new Date(expiry_time)){
            // link already expired
            throw new Error(`Link for video_id:${videoId} has expired`);
        }
        else if(!expiry_time){
            let [updateErr, updateMsg] = await this.helper.invoker(this.sqliteRepo.updateLinkExpiry(videoId));
            if(updateErr){
                throw updateErr;
            }
        }

        const link = `${process.cwd()}/${videoRecord.location}`
        return link;
    }
}

module.exports = LinkLogic;