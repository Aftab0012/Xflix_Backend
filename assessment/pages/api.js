
import basePage from "./basePage";

const apis = {
  baseUrl: "http://localhost:8082/v1",

  uploadNewVideo(
    videoLink,
    title,
    genre,
    contentRating,
    releaseDate,
    previewImage
  ) {
    let data = {
      videoLink: videoLink,
      title: title,
      genre: genre,
      contentRating: contentRating,
      releaseDate: releaseDate,
      previewImage: previewImage,
    };
    return cy.request("POST", this.baseUrl + "/videos", data);
  },
  getAllVideos() {
    return cy.request("GET", this.baseUrl + "/videos");
  },
  getAllVideosSortByReleaseDate() {
    return cy.request("GET", this.baseUrl + "/videos?sortBy=releaseDate");
  },
  getVideoByTitle(title) {
    cy.log(this.baseUrl + "/videos?title=" + title);
    return cy.request("GET", this.baseUrl + "/videos?title=" + title);
  },
  getVideoByGenres(genres) {
    cy.log(this.baseUrl + "/videos?genres=" + genres);
    return cy.request("GET", this.baseUrl + "/videos?genres=" + genres);
  },
  getVideoByContentRating(rating) {
    cy.log(this.baseUrl + "/videos?contentRating=" + rating);
    return cy.request("GET", this.baseUrl + "/videos?contentRating=" + rating);
  },
  getVideosByParameters(title, genres, contentRating) {
    let endpoint = `${this.baseUrl}/videos?title=${title}&genres=${genres}&contentRating=${contentRating}`;
    cy.log(endpoint);
    return cy.request("GET", endpoint);
  },
  upvote(id) {
    let data = {
      vote: "upVote",
      change: "increase",
    };
    return cy.request("PATCH", this.baseUrl + "/videos/" + id + "/votes", data);
  },
  downVote(id) {
    let data = {
      vote: "downVote",
      change: "increase",
    };
    return cy.request("PATCH", this.baseUrl + "/videos/" + id + "/votes", data);
  },
  getVideoById(id) {
    return cy.request("GET", this.baseUrl + "/videos/" + id);
  },
  incrementViewCount(id) {
    return cy.request("PATCH", this.baseUrl + "/videos/" + id + "/views");
  },
};

export default { ...basePage, ...apis };

