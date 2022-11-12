import { EventEmitter } from "events";

import ScrollReveal from "scrollreveal";

import ThemeGenerator from "./Steps/theme";
import PaletteGenerator from "./Steps/palette";
import StaggerFill from "./Steps/staggerfill";

export default class WebsiteGenerator extends EventEmitter {
    static instance;
    
    constructor () {
        super();

        if (WebsiteGenerator.instance) return WebsiteGenerator.instance;
        WebsiteGenerator.instance = this;

        this.generating = false;

        this.setListeners();
        this.generate();
    }

    setListeners() {
        this.on("themeGenerated", _ => this.paletteGenerator = new PaletteGenerator(this.themeGenerator.colors));

        this.on("paletteGenerated", _ => {
            window.scrollTo(0, 0);

            this.fColors = Array.from(this.paletteGenerator.palette, c => `rgb(${c.join(",")})`);
            const colorElms = document.querySelectorAll(".color");

            this.fColors.forEach((c, i) => {
                if (colorElms[i]) colorElms[i].style.transitionDelay = `${i * 50}ms`;

                document.documentElement.style.setProperty(
                    `--${Object.keys(this.themeGenerator.colors)[i]}`,
                    `${c}`
                )
            })

            document.querySelector(".example-text").innerText = this.themeGenerator.theme;
            this.staggerFill = new StaggerFill(document.querySelector("main"), this.paletteGenerator.palette);
        })

        this.on("finishedAnimating", _ => {
            document.querySelector(".colors").classList.add("animating");
            
            setTimeout(_ => {
                document.body.dataset.ready = "true";
                this.generating = false;

                ScrollReveal().reveal(document.querySelectorAll("[slide-in]"), {distance: "125%"})
            
                this.generateCards();
            }, 500);
        });
    }
    
    generate(theme = undefined, generated = false) {
        this.generating = true;

        if (!generated) this.themeGenerator = new ThemeGenerator(theme);
        else this.emit("themeGenerated");
    }

    reset() {
        if (this.generating) return;

        document.body.dataset.ready = "false";
        document.querySelector(".colors").classList.remove("animating");
        document.querySelector(".header-item.copy > i").classList.replace("bi-clipboard-check", "bi-clipboard");

        this.generate(this.themeGenerator.theme.toLowerCase().replace(".", ""), true);
    }

    generateCards() {
        const list = document.querySelector("ul.color-info");

        while (list.firstChild)
            list.removeChild(list.firstChild);

        function generateCard(img, col, text, flip) {
            const imgEl = `<a class="color-info-img ${col}" style="background-image:url(${img})" href=${img} target="_blank"></a>`;
            const textEl = `<p class="color-info-text" ${flip ? "rev" : ""}>${text}</p>`;

            list.innerHTML += `
                <li class="color-info-card">
                    ${flip ? textEl : imgEl}
                    ${flip ? imgEl : textEl}
                </li>
            `
        }

        Object.keys(this.themeGenerator.colors).forEach((c, i) => {
            const targ = this.themeGenerator.colors[c];
            
            generateCard(
                targ.image || "undefined.png",
                Object.keys(this.themeGenerator.colors)[i],
                undefined,
                i % 2 == 0
            );
        })
    }
}