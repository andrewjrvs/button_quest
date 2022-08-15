import { Item } from "./item";

export interface Sack {
    coin: bigint;
    limit: number;
    items: Item[];
}
