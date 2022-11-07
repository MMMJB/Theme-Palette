import { EventEmitter } from "events";

import request from "../Utils/requests";
import brightness from "../Utils/brightness";

export default class themeGenerator extends EventEmitter {
    constructor () {
        super();
        var theme;

        request("/public/themes.txt", "GET", r => {
            const response = r.split("\n");

            theme = response[Math.floor(Math.random() * response.length)];
            console.log(theme);
            this.emit("themeChosen");
        })

        this.on("themeChosen", _ => {
            const cf = new ColorThief();
            const KEY = "31117334-98f93316f25d761fec9942630";

            request(`https://pixabay.com/api/?key=${KEY}&q=${theme}`, "GET", r => {
                const response = JSON.parse(r).hits;
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

                            this.light = colToArr(brightnesses[0][0]);
                            this.mid = colToArr(brightnesses[Math.floor(brightnesses.length / 2)][0]);
                            this.dark = colToArr(brightnesses[brightnesses.length - 1][0]);

                            this.emit("themeGenerated");
                        }
                    }
                })
            })
        })
    }
}