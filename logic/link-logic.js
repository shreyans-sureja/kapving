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

        // generate link to share
        const key = `${Date.now()}_${videoRecord.id}`
        let [updateErr, updateMsg] = await this.helper.invoker(this.sqliteRepo.createLink(key, videoId, videoRecord.location));
        if(updateErr){
            throw updateErr;
        }

        return key;
    }
}

module.exports = LinkLogic;