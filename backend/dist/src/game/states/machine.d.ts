import { Player } from "../types/machine";
export declare const GameModel: import("xstate/lib/model.types").Model<{
    players: Player[];
    victory: number;
}, import("xstate/lib/model.types").UnionFromCreatorsReturnTypes<import("xstate/lib/model.types").FinalEventCreators<{
    join: (id: Player['id'], name: Player['name']) => {
        id: string;
        name: string;
    };
    chooseMap: (id: Player['id'], map: Player['map']) => {
        id: string;
        map: import("../types/machine").MapTheme;
    };
    leave: (id: Player['id']) => {
        id: string;
    };
    power: (id: Player['id']) => {
        id: string;
    };
    ready: (id: Player['id']) => {
        id: string;
    };
    restart: () => {};
    start: () => {};
    score: (index: number) => {
        index: number;
    };
    ulti: (id: Player['id']) => {
        id: string;
    };
    update: () => {};
}>>, import("xstate").BaseActionObject, import("xstate/lib/model.types").FinalModelCreators<{
    events: {
        join: (id: Player['id'], name: Player['name']) => {
            id: string;
            name: string;
        };
        chooseMap: (id: Player['id'], map: Player['map']) => {
            id: string;
            map: import("../types/machine").MapTheme;
        };
        leave: (id: Player['id']) => {
            id: string;
        };
        power: (id: Player['id']) => {
            id: string;
        };
        ready: (id: Player['id']) => {
            id: string;
        };
        restart: () => {};
        start: () => {};
        score: (index: number) => {
            index: number;
        };
        ulti: (id: Player['id']) => {
            id: string;
        };
        update: () => {};
    };
}>>;
export declare const GameMachine: import("xstate").StateMachine<{
    players: Player[];
    victory: number;
}, any, import("xstate/lib/model.types").UnionFromCreatorsReturnTypes<import("xstate/lib/model.types").FinalEventCreators<{
    join: (id: Player['id'], name: Player['name']) => {
        id: string;
        name: string;
    };
    chooseMap: (id: Player['id'], map: Player['map']) => {
        id: string;
        map: import("../types/machine").MapTheme;
    };
    leave: (id: Player['id']) => {
        id: string;
    };
    power: (id: Player['id']) => {
        id: string;
    };
    ready: (id: Player['id']) => {
        id: string;
    };
    restart: () => {};
    start: () => {};
    score: (index: number) => {
        index: number;
    };
    ulti: (id: Player['id']) => {
        id: string;
    };
    update: () => {};
}>>, {
    value: any;
    context: {
        players: Player[];
        victory: number;
    };
}, import("xstate").BaseActionObject, import("xstate").ServiceMap, import("xstate").ResolveTypegenMeta<import("xstate").TypegenDisabled, import("xstate/lib/model.types").UnionFromCreatorsReturnTypes<import("xstate/lib/model.types").FinalEventCreators<{
    join: (id: Player['id'], name: Player['name']) => {
        id: string;
        name: string;
    };
    chooseMap: (id: Player['id'], map: Player['map']) => {
        id: string;
        map: import("../types/machine").MapTheme;
    };
    leave: (id: Player['id']) => {
        id: string;
    };
    power: (id: Player['id']) => {
        id: string;
    };
    ready: (id: Player['id']) => {
        id: string;
    };
    restart: () => {};
    start: () => {};
    score: (index: number) => {
        index: number;
    };
    ulti: (id: Player['id']) => {
        id: string;
    };
    update: () => {};
}>>, import("xstate").BaseActionObject, import("xstate").ServiceMap>>;
