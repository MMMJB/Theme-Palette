import WebsiteGenerator from "./master.js";
import Handlers from "./handlers.js";

import BlobMorph from "./Utils/blobmorph.js";

window.onload = _ => {
    const formBG = new BlobMorph(document.querySelector(".form-bg > path"));

    const website = new WebsiteGenerator();
    const handlers = new Handlers(website);
};