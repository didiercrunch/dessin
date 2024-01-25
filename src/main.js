
import {drawShapes, populateTable, Circle, Point, Text, Rectangle, randomColor} from "./tp1.js";

const shapes = []

function getShapeById(shapeId){
    for(const shape of shapes){
        if(shape.getId() === shapeId){
            return shape;
        }
    }
}

function getShapeIndexById(shapeId){
    let i = 0;
    for(const shape of shapes){
        if(shape.getId() === shapeId){
            return i;
        }
        i ++;
    }
    return -1;
}

function onClickUp(shapeId){
    const shape = getShapeById(shapeId);
    shape.bouger(0, 10);
    renderShapes();
}

function onClickDown(shapeId){
    const shape = getShapeById(shapeId);
    shape.bouger(0, -10);
    renderShapes();
}

function onClickLeft(shapeId){
    const shape = getShapeById(shapeId);
    shape.bouger(-10, 0);
    renderShapes();
}

function onClickRight(shapeId){
    const shape = getShapeById(shapeId);
    shape.bouger(10, 0);
    renderShapes();
}



function onClickPaint(shapeId, color){
    const shape = getShapeById(shapeId);
    shape.setColor(color)
    renderShapes();
}

function onClickTrash(shapeId){
    const index = getShapeIndexById(shapeId);
    shapes.splice(index, 1)
    renderShapes();
}

function drawNewCircle(){
    const x = parseInt(document.getElementById("cx").value)
    const y = parseInt(document.getElementById("cy").value)
    const r = parseInt(document.getElementById("cr").value)
    const p = new Point(x, y);
    const circle = new Circle(p, r, Date.now());
    shapes.push(circle);
    renderShapes();
}


function drawNewRectangle() {
    const x = parseInt(document.getElementById("rect-top-left-x").value)
    const y = parseInt(document.getElementById("rect-top-left-y").value)
    const width = parseInt(document.getElementById("rect-width").value)
    const height = parseInt(document.getElementById("rect-height").value)

    const p = new Point(x, y);
    const rectangle = new Rectangle(p, width, height, Date.now());
    shapes.push(rectangle);
    renderShapes();

}

function drawNewText() {
    const x = parseInt(document.getElementById("text-top-left-x").value)
    const y = parseInt(document.getElementById("text-top-left-y").value)
    const text = document.getElementById("text-value").value

    const p = new Point(x, y);
    const rectangle = new Text(p, text, Date.now());
    shapes.push(rectangle);
    renderShapes();

}



function clearShapes(){
    shapes.length = 0;
    renderShapes();
}


function renderShapes(){
    drawShapes(document.getElementById("canvas"), shapes);
    populateTable(document.getElementById("table-body"),
        shapes,
        onClickUp,
        onClickDown,
        onClickLeft,
        onClickRight,
        onClickPaint,
        onClickTrash);
}



document.getElementById("draw-circle").addEventListener("click", drawNewCircle);
document.getElementById("draw-rectangle").addEventListener("click", drawNewRectangle);
document.getElementById("draw-text").addEventListener("click", drawNewText);

document.getElementById("clear-drawing").addEventListener("click", clearShapes);


