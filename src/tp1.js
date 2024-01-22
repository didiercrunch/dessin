import m from "https://esm.sh/mithril@2.2.2"

const BLACK = "#000000";
/**
 * Classe qui représente un point sur
 * un plan cartésien.  Le point est donc
 * représenté par deux coordonnées x et y.
 */
export class Point{
    #x;
    #y;
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }
    getX(){
        return this.#x;
    }

    getY(){
        return this.#y;
    }
}

/**
 * Classe qui représente un cercle.  Le cercle est
 * définit par un Point et un rayon.
 *
 * Par défaut, le cercle est noir.  Mais le cercle peut
 * changer de couleur.
 */
export class Circle{
    #center;
    #radius;
    #color;
    #id;

    /**
     *
     * @param {Point} center le point au centre du cercle
     * @param {number} radius le rayon du cercle
     * @param {number} id l'id unique du cercle.  C'est au
     *         créateur de l'instance de s'assurer de l'unicité
     *         de l'id.
     */
    constructor(center, radius, id) {
        this.#center = center;
        this.#radius = radius;
        this.#color = BLACK;
        this.#id = id;
    }

    /**
     * @returns {Point} le point au centre au cercle
     */
    getCenter(){
        return this.#center;
    }

    /**
     *
     * @returns {number} le rayon du cercle
     */
    getRadius(){
        return this.#radius;
    }

    /**
     *
     * @returns {string} la couleur (hexadécimal) du cercle
     */
    getColor(){
        return this.#color;
    }

    /**
     * @param {String} color la nouvelle couleur du cercle
     */
    setColor(color){
        this.#color = color;
    }

    setCenter(center){
        this.#center = center;
    }

    /**
     * @returns {number} l'id du cercle
     */
    getId(){
        return this.#id;
    }


    toString(){
        return `Cercle(${ this.#radius }, ${ this.getCenter().getX() }, ${ this.getCenter().getY() })`;
    }

    bouger(deltaX, deltaY){
        const newCenter = new Point(this.getCenter().getX() + deltaX,
            this.getCenter().getY() - deltaY);
        this.setCenter(newCenter)
    }

    getRepresentationMithril(){
        const attr = {
            cx: this.getCenter().getX(),
            cy: this.getCenter().getY(),
            r: this.getRadius(),
            fill: this.getColor(),

        };
        return m("circle", attr);
    }
}

export class Rectangle {

    constructor(coin, largeur, hauteur, id) {
        this.coin = coin;
        this.largeur = largeur;
        this.hauteur = hauteur;
        this.id = id;
        this.color = BLACK;
    }

    getId(){
        return this.id;
    }

    bouger(deltaX, deltaY){
        const nouveauCoin = new Point(this.coin.getX() + deltaX,
            this.coin.getY() - deltaY);
        this.coin = nouveauCoin
    }

    getColor(){
        return this.color;
    }

    getRepresentationMithril(){
        const attr = {
            x: this.coin.getX(),
            y: this.coin.getY(),
            width: this.largeur,
            height: this.hauteur,
            fill: this.getColor(),

        };
        return m("rect", attr);
    }

    toString(){
        return `Rectangle(${ this.coin.getX() }, ${ this.coin.getY() }, ${ this.largeur }, ${ this.hauteur })`;
    }

    setColor(color){
        this.color = color;
    }

}


export class Text {
    constructor(coin, text, id) {
        this.coin = coin;
        this.text = text;
        this.id = id;
    }

    getId(){
        return this.id;
    }

    bouger(deltaX, deltaY){
        const nouveauCoin = new Point(this.coin.getX() + deltaX,
            this.coin.getY() - deltaY);
        this.coin = nouveauCoin
    }

    getColor(){
        return this.color;
    }

    getRepresentationMithril(){
        const attr = {
            x: this.coin.getX(),
            y: this.coin.getY(),
            fill: this.getColor(),

        };
        return m("text", attr, this.text);
    }

    toString(){
        return `Text(${ this.coin.getX() }, ${ this.coin.getY() }, ${ this.text })`;
    }

