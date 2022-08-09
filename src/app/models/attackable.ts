import { Attachable } from "./attachable";

export interface Attackable {

    /** attached items to augment the 'attack' */
    attached: Attachable[]

    /** base attack info */
    attack: number;
}
