import { EventEmitter } from "events";

import request from "../Utils/requests";
import brightness from "../Utils/brightness";

export default class themeGenerator extends EventEmitter {
    constructor () {
        super();
        var theme;

        request("/themes.txt", "GET", r => {
            const response = r.split("\n");

            theme = response[Math.floor(Math.random() * response.length)];
            console.log(theme);
            this.emit("themeChosen");
        })

        this.on("themeChosen", _ => {
            const cf = new ColorThief();
            const KEY = "31117334-98f93316f25d761fec9942630";

            request(`https://pixabay.com/api/?key=${KEY}&q=${theme}`, "GET", r => {
                const response = JSON.parse(r).hits, len = response.length;
                if (response == undefined) return this.emit("themeGenerationError");

                var brightnesses = [], queue = response.length, loaded = 0;

                response.forEach(h => {
                    const img = new Image();
                    img.src = h.previewURL;
                    img.crossOrigin = "Anonymous";

                    img.onload = _ => {
                        loaded++;
                        const col = `rgb(${cf.getColor(img).join(",")})`;

                        brightnesses.push([col, brightness(col)]);
                        // console.log(`%c${brightnesses[brightnesses.length - 1]}`, `background-color:${col}`);

                        if (loaded == queue) {
                            brightnesses.sort((a, b) => b[1] - a[1]);

                            const colToArr = col => Array.from(col.replaceAll(/rgb\(|\)/g, "").split(","), e => e = parseFloat(e));
                            const numB = brightnesses.length;

                            this.colors = {
                                ls: colToArr(brightnesses[0][0]),
                                la: len % 4 == 0 ? colToArr(brightnesses[numB / 4][0]) : "N",
                                bc: colToArr(brightnesses[numB / 2][0]),
                                da: len % 4 == 0 ? colToArr(brightnesses[numB * 3 / 4][0]) : "N",
                                ds: colToArr(brightnesses[numB - 1][0])
                            }

                            this.emit("themeGenerated");
                        }
                    }
                })
            })
        })
    }
}