import WebsiteGenerator from "./master.js";
import Handlers from "./handlers.js";

window.onload = _ => {
    const website = new WebsiteGenerator();
    const handlers = new Handlers(website);
};