    setColor(color){
        this.color = color;
    }

}
/**
 * Dessine toutes les formes dans un svg.  Cette fonction
 * nettoye le svg avant d'ajouter les cercles.
 *
 * @param node {HTMLElement} un element svg
 * @param shapes {Circle[]} Les formes à dessiner
 */
export function drawShapes(node, shapes){
    let svgShapes = [];
    for(const shape of shapes){
        svgShapes.push(shape.getRepresentationMithril())
    }
    m.render(node, svgShapes);
}

function identity(x){
    return x;
}

function functionOrDefault(fn){
    if(typeof fn === 'function'){
        return fn;
    }
    return identity;
}

function drawIcons(shape,
                   onClickUp,
                   onClickDown,
                   onClickLeft,
                   onClickRight,
                   onClickPaint,
                   onClickDelete){
    return [
        m("i.fa-solid.fa-arrow-up.is-clickable", {onclick: () => onClickUp(shape.getId())}),
        m("i.fa-solid.fa-arrow-down.is-clickable", {onclick: () => onClickDown(shape.getId())}),
        m("i.fa-solid.fa-arrow-left.is-clickable", {onclick: () => onClickLeft(shape.getId())}),
        m("i.fa-solid.fa-arrow-right.is-clickable", {onclick: () => onClickRight(shape.getId())}),
        m("input", {type: 'color', onchange: (evt) => onClickPaint(shape.getId(), evt.target.value)}),
        m("i.fa-solid.fa-trash.is-clickable", {onclick: () => onClickDelete(shape.getId())}),
    ]
}

/**
 * @param node {HTMLElement} un element tbody
 * @param circles {Circle[]} Les cercles
 * @param pointToString Argument optionnel qui doit être une fonction
 *        qui prend en paramêtre un Point et retourne un String qui
 *        représente le point.
 * @param onClickUp Argument optionnel qui doit être une fonction
 *        qui sera appelée lorsque la flèche pointant vers le haut
 *        sera cliquée.  L'id du cercle sera passé en argument de
 *        la fonction.
 * @param onClickDown Argument optionnel qui doit être une fonction
 *        qui sera appelée lorsque la flèche pointant vers le bas
 *        sera cliquée.  L'id du cercle sera passé en argument de
 *        la fonction.
 * @param onClickLeft Argument optionnel qui doit être une fonction
 *        qui sera appelée lorsque la flèche pointant vers la gauche
 *        sera cliquée.  L'id du cercle sera passé en argument de
 *        la fonction.
 * @param onClickRight Argument optionnel qui doit être une fonction
 *        qui sera appelée lorsque la flèche pointant vers la droite
 *        sera cliquée.  L'id du cercle sera passé en argument de
 *        la fonction.
 * @param onClickPaint Argument optionnel qui doit être une fonction
 *        qui sera appelée lorsque l'icone peinture
 *        sera cliquée.  L'id du cercle sera passé en argument de
 *        la fonction.
 * @param onClickDelete Argument optionnel qui doit être une fonction
 *        qui sera appelée lorsque l'icone poubelle
 *        sera cliquée.  L'id du cercle sera passé en argument de
 *        la fonction.
 */
export function populateTable(node,
                              circles,
                              onClickUp=undefined,
                              onClickDown=undefined,
                              onClickLeft=undefined,
                              onClickRight=undefined,
                              onClickPaint=undefined,
                              onClickDelete = undefined){
    const rows = [];
    for(const circle of circles){
        const row =[m("td", circle.getId()),
            m("td", circle.toString()),
            m("td", drawIcons(circle,
                functionOrDefault(onClickUp),
                functionOrDefault(onClickDown),
                functionOrDefault(onClickLeft),
                functionOrDefault(onClickRight),
                functionOrDefault(onClickPaint),
                functionOrDefault(onClickDelete)))];
        rows.push(m("tr", row))
    }
    m.render(node, rows);

}

/**
 * Retourne une couleur de gris aléatoire à partir d'un nombre entier.
 * @param i {number} (entier) qui sera utilisé comme "seed".
 * @returns {string} une couleur hexadécimale
 */
export function randomColor(i){
    const base = (i % 256).toString(16);
    return `${base}${base}${base}`
}