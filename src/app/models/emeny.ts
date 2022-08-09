import { Attackable } from "./attackable";
import { Defendable } from "./defendable";
import { EnemyType } from "./enemy-type";

export class Enemy implements Attackable, Defendable {
    public fullHealth: number;
    public attack: number;

    constructor(
        public health: number = 20
        , public type: EnemyType
        , public subType: string
        , public baseAttack: number = 20
        , public baseDefence: number = 0
        , public status: number = 0) {
        this.fullHealth = health;
        this.attack = baseAttack;
    }

}