import WebsiteGenerator from "./master";
import Handlers from "./handlers";

window.onload = _ => {
    const website = new WebsiteGenerator();
    const handlers = new Handlers(website);
};