import { animation } from './animation.ts';
import { editor } from './editor.ts'
import hljs from "highlight.js";


const container = document.getElementById("container");
const svg = document.getElementById("svg");
const inputStep = document.getElementById("inputStep") as any;


let _currentTime = 0;

export function load() {
    _currentTime = 0;
    animation.clear();
    eval(editor.getValue());
    inputStep.max = animation.totalDuration;
    console.log("total duration: " + animation.totalDuration);
}


function cls() {
    exec(() => { (container as any).innerHTML = ""; (svg as any).innerHTML = "" });
}


function htmlElement(htmlCode: string, parameters: any) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = htmlCode;
    const element: any = wrapper.firstChild;
    element.style.position = "absolute";
    _setParameters(element, parameters);

    exec(() => {
        (container as any).append(element);
    });
    return element;
}



function openmoji(emoticonCode: string, parameters: any) {
    return htmlElement(`<img src="https://openmoji.org/data/color/svg/${emoticonCode}.svg"/>`, parameters)
}

function latex(latexCode: string, parameters: any) {
    const element = document.createElement("div");
    element.innerText = `\\[${latexCode}\\]`;
    _setParameters(element, parameters);

    exec(() => {
        (container as any).append(element);
        // @ts-ignore
        (MathJax as any).typeset();
    });
    return element;
}

function text(str: string, parameters: any) {
    const element = document.createElement("div");
    element.innerText = str;
    _setParameters(element, parameters);
    exec(() => {
        (container as any).append(element);
    });
    return element;
}

/**
 * <pre><code class="language-html">...</code></pre>
 */
function code(codeStr: string, parameters: any) {
    const element = document.createElement("pre");
    const codeElement = document.createElement("code");
    if (parameters)
        if (parameters.language)
            codeElement.classList.add("language-" + parameters.language);
    element.style.position = "absolute";
    element.appendChild(codeElement);
    codeElement.textContent = codeStr;
    _setParameters(element, parameters);
    exec(() => {
        (container as any).append(element);
        hljs.highlightAll();
    });
    return element;
}

function del(obj: any) {
    exec(() => {
        obj.remove();
    });
}


function rect(parameters: any) {
    const content = `<div style="position:absolute"></div>`;
    return htmlElement(content, parameters);
}

function circle(parameters: any) {
    var newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    _setParameters(newCircle, parameters);

    exec(() => {
        _svgAppend(newCircle);
    });
    return newCircle;
}

function svgElement(content: string) {
    const wrapper = document.createElement('svg');
    wrapper.innerHTML = content;
    const element = wrapper.firstChild;
    exec(() => {
        _svgAppend(element);
    });
    return element;
}


function _svgAppend(obj: any) {
    if (obj.style.zIndex == "") {
        (svg as any).appendChild(obj);
        return;
    }

    const z = parseInt(obj.style.zIndex);

    if (z <= 0)
        (svg as any).prepend(obj);
    else
        (svg as any).appendChild(obj);
    return;


}


function line(parameters: any) {
    var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    _setParameters(newLine, parameters);

    exec(() => {
        _svgAppend(newLine);
    });
    return newLine;

}


function exec(f: () => void) {
    if (typeof (_currentTime) != "number")
        console.error("a")
    animation.addAction(_currentTime, _currentTime, f);
}






let defaultParameters = { x: 0, y: 0, w: 32, h: 32, color: "black", stroke: "black", fill: "white", fillColor: "white", duration: 200 };

function sameButFirstLetterUpperCase(name: string) {
    return name[0].toUpperCase() + name.substring(1);
}

/**
 * install the setter for the default parameters
 */
for (let parameterName in defaultParameters) {
    eval(`function set${sameButFirstLetterUpperCase(parameterName)}(value) {defaultParameters.${parameterName} = value;}`)
}



