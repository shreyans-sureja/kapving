class ShareLinkApi {

    constructor(sqliteRepo, shareLinkLogic) {
        this.sqliteRepo = sqliteRepo;
        this.shareLinkLogic = shareLinkLogic;
    }

    // API to handle shared public link
    async handleRequest(req, res) {
        const key = req.params.key;
        if(!key) {
            return res.status(500).send("Link is missing in request!");
        }

        try{
            await this.shareLinkLogic.getVideoFromLink(req, res, key);
        }
        catch (err) {
            return res.status(500).send({err: err.message});
        }
    }
}

module.exports = ShareLinkApi;