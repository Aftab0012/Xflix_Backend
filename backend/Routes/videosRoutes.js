const express = require("express");
const router = express.Router();
const videoController = require("../Controller/videoController");

// Route to add a new video
router.post("/videos", videoController.addVideo);

// Route to get all videos
router.get("/videos", videoController.getVideos);

// Route to get one video
router.get("/videos/:videoId", videoController.getVideoById);

// Route to update a video by ID
router.patch("/videos/:videoId/vote", videoController.updateVideoVotesById);

// Route to update a video by ID
router.patch("/videos/:videoId/views", videoController.updateVideoViewsById);

// Route to delete a video by ID
router.delete("/videos/:videoId", videoController.deleteVideoById);

module.exports = router;
