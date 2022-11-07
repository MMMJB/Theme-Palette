import request from "../Utils/requests";

export default function generatePalette(startColor) {
    const colors = document.querySelectorAll(".color");
    var palette = [];

    const data = {
        model: "ui",
        input: [
            "N",
            "N",
            startColor,
            "N",
            "N"
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