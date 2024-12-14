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

    async getVideoRecord(video_id) {
        return new Promise((resolve, reject) => {
            this.sqlite.get(
                `SELECT * FROM videos WHERE id = ?`,
                [video_id],
                (err, row) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(row);
                }
            );
        });
    }

    async updateVideoPath(id, title, newLocation) {
        return new Promise((resolve, reject) => {
            this.sqlite.run(
                `UPDATE videos SET title = ?, location = ?, updated_at = CURRENT_TIMESTAMP  WHERE id = ?`,
                [title, newLocation, id],
                (err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                }
            );
        });
    }

    async getVideoRecordsForUser(user_id, videoIds) {
        return new Promise((resolve, reject) => {
            this.sqlite.all(
                `SELECT * FROM videos WHERE userid = ?  AND id IN (${videoIds.join(',')})`,
                [user_id],
                (err, rows) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows);
                }
            );
        });
    }

    async bulkDeleteVideos(ids) {
        return new Promise((resolve, reject) => {
            this.sqlite.run(
                `DELETE FROM videos WHERE id IN (${ids.join(',')})`,
                [],
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