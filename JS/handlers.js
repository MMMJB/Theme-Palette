export default class Handlers {
    constructor (website) {
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
    
        document.querySelectorAll("*").forEach(e => e.addEventListener("click", e => {
            const targ = e.target;
            if (!targ.getAttribute("copy") && !targ.parentElement.getAttribute("copy")) return;

            const copyText = targ.getAttribute("copy") || targ.parentElement.getAttribute("copy");
            navigator.clipboard.writeText(copyText);
    
            if (targ.tagName == "I") targ.classList.replace("bi-clipboard", "bi-clipboard-check");
            else if (targ.querySelector("i")) targ.querySelector("i").classList.replace("bi-clipboard", "bi-clipboard-check");
        }))
    
        document.querySelector(".header-item.favorite").onclick = _ => {
            const icon = document.querySelector(".header-item.favorite > i");
            
            if (icon.classList.contains("bi-star")) {
                if (!window.localStorage.getItem("savedThemes")) window.localStorage.setItem("savedThemes", "[]");
                var saved = JSON.parse(window.localStorage.getItem("savedThemes"));

                saved.push({
                    theme: website.themeGenerator.theme.toLowerCase().replace(".", ""),
                    colors: website.fColors,
                    images: Array.from(Object.keys(website.themeGenerator.colors), c => website.themeGenerator.colors[c].image)
                })

                window.localStorage.setItem("savedThemes", JSON.stringify(saved));

                icon.classList.replace("bi-star", "bi-star-fill");
            } else {
                var saved = JSON.parse(window.localStorage.getItem("savedThemes"));
                saved.splice(saved.findIndex(t => t.colors.toString() == website.fColors.toString()), 1);

                window.localStorage.setItem("savedThemes", JSON.stringify(saved));

                icon.classList.replace("bi-star-fill", "bi-star");
            }
        }

        document.querySelectorAll("*:not(a, link)[href]").forEach(e => e.onclick = e => window.open(e.target.getAttribute("href"), "_blank"));
    }
}