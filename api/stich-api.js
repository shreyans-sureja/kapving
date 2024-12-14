class StichApi {

    constructor(sqliteRepo, stichLogic) {
        this.sqliteRepo = sqliteRepo;
        this.stichLogic = stichLogic;
    }

    async handleRequest(req, res) {
        const {authorization, user_id} = req.headers;
        const videoIds = req.body.ids;

        const isValidUser = await this.sqliteRepo.isAuthenticated(authorization, user_id)
        if (!isValidUser) {
            return res.status(401).send("User is not authorized");
        }else if(!videoIds || !videoIds.length || videoIds.length < 2) {
            return res.status(500).send("Input must contains at least 2 ids");
        }

        try{
            await this.stichLogic.stichVideos(user_id, videoIds);
            return res.status(200).send("Videos stitched successfully.");
        }catch (err) {
            return res.status(500).send({"message": err.message});
        }
    }
}

module.exports = StichApi;