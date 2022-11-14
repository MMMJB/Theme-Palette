import WebsiteGenerator from "../master.js";

import request from "../Utils/requests.js";

export default class PaletteGenerator {
    constructor (colors) {
        this.parent = new WebsiteGenerator();
        this.colors = colors;
        this.palette = [];

        this.requestColors();
    }

    requestColors() {
        const data = {
            model: "ui",
            input: [
                this.colors.ls.color,
                this.colors.la.color,
                this.colors.bc.color,
                this.colors.da.color,
                this.colors.ds.color
            ]
        };

        request("http://colormind.io/api/", "POST", r => {
            const response = JSON.parse(r).result;
            this.palette = [...response];
            
            this.parent.emit("paletteGenerated");
        }, data);
    }
}