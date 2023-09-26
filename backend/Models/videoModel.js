const mongoose = require("mongoose");
const validator = require("validator");
const genresList = [
  "Education",
  "Sports",
  "Movies",
  "Comedy",
  "Lifestyle",
  "All",
  "Cooking"
];
const contentRatingList = ["Anyone", "7+", "12+", "16+", "18+"];

const videosSchema = new mongoose.Schema({
  videoLink: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    enum: genresList,
    required: true,
  },
  contentRating: {
    type: String,
    enum: contentRatingList,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  previewImage: {
    type: String,
  
    required: true,
  },
  votes: {
    upVotes: {
      type: Number,
      default: 0,
    },
    downVotes: {
      type: Number,
      default: 0,
    },
  },
  viewCount: {
    type: Number,
    default: 0,
  },
},{
  timestamps: true
});



const Videos = mongoose.model("videos",videosSchema);

module.exports = Videos;