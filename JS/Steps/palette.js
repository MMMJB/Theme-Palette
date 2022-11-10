import WebsiteGenerator from "../master";

import request from "../Utils/requests";

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
                this.colors.ls,
                this.colors.la,
                this.colors.bc,
                this.colors.da,
                this.colors.ds
            ]
        };

        data.input.forEach(e => {
            const c = e == "N" ? "undefined" : `rgb(${e.join(",")})`;
            console.log(`%c${c}`, `background-color:${c}`);
        })

        request("http://colormind.io/api/", "POST", r => {
            const response = JSON.parse(r).result;
            this.palette = [...response];

            this.parent.emit("paletteGenerated");
        }, data);
    }
}