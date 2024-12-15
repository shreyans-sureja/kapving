# Kapving-video-service

---

## Setup Instructions

### Prerequisites

- Install [Node.js](https://nodejs.org/) (version 14.x or higher recommended)
- A terminal or command-line interface
- Clone this repository to your local machine

---

### Steps to Run the Repository

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>

2. **Install dependency**:
    ```bash
   npm i

3. **Install Ffmpeg dependecy** 
    ```bash
   brew install ffmpeg   

3. **To Run the server**:
   ```bash
   node index.js

### choices:

1. Upload API:
``Users are allowed to upload videos with a maximum size of 10 MB. The video duration must be within the range of [5, 120] seconds.``


2. Trim API:
``Users are allowed to trim videos from the beginning by specifying the start duration (in seconds). This API can be extended to allow trimming from the end as well.``


3. Stich(Merge) API:
``Users can stitch multiple videos into a single video using this API.``


4. Link API:
``Users can create a link for an uploaded video. Note: Multiple links can be created for the same video, as different links can serve different purposes in the future, such as tracking.``


5. Share-link API:
``Users can access the shared video through this API before it expires. Each link expires 2 days after its creation.``