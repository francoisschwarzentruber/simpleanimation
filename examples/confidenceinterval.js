cls();
const population = [];
const elements = [];
const SPACE = 24;
const DELAY = 500;
const n = 20;

let i = 0;
for (let x = 0; x < 15; x++)
    for (let y = 0; y < 10; y++) {
        const individual = Math.random() > 2 / 3 ? 1 : 0;
        population.push(individual);
        elements[i] = openmoji(individual ? `1F920` : `1F642`, { x: SPACE * x + Math.random() * 6, y: SPACE * y + Math.random() * 6, w: 32, opacity: 0.2 });
        i++;
    }

const y = 300;
const px = (x) => 32 + x * 320;

function mark(x, stroke) {
    line({ x1: px(x), y1: y - 10, x2: px(x), y2: y + 10, linewidth: 3, stroke });
}

const CI = line({ x1: 0, y1: y, x2: 0, y2: y, stroke: "#00AA00", linewidth: 10, zindex: -1 });

line({ x1: 0, y1: y, x2: 380, y2: y, zindex: 1000 });
mark(0)
mark(1)
text("0", { x: px(0) - 4, y: y + 16 });
text("1", { x: px(1) - 4, y: y + 16 });

mark(mean(Array.from({ length: population.length }, (v, i) => i)), "brown")

function mean(sample) {
    let s = 0;
    for (const i of sample)
        s += population[i];
    return s / sample.length;
}

wait(DELAY);
for (let step = 0; step < 1000; step++) {
    const sample = Array.from({ length: n }, () => Math.floor(population.length * Math.random()));
    for (const i of sample)
        mv(elements[i], { opacity: 1 });

    const m = mean(sample);
    const w = 1.645 * Math.sqrt(m * (1 - m) / n);

    mv(CI, { x1: px(m - w), y1: y, x2: px(m + w), y2: y, stroke: "#00AA00", linewidth: 10, zindex: -1 });
    wait(DELAY);

    for (const i of sample)
        mv(elements[i], { dur: 0, opacity: 0.2 });
}
del(CI);
