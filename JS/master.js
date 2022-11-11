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

        this.generate();
    }
    
    generate(theme = undefined, generated = false) {
        if (!generated) this.themeGenerator = new ThemeGenerator(theme);
        else this.emit("themeGenerated");
       
        this.on("themeGenerated", _ => this.paletteGenerator = new PaletteGenerator(this.themeGenerator.colors));

        this.on("paletteGenerated", _ => {
            window.scrollTo(0, 0);

            const colors = Array.from(this.paletteGenerator.palette, c => `rgb(${c.join(",")})`);
            const colorElms = document.querySelectorAll(".color");

            colors.forEach((c, i) => {
                if (colorElms[i]) {
                    colorElms[i].style.backgroundColor = c;
                    colorElms[i].style.transitionDelay = `${i * 50}ms`;
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
            
            setTimeout(_ => {
                document.body.dataset.ready = "true";
                ScrollReveal().reveal(document.querySelectorAll("[slide-in]"), {distance: "100%"})
            }, 500);
        });
    }

    reset() {
        document.body.dataset.ready = "false";
        document.querySelector(".colors").classList.remove("animating");
        
        this.generate(this.themeGenerator.theme.toLowerCase().replace(".", ""), true);
    }
}