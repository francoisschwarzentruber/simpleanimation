# simpleanimation

An easy-to-use tool for creating small animations by coding. The tool is still in developpement. The philosophy is to write Javascript code with the help of these functions:
- `cls()` clears the screen
- `wait(2000)` waits 2000ms until going to the next instruction
- functions that creates and returns objects, for instance `rect({x:2, y:3, w: 10, h: 20, color: "red"})` or `line({x1:2, y1: 3, x2:19, y2: 12})` or `latex("\frac 1 2", {x:300, y:200})`, etc.
- a function for animating `mv(obj, {x: 5, duration: 500})`. The `mv` works for any kind of objects and the you may assign any property
- `del(obj)` deletes the object `obj`

That's all folks!

## Examples

29 lines of code produce:
<img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Telescopingseries.gif"></img>

58 lines of code produce:
<img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Alias-method-table-generation.gif"></img>

This tool has been used to add animations to Wikipedia:

- https://fr.wikipedia.org/wiki/M%C3%A9thode_des_alias#/media/Fichier:Alias-method-table-generation.gif
- https://fr.wikipedia.org/wiki/Somme_t%C3%A9lescopique#/media/Fichier:Telescopingseries.gif

The examples are available in the folder  `examples`. Just copy/paste them in the tool for obtaining these animations are in the folder


## Functions 

### Creation of objects

- `rect({x:2, y:3, w: 10, h: 20, color: "red"})` creates a rectangle and returns it
- `latex("\frac 1 2", {x:300, y:200})` creates a LaTEX formula and returns it
- `line({x1:2, y1: 3, x2:19, y2: 12})` creates a line

### Animation

- `mv(obj, {x: 5, duration: 500})` moves the object `obj` by modifying `x` coordinate during 500ms
- `exec(() => ...)` executes the function given by its lambda expression

### Waiting
- `wait(2000)` waits 2000ms

### Clear the screen

- `cls()` clears the screen

### Deleting objects
- `del(obj)` deletes the object `obj`


## Roadmap
- handle more properties
- drawing for specifying new objects or moving objects
- export in GIF (but not sure because Peek works)
- export in MP4 (but not sure because Peek works)
