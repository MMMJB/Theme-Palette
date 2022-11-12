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
    
        document.querySelector(".header-item.copy").onclick = _ => {
            if (!website.staggerFill) return;
    
            navigator.clipboard.writeText(website.staggerFill.colors.join(", "));
    
            document.querySelector(".header-item.copy > i").classList.replace("bi-clipboard", "bi-clipboard-check");
        }
    
        document.querySelector(".header-item.favorite").onclick = _ => {
            const icon = document.querySelector(".header-item.favorite > i");
            if (icon.classList.contains("bi-star")) icon.classList.replace("bi-star", "bi-star-fill");
            else icon.classList.replace("bi-star-fill", "bi-star");
        }
    }
}