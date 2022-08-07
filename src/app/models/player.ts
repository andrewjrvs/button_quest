import { Attachable } from "./attachable";
import { Attackable } from "./attackable";
import { Defendable } from "./defendable";

export class Player implements Attackable, Defendable {
    public fullHealth: number;
    public name?: string;
    public healthBase: number = 20;
    public baseLevelExperience?: number;
    public nextLevelExperience?: number;
    public attack: number;
    public coin: bigint = BigInt(0);

    constructor(
        public health: number
        , public level: number
        , public attachments: Attachable[] = []
        , public status: number = 0
        , public experience: number = 0
        , public baseAttack: number = 1
        , public baseDefence: number = 1) {
        this.fullHealth = health;
        this.attack = baseAttack;

    }

}
