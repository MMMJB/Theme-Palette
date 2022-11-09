import { EventEmitter } from "events";

import ThemeGenerator from "./Steps/theme";
import PaletteGenerator from "./Steps/palette";
import StaggerFill from "./Steps/staggerfill";

export default class WebsiteGenerator extends EventEmitter {
    static instance;
    
    constructor () {
        super();

        if (WebsiteGenerator.instance) return WebsiteGenerator.instance;
        WebsiteGenerator.instance = this;

        this.themeGenerator = new ThemeGenerator();
       
        this.on("themeGenerated", _ => this.paletteGenerator = new PaletteGenerator(this.themeGenerator.colors));
        
        this.on("paletteGenerated", _ => {
            document.querySelector(".example-text").innerText = this.themeGenerator.theme;
            this.staggerFill = new StaggerFill(document.body, this.paletteGenerator.palette);
        })

        this.on("finishedAnimating", _ => {
            const colors = this.staggerFill.colors;
            const colorElms = document.querySelectorAll(".color");

            colorElms.forEach((e, i) => {
                e.style.backgroundColor = colors[i];
                e.style.transitionDelay = `${i * 50}ms`;
            })

            document.querySelector(".colors").classList.add("animating");
        })
    }
}