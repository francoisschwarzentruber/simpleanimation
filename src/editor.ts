import {animation} from './animation.ts';
import {load} from './commands.ts'


/**
 * wrapper of a naïve textarea editor
 */
class EditorText {

    editor: any;

    constructor() {
        this.editor = document.createElement("textarea");
        (document.getElementById("editor") as any).append(this.editor);
        this.editor.setAttribute("rows", "30");
        this.editor.setAttribute("cols", "50");
        this.editor.oninput = (
            () => {
                localStorage.setItem("code", this.editor.value);
            });
    }


    setValue(txt: string) {
        this.editor.value = (txt);
    }

    getValue() {
        return this.editor.value;
    }
}


/** logic */
export const editor = new EditorText();
editor.setValue(localStorage.getItem("code") as string);

const inputStep = document.getElementById("inputStep") as any;
inputStep.oninput = () => { animation.stop(); load(); animation.gotoTime(inputStep.value) };

