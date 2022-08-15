import { Actor } from "./actor";
import { Attachable } from "./attachable";
import { EnemyType } from "./enemy-type";
import { Sack } from "./sack";

export class Villan implements Actor {
    
    public sack: Sack = {
        coin: BigInt(0)
        , limit: 10
        , items: []
    }; 

    public fullHealth: number;
    public status: any[] = [];
    public attached: Attachable[] = [];
    public attack: number = 1;
    public defence: number = 1;

    constructor(
        public id: string
        , public name: string
        , public type: EnemyType
        , public subType: string
        , public health: number
        , public level: number = 1
    ) {
        this.fullHealth = health;
    }
    experience: bigint = BigInt(0);
    currentBreakpoint?: bigint | undefined;
    nextBreakpoint?: bigint | undefined;

    static create(actor: Actor): Villan {
        const rtnPlr = new Villan(
            actor.id
            , actor.name
            , actor.type
            , actor.subType
            , actor.health
            , actor.level);
        rtnPlr.sack.coin = actor.sack.coin
        rtnPlr.sack.items.push(...actor.sack.items)
        rtnPlr.sack.limit = actor.sack.limit;
        rtnPlr.fullHealth = actor.fullHealth;
        rtnPlr.status.push(...actor.status);
        rtnPlr.attached.push(...actor.attached);
        rtnPlr.attack = actor.attack;
        rtnPlr.defence = actor.defence;
        rtnPlr.experience = actor.experience;
        return rtnPlr;
    }
}
