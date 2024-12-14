class UploadApi {

    constructor(authRepo) {
        this.authRepo = authRepo;
    }

    async handleRequest(req, res) {
        let {authorization, user_id} = req.headers;
        const isValidUser = await this.authRepo.isAuthenticated(authorization, user_id)
        if (!isValidUser) {
            return res.status(401).send("User is not authorized");
        }

        return res.json({"user": user_id});
    }
}

module.exports = UploadApi;