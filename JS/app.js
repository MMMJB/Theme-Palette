import WebsiteGenerator from "./master";

window.onload = _ => {
    const website = new WebsiteGenerator();

    document.querySelector(".refresh").onclick = _ => {
        document.querySelector(".refresh > i").animate(
            [
                { transform: "rotate(0)" },
                { transform: "rotate(360deg)" }
            ],
            {
                duration: 300,
                iterations: 1,
                easing: "ease-out"
            }
        )

        website.reset();
    }
};