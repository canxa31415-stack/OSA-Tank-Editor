const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
OGWidth = canvas.width
OGHeight = canvas.height


let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragStartOffsetX = 0;
let dragStartOffsetY = 0;
canvas.addEventListener("mousedown", (event) => {
    isDragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragStartOffsetX = offsetX;
    dragStartOffsetY = offsetY;
});

window.addEventListener("mouseup", () => {
    isDragging = false;
});

window.addEventListener("mousemove", (event) => {
    if (!isDragging) return;
    const dx = event.clientX - dragStartX;
    const dy = event.clientY - dragStartY;
//        offsetX = dragStartOffsetX - dx * zoom;
//        offsetY = dragStartOffsetY - dy * zoom;
});
canvas.addEventListener("wheel", (event) => {
    event.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xWorld = (mouseX - canvas.width / 2) * zoom + offsetX;
    const yWorld = (mouseY - canvas.height / 2) * zoom + offsetY;

    const zoomFactor = 1.2;

    if (event.deltaY < 0) {
        zoom *= zoomFactor;
    } else {
        zoom /= zoomFactor;
    }

//        offsetX = xWorld - (mouseX - canvas.width / 2) * zoom;
//        offsetY = yWorld - (mouseY - canvas.height / 2) * zoom;
    zoomShow.textContent = zoom;
});

function radiansToDegrees(radians) {
    return radians * (180 / Math.PI)
}
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180)
}
function isEven(number) {
    return number % 2 === 0;
}

function toNumberIfNumeric(str) {
    // Try converting the string to a number
    const num = Number(str);

    // Check if conversion is valid
    if (!isNaN(num)) {
        return num; // it's a number, return it
    } else {
        return str; // not a number, return original string
    }
}
function rotatePoint(x, y, cx, cy, angle) {
    // angle in radians
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const dx = x - cx;
    const dy = y - cy;

    const xNew = dx * cos - dy * sin + cx;
    const yNew = dx * sin + dy * cos + cy;

    return [ xNew, yNew ];
}
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function hexToHSL(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map(x => x + x).join("");

    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }

    return { h, s: s * 100, l: l * 100 };
}
function HSLToHex(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c/2;
    let r, g, b;

    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    let R = Math.round((r + m) * 255).toString(16).padStart(2, "0");
    let G = Math.round((g + m) * 255).toString(16).padStart(2, "0");
    let B = Math.round((b + m) * 255).toString(16).padStart(2, "0");

    return `#${R}${G}${B}`.toUpperCase();
}
function shiftColor(hex, hueShift=0, satMult=1, brightShift=0) {
    let {h, s, l} = hexToHSL(hex);

    // Apply hue shift
    h = (h + hueShift) % 360;
    if (h < 0) h += 360;

    // Apply saturation multiplier
    s = Math.min(100, Math.max(0, s * satMult));

    // Apply brightness shift (-100 to 100)
    l = Math.min(100, Math.max(0, l + brightShift));

    return HSLToHex(h, s, l);
}
const coeffs = [ // chat gpt written
    -7.7963687551e-07,
    0.000192084425954,
    -0.017330032325,
    0.921988588286,
    -7.68498944021,
    36.6018925519,
    -36.0376872078
];
function approximateScore(x) { // chat gpt written
    // Horner's method
    let result = 0.0;
    for (let i = 0; i < coeffs.length; i++) {
        result = result * x + coeffs[i];
    }
    return result;
}
function invertedApproximateScore(yTarget, xMin = 0, xMax = 200) { // chat gpt written
    let tol = 1e-6;   // tolerance for stopping
    let maxIter = 100;

    for (let i = 0; i < maxIter; i++) {
        let mid = 0.5 * (xMin + xMax);
        let yMid = approximateScore(mid);

        if (Math.abs(yMid - yTarget) < tol) {
            return mid; // close enough
        }

        if (yMid < yTarget) {
            xMin = mid;
        } else {
            xMax = mid;
        }
    }
    return Math.round(0.5 * (xMin + xMax)); // best guess after maxIter

}
