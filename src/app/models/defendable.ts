import { Attachable } from "./attachable";

export interface Defendable{
    /** Attachments we can use to agument the defence */
    attached: Attachable[]

    /** base defence number */
    defence: number;
}
