# simpleanimation

A simple language for creating small animations with tiny functions in JS.

## Examples

https://fr.wikipedia.org/wiki/M%C3%A9thode_des_alias#/media/Fichier:Alias-method-table-generation.gif



## Functions 

- `cls()` clears the screen
- `wait(2000)` waits 2000ms
- `rect({x:2, y:3, w: 10, h: 20, color: "red"})` creates a rectangle and returns it
- `latex("\frac 1 2", {x:300, y:200})` creates a LaTEX formula and returns it
- `line({x1:2, y1: 3, x2:19, y2: 12})` creates a line
- `mv(obj, {x: 5, duration: 500})` moves the object `obj` by modifying `x` coordinate during 500ms
- `exec(() => ...)` executes the function given by its lambda expression
- `del(obj)` deletes the object `obj`


## Roadmap

- export in GIF (but not sure because Peek works)
- export in MP4 (but not sure because Peek works)
