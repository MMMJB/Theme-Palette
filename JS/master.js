import { EventEmitter } from "events";

import themeGenerator from "./Steps/theme";
import paletteGenerator from "./Steps/palette";

export default class Website extends EventEmitter {
    constructor () {
        super();

        this.themeGenerator = new themeGenerator();
        this.themeGenerator.on("themeGenerated", _ => {
            this.paletteGenerator = new paletteGenerator(this.themeGenerator.light, this.themeGenerator.mid, this.themeGenerator.dark)
        })
    }
}