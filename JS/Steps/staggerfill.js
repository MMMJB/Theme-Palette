import WebsiteGenerator from "../master";

import lerp from "../Utils/lerp";

export default class StaggerFill {
    constructor (elm, colors) {
        this.FPS = 60;

        this.parent = new WebsiteGenerator();
        this.elm = elm;
        this.elm.style.backgroundSize = "101%";
        this.colors = Array.from(colors, c => `rgb(${c.join(",")})`);

        this.animateGradient(.075);
    }

    animateGradient(speed) {
        this.sizes = Array(this.colors.length).fill(100);
        const len = this.sizes.length;
        
        var growing = 1;

        var animating = setInterval(_ => {
            if (growing == this.sizes.length - 1 && this.sizes[len - 2] <= 1) {
                this.elm.style.backgroundColor = this.colors[this.colors.length - 1];
                this.elm.style.backgroundImage = "";

                this.parent.emit("finishedAnimating");
                return clearInterval(animating);
            }

            for (let i = 0; i < growing; i++)
                if (this.sizes[i] > 1) this.sizes[i] = lerp(this.sizes[i], 0, speed);

            if (this.sizes[growing - 1] <= 50 && growing !== len - 1) growing++;

            this.generateGradient();
        }, 1000 / this.FPS)
    }

    generateGradient() {
        var grad = [];
        this.colors.forEach((c, i) => {
            if (i > 0) grad.push(`${c} ${this.sizes[i - 1]}%`);
            grad.push(`${c} ${this.sizes[i]}%`);
        });
        
        this.elm.style.backgroundImage = `linear-gradient(to left, ${grad.join(",")})`;
    }
}