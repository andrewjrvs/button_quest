import { Hero, HeroType, Item, ItemType, Villan } from "../models";
import { EnemyType, subType } from "../models/enemy-type";

const actor_row_offset = 0;
const actor_row_modifier = 24;
const actor_column_offset = 0;
const actor_column_modifier = 24;

const item_row_offset = 0;
const item_row_modifier = 16;
const item_column_offset = 0;
const item_column_modifier = 16;


const typeVillanIndex: { [key in EnemyType]: { row: number, columns: number[] }[] } = {
    0: [{ row: 9, columns: [1, 2, 3, 4, 5, 6, 7, 8] }]
    , 1: [{ row: 9, columns: [9, 10, 11, 12, 13] }]
    , 2: [{ row: 9, columns: [14, 15, 16, 17, 18] }]
    , 3: [{ row: 11, columns: [1, 2, 3, 4] }]
    , 4: [{ row: 11, columns: [5, 6, 7] }]
    , 5: [{ row: 11, columns: [11, 12, 13, 14, 15] }]
    , 6: [{ row: 11, columns: [16] }]
    , 7: [{ row: 11, columns: [17] }]
    , 8: [{ row: 11, columns: [18] }]
}

const typeHeroIndex: { [key in HeroType]: { row: number, columns: number[] }[] } = {
    0: [{ row: 1, columns: [1] }]
    , 1: [{ row: 1, columns: [2] }]
    , 2: [{ row: 1, columns: [3] }]
    , 3: [{ row: 1, columns: [4] }]
    , 4: [{ row: 1, columns: [5] }]
    , 5: [{ row: 1, columns: [6] }]
    , 6: [{ row: 1, columns: [7] }]
    , 7: [{ row: 1, columns: [8] }]
    , 8: [{ row: 1, columns: [9] }]
}

const typeHealthIndex: { [key: string]: { row: number, columns: number[] }[] } = {
    's': [{ row: 1, columns: [3] }]
    , 'm': [{ row: 1, columns: [9] }]
    , 'f': [{ row: 1, columns: [15] }]
}

const typeItemIndex: { [key in ItemType]: { [key: string]: { row: number, columns: number[] }[] } } = {
    "": {"": [{row: 1, columns: [1] }] },
    health: {
        's': [{ row: 1, columns: [3] }]
        , 'm': [{ row: 1, columns: [9] }]
        , 'f': [{ row: 1, columns: [15] }]
     },
    attack: {
        '': [{ row: 10, columns: [11] }]
        , 'fire': [{ row: 10, columns: [16] }]
        , 'ice': [{ row: 10, columns: [15] }]
        
    },
    improve: {
        'h': [{ row: 3, columns: [13] }]
        , 'd': [{ row: 3, columns: [12] }]
        , 'a': [{ row: 3, columns: [14] }]
    },
    "x->t": {}
}

function getActorRowFromIndex(index: number): number {
    return (index * actor_row_modifier) + actor_row_offset;
}

function getActorColumnFromIndex(index: number): number {
    return (index * actor_column_modifier) + actor_column_offset;
}


function getItemRowFromIndex(index: number): number {
    return (index * item_row_modifier) + item_row_offset;
}

function getItemColumnFromIndex(index: number): number {
    return (index * item_column_modifier) + item_column_offset;
}


/**
 * rturns the background point for the hero image
 * @returns the x,y point for the image
 */
export function getVillanTypeXYPoint(villan: Villan): { x: number, y: number } {
    const row = getActorRowFromIndex(typeVillanIndex[villan.type][0].row);
    const colOps = typeVillanIndex[villan.type][0].columns;
    const idx = subType[villan.type].indexOf(villan.subType);
    const col = getActorColumnFromIndex(colOps[idx]);
    return { x: col, y: row };
}

export function getVillanDisplayIndex(villan: Villan): string {
    const { x, y } = getVillanTypeXYPoint(villan);
    return `-${x}px -${y}px`;
}

export function getHeroDisplayIndex(hero: Hero): string {
    const { x, y } = getHeroTypeXYPoint(hero);
    return `-${x}px -${y}px`;
}

export function getHeroTypeXYPoint(hero: Hero): { x: number, y: number } {
    const row = getActorRowFromIndex(typeHeroIndex[hero.type][0].row);
    const colOps = typeHeroIndex[hero.type][0].columns;
    const idx = 0;
    const col = getActorColumnFromIndex(colOps[idx]);
    return { x: col, y: row };
}

export function getItemDisplayIndex(item: Item): string {
    const { x, y } = getItemTypeXYPoint(item);
    return `-${x}px -${y}px`;
}

export function getItemTypeXYPoint(item: Item): { x: number, y: number } {
    let row: number = getItemRowFromIndex(typeItemIndex[item.type][item.subType!][0].row);
    let colOps: number[] = typeItemIndex[item.type][item.subType!][0].columns;
    let idx: number = 0;
    let col: number = getItemColumnFromIndex(colOps[idx]);
    return { x: col, y: row };
}