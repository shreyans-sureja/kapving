class LinkLogic {

    constructor(helper, sqliteRepo, config) {
        this.helper = helper;
        this.sqliteRepo = sqliteRepo;
        this.config = config;
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

        const urlLink = this.config.link_prefix_url + key;
        return urlLink;
    }
}

module.exports = LinkLogic;