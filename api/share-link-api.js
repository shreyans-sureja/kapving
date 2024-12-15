class ShareLinkApi {

    constructor(sqliteRepo, helper, shareLinkLogic) {
        this.sqliteRepo = sqliteRepo;
        this.helper = helper;
        this.shareLinkLogic = shareLinkLogic;
    }

    async handleRequest(req, res) {
        let {authorization, user_id} = req.headers;
        const key = req.params.key;

        const isValidUser = await this.sqliteRepo.isAuthenticated(authorization, user_id)
        if (!isValidUser) {
            return res.status(401).send("User is not authorized!");
        }else if(!key) {
            return res.status(500).send("Link is missing in request!");
        }

        try{
            await this.helper.invoker(this.shareLinkLogic.getVideoFromLink(req, res, key));
        }
        catch (err) {
            return res.status(500).send({err: err.message});
        }
    }
}

module.exports = ShareLinkApi;