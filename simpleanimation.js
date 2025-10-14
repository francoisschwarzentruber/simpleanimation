/**
 * wrapper of ACE editor
 */
class EditorACE {

    constructor() {
        this.editor = ace.edit("editor");
        this.editor.setTheme("ace/theme/monokai");
        this.editor.session.setMode("ace/mode/javascript");
        this.editor.getSession().on('change', function () {
            localStorage.setItem("code", this.editor.getValue());
        });
    }


    setValue(txt) {
        this.editor.setValue(txt);
    }

    getValue() {
        return this.editor.getValue();
    }
}


/**
 * wrapper of a naïve textarea editor
 */
class EditorText {

    constructor() {
        this.editor = document.createElement("textarea");
        document.getElementById("editor").append(this.editor);
        this.editor.setAttribute("rows", "30");
        this.editor.setAttribute("cols", "50");
        this.editor.oninput = (
            () => {
                localStorage.setItem("code", this.editor.value);
            });
    }


    setValue(txt) {
        this.editor.value = (txt);
    }

    getValue() {
        return this.editor.value;
    }
}


/** logic */
editor = new EditorText();
editor.setValue(localStorage.getItem("code"));
inputStep.oninput = () => { animation.stop(); load(); animation.gotoTime(inputStep.value) };



class Animation {
    stopped = true;
    actions = [];
    t = 0;
    i = 0;

    /**
     * 
     * @param {*} startTime 
     * @param {*} endTime 
     * @param {*} f function to be executed as an action
     */
    addAction(startTime, endTime, f) {
        this.actions.push({ startTime, endTime, f });
    }


    gotoTime(newt) {
        this.i = 0;
        this.t = 0;
        this._forwardTo(newt);
    }


    _forwardTo(newt) {
        inputStep.value = newt;

        while (this.i < animation.actions.length && animation.actions[this.i].startTime <= newt) {
            animation.actions[this.i].f();
            this.i++;
        }

        this.t = newt;

        if (this.i >= animation.actions.length) {
            this.stopped = true;
            return;
        }

    }


    play() {
        this.stopped = false;
        const beginning = Date.now() - this.t;
        console.log("play")
        let loop = () => {
            if (this.stopped)
                return;

            const t = Date.now() - beginning;

            this._forwardTo(t);

            if (!this.stopped)
                requestAnimationFrame(loop);
        }
        loop();
    }

    stop() { this.stopped = true; }
    get duration() { return Math.max(...this.actions.map((a) => a.endTime)); }
}


let animation = new Animation();
let _currentTime = 0;

function load() {
    _currentTime = 0;
    animation = new Animation();
    eval(editor.getValue());
    inputStep.max = animation.duration;
    console.log("total duration: " + animation.duration);
}


const container = document.getElementById("container");
const svg = document.getElementById("svg");

function cls() {
    animation.addAction(_currentTime, _currentTime, () => container.innerHTML = "");
}

function htmlElement(htmlCode, parameters) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = htmlCode;
    const element = wrapper.firstChild;
    element.style.position = "absolute";
    _setParameters(element, parameters);

    exec(() => {
        container.append(element);
    });
    return element;
}



function openmoji(emoticonCode, parameters) {
    return htmlElement(`<img src="https://openmoji.org/data/color/svg/${emoticonCode}.svg"/>`, parameters)
}

function latex(latexCode, { x, y }) {
    const element = document.createElement("div");
    element.innerText = "\\[${latexCode}\\]";
    _setParameters(element, parameters);

    exec(() => {
        container.append(element);
        MathJax.typeset();
    });
    return element;
}

