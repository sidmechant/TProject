"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const p2_es_1 = require("p2-es");
const constante_1 = require("./constante");
function createBorder(location) {
    let shape = new p2_es_1.Box({ width: constante_1.MAP_WIDTH * 2, height: constante_1.OFFSET * 2 });
    shape.collisionGroup = constante_1.BORDER;
    shape.collisionMask = constante_1.BALL | constante_1.PADDLE;
    let body = new p2_es_1.Body({ mass: 0, position: [0, (constante_1.MAP_HEIGHT / 2 + constante_1.OFFSET) * location] });
    body.addShape(shape);
    return body;
}
exports.default = createBorder;
//# sourceMappingURL=border.js.map