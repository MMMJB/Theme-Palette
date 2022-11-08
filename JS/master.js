import { EventEmitter } from "events";

import themeGenerator from "./Steps/theme";
import paletteGenerator from "./Steps/palette";

export default class WebsiteGenerator {
    constructor () {
        this.themeGenerator = new themeGenerator();

        this.themeGenerator.on("themeGenerated", _ => {
            this.paletteGenerator = new paletteGenerator(this.themeGenerator.colors);
            this.paletteGenerator.on("paletteGenerated", _ => console.log("done"));
        })

    }
}