function text(str, parameters) {
    const element = document.createElement("div");
    element.innerText = str;
    _setParameters(element, parameters);
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


function rect(parameters) {
    const content = `<div style="position:absolute"></div>`;
    return htmlElement(content, parameters);
}

function circle(info) {
    var newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    if (info.stroke == undefined)
        info.stroke = "black";


    _setParameters(newCircle, info);

    exec(() => {
        _svgAppend(newCircle);
    });
    return newCircle;
}

function svgElement(content) {
    const wrapper = document.createElement('svg');
    wrapper.innerHTML = content;
    const element = wrapper.firstChild;
    exec(() => {
        _svgAppend(element);
    });
    return element;
}


function _svgAppend(obj) {
    if (obj.style.zIndex == "") {
        svg.appendChild(obj);
        return;
    }

    const z = parseInt(obj.style.zIndex);

    if (z <= 0)
        svg.prepend(obj);
    else
        svg.appendChild(obj);
    return;
    for (const o of svg.children) {
        if (z <= parseInt(o.style.zIndex)) {
            console.log(z)
            console.log(parseInt(o.style.zIndex))
            svg.insertBefore(obj, o);
            return;
        }
    }

    svg.appendChild(obj);

}


function line(parameters) {
    var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    if (parameters.stroke == undefined)
        parameters.stroke = "black";

    _setParameters(newLine, parameters);

    exec(() => {
        _svgAppend(newLine);
    });
    return newLine;

}


function exec(f) {
    if(typeof(_currentTime) != "number")
        console.error("a")
    animation.addAction(_currentTime, _currentTime, f);
}


function cls() {
    exec(() => { container.innerHTML = ""; svg.innerHTML = "" });
}





let defaultParameters = {};

let exampleParameters = { x: 0, y: 0, w: 32, h: 32, color: "black", stroke: "black", fill: "white", fillColor: "white", duration: 200 };

function sameButFirstLetterUpperCase(name) {
    return name[0].toUpperCase() + name.substring(1);
}

/**
 * install the setter for the default parameters
 */
for (let parameterName in exampleParameters) {
    eval(`function set${sameButFirstLetterUpperCase(parameterName)}(value) {defaultParameters.${parameterName} = value;}`)
}



function _setParameters(obj, parameters) {
    if (parameters == undefined)
        parameters = defaultParameters;

    for (const name in defaultParameters)
        if (parameters[name] == undefined)
            parameters[name] = defaultParameters[name];

    if (parameters.x)
        obj.style.left = parameters.x + "px";
    if (parameters.y)
        obj.style.top = parameters.y + "px";
    if (parameters.dx)
        obj.style.left = (parseInt(obj.style.left) + parameters.dx) + "px";
    if (parameters.dy)
        obj.style.top = (parseInt(obj.style.top) + parameters.dy) + "px";

    if (parameters.w)
        obj.style.width = parameters.w + "px";
    if (parameters.h)
        obj.style.height = parameters.h + "px";
    if (parameters.fill)
        obj.style.background = parameters.fill;
    if (parameters.fillcolor)
        obj.style.background = parameters.fillcolor;
    if (parameters.border)
        obj.style.border = parameters.border;
    if (parameters.opacity)
        obj.style.opacity = parameters.opacity;
    if (parameters.zindex)
        obj.style.zIndex = parameters.zindex;

    if (parameters.x1)
        obj.setAttribute('x1', parameters.x1);
    if (parameters.y1)
        obj.setAttribute('y1', parameters.y1);
    if (parameters.x2)
        obj.setAttribute('x2', parameters.x2);
    if (parameters.y2)
        obj.setAttribute('y2', parameters.y2);
    if (parameters.cx)
        obj.setAttribute('cx', parameters.cx);
    if (parameters.cy)
        obj.setAttribute('cy', parameters.cy);
    if (parameters.rx)
        obj.setAttribute('rx', parameters.rx);
    if (parameters.ry)
        obj.setAttribute('rx', parameters.ry);
    if (parameters.r)
        obj.setAttribute('r', parameters.r);
    if (parameters.fill)
        obj.setAttribute('fill', parameters.fill);
    obj.setAttribute("stroke", parameters.stroke || parameters.color);
    obj.setAttribute("stroke-width", parameters.linewidth);
    obj.setAttribute("stroke-dasharray", parameters.strokeDasharray);
}


function mv(obj, parameters) {
    if (obj instanceof Array) {
        obj.map((el) => mv(el, parameters));
        return;
    }
    if (parameters == undefined)
        parameters = {};
    if (parameters.duration == undefined)
        parameters.duration = defaultParameters.duration;
    if (parameters.duration == undefined)
        parameters.duration = 0;
    if (parameters.dur == undefined)
        parameters.dur = parameters.duration;
    exec(() => {
        obj.style.transition = `all ${parameters.dur}ms`;
        _setParameters(obj, parameters);
    })
}


function wait(duration) {_currentTime +=
    _currentTime += duration;
}

document.getElementById("buttonPlayStop").onclick = () => {
    if (animation.stopped) {
        container.innerHTML = "";
        let t = 0;
        if (animation)
            t = animation.t;

        load();

        if (t >= animation.duration)
            t = 0;
        animation.gotoTime(t);
        animation.play();
    }
    else
        animation.stop();
}
