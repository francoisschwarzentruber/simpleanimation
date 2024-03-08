const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

class Animation {
    stopped = true;
    actions = [];

    addAction(startTime, endTime, f) {
        this.actions.push({ startTime, endTime, f });
    }


    play() {
        this.stopped = false;
        let beginning = Date.now();
        let i = 0;
        console.log("play")
        let loop = () => {
            if (this.stopped)
                return;

            const t = Date.now() - beginning;


            while (i < animation.actions.length && animation.actions[i].startTime <= t) {
                animation.actions[i].f();
                i++;
            }

            if (i >= animation.actions.length) {
                this.stopped = true;
                return;
            }


            if (!this.stopped)
                requestAnimationFrame(loop);
        }
        loop();
    }

    stop() {
        this.stopped = true;
    }
}


let animation = new Animation();
let t = 0;

function load() {
    t = 0;
    animation = new Animation();
    eval(editor.getValue());
}


const container = document.getElementById("container");
const svg = document.getElementById("svg");

function cls() {
    animation.addAction(t, t, () => container.innerHTML = "");
}

function htmlElement(content) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = content;
    const element = wrapper.firstChild;
    exec(() => {
        container.append(element);
    });
    return element;
}





function latex(latexCode, { x, y }) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<div style="left:${x}px; top:${y}px">\\[${latexCode}\\]</div>`;
    const element = wrapper.firstChild;
    exec(() => {
        container.append(element);
        MathJax.typeset();
    });
    return element;
}



function del(obj) {
    exec(() => {
        obj.remove();
    });
}
function rect({ x, y, w, h, fillcolor = "red", border = "black" }) {
    const content = `<div style="position:absolute; left: ${x}; top: ${y};  width:${w}; height: ${h}; background: ${fillcolor}; border: ${border}"></div>`;
    return htmlElement(content);
}

function svgElement(content) {
    const wrapper = document.createElement('svg');
    wrapper.innerHTML = content;
    const element = wrapper.firstChild;
    exec(() => {
        svg.append(element);
    });
    return element;
}

function line({ x1, y1, x2, y2, stroke = "black", strokeDasharray = "" }) {
    var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine.setAttribute('id', 'line2');
    newLine.setAttribute('x1', x1);
    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.setAttribute("stroke", stroke);
    newLine.setAttribute("stroke-dasharray", strokeDasharray);

    exec(() => {
        svg.append(newLine);
    });
    return newLine;

}
function exec(f) {
    animation.addAction(t, t, f);
}


function cls() {
    exec(() => { container.innerHTML = ""; svg.innerHTML = "" });
}


function mv(obj, info) {
    if (info.duration == undefined)
        info.duration = 1000;
    exec(() => {
        obj.style.transition = `all ${info.duration}ms`
        if (info.x)
            obj.style.left = info.x + "px";
        if (info.y)
            obj.style.top = info.y + "px";
        if (info.dx)
            obj.style.left = (parseInt(obj.style.left) + info.dx) + "px";
        if (info.dy)
            obj.style.top = (parseInt(obj.style.top) + info.dy) + "px";

        if (info.w)
            obj.style.width = info.w + "px";
        if (info.h)
            obj.style.height = info.h + "px";
        if (info.fillcolor)
            obj.style.background = info.fillcolor;
        if (info.border)
            obj.style.border = info.border;
    })
}


function wait(duration) { t += duration; }

document.getElementById("run").onclick = () => {
    if (animation.stopped) {
        container.innerHTML = "";
        load();
        animation.play();
    }
    else
        animation.stop();
}
    ;

