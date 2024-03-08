cls();

let p = [0.25, 0.3, 0.1, 0.2, 0.15];
let colors = ["#22AAFF", "red", "yellow", "green", "purple"]
let alias = [undefined, undefined, undefined, undefined, undefined]
let prob = [...p];

const space = 48;
let a = [];
let b = [];
for (let i = 0; i < 5; i++) {
    a[i] = rect({
        x: 15 + space * i,
        y: 320 - 256 * prob[i],
        w: 24,
        h: prob[i] * 256,
        fillcolor: colors[i],
        border:"1x solid black"
    });
    b[i] = rect({
        x: 15 + space * i,
        y: 320 - 256 * prob[i],
        w: 24,
        h: 0,
        fillcolor: colors[i],
        border:"1x solid black"
    });
}

const xEnd = space * 5 + 30;
line({x1: 0, y1: 320, x2: xEnd, y2: 320})
line({x1: 0, y1: 320-256/5, x2: xEnd, y2: 320-256/5, strokeDasharray:4})



function assign(i, j) {
    alias[j] = i; prob[i] -= (1 / 5 - prob[j]);
    mv(a[i], {
        duration: 1000,
        y: 320 - 256 * prob[i],
        h: prob[i] * 256
    });
    mv(b[i], {
        duration: 0,
        y: 320 - 256 * prob[i]
    })
    mv(b[j], {
        duration: 1000,
        y: 320 - 256 * 1 / 5,
        h: (1 / 5 - prob[j]) * 256,
        fillcolor: colors[i]
    });
    wait(1000);
}
wait(1000);

assign(1, 2);
assign(0, 4);

/*
assign(0, 2);
assign(1, 4);
assign(1, 0);
*/