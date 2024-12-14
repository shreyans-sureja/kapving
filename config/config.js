const config = {
    port : process.env.PORT || 3000,
    max_video_length : 120,  // 120 second
    min_video_length : 5,   // 5 second
    max_video_size : 10 * 1024 * 1024, // 10 MB
}

module.exports = config;