class LinkApi {

    constructor(sqliteRepo, helper, linkLogic) {
        this.sqliteRepo = sqliteRepo;
        this.helper = helper;
        this.linkLogic = linkLogic;
    }

    // API to generate sharable link
    async handleRequest(req, res) {
        let {authorization, user_id} = req.headers;
        let {video_id} = req.query;

        const isValidUser = await this.sqliteRepo.isAuthenticated(authorization, user_id)
        if (!isValidUser) {
            return res.status(401).send("User is not authorized!");
        }else if(!video_id) {
            return res.status(500).send("Video id is missing in request!");
        }

        let [err, link] = await this.helper.invoker(this.linkLogic.generateLink(user_id, video_id) );
        if (err) {
            return res.status(500).send({err: err.message});
        }

        return res.status(200).send({"videoLink" : link});
    }
}

module.exports = LinkApi;