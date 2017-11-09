/**
 * Created by claim on 26.04.15.
 */

HEXENGINE = (function () {

    var background, foreground, resources, rctx, bctx, fctx, stage,
        width, height,
        isoField, isoCtx,
        hexWidth = 100, hexHeight = 100,
        vHexCount, hHexCount,
        types, grid, hexes = [];

    var attackHexIndicator;

    function setup(w, h) {
        width = w;
        height = h;

        stage = document.createElement('div');
        stage.setAttribute('id', 'stage');
        document.body.appendChild(stage);

        background = document.createElement('canvas');
        background.setAttribute('id', 'background');
        background.setAttribute('width', w);
        background.setAttribute('height', h);
        stage.appendChild(background);
        bctx = background.getContext("2d");

        resources = document.createElement('canvas');
        resources.setAttribute('id', 'resources');
        resources.setAttribute('width', w);
        resources.setAttribute('height', h);
        stage.appendChild(resources);
        rctx = resources.getContext("2d");

        foreground = document.createElement('canvas');
        foreground.setAttribute('id', 'foreground');
        foreground.setAttribute('width', w);
        foreground.setAttribute('height', h);
        stage.appendChild(foreground);
        fctx = background.getContext("2d");

        isoField = document.createElement('canvas');
        isoField.width = width;
        isoField.height = height;
        isoCtx = isoField.getContext("2d");

        vHexCount = Math.floor(width/hexWidth);
        hHexCount = Math.floor(height/(hexHeight/2));

        console.info(vHexCount, hHexCount);
        scaleToFit();
        window.addEventListener('resize', scaleToFit);

        foreground.addEventListener('mousemove', eventMouseMoved);
    }

    function setHexTypes(hexTypes) {
        types = hexTypes;
    }

    function setHexGrid(hexGrid) {
        grid = hexGrid
    }

    function generateHexImages() {
        for(var i = 0 ; i < types.length ; i++) {
            generateHexFlat(i);
        }
    }

    function generateHexFlat(iterator) {
        if(types[iterator].name !== "hollow") {
            var range = hexWidth/2, line = 4, x = range + 20, y = range;
            //hexes[iterator]
            var hex = document.createElement('canvas');
            hex.width = hexWidth + 20;
            hex.height = 250;
            var ctx = hex.getContext("2d");
            var a = hexWidth / 2 / 2, height = a * math_sqrootThree;

            var hDiff = 150;

            if(types[iterator].height === 0) {
                hDiff = 120;
            }

            drawRhomboid(ctx, [{x: x - a, y: y + height}, {x: x - range, y: y}],
                types[iterator].stroke, types[iterator].fill, hDiff);
            drawRhomboid(ctx, [{x: x - a, y: y + height}, {x: x + a, y: y + height}],
                types[iterator].stroke, types[iterator].fill, hDiff);
            drawRhomboid(ctx, [{x: x + a, y: y + height}, {x: x + range, y: y}],
                types[iterator].stroke, types[iterator].fill, hDiff);

            drawHexFlat(ctx, x, y, range, line, types[iterator].stroke, types[iterator].fill);

            hexes[iterator] = hex;
        }
    }

    function generateIndicators() {
        var range = hexWidth/2, line = 4, x = range + 20, y = range;
        attackHexIndicator = document.createElement('canvas');
        attackHexIndicator.width = hexWidth + 20;
        attackHexIndicator.height = 250;

        var ctx = attackHexIndicator.getContext("2d");
        var a = hexWidth / 2 / 2, height = a * math_sqrootThree;
        ctx.globalAlpha=0.5;
        drawHexFlat(ctx, x, y, range, line, "red", "red");
    }

    function drawRhomboid(ctx, points, stroke, fill, height) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(points[0].x, points[0].y );
        ctx.lineTo(points[0].x - height * 0.12, points[0].y + height);
        ctx.lineTo(points[1].x - height * 0.12, points[1].y + height);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.closePath();
        ctx.strokeStyle = stroke;
        ctx.stroke();
        ctx.closePath();
        var grd=ctx.createLinearGradient(0,0,170,0);
        grd.addColorStop(0, fill);
        grd.addColorStop(1, "black");
        ctx.fillStyle=grd;
        ctx.fill();
    }

    function drawHexFlat(ctx, x, y, range, line, stroke, fill) {
        var a = hexWidth / 2 / 2, height = a * math_sqrootThree;
        ctx.beginPath();
        ctx.lineWidth = line;
        ctx.moveTo(x - range, y);
        ctx.lineTo(x - a, y - height);
        ctx.lineTo(x + a, y - height);
        ctx.lineTo(x + range, y);
        ctx.lineTo(x + a, y + height);
        ctx.lineTo(x - a, y + height);
        ctx.lineTo(x - range, y);
        ctx.closePath();
        ctx.strokeStyle = stroke;
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
    }

    function setupInternals() {
        generateHexImages();
        generateIndicators();
    }

    function scaleToFit() {
        var windowWidth = window.innerWidth,
            windowHeight = window.innerHeight,
            scaleX = windowWidth / width,
            scaleY = windowHeight / height,
            scaleToFit = Math.min(scaleX, scaleY), left, top;

        if(scaleToFit === scaleX) {
            left = "0px";
            top = ((windowHeight - height * scaleToFit) / 2) + "px";
        } else {
            left = ((windowWidth - width * scaleToFit) / 2) + "px";
            top = "0px";
        }
        background.style.transformOrigin = "0 0"; //scale from top left
        background.style.transform = "scale(" + scaleToFit + ")";
        foreground.style.transformOrigin = "0 0"; //scale from top left
        foreground.style.transform = "scale(" + scaleToFit + ")";

        background.style.top = top;
        foreground.style.top = top;
        background.style.left = left;
        foreground.style.left = left;
    }

    function drawHex (x, y, nbr, type) {
        isoCtx.drawImage(hexes[type],x,y);
        /*isoCtx.font = 'bold 40pt Calibri';
        isoCtx.fillStyle = 'blue';
        isoCtx.fillText(nbr, x+30, y+60);*/
    }

    function drawHexIndicator (type, x, y) {
        var pos = getGridPosition(x, y);
        fctx.drawImage(type, pos[0], pos[1]);
        /*isoCtx.font = 'bold 40pt Calibri';
         isoCtx.fillStyle = 'blue';
         isoCtx.fillText(nbr, x+30, y+60);*/
    }

    var math_sqrootThree = Math.sqrt(3);
    var math_widthThreeFourths = hexWidth * 3/4;
    var math_widthOneFourth = hexWidth/4;

    function getGridPosition(x, y) {
        return [x * math_widthThreeFourths, Math.floor(50 + (x + (y * 2 + 1)) * math_widthOneFourth * math_sqrootThree)];
    }

    function getReverseGridPosition(x, y) {
        var xToRet = Math.floor(x / math_widthThreeFourths);
        return [xToRet, ((y - 50) / (math_widthOneFourth * math_sqrootThree) - xToRet - 1)/2];
    }

    function addHexRow(row) {
        for(var i = 0 ; i < vHexCount ; i++) {

            var hexgrid =  grid[row][i];

            hexgrid = Math.floor(Math.random() * 3);

            if(types[hexgrid].name !== "hollow")
            {
                var x = getGridPosition(i, row);
                var y = x[1];
                x = x[0];

                if(types[hexgrid].height === 0) {
                    y = Math.floor(80 + (i + (row * 2 + 1)) * math_widthOneFourth * math_sqrootThree);
                    x = i * math_widthThreeFourths - 3;
                }

                drawHex(x, y, i + row * vHexCount, hexgrid);
            }
        }
    }

    function fillIsoFields () {
        isoCtx.rotate(-13*Math.PI/180);
        isoCtx.scale(1.00, 0.5);
        for(var i = 0 ; i < hHexCount; i ++) {
            addHexRow(i);
        }
    }

    function start () {

        setupInternals();

        bctx.fillRect(0, 0, width, height);
        fillIsoFields();
        bctx.drawImage(isoField, 0,0);

        fctx.rotate(-13*Math.PI/180);
        fctx.scale(1.00, 0.5);
        drawHexIndicator(attackHexIndicator, 2 ,1);

        console.info(getGridPosition(1, 0));
    }

    function eventMouseMoved(event) {
        var x = event.layerX, y = event.layerY;
        console.info(x, y);
        y = 2 * y;
        console.info(x, y);

        var w = Math.sqrt(x * x + y * y);
        var deg = Math.atan(y/x) * 180/Math.PI + 13;
        y = Math.sin(deg * Math.PI/180) * w;
        x = Math.cos(deg * Math.PI/180) * w;
        console.info(getReverseGridPosition(x,y));
    }

    return {
        setup: setup,
        start: start,
        setHexTypes: setHexTypes,
        setHexGrid: setHexGrid
    };
})();