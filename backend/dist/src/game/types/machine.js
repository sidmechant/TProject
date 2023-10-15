"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapTheme = exports.ModeType = exports.GameStates = void 0;
var GameStates;
(function (GameStates) {
    GameStates["MODE"] = "Mode";
    GameStates["MAP"] = "Map";
    GameStates["LOADING"] = "Loading";
    GameStates["PLAY"] = "Play";
    GameStates["END"] = "End";
    GameStates["ANIMATION"] = "Animation";
})(GameStates || (exports.GameStates = GameStates = {}));
;
var ModeType;
(function (ModeType) {
    ModeType["MATCHMAKING"] = "MatchMaking";
    ModeType["ONLINEPLAYER"] = "2POnline";
})(ModeType || (exports.ModeType = ModeType = {}));
;
var MapTheme;
(function (MapTheme) {
    MapTheme["MEDIEVAL"] = "medieval";
    MapTheme["WESTERN"] = "western";
    MapTheme["NINJA"] = "ninja";
    MapTheme["RETRO"] = "retro";
})(MapTheme || (exports.MapTheme = MapTheme = {}));
;
//# sourceMappingURL=machine.js.map