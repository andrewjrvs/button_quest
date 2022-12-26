import { Actor } from "./actor";
import { Attachable } from "./attachable";
import { HeroType } from "./hero-type";
import { Sack } from "./sack";

export class Hero implements Actor {
    
    public sack: Sack = {
        coin: BigInt(0)
        , limit: 100
        , items: []
    }; 

    public property?: { [key: string]: any };

    public fullHealth: number;
    public status: any[] = [];
    public attached: Attachable[] = [];
    public attack: number = 1;
    public defence: number = 1;

    constructor(
        public id: string
        , public name: string
        , public type: HeroType
        , public subType: string
        , public health: number
        , public level: number = 1
        , public experience: bigint = BigInt(0)
    ) {
        this.fullHealth = health;
    }

    currentBreakpoint?: bigint | undefined;
    nextBreakpoint?: bigint | undefined;

    static create(actor: Actor): Hero {
        const rtnPlr = new Hero(
            actor.id
            , actor.name
            , actor.type
            , actor.subType
            , actor.health
            , actor.level
            , actor.experience
        );
        rtnPlr.sack.coin = actor.sack.coin
        rtnPlr.sack.items.push(...actor.sack.items)
        rtnPlr.sack.limit = actor.sack.limit;
        rtnPlr.fullHealth = actor.fullHealth;
        rtnPlr.status.push(...actor.status);
        rtnPlr.attached.push(...actor.attached);
        rtnPlr.attack = actor.attack;
        rtnPlr.defence = actor.defence;

        if (actor.property) {
            rtnPlr.property = { ...actor.property };
        }

        rtnPlr.currentBreakpoint = actor.currentBreakpoint;
        rtnPlr.nextBreakpoint = actor.nextBreakpoint;
        return rtnPlr;
    }
}
