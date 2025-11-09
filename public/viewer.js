

let levelCap = document.getElementById('levelCap');
let whichTank = document.getElementById('whichTank');
let tankCode = {}
let pointyTraps = document.getElementById('optNoPointy');
let labelShower = document.getElementById('labelShower');
let nameShower = document.getElementById('nameShower');
let definitionShower = document.getElementById('definitionShower');
let allowErrors = document.getElementById('errors').value;
let upgradeLabelShower = document.getElementById('upgradeLabelShower');
let currentError = document.getElementById('currentError');
let showGrid = eval(document.getElementById('showGrid').value);
let lazyRealSizes = [1, 1, 1];
for (let i = 3; i < 17; i++) {
    // We say that the real size of a 0-gon, 1-gon, 2-gon is one, then push the real sizes of triangles, squares, etc...
    let circum = (2 * Math.PI) / i;
    lazyRealSizes.push(Math.sqrt(circum * (1 / Math.sin(circum))));
}
const drawPolyImgs = [];
function drawPoly(context, centerX, centerY, radius, sides, angle = 0, borderless, fill, imageInterpolation) {
    try {
        let fixedRadius = radius
        if (lazyRealSizes.length > Math.abs(sides)) {
            fixedRadius = radius * lazyRealSizes[Math.abs(Math.floor(sides))];
        }
        // Start drawing
        context.beginPath();
        if (sides instanceof Array) {
            let dx = Math.cos(angle);
            let dy = Math.sin(angle);
            for (let [x, y] of sides)
                context.lineTo(
                    centerX + fixedRadius * (x * dx - y * dy),
                    centerY + fixedRadius * (y * dx + x * dy)
                );
        } else {
            if ("string" === typeof sides) {
                //ideally we'd preload images when mockups are loaded but im too lazy for that atm
                if (sides.startsWith('/') | sides.startsWith('./') | sides.startsWith('http')) {
                    drawPolyImgs[sides] = new Image();
                    drawPolyImgs[sides].src = sides;
                    drawPolyImgs[sides].isBroken = false;
                    drawPolyImgs[sides].onerror = function() {
                        this.isBroken = true;
                    }

                    let img = drawPolyImgs[sides];
                    context.translate(centerX, centerY);
                    context.rotate(angle);
                    context.imageSmoothingEnabled = imageInterpolation;
                    context.drawImage(img, -fixedRadius, -fixedRadius, fixedRadius*2, fixedRadius*2);
                    context.imageSmoothingEnabled = true;
                    context.rotate(-angle);
                    context.translate(-centerX, -centerY);
                    return;
                }
                let path = new Path2D(sides);
                context.save();
                context.translate(centerX, centerY);
                context.scale(fixedRadius, fixedRadius);
                context.lineWidth /= fixedRadius;
                context.rotate(angle);
                context.lineWidth *= fill ? 1 : 0.5; // Maintain constant border width
                if (!borderless) context.stroke(path);
                if (fill) context.fill(path);
                context.restore();
                return;
            }
            angle += sides % 2 ? 0 : Math.PI / sides;
        }
        if (!sides) {
            // Circle
            let fillcolor = context.fillStyle;
            let strokecolor = context.strokeStyle;
            context.arc(centerX, centerY, fixedRadius, 0, 2 * Math.PI);
            context.fillStyle = strokecolor;
            context.lineWidth *= fill ? 1 : 0.5; // Maintain constant border width
            if (!borderless) context.stroke();
            context.closePath();
            context.beginPath();
            context.fillStyle = fillcolor;
            context.arc(centerX, centerY, fixedRadius * fill, 0, 2 * Math.PI);
            if (fill) context.fill();
            context.closePath();
            return;
        } else if (sides < 0) {
            // Star
            if (pointyTraps === true) context.lineJoin = "miter";
            sides = -sides;
            angle += (sides % 1) * Math.PI * 2;
            sides = Math.floor(sides);
            let dip = 1 - 6 / (sides ** 2);
            context.moveTo(centerX + fixedRadius * Math.cos(angle), centerY + fixedRadius * Math.sin(angle));
            context.lineWidth *= fill ? 1 : 0.5; // Maintain constant border width
            for (let i = 0; i < sides; i++) {
                let htheta = ((i + 0.5) / sides) * 2 * Math.PI + angle,
                    theta = ((i + 1) / sides) * 2 * Math.PI + angle,
                    cx = centerX + fixedRadius * dip * Math.cos(htheta),
                    cy = centerY + fixedRadius * dip * Math.sin(htheta),
                    px = centerX + fixedRadius * Math.cos(theta),
                    py = centerY + fixedRadius * Math.sin(theta);
                /*if (curvyTraps) {
                    context.quadraticCurveTo(cx, cy, px, py);
                } else {
                    context.lineTo(cx, cy);
                    context.lineTo(px, py);
                }*/
                context.quadraticCurveTo(cx, cy, px, py);
            }
        } else if (sides > 0) {
            // Polygon
            angle += (sides % 1) * Math.PI * 2;
            sides = Math.floor(sides);
            context.lineWidth *= fill ? 1 : 0.5; // Maintain constant border width
            for (let i = 0; i < sides; i++) {
                let theta = (i / sides) * 2 * Math.PI + angle;
                context.lineTo(centerX + fixedRadius * Math.cos(theta), centerY + fixedRadius * Math.sin(theta));
            }
        }
        context.closePath();
        if (!borderless) context.stroke();
        if (fill) context.fill();
        context.lineJoin = "round";
    } catch (e) { // this actually prevents to panic the client. so we will just call "resizeEvent()".
        resizeEvent();
        console.error("Uh oh, 'CanvasRenderingContext2D' has gotton an error! Error: " + e);
    }
}
function drawTrapezoid(
    context, x, y,
    length, height, aspect, angle,
    borderless, fill, alpha, strokeWidth,
    offsetX, offsetY // <-- added vertical offset
) {
    let h = aspect > 0 ? [height * aspect, height] : [height, -height * aspect];

    // Construct a trapezoid at angle 0
    let points = [],
        sinT = Math.sin(angle),
        cosT = Math.cos(angle);

    points.push([-offsetX,  h[1] - offsetY]);
    points.push([ length * 2 - offsetX,  h[0] - offsetY]);
    points.push([ length * 2 - offsetX, -h[0] - offsetY]);
    points.push([-offsetX, -h[1] - offsetY]);

    context.globalAlpha = alpha;
    context.beginPath();

    for (let point of points) {
        let newX = point[0] * cosT - point[1] * sinT + x,
            newY = point[0] * sinT + point[1] * cosT + y;
        context.lineTo(newX, newY);
    }

    context.closePath();
    context.lineWidth *= strokeWidth;
    context.lineWidth *= fill ? 1 : 0.5; // Maintain constant border width

    if (!borderless) context.stroke();
    context.lineWidth /= fill ? 1 : 0.5;

    if (fill) context.fill();
    context.globalAlpha = 1;
}

