import { Actor } from "../models";

/** check the actors health to see if they are dead... */
export function isActorDead(thing: Actor): boolean {
    return thing.health < 1;
}

