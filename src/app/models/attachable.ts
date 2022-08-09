import { Item } from "./item";

export interface Attachable extends Item {
    improveAttack?: number;
    improveDefence?: number;
    name?: string;
}