function calcColor(color) {
    if (isObject(color)) {
        if (color.BASE) {
            return shiftColor(getColor(color.BASE), color.HUE_SHIFT || 0, color.SATURATION_SHIFT || 1, color.BRIGHTNESS_SHIFT || 0);
        } else {
            return getColor("grey");
        }
    } else {
        return getColor(color);
    }
}
const drawEntity = (baseColor, x, y, code, rotation) => {
//    console.log(baseColor, x, y, code);
    ctx.lineWidth = zoom*4.175;
    function turretStuffsBelow() {
        for(let i = 0; i < code.TURRETS.length; i++) {
            if (code.TURRETS[i].POSITION[5] === 0) {
                if (Array.isArray(code.TURRETS[i].TYPE)) {
                    turretCode = {...Class[code.TURRETS[i].TYPE[0]], ...code.TURRETS[i].TYPE[1]}
                } else {
                    turretCode = Class[code.TURRETS[i].TYPE]
                }
                newTurretCode = { ...Class.genericEntity };
                if (turretCode) {
                    let turretParent = turretCode.PARENT;
                    const turretAncestry = [];
                    while (parent && Class[turretParent]) {
                        turretAncestry.unshift(Class[turretParent]);
                        turretParent = Class[turretParent].PARENT;
                    }
                    for (const turretAncestor of turretAncestry) {
                        newTurretCode = { ...newTurretCode, ...turretAncestor };
                    }
                }
                newTurretCode = { ...newTurretCode, ...turretCode };
                if (newTurretCode.COLOR.BASE === "mirror" || newTurretCode.COLOR.BASE === -1 || newTurretCode.COLOR === "mirror" || newTurretCode.COLOR === -1) {
                    newTurretCode = { ...newTurretCode, COLOR: code.COLOR };
                }
                let newTurretPos = rotatePoint(x+(code.TURRETS[i].POSITION[1]/20 * code.SIZE * 2 * zoom), y+(code.TURRETS[i].POSITION[2]/20 * code.SIZE * 2 * zoom), x, y, degreesToRadians(code.TURRETS[i].POSITION[3]+rotation))
                drawEntity("#FF44FF", newTurretPos[0], newTurretPos[1], {...Class.genericEntity, ...newTurretCode, SIZE: code.SIZE * (code.TURRETS[i].POSITION[0]/20)}, code.TURRETS[i].POSITION[3]+rotation)
            }
        }
    }
    function turretStuffsAbove() {
        for(let i = 0; i < code.TURRETS.length; i++) {
            if (code.TURRETS[i].POSITION[5] === 1) {
                if (Array.isArray(code.TURRETS[i].TYPE)) {
                    turretCode = {...Class[code.TURRETS[i].TYPE[0]], ...code.TURRETS[i].TYPE[1]}
                } else {
                    turretCode = Class[code.TURRETS[i].TYPE]
                }
                newTurretCode = { ...Class.genericEntity };
                if (turretCode) {
                    let turretParent = turretCode.PARENT;
                    const turretAncestry = [];
                    while (parent && Class[turretParent]) {
                        turretAncestry.unshift(Class[turretParent]);
                        turretParent = Class[turretParent].PARENT;
                    }
                    for (const turretAncestor of turretAncestry) {
                        newTurretCode = { ...newTurretCode, ...turretAncestor };
                    }
                }
                newTurretCode = { ...newTurretCode, ...turretCode };
                if (newTurretCode.COLOR.BASE === "mirror" || newTurretCode.COLOR.BASE === -1 || newTurretCode.COLOR === "mirror" || newTurretCode.COLOR === -1) {
                    newTurretCode = { ...newTurretCode, COLOR: code.COLOR };
                }
                let newTurretPos = rotatePoint(x+(code.TURRETS[i].POSITION[1]/20 * code.SIZE * 2 * zoom), y+(code.TURRETS[i].POSITION[2]/20 * code.SIZE * 2 * zoom), x, y, degreesToRadians(code.TURRETS[i].POSITION[3]+rotation))
                drawEntity("#FF44FF", newTurretPos[0], newTurretPos[1], {...Class.genericEntity, ...newTurretCode, SIZE: code.SIZE * (code.TURRETS[i].POSITION[0]/20)}, code.TURRETS[i].POSITION[3]+rotation)
            }
        }
    }
    function propStuffsBelow() {
        for(let i = 0; i < code.PROPS.length; i++) {
            if (code.PROPS[i].POSITION[4] === 0) {
                if (Array.isArray(code.PROPS[i].TYPE)) {
                    propCode = {...Class[code.PROPS[i].TYPE[0]], ...code.PROPS[i].TYPE[1]}
                } else {
                    propCode = Class[code.PROPS[i].TYPE]
                }
                newPropCode = { ...Class.genericEntity };
                if (propCode) {
                    let turretParent = propCode.PARENT;
                    const turretAncestry = [];
                    while (parent && Class[turretParent]) {
                        turretAncestry.unshift(Class[turretParent]);
                        turretParent = Class[turretParent].PARENT;
                    }
                    for (const turretAncestor of turretAncestry) {
                        newPropCode = { ...newPropCode, ...turretAncestor };
                    }
                }
                newPropCode = { ...newPropCode, ...propCode };
                if (newPropCode.COLOR.BASE === "mirror" || newPropCode.COLOR.BASE === -1 || newPropCode.COLOR === "mirror" || newPropCode.COLOR === -1) {
                    newPropCode = { ...newPropCode, COLOR: code.COLOR };
                }
                let newTurretPos = rotatePoint(x+(code.PROPS[i].POSITION[1]/20 * code.SIZE * 2 * zoom), y+(code.PROPS[i].POSITION[2]/20 * code.SIZE * 2 * zoom), x, y, degreesToRadians(code.PROPS[i].POSITION[3]+rotation))
                drawEntity("#FF44FF", newTurretPos[0], newTurretPos[1], {...Class.genericEntity, ...newPropCode, SIZE: code.SIZE * (code.PROPS[i].POSITION[0]/20)}, code.PROPS[i].POSITION[3]+rotation)
            }
        }
    }
    function propStuffsAbove() {
        for(let i = 0; i < code.PROPS.length; i++) {
            if (code.PROPS[i].POSITION[4] === 1) {
                if (Array.isArray(code.PROPS[i].TYPE)) {
                    propCode = {...Class[code.PROPS[i].TYPE[0]], ...code.PROPS[i].TYPE[1]}
                } else {
                    propCode = Class[code.PROPS[i].TYPE]
                }
                newPropCode = { ...Class.genericEntity };
                if (propCode) {
                    let turretParent = propCode.PARENT;
                    const turretAncestry = [];
                    while (parent && Class[turretParent]) {
                        turretAncestry.unshift(Class[turretParent]);
                        turretParent = Class[turretParent].PARENT;
                    }
                    for (const turretAncestor of turretAncestry) {
                        newPropCode = { ...newPropCode, ...turretAncestor };
                    }
                }
                newPropCode = { ...newPropCode, ...propCode };
                if (newPropCode.COLOR.BASE === "mirror" || newPropCode.COLOR.BASE === -1 || newPropCode.COLOR === "mirror" || newPropCode.COLOR === -1) {
                    newPropCode = { ...newPropCode, COLOR: code.COLOR };
                }
                let newTurretPos = rotatePoint(x+(code.PROPS[i].POSITION[1]/20 * code.SIZE * 2 * zoom), y+(code.PROPS[i].POSITION[2]/20 * code.SIZE * 2 * zoom), x, y, degreesToRadians(code.PROPS[i].POSITION[3]+rotation))
                drawEntity("#FF44FF", newTurretPos[0], newTurretPos[1], {...Class.genericEntity, ...newPropCode, SIZE: code.SIZE * (code.PROPS[i].POSITION[0]/20)}, code.PROPS[i].POSITION[3]+rotation)
            }
        }
    }
    if (code.TURRETS) {
        turretStuffsBelow()
    }
    if (code.PROPS) {
        propStuffsBelow()
    }
    for(let i = 0; i < code.GUNS.length; i++) {
        if (code.GUNS[i].PROPERTIES) {
            ctx.fillStyle = getColor(code.GUNS[i].PROPERTIES.COLOR || "grey");
            ctx.strokeStyle = getColorDark(getColor(code.GUNS[i].PROPERTIES.COLOR || "grey"));
        } else {
            ctx.fillStyle = getColor("grey");
            ctx.strokeStyle = getColorDark(getColor("grey"));
        }
        if (isObject(code.GUNS[i].POSITION)) {
            if (code.GUNS[i].PROPERTIES) {
                drawTrapezoid(ctx, x, y,code.GUNS[i].POSITION.LENGTH*(code.SIZE/20)*zoom || zoom, code.GUNS[i].POSITION.WIDTH*(code.SIZE/20)*zoom || zoom, code.GUNS[i].POSITION.ASPECT || 1, degreesToRadians(code.GUNS[i].POSITION.ANGLE+rotation) || 0, code.GUNS[i].PROPERTIES.BORDERLESS || false, code.GUNS[i].PROPERTIES.DRAW_FILL || true, code.GUNS[i].PROPERTIES.ALPHA || 1, 1, -code.GUNS[i].POSITION.X*2*(code.SIZE/20)*zoom || 0, -code.GUNS[i].POSITION.Y*2*(code.SIZE/20)*zoom || 0)
            } else {
                drawTrapezoid(ctx, x, y,code.GUNS[i].POSITION.LENGTH*(code.SIZE/20)*zoom || zoom, code.GUNS[i].POSITION.WIDTH*(code.SIZE/20)*zoom || zoom, code.GUNS[i].POSITION.ASPECT || 1, degreesToRadians(code.GUNS[i].POSITION.ANGLE+rotation) || 0, false,  true, 1, 1, -code.GUNS[i].POSITION.X*2*(code.SIZE/20)*zoom || 0, -code.GUNS[i].POSITION.Y*2*(code.SIZE/20)*zoom || 0)
            }
        } else {
            if (code.GUNS[i].PROPERTIES) {
                drawTrapezoid(ctx, x, y,code.GUNS[i].POSITION[0]*(code.SIZE/20)*zoom || zoom, code.GUNS[i].POSITION[1]*(code.SIZE/20)*zoom || zoom, code.GUNS[i].POSITION[2] || 1, degreesToRadians(code.GUNS[i].POSITION[5]+rotation) || 0, code.GUNS[i].PROPERTIES.BORDERLESS || false, code.GUNS[i].PROPERTIES.DRAW_FILL || true, code.GUNS[i].PROPERTIES.ALPHA || 1, 1, -code.GUNS[i].POSITION[3]*2*(code.SIZE/20)*zoom || 0, -code.GUNS[i].POSITION[4]*2*(code.SIZE/20)*zoom || 0)
            } else {
                drawTrapezoid(ctx, x, y,code.GUNS[i].POSITION[0]*(code.SIZE/20)*zoom || zoom, code.GUNS[i].POSITION[1]*(code.SIZE/20)*zoom || zoom, code.GUNS[i].POSITION[2] || 1, degreesToRadians(code.GUNS[i].POSITION[5]+rotation) || 0, false, true,  1, 1, -code.GUNS[i].POSITION[3]*2*(code.SIZE/20)*zoom || 0, -code.GUNS[i].POSITION[4]*2*(code.SIZE/20)*zoom || 0)
            }
        }
    }
    ctx.fillStyle = calcColor(code.COLOR);
    ctx.strokeStyle = getColorDark(calcColor(code.COLOR));
    drawPoly(ctx, x, y, code.SIZE*zoom, code.SHAPE, degreesToRadians(rotation), code.BORDERLESS, code.DRAW_FILL, true)
    if (code.TURRETS) {
        turretStuffsAbove()
    }
    if (code.PROPS) {
        propStuffsAbove()
    }
};
function drawGrid(ctx, centerX, centerY, spacing, color) {
    showGrid = eval(document.getElementById('showGrid').value);
    if (showGrid === true) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        ctx.strokeStyle = color;
        ctx.lineWidth = 1*zoom;
        ctx.globalAlpha = 0.04
        ctx.beginPath();

        // Vertical lines
        for (let x = (centerX-(offsetX/zoom)) % (spacing*zoom); x <= width; x += (spacing*zoom)) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for (let x = (centerX-(offsetX/zoom)) - (spacing*zoom); x >= 0; x -= (spacing*zoom)) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }

        // Horizontal lines
        for (let y = (centerY-(offsetY/zoom)) % (spacing*zoom); y <= height; y += (spacing*zoom)) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        for (let y = (centerY-(offsetY/zoom)) - (spacing*zoom); y >= 0; y -= (spacing*zoom)) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }

        ctx.stroke();
    } else {
        return
    }
}
function animate() {
    try {
        eval("(" + document.getElementById('codeInput').value + ")")
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        reanimateColors();
        drawGrid(ctx, (canvas.width / 2)-(offsetX/zoom), (canvas.height / 2)-(offsetY/zoom), 30,  getColor("pureBlack"))
        borderType = document.getElementById('borderType').value.toString();
        color = eval(document.getElementById('colorStyle').value);
        whichTank.max = (eval("(" + document.getElementById('codeInput').value + ")").length-1)
        pointyTraps = !eval(document.getElementById('optNoPointy').value);
        tankCode = eval("(" + document.getElementById('codeInput').value + ")")[whichTank.value%(eval("(" + document.getElementById('codeInput').value + ")").length)]
        code = { ...Class.genericEntity };
        let parent = tankCode.PARENT;
        const ancestry = [];
        while (parent && Class[parent]) {
            ancestry.unshift(Class[parent]);
            parent = Class[parent].PARENT;
        }
        for (const ancestor of ancestry) {
            code = { ...code, ...ancestor };
        }
        code = { ...code, ...tankCode };
        isErroring = false
    } catch (e) {
        if (allowErrors === "true") {
            console.error("Error in user code:", e);
            currentError.textContent = "Error in user code:" + e;
        } else {
        }
        isErroring = true
    }
    if (isErroring === false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        reanimateColors();
        drawGrid(ctx, (canvas.width / 2)-(offsetX/zoom), (canvas.height / 2)-(offsetY/zoom), 30,  getColor("pureBlack"))
        borderType = document.getElementById('borderType').value.toString();
        color = eval(document.getElementById('colorStyle').value);
        whichTank.max = (eval("(" + document.getElementById('codeInput').value + ")").length-1)
        pointyTraps = !eval(document.getElementById('optNoPointy').value);
        tankCode = eval("(" + document.getElementById('codeInput').value + ")")[whichTank.value%(eval("(" + document.getElementById('codeInput').value + ")").length)]
        code = { ...Class.genericEntity };
        let parent = tankCode.PARENT;
        const ancestry = [];
        while (parent && Class[parent]) {
            ancestry.unshift(Class[parent]);
            parent = Class[parent].PARENT;
        }
        for (const ancestor of ancestry) {
            code = { ...code, ...ancestor };
        }
        code = { ...code, ...tankCode };
        if (invertedApproximateScore(code.VALUE) > code.LEVEL) {
            code.LEVEL = invertedApproximateScore(code.VALUE)
        }
        realScore = Math.min(parseFloat(code.LEVEL), parseFloat(levelCap.value))
        if (code.LEVEL_CAP) {
            realScore = Math.min(parseFloat(code.LEVEL), parseFloat(code.LEVEL_CAP))
        }
        realSize = code.SIZE * (1 + realScore / 45)
        code = { ...code, SIZE: realSize };
        if (isObject(code.COLOR)) {
            let fixedColor = code.COLOR
            if (code.COLOR.BASE === -1 || code.COLOR.BASE === "mirror") {
                fixedColor = {BASE: "blue", HUE_SHIFT: code.COLOR.HUE_SHIFT, BRIGHTNESS_SHIFT: code.COLOR.BRIGHTNESS_SHIFT, SATURATION_SHIFT: code.COLOR.SATURATION_SHIFT}
                code = { ...code, COLOR: fixedColor };
            }
        }
        drawEntity("#FF44FF", (canvas.width / 2)-(offsetX/zoom), (canvas.height / 2)-(offsetY/zoom), code, 0)
        labelShower.textContent = code.LABEL || "";
        upgradeLabelShower.textContent = code.UPGRADE_LABEL || code.LABEL || "";
        nameShower.textContent = code.NAME || "";
//        definitionShower.textContent = "";
        currentError.textContent = "";
    }
    allowErrors = document.getElementById('errors').value;
    setTimeout(animate, 5);
}
animate();
document.getElementById("newCanvasWidth").addEventListener("change", () => {
    canvas.width = document.getElementById('newCanvasWidth').value;
});
document.getElementById("newCanvasHeight").addEventListener("change", () => {
    canvas.height = document.getElementById('newCanvasHeight').value;
});

