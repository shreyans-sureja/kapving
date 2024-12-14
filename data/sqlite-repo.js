class SqliteRepo {

    constructor (sqlite) {
        this.sqlite = sqlite;
    }

    async getUserToken(user_id) {
        return new Promise((resolve, reject) => {
            this.sqlite.get(
                `SELECT token FROM auth WHERE id = ?`,
                [user_id],
                (err, row) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(row);
                }
            );
        });
    }

    // validate token is correct for user
    async isAuthenticated(authHeader, user_id) {
        // extract token after "Bearer"
        const token = authHeader.split(' ')[1];
        const user = await this.getUserToken(user_id);
        if(!user || !user.token || user.token !== token) {
            return false
        }
        return true
    }

    // add video meta into database.
    async addVideoRecord(user_id, fileName, filePath) {
        return new Promise((resolve, reject) => {
            this.sqlite.run(
                `INSERT INTO videos (userid, title, location) VALUES (?, ?, ?)`,
                [user_id, fileName, filePath],
                 (err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                }
            );
        });
    }
}

module.exports = SqliteRepo;