function _setParameters(obj: any, parameters: any) {
    if (parameters == undefined)
        parameters = {};

    if (parameters.dur == undefined)
        for (const name in defaultParameters)
            if (parameters[name] == undefined)
                parameters[name] = (defaultParameters as any)[name];

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
    if (parameters.width)
        obj.style.width = parameters.width + "px";
    if (parameters.h)
        obj.style.height = parameters.h + "px";
    if (parameters.height)
        obj.style.height = parameters.height + "px";
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

    if (parameters.stroke || parameters.color)
        obj.setAttribute("stroke", parameters.stroke || parameters.color);

    if (parameters.linewidth)
        obj.setAttribute("stroke-width", parameters.linewidth);

    if (parameters.strokeDasharray)
        obj.setAttribute("stroke-dasharray", parameters.strokeDasharray);
}


function mv(obj: any, parameters: any) {
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


function wait(duration: number) {
    if (duration == undefined)
        duration = defaultParameters.duration;
    _currentTime += duration;
}








// @ts-ignore
const converter = new showdown.Converter();

function markdown(mdCode: string, parameters: any) {
    const htmlCode = converter.makeHtml(mdCode);
    return htmlElement(htmlCode, parameters);
}






function lev(s: string, t: string) {
    let D = Array(s.length + 1);
    for (let i = 0; i <= s.length; i++)
        D[i] = Array(t.length + 1);

    for (let i = 0; i <= s.length; i++)
        D[i][0] = i;

    for (let j = 0; j <= t.length; j++)
        D[0][j] = j;


    for (let i = 1; i <= s.length; i++)
        for (let j = 1; j <= t.length; j++) {
            const cost = (s[i] == t[j]) ? 0 : 1;
            D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + cost);
        }

    console.log(D[s.length][t.length])
    return D;
}




function sequenceTransformation(s: string, t: string) {
    const D = lev(s, t);
    const operations: any = [];
    let i = s.length;
    let j = t.length;
    let position = j;
    while (D[i][j] > 0) {
        if (D[i][j] == D[i - 1][j] + 1) {
            operations.unshift({ type: "delete", position })
            i--;
            position--;
        }
        else if (D[i][j] == D[i][j - 1] + 1) {
            operations.unshift({ type: "add", position, letter: t[j] })
            j--;
            position++;
        }
        else if (D[i][j] == D[i - 1][j - 1]) {
            i--;
            j--;
            position--;
        }
        else if (D[i][j] == D[i - 1][j - 1] + 1) {
            operations.unshift({ type: "replace", position, letter: t[j] });
            i--;
            j--;
            position--;
        }
    }
    return operations;
}






function morph(el: HTMLElement, el2: HTMLElement) {
    const s = el.innerHTML;
    const t = el2.innerHTML;
    const operations = sequenceTransformation(s, t);
    exec(() => { el2.remove(); });
    console.log(operations)
    let sCurrent = s;
    for (const op of operations) {

        if (op.type == "remove")
            sCurrent = sCurrent.substring(0, op.position) + sCurrent.substring(op.position + 1);
        else if (op.type == "add")
            sCurrent = sCurrent.substring(0, op.position + 1) + op.letter + sCurrent.substring(op.position + 1);
        else if (op.type == "replace") {
            sCurrent = sCurrent.substring(0, op.position) + op.letter + sCurrent.substring(op.position + 1);
        }
        const current = sCurrent;
        exec(() => {
            el.innerHTML = current;
            // @ts-ignore
            //(MathJax as any).typeset();
        }
        );

        wait(100);
    }

}


(window as any).cls = cls;
(window as any).latex = latex;
(window as any).wait = wait;
(window as any).mv = mv;
(window as any).openmoji = openmoji;
(window as any).text = text;
(window as any).code = code;
(window as any).del = del;
(window as any).rect = rect;
(window as any).line = line;
(window as any).circle = circle;
(window as any).svgElement = svgElement;
(window as any).markdown = markdown;
(window as any).morph = morph;