const Videos = require("../Models/videoModel")
const mongoose = require('mongoose');

const addVideo = async (req, res) => {
  // try {
  //   const videoData = req.body;
  //   console.log("video", videoData)
  //   // const newVideo = await Video.create(video);
  //   const newVideo = new Videos(videoData); // Create a new video document
  //   console.log(newVideo)
  //   await newVideo.save();
  //   console.log("video",newVideo)
  //   res.status(201).json({ message: "Video created", video: newVideo });
  // } catch (error) {
  //   return res.status(400).json({ message: "Video not added" });
  // }
  const video = await Videos.create(req.body).catch((error) => {
    if (mongoose.Error.ValidationError) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Video Link already exist");
    }
  });
  res.status(201).send(video);
};

// const getVideos = async (req, res) => {
//   const sortBy = req.query.sortBy;
//   const title = req.query.title;
//   const genres = req.query.genres;
//   const contentRating = req.query.contentRating;

//   // const queryConditions = {};

//   // if (title) {
//   //   queryConditions.title = title;
//   // }

//   // // Allowed genres
//   // const allowedGenres = ["Education", "Sports", "Movies", "Comedy", "Lifestyle", "All"];

//   // if (genres) {
//   //   const genreList = genres.split(",");
//   //   const invalidGenres = genreList.filter((genre) => !allowedGenres.includes(genre));

//   //   if (invalidGenres.length > 0) {
//   //     return res.status(400).json({ error: "Invalid genres", message: "\"[0]\" must be one of [Education, Sports, Movies, Comedy, Lifestyle, All]" });
//   //   }

//   //   queryConditions.genres = { $in: genreList };
//   // }

//   // // Allowed content ratings
//   // const allowedContentRatings = ["Anyone", "7+", "12+", "16+", "18+"];

//   // if (contentRating) {
//   //   if (!allowedContentRatings.includes(contentRating)) {
//   //     return res.status(400).json({ error: "Invalid content rating", message:  "\"contentRating\" must be one of [Anyone, 7+, 12+, 16+, 18+, All]" });
//   //   }

//   //   queryConditions.contentRating = contentRating;
//   // }

//   try {
//     let videos;

//     if (sortBy === "viewCount") {
//       videos = await Videos.find({}).sort({ viewCount: -1 });
//     } else if (sortBy === "releaseDate") {
//       videos = await Videos.find({}).sort({ releaseDate: 1 });
//     } else if (sortBy) {
//       return res.status(400).json({ error: "Invalid sortBy", message:  "\"sortBy\" must be one of [viewCount, releaseDate]" });
//     } else if(title){
//       videos = await Videos.find({ title: {
//         $regex: new RegExp(title, "i"),   // The regex pattern to match "title" case-insensitively
//       }})
//       return res.status(400).json({message: "no titles found"})
//     } else if (genres) {
//       videos = await Videos.find({genres: genres});
//       console.log(videos,"found it!");
//       return res.status(400).json({ error: "Invalid genres", message: "\"[0]\" must be one of [Education, Sports, Movies, Comedy, Lifestyle, All]" });
//     } else if(contentRating){
//       videos = await Videos.find(contentRating)
//       return res.status(400).json({ error: "Invalid content rating", message:  "\"contentRating\" must be one of [Anyone, 7+, 12+, 16+, 18+, All]" });
//     } else {
//       videos = await Videos.find({});
//     }
//     // console.log("Query Conditions:", queryConditions);

//     res.status(200).json({ videos }); 
//   } catch (error) {
//     res.status(404).json({ message: "No videos found" });
//   }
// };

const getVideos = async (req, res) => {
  const sortBy = req.query.sortBy;
  const title = req.query.title;
  const genres = req.query.genres;
  const contentRating = req.query.contentRating;

  try {
    let videos;

    if (sortBy === "viewCount") {
      videos = await Videos.find({}).sort({ viewCount: -1 });
    }

    if (sortBy === "releaseDate") {
      videos = await Videos.find({}).sort({ releaseDate: 1 });
    }

    if (title) {
      videos = await Videos.find({
        title: {
          $regex: new RegExp(title, "i"),
        },
      });
      if (videos.length === 0) {
        return res.status(404).json({ message: "No titles found" });
      } 
    }

    if (genres) {
      // Split the genres string into an array
      const genreArray = genres.split(",");

      // Use $in operator to find videos that match any of the specified genres
      videos = await Videos.find({ 
        genre: { $in: genreArray.map(genre => new RegExp(genre, 'i')) }
      });
      console.log(videos, "found it!");
      if (videos.length === 0) {
        return res.status(404).json({
          error: "Invalid genres",
          message: "[0] must be one of [Education, Sports, Movies, Comedy, Lifestyle, All]",
        });
      }
    }

    if (contentRating) {
      videos = await Videos.find({contentRating: contentRating});
      console.log("Content Rating:", videos);

      if (videos.length === 0) {
        return res.status(404).json({
          error: "Invalid content rating",
          message: "\"contentRating\" must be one of [Anyone, 7+, 12+, 16+, 18+, All]",
        });
      }
    }

    // If none of the conditions match, return all videos
    if (!sortBy && !title && !genres && !contentRating) {
      videos = await Videos.find({});
    }

    res.status(200).json({ videos });
  } catch (error) {
    res.status(404).json({ message: "No videos found" });
  }
};


