import { Item } from "./item";
import { Sack } from "./sack";

export class Bank implements Sack {
    constructor(public coin: bigint = BigInt(0)
        , public items: Item[] = []
        , public limit = -1
    ) { }
}