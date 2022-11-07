import request from "../Utils/requests";

export default class paletteGenerator {
    constructor(light, mid, dark) {
        this.light = light;
        this.mid = mid;
        this.dark = dark;

        this.requestColors();
    }

    requestColors() {
        const colors = document.querySelectorAll(".color");
        var palette = [];

        const data = {
            model: "ui",
            input: [
                this.light,
                "N",
                this.mid,
                "N",
                this.dark
            ]
        };

        request("http://colormind.io/api/", "POST", r => {
            const response = JSON.parse(r).result;

            colors.forEach((c, i) => {
                c.style.backgroundColor = `rgb(${response[i][0]},${response[i][1]},${response[i][2]})`;
                palette.push(c);
            })

            return palette;
        }, data);
    }
}