import api from "../pages/api";

describe("Search", () => {
  beforeEach(() => {});

  it("POST /v1/videos - Verify expected fields are present in response on uploading videos", () => {
    cy.readFile("api-video.json").then((videoConfigs) => {
      cy.log(videoConfigs);
      videoConfigs.forEach((config) => {
        let response = api.uploadNewVideo(
          config.link,
          config.title,
          config.genre,
          config.contentRating,
          config.releaseDate,
          config.image
        );
        response
          .its("body")
          .should("to.have.all.keys", [
            "contentRating",
            "genre",
            "_id",
            "__v",
            "previewImage",
            "releaseDate",
            "title",
            "videoLink",
            "viewCount",
            "votes",
          ]);
      });
    });
  });

  it("GET /v1/videos - Verify all videos were uploaded", () => {
    let response = api.getAllVideos();
    response.its("body.videos").should("to.have.length.of.at.least", 15);
  });

  it("GET /v1/videos?title=video18 - Verify only 1 video with title 'video18' exists and has its genre as Education", () => {
    let response = api.getVideoByTitle("video18");
    response
      .its("body.videos")
      .should("to.have.length", 1)
      .its(0) //0th element
      .its("genre")
      .should("to.be.equal", "Education");
  });

  it("GET /v1/videos?genres=Sports - Verify exactly 2 videos are available for Sports genre", () => {
    let response = api.getVideoByGenres("Sports");

    response
      .its("body.videos")
      .should("to.have.length", 2)
      .its(0) //0th element
      .its("genre")
      .should("to.be.equal", "Sports");
  });

  it("GET /v1/videos?genres=Sports,Lifestyle - Verify exactly 4 videos are available for Sports/Lifestyle genres", () => {
    let response = api.getVideoByGenres("Sports,Lifestyle");

    response
      .its("body.videos")
      .should("to.have.length", 4)
      .its(0) //0th element
      .its("genre")
      .should("to.be.oneOf", ["Sports", "Lifestyle"]);

    // response.its("body.videos").should("have.length", 4);
  });

  it("GET /v1/videos?contentRating=18%2B - Verify videos are returned with contentRating set as 18+", () => {
    let response = api.getVideoByContentRating("18%2B");

    response
      .its("body.videos")
      .should("to.have.length", 1)
      .its(0) //0th element
      .its("contentRating")
      .should("to.be.oneOf", ["18+"]);
  });

  it("GET /v1/videos?title=consumed&genres=Sports,Lifestyle&contentRating=12%2B - Verify exactly 4 videos are available", () => {
    let response = api.getVideosByParameters(
      "consumed",
      "Sports,Lifestyle",
      "12%2B"
    );

    response
      .its("body.videos")
      .should("to.have.length", 3)
      .its(0) //0th element
      .its("title")
      .should("to.match", /^consumed/i);
  });

  it("GET /v1/videos?sortBy=releaseDate - Verify that video with title First-Video comes first when sorted by releaseDate ", () => {
    let response = api.getAllVideosSortByReleaseDate();
    response
      .its("body.videos")
      .its(0) //0th element
      .its("title")
      .should("to.be.equal", "First-Video");
  });

  it("PATCH /v1/videos/:videoId/votes - Verify upvote feature works", () => {
    let response = api.getAllVideos();
    response
      .its("body.videos")
      .its(1)
      .then((video) => {
        api.upvote(video._id).then(() => {
          api
            .getVideoById(video._id)
            .its("body.votes.upVotes")
            .should("to.be.greaterThan", 0);
        });
      });
  });

  it("PATCH /v1/videos/:videoId/votes - Verify downvote feature works", () => {
    let response = api.getAllVideos();
    response
      .its("body.videos")
      .its(1)
      .then((video) => {
        api.downVote(video._id).then(() => {
          api
            .getVideoById(video._id)
            .its("body.votes.downVotes")
            .should("to.be.greaterThan", 0);
        });
      });
  });

  it("PATCH /v1/videos/:videoId/views - Verify view count is increased", () => {
    let response = api.getAllVideos();
    response
      .its("body.videos")
      .its(1)
      .then((video) => {
        api.incrementViewCount(video._id).then(() => {
          api
            .getVideoById(video._id)
            .its("body.viewCount")
            .should("to.be.greaterThan", 0);
        });
      });
  });
});