import { EventEmitter } from "events";

import WebsiteGenerator from "../master.js";

import request from "../Utils/requests.js";
import brightness from "../Utils/brightness.js";

export default class ThemeGenerator extends EventEmitter {
    constructor(theme) {
        super();
        
        this.parent = new WebsiteGenerator();
        this.theme = theme;

        if (!this.theme) {
            request("/themes.txt", "GET", r => {
                const response = r.split("\n");
    
                this.theme = response[Math.floor(Math.random() * response.length)];
                this.emit("themeChosen");
            })
        } else this.generateColors();

        this.on("themeChosen", _ => this.generateColors());
    }

    generateColors() {
        const cf = new ColorThief();
        const data = {
            key: "31117334-98f93316f25d761fec9942630",
            q: this.theme.replaceAll(" ", "+"),
            image_type: "vector",
            safesearch: true
        }

        var query = "";
        Object.keys(data).forEach(k => query += `${k}=${data[k].toString()}&`);

        request(`https://pixabay.com/api/?${query}`, "GET", r => {
            const response = JSON.parse(r).hits, len = response.length;
            if (!response || len < 3) return this.parent.emit("themeGenerationError");

            var brightnesses = [], queue = response.length, loaded = 0;
            this.theme = this.theme[0].toUpperCase() + this.theme.substring(1).trim() + ".";

            response.forEach(h => {
                const img = new Image();
                img.src = h.previewURL;
                img.crossOrigin = "Anonymous";

                img.onload = _ => {
                    loaded++;
                    const col = `rgb(${cf.getColor(img).join(",")})`;

                    brightnesses.push([col, brightness(col), img.src]);
                    // console.log(`%c${brightnesses[brightnesses.length - 1]}`, `background-color:${col}`);

                    if (loaded == queue) {
                        brightnesses.sort((a, b) => b[1] - a[1]);

                        const colToArr = col => !col ? "N" : Array.from(col.replaceAll(/rgb\(|\)/g, "").split(","), e => e = parseFloat(e));
                        const numB = brightnesses.length;
                        this.colors = { ls: "", la: "", bc: "", da: "", ds: "" }

                        const indexes = [
                            brightnesses[0],
                            len % 4 == 0 ? brightnesses[Math.floor(numB / 4)] : [],
                            brightnesses[Math.floor(numB / 2)],
                            len % 4 == 0 ? brightnesses[Math.floor(numB * (3 / 4))] : [],
                            brightnesses[brightnesses.length - 1]
                        ]

                        indexes.forEach((b, i) => {
                            this.colors[Object.keys(this.colors)[i]] = {
                                color: colToArr(b[0]),
                                image: b[2]
                            }
                        })

                        this.parent.emit("themeGenerated");
                    }
                }
            })
        })
    }
}