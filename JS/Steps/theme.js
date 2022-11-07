import { EventEmitter } from "events";

import request from "../Utils/requests";
import brightness from "../Utils/brightness";

export default async function generateTheme() {
    var ev = new EventEmitter(), theme;

    request("/public/themes.txt", "GET", r => {
        const response = r.split("\n");

        theme = response[Math.floor(Math.random() * response.length)];
        console.log(theme);
        ev.emit("themeGenerated");
    })

    ev.on("themeGenerated", _ => {
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
                    console.log(`%c${brightnesses[brightnesses.length - 1]}`, `background-color:${col}`);

                    if (loaded == queue) {
                        brightnesses.sort((a, b) => b[1] - a[1]);

                        console.log(brightnesses);
                    }
                }
            })
        })
    })
}