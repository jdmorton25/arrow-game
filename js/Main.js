container.style.width = (canvasWidth + 2*marginWidth) + "px";
container.style.height = (canvasHeight + 2*marginHeight) + "px";

overlap0.style.left = "0px";
overlap0.style.top = "0px";
overlap0.style.width = (1000 + canvasWidth + 2*marginWidth) + "px";
overlap0.style.height = marginHeight + "px";

overlap1.style.left = "0px";
overlap1.style.top = marginHeight + "px";
overlap1.style.width = marginWidth + "px";
overlap1.style.height = canvasHeight + "px";

canvas.style.left   = marginWidth + "px";
canvas.style.top    = marginHeight + "px";
canvas.style.width  = canvasWidth + "px";
canvas.style.height = canvasHeight + "px";

overlap2.style.left = (marginWidth + canvasWidth) + "px";
overlap2.style.top = marginHeight + "px";
overlap2.style.width = (1000 + marginWidth) + "px";
overlap2.style.height = canvasHeight + "px";

overlap3.style.left = "0px";
overlap3.style.top = (canvasHeight + marginHeight) + "px";
overlap3.style.width = (1000 + canvasWidth + 2*marginWidth) + "px";
overlap3.style.height = (1000 + marginHeight) + "px";

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}

function randomFloat(min, max) {
    return min + (max - min) * Math.random();
}

function randomGaussian() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();                   // converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        num = num / 10.0 + 0.5;                         // translate to 0 -> 1
    if (num > 1 || num < 0) 
        return randomGaussian();    // resample between 0 and 1
    return num;
}

function clearCanvas() {
    for(var i = canvas.childNodes.length - 1; i >= 0; i--)
        canvas.childNodes[i].remove();
        w.visionVisualisasion = {zone:     {svg: undefined, circle: undefined},
                                    lines:    {svg: undefined, line0: undefined, line1: undefined, line2: undefined},
                                    o_lines:  {svg: undefined, line0: undefined, line1: undefined, line2: undefined},
                                    sz_lines: {svg: undefined, line0: undefined, line1: undefined, line2: undefined}};
    console.log("complete")
}

var w = new World(50);

function loop() {
    w.update();
    
}

setInterval(loop, 1000/FPS)