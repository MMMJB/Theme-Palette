import WebsiteGenerator from "../master";

import request from "../Utils/requests";

export default class CardGenerator {
    constructor () {
        this.parent = new WebsiteGenerator();
        this.list = document.querySelector("ul.color-info");

        while (this.list.firstChild)
            list.removeChild(list.firstChild);

        request("/cardcontent.json", "GET", r => {
            this.cardcontent = JSON.parse(r);
        
            Object.keys(this.parent.themeGenerator.colors).forEach((c, i) => {
                const targ = this.parent.themeGenerator.colors[c];
                
                this.generateCard(
                    targ.image || "/img/undefined.png",
                    Object.keys(this.parent.themeGenerator.colors)[i],
                    this.cardcontent[i],
                    i % 2 == 0
                );
            })

            this.parent.emit("cardsGenerated");
        });
    }

    generateCard(img, col, text, flip) {
        const imgEl = `<a class="color-info-img ${col}" style="background-image:url(${img})" href=${img} target="_blank"></a>`;
        const textEl = `<div class="color-info-text" ${flip ? "rev" : ""}><h3>${text.title}</h3><p>${text.content}</p></div>`;

        this.list.innerHTML += `
            <li class="color-info-card" ${flip ? "rev" : ""} slide-in>
                ${flip ? textEl : imgEl}
                ${flip ? imgEl : textEl}
            </li>
        `
    }
}