import { EventEmitter } from "events";

import request from "../Utils/requests";

export default class paletteGenerator extends EventEmitter {
    constructor(colors) {
        super();
        this.colors = colors;

        this.requestColors();
    }

    requestColors() {
        const colors = document.querySelectorAll(".color");
        var palette = [];

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
            const c = `rgb(${e.join(",")})`;
            console.log(`%c${c}`, `background-color:${c}`);
        })

        request("http://colormind.io/api/", "POST", r => {
            const response = JSON.parse(r).result;

            colors.forEach((c, i) => {
                c.style.backgroundColor = `rgb(${response[i][0]},${response[i][1]},${response[i][2]})`;
                palette.push(c);
            })

            this.emit("paletteGenerated");
        }, data);
    }
}