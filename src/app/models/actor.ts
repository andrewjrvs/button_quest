import { Attackable } from "./attackable";
import { Defendable } from "./defendable";
import { Experienced } from "./experienced";
import { Sack } from "./sack";

export interface Actor extends Attackable, Defendable, Experienced {
    /** government issued ID */
    id: string;

    /** Actor Name */
    name: string;

    /** the actor class (represents the class type (differnt for heros / villians)) */
    type: any;

    /** subclass (optional) can be anything... */
    subType?: any;

    /** "pouch" for storing money, and other Items... */
    sack: Sack;
    
    /** default fill health for player */
    fullHealth: number;

    /** current 'count' of health the player has */
    health: number;

    /** active LEVEL for the actor */
    level: number;

    // placeholder
    status: any[]; 

    // location to store 'extra' information;
    property?: { [key: string]: any };
}
