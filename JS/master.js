import { EventEmitter } from "events";

import ScrollReveal from "scrollreveal";

import ThemeGenerator from "./Steps/theme.js";
import PaletteGenerator from "./Steps/palette.js";
import StaggerFill from "./Steps/staggerfill.js";
import CardGenerator from "./Steps/cards.js";

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
                if (colorElms[i]) {
                    colorElms[i].style.transitionDelay = `${i * 50}ms`;
                    colorElms[i].setAttribute("copy", c);
                }

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
            this.cardGenerator = new CardGenerator();
            document.querySelector(".header-item.copy").setAttribute("copy", this.fColors.join(", "));
        });

        this.on("cardsGenerated", _ => {
            setTimeout(_ => {
                document.body.dataset.ready = "true";
                this.generating = false;
    
                ScrollReveal().reveal("[slide-in]", {distance: "125%", opacity: 1})
            }, 1000)
        })
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
        document.querySelector(".header-item.favorite > i").classList.replace("bi-star-fill", "bi-star");

        document.querySelectorAll("[slide-in]").forEach(e => e.style.transform = "");

        setTimeout(_ => this.generate(this.themeGenerator.theme.toLowerCase().replace(".", ""), true), 600);
    }
}