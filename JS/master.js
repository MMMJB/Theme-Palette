import generateTheme from "./Steps/theme";
import generatePalette from "./Steps/palette";

export default class Website {
    constructor () {
        generateTheme().then(r => console.log(r));
    }
}