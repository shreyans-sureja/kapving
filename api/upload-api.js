class UploadApi {

    constructor(sqliteRepo, uploadLogic) {
        this.sqliteRepo = sqliteRepo;
        this.uploadLogic = uploadLogic;
    }

    // API to upload a video
    async handleRequest(req, res) {
        let {authorization, user_id} = req.headers;
        const isValidUser = await this.sqliteRepo.isAuthenticated(authorization, user_id)
        if (!isValidUser) {
            return res.status(401).send("User is not authorized");
        }

        return await this.uploadLogic.uploadVideo(req, res, user_id);
    }
}

module.exports = UploadApi;