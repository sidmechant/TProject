"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const p2_es_1 = require("p2-es");
const constante_1 = require("./constante");
function createStone(width, height, x, y, locationX, locationY) {
    let shape = new p2_es_1.Box({ width, height });
    shape.collisionGroup = constante_1.STONE;
    shape.collisionMask = constante_1.BALL;
    let body = new p2_es_1.Body({ mass: 0, position: [x * locationX, y * locationY] });
    body.addShape(shape);
    return body;
}
exports.default = createStone;
//# sourceMappingURL=stone.js.map