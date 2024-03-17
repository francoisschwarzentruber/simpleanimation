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

function htmlElement(content, info) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = content;
    const element = wrapper.firstChild;
    element.style.position = "absolute";
    _set(element, info);

    exec(() => {
        container.append(element);
    });
    return element;
}



function openmoji(name, info) {
    return htmlElement(`<img src="https://openmoji.org/data/color/svg/${name}.svg"/>`, info)
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

function text(str, { x, y }) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<div style="left:${x}px; top:${y}px">${str}</div>`;
    const element = wrapper.firstChild;
    exec(() => {
        container.append(element);
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

function line(info) {
    var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    if (info.stroke == undefined)
        info.stroke = "black";


    _set(newLine, info);

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

function _set(obj, info) {
    if (info == undefined)
        return;

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
    if (info.opacity)
        obj.style.opacity = info.opacity;
    if (info.zindex)
        obj.style.zIndex = info.zindex;

    if (info.x1)
        obj.setAttribute('x1', info.x1);
    if (info.y1)
        obj.setAttribute('y1', info.y1);
    if (info.x2)
        obj.setAttribute('x2', info.x2);
    if (info.y2)
        obj.setAttribute('y2', info.y2);
    if (info.cx)
        obj.setAttribute('cx', info.cx);
    if (info.cy)
        obj.setAttribute('cy', info.cy);
    if (info.rx)
        obj.setAttribute('rx', info.rx);
    if (info.ry)
        obj.setAttribute('rx', info.ry);
    if (info.r)
        obj.setAttribute('r', info.r);

    obj.setAttribute("stroke", info.stroke || info.color);
    obj.setAttribute("stroke-width", info.linewidth);
    obj.setAttribute("stroke-dasharray", info.strokeDasharray);
}


function mv(obj, info) {
    if (info.duration == undefined)
        info.duration = 0;
    if (info.dur == undefined)
        info.dur = info.duration;
    exec(() => {
        obj.style.transition = `all ${info.dur}ms`;
        _set(obj, info);
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

