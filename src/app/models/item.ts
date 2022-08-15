import { ItemType } from "./item-type";

export interface Item {
    key: string;
    type: ItemType;
    subType?: string;
}