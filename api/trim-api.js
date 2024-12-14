class TrimApi {

    constructor(sqliteRepo, trimLogic) {
        this.sqliteRepo = sqliteRepo;
        this.trimLogic = trimLogic;
    }

    async handleRequest(req, res) {
        let {authorization, user_id} = req.headers;
        let {video_id, start} = req.query;

        const isValidUser = await this.sqliteRepo.isAuthenticated(authorization, user_id)
        if (!isValidUser) {
            return res.status(401).send("User is not authorized");
        } else if (!video_id || !start) {
            return res.status(500).send("invalid input params!");
        }

        try{
            await this.trimLogic.trimVideo({user_id, video_id, start});
            return res.status(200).send("Video trimmed successfully");
        }catch (err) {
            return res.status(500).send({"message": err.message});
        }
    }
}

module.exports = TrimApi;