// const updateVideoVotesById = async (req, res) => {
//   const videoId = req.params.videoId;
//   // Check if the provided videoId is a valid ObjectId
//   if (!mongoose.Types.ObjectId.isValid(videoId)) {
//     return res.status(400).json({ message: "Invalid videoId" });
//   }
  
//   try {
//     const { vote, change } = req.body;

//     // Validate the 'change' and 'vote' values
//     if (change !== 'increase' && change !== 'decrease') {
//       return res.status(400).json({ message: "Invalid 'change' value" });
//     }
//     if (vote !== 'upVote' && vote !== 'downVote') {
//       return res.status(400).json({ message: "Invalid 'vote' value" });
//     }

//     // Define the update object based on the 'change' and 'vote' values
//     const update = {};
//     if (change === 'increase' && vote === "upvote") {
//       update[`votes.upVote`] = 1;
//     } else if (change === 'decrease' && vote === 'upvote') {
//       update[`votes.downVote`] = -1;
//     }

//     const updatedVideo = await Videos.findByIdAndUpdate(videoId, { $inc: update }, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedVideo) {
//       return res.status(404).json({ message: "No video found with matching id" });
//     }
    
//     return res.status(200).json({ message: "Video updated", video: updatedVideo });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };
const updateVideoVotesById = async (req, res) => {
  const videoId = req.params.videoId;
  // Check if the provided videoId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json({ message: "Invalid videoId" });
  }

  try {
    const { vote, change } = req.body;

    // Validate the 'change' and 'vote' values
    if (change !== 'increase' && change !== 'decrease') {
      return res.status(400).json({ message: "Invalid 'change' value" });
    }
    if (vote !== 'upVote' && vote !== 'downVote') {
      return res.status(400).json({ message: "Invalid 'vote' value" });
    }

    // Define the update object based on the 'change' and 'vote' values
    const update = {};
    if (change === 'increase' && vote === 'upVote') {
      update['votes.upVotes'] = 1;
    } else if (change === 'decrease' && vote === 'upVote') {
      update['votes.downVotes'] = -1;
    } else if (change === 'increase' && vote === 'downVote') {
      update['votes.downVotes'] = 1;
    } else if (change === 'decrease' && vote === 'downVote') {
      update['votes.downVotes'] = -1;
    }

    const updatedVideo = await Videos.findByIdAndUpdate(videoId, { $inc: update }, {
      new: true,
      runValidators: true,
    });

    if (!updatedVideo) {
      return res.status(404).json({ message: "No video found with matching id" });
    }

    return res.status(200).json({ message: "Video updated", video: updatedVideo });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const updateVideoViewsById = async (req, res) => {
  const videoId = req.params.videoId;
  // Check if the provided videoId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json({ message: "\"id\" must be a valid mongo id" });
  }
  try {
    const updatedVideo = await Videos.findByIdAndUpdate(videoId, { $inc: { viewCount: 1 } }, {
      new: true,
      runValidators: true,
    });
    if (!updatedVideo) {
      return res.status(404).json({ message: "No video found with matching id" });
    }
    return res.status(200).json({ message: "Video updated", video: updatedVideo });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteVideoById = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const deletedVideo = await Videos.findByIdAndDelete(videoId);;
    if (!deletedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }
    return res.status(200).json({ message: "Video deleted", video: deletedVideo });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getVideoById = async (req, res) => {
  const videoId = req.params.videoId;
    // Check if the provided videoId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid videoId" });
    }
  try {
    const video = await Videos.findById(videoId)
    if(!video){
      res.status(404).json({message: "No video found with matching id"})
    }
    res.status(201).json({message: "video found", video})
    } catch (error) {
      res.status(500).json({message: "internal server error from me"})
  }
};

module.exports = {
    addVideo,
    getVideos,
    updateVideoVotesById,
    updateVideoViewsById,
    deleteVideoById,
    getVideoById
}