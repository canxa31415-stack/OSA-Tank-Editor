
function decimal2hex(d) {
    return d.toString(16);
};
function hex2decimal(h) {
    return parseInt(h, 16);
};
function mixColors(color_2, color_1, weight = 0.5) {
    if (weight === 1) return color_1;
    if (weight === 0) return color_2;
    var col = "#";
    for (var i = 1; i <= 6; i += 2) {
        // loop through each of the 3 hex pairs—red, green, and blue, skip the '#'
        var v1 = hex2decimal(color_1.substr(i, 2)), // extract the current pairs
            v2 = hex2decimal(color_2.substr(i, 2)),
            // combine the current pairs from each source color, according to the specified weight
            val = decimal2hex(Math.floor(v2 + (v1 - v2) * weight));
        while (val.length < 2) {
            val = "0" + val;
        } // prepend a '0' if val results in a single digit
        col += val; // concatenate val to our new color string
    }
    return col; // PROFIT!
};
function hueToRgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 0.166) return p + (q - p) * 6 * t;
    if (t < 0.5) return q;
    if (t < 0.666) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
};
function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }
    return '#' +
        Math.round(r * 255).toString(16).padStart(2, '0') +
        Math.round(g * 255).toString(16).padStart(2, '0') +
        Math.round(b * 255).toString(16).padStart(2, '0');
};
function getRainbow(a, b, c = 0.5) {
    if (0 >= c) return a;
    if (1 <= c) return b;
    let f = 1 - c;
    a = parseInt(a.slice(1, 7), 16);
    b = parseInt(b.slice(1, 7), 16);
    return (
        "#" +
        (
            (((a & 16711680) * f + (b & 16711680) * c) & 16711680) |
            (((a & 65280) * f + (b & 65280) * c) & 65280) |
            (((a & 255) * f + (b & 255) * c) & 255)
        )
        .toString(16)
        .padStart(6, "0")
    );
};
let lightColors = {
    "teal": "#7ad3db",
    "lgreen": "#b9e87e",
    "orange": "#e7896d",
    "yellow": "#fdf380",
    "lavender": "#b58efd",
    "aqua": "#7adbba",
    "pink": "#ef99c3",
    "vlgrey": "#e8ebf7",
    "lgrey": "#a4a4ad", //"#aa9f9e",
    "guiwhite": "#ffffff",
    "black": "#484848",
    "blue": "#3ca4cb",
    "green": "#8abc3f",
    "red": "#e03e41",
    "gold": "#efc74b",
    "purple": "#8d6adf",
    "magenta": "#cc669c",
    "grey": "#a7a7af",
    "dgrey": "#726f6f",
    "white": "#dbdbdb",
    "guiblack": "#000000",
    "mustard": "#c49608",
    "tangerine": "#ec7b0f",
    "brown": "#895918",
    "cyan": "#13808e",
};
let darkColors = {
    "teal": "#6ecedc",
    "lgreen": "#0c491d",
    "orange": "#c46748",
    "yellow": "#b2b224",
    "lavender": "#7d56c5",
    "aqua": "#62caa7",
    "pink": "#b24fae",
    "vlgrey": "#1e1e1e",
    "lgrey": "#3c3a3a",
    "guiwhite": "#000000",
    "black": "#e5e5e5",
    "blue": "#379FC6",
    "green": "#30b53b",
    "red": "#ff6c6e",
    "gold": "#ffc665",
    "purple": "#9673e8",
    "magenta": "#c8679b",
    "grey": "#635f5f",
    "dgrey": "#73747a",
    "white": "#11110f",
    "guiblack": "#ffffff",
    "mustard": "#c49608",
    "tangerine": "#ec7b0f",
    "brown": "#895918",
    "cyan": "#13808e",
};
let naturalColors = {
    "teal": "#76c1bb",
    "lgreen": "#aad35d",
    "orange": "#e09545",
    "yellow": "#ffd993",
    "lavender": "#939fff",
    "aqua": "#76c1bb",
    "pink": "#d87fb2",
    "vlgrey": "#c4b6b6",
    "lgrey": "#7f7f7f",
    "guiwhite": "#ffffff",
    "black": "#373834",
    "blue": "#4f93b5",
    "green": "#00b659",
    "red": "#e14f65",
    "gold": "#e5bf42",
    "purple": "#8053a0",
    "magenta": "#b67caa",
    "grey": "#998f8f",
    "dgrey": "#494954",
    "white": "#a5b2a5",
    "guiblack": "#000000",
    "mustard": "#c49608",
    "tangerine": "#ec7b0f",
    "brown": "#895918",
    "cyan": "#13808e",
};
let classicColors = {
    "teal": "#6cfffa",
    "lgreen": "#85e37d",
    "orange": "#fc7676",
    "yellow": "#ffeb8e",
    "lavender": "#b58eff",
    "aqua": "#72eacf",
    "pink": "#f177dd",
    "vlgrey": "#cdcdcd",
    "lgrey": "#999999",
    "guiwhite": "#ffffff",
    "black": "#525252",
    "blue": "#00b0e1",
    "green": "#00e06c",
    "red": "#f04f54",
    "gold": "#ffe869",
    "purple": "#768cfc",
    "magenta": "#be7ff5",
    "grey": "#999999",
    "dgrey": "#545454",
    "white": "#c0c0c0",
    "guiblack": "#000000",
    "mustard": "#c49608",
    "tangerine": "#ec7b0f",
    "brown": "#895918",
    "cyan": "#13808e",
};
let color = lightColors;
let borderType = "document.getElementById('borderType').value.toString()";
let animatedColor = {
    lesbian: "",
    gay: "",
    bi: "",
    trans: "",
    magenta: "",
    blue_red: "",
    blue_grey: "",
    grey_blue: "",
    red_grey: "",
    grey_red: ""
};
function reanimateColors() {
    let now = Date.now(),

        //six_gradient = Math.floor((now / 200) % 6),
        five_bars = Math.floor((now % 2000) / 400),
        three_bars = Math.floor((now % 2000) * 3 / 2000),
        blinker = 150 > now % 300,

        lesbian_magenta = "#a50062",
        lesbian_oredange = "#d62900",
        lesbian_white = "#ffffff",
        lesbian_useSecondSet = five_bars < 2,

        gay_transition = (now / 2000) % 1,

        ratio = (Math.sin(now / 2000 * Math.PI)) / 2 + 0.5,
        light_purple = { h: 258 / 360, s: 1, l: 0.84 },
        purple = { h: 265 / 360, s: 0.69, l: 0.47 },

        trans_pink = "#f7a8b8",
        trans_blue = "#55cdfc",
        trans_white = "#ffffff";

    animatedColor.lesbian = getRainbow(lesbian_useSecondSet ? lesbian_oredange : lesbian_white, lesbian_useSecondSet ? lesbian_white : lesbian_magenta, (lesbian_useSecondSet ? five_bars : five_bars - 3) / 2);
    animatedColor.gay = hslToRgb(gay_transition, 0.75, 0.5);
    // animatedColor.trans = [trans_blue, trans_pink, trans_white, trans_pink, trans_blue][five_bars];
    animatedColor.trans = mixColors(trans_white, 2000 > now % 4000 ? trans_blue : trans_pink, Math.max(Math.min(5 * Math.sin(now % 2000 / 2000 * Math.PI) - 2, 1), 0)); // Animated!
    animatedColor.magenta = hslToRgb(
        light_purple.h + (purple.h - light_purple.h) * ratio,
        light_purple.s + (purple.s - light_purple.s) * ratio,
        light_purple.l + (purple.l - light_purple.l) * ratio
    );

    animatedColor.blue_red = blinker ? color.blue : color.red;
    animatedColor.blue_grey = blinker ? color.blue : color.grey;
    animatedColor.grey_blue = blinker ? color.grey : color.blue;
    animatedColor.red_grey = blinker ? color.red : color.grey;
    animatedColor.grey_red = blinker ? color.grey : color.red;
};
function getColor(colorNumber) {
    if (colorNumber[0] == '#') return colorNumber;
    switch (colorNumber) {
        case 0:
        case "shiny":
        case "teal":
            return color.teal;
        case 1:
        case "legendary":
        case "lightGreen":
            return color.lgreen;
        case 2:
        case "triangle":
        case "orange":
            return color.orange;
        case 3:
        case "neutral":
        case "yellow":
            return color.yellow;
        case 4:
        case "lavender":
            return color.lavender;
        case "hexagon":
        case "aqua":
            return color.aqua;
        case 5:
        case "crasher":
        case "pink":
            return color.pink;
        case 6:
        case "egg":
        case "veryLightGrey":
        case "veryLightGray":
            return color.vlgrey;
        case 7:
        case "wall":
        case "lightGrey":
        case "lightGray":
            return color.lgrey;
        case 8:
        case "pureWhite":
            return color.guiwhite;
        case 9:
        case "black":
            return color.black;
        case 10:
        case "blue":
            return color.blue;
        case 11:
        case "green":
            return color.green;
        case 12:
        case "red":
            return color.red;
        case 13:
        case "square":
        case "gold":
            return color.gold;
        case 14:
        case "pentagon":
        case "purple":
            return color.purple;
        case 15:
        case "magenta":
            return color.magenta;
        case 16:
        case "grey":
        case "gray":
            return color.grey;
        case 17:
        case "darkGrey":
        case "darkGray":
            return color.dgrey;
        case 18:
        case "white":
            return color.white;
        case 19:
        case "pureBlack":
            return color.guiblack;
        case 20:
        case "animatedBlueRed":
        case "flashBlueRed":
            return animatedColor.blue_red;
        case 21:
        case "animatedBlueGrey":
        case "animatedBlueGray":
        case "flashBlueGrey":
        case "flashBlueGray":
            return animatedColor.blue_grey;
        case 22:
        case "animatedGreyBlue":
        case "animatedGrayBlue":
        case "flashGreyBlue":
        case "flashGrayBlue":
            return animatedColor.grey_blue;
        case 23:
        case "animatedRedGrey":
        case "animatedRedGray":
        case "flashRedGrey":
        case "flashRedGray":
            return animatedColor.red_grey;
        case 24:
        case "animatedGreyRed":
        case "animatedGrayRed":
        case "flashGreyRed":
        case "flashGrayRed":
            return animatedColor.grey_red;
        case 25:
        case "mustard":
            return color.mustard;
        case 26:
        case "darkOrange":
        case "tangerine":
            return color.tangerine;
        case 27:
        case "brown":
            return color.brown;
        case 28:
        case "cyan":
        case "turquoise":
            return color.cyan;
        case 29:
        case "animatedLesbian":
            return animatedColor.lesbian;
        case 30:
        case "powerGem":
        case "powerStone":
            return "#a913cf";
        case 31:
        case "spaceGem":
        case "spaceStone":
            return "#226ef6";
        case 32:
        case "realityGem":
        case "realityStone":
            return "#ff1000";
        case 33:
        case "soulGem":
        case "soulStone":
            return "#ff9000";
        case 34:
        case "timeGem":
        case "timeStone":
            return "#00e00b";
        case 35:
        case "mindGem":
        case "mindStone":
            return "#ffd300";
        case 36:
        case "rainbow":
            return animatedColor.gay;
        case 37:
        case "animatedTrans":
            return animatedColor.trans;
        case 38:
        case "animatedBi":
            return animatedColor.bi;
        case 39:
        case "pumpkinStem":
            return "#654321";
        case 40:
        case "pumpkinBody":
            return "#e58100";
        case 41:
        case "tree":
            return "#267524";
        case 42:
        case "animatedMagenta":
            return animatedColor.magenta
        case "border":
            return mixColors(color.white, color.guiblack, 1 / 3);
        default:
            return "#000000";
    }
};
function getColorDark(givenColor) {
    let dark = color.black;
    if (borderType === "darkBorders") {
        return dark;
    } else if (borderType === "softBorders") {
        return mixColors(givenColor, dark, color.border);
    }
};