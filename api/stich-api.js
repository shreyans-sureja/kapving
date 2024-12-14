class StichApi {

    constructor(sqliteRepo, stichLogic) {
        this.sqliteRepo = sqliteRepo;
        this.stichLogic = stichLogic;
    }

    async handleRequest(req, res) {
        let {authorization, user_id} = req.headers;
        const isValidUser = await this.sqliteRepo.isAuthenticated(authorization, user_id)
        if (!isValidUser) {
            return res.status(401).send("User is not authorized");
        }

        try{
            await this.stichLogic.stichVideos(user_id);
            return res.status(200).send("Videos stitched successfully.");
        }catch (err) {
            return res.status(500).send({"message": err.message});
        }
    }
}

module.exports = StichApi;