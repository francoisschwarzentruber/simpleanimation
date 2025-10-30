import {load} from './commands.ts'

const container = document.getElementById("container");
const inputStep = document.getElementById("inputStep") as any;


class Animation {
    stopped = true;
    actions: { startTime: number, endTime: number, f: () => void }[] = [];
    t = 0;
    i = 0;

    /**
     * 
     * @param {*} startTime 
     * @param {*} endTime 
     * @param {*} f function to be executed as an action
     */
    addAction(startTime: number, endTime: number, f: () => void) {
        this.actions.push({ startTime, endTime, f });
    }

    /**
     * 
     * @param {*} newt
     * @description show the picture at time newt 
     */
    gotoTime(newt: number) {
        this.i = 0;
        this.t = 0;
        (container as any).innerHTML = "";
        this._forwardTo(newt);
    }


    _forwardTo(newt: number) {
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


    /**
     * play the animation from the current time
     */
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

    /**
     * @description stop the animation
     */
    stop() { this.stopped = true; }

    clear() { this.actions = []; this.t = 0; this.i = 0; }
    get totalDuration() { return Math.max(...this.actions.map((a) => a.endTime)); }
}


export const animation = new Animation();


(document.getElementById("buttonPlayStop") as any).onclick = () => {
    if (animation.stopped) {
        (container as any).innerHTML = "";
        let t = 0;
        if (animation)
            t = animation.t;

        load();

        if (t >= animation.totalDuration)
            t = 0;
        animation.gotoTime(t);
        animation.play();
    }
    else
        animation.stop();
}
