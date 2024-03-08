cls()

let p = [];
let m = [];
const sep = 90

for (let i = 0; i <= 4; i++) {
    p[5 - i] = latex(i == 0 ? "\\phantom{+}a_5" : `~+ a_${5 - i}`, { x: i == 0 ? 110 : (100 + i * sep), y: 100 });
    m[5 - i - 1] = latex(`~- a_${5 - i - 1}`, { x: 100 + i * sep + sep * 0.45, y: 100 });
}



function collapse(i) {
    wait(1000)
    for (let j = i-1; j >= 0; j--) {
        if (j > 0)
            mv(p[j], { duration: 500, dx: -sep });
        mv(m[j], { duration: 500, dx: -sep });
    }

    wait(100);
    del(m[i]);
    del(p[i]);
}


for (let i = 4; i >= 1; i--)
    collapse(i);