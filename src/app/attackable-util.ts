import { Attackable } from "./models/attackable";
import { Defendable } from "./models/defendable";

export function isDefendableDead(thing: Defendable): boolean {
    return thing.health < 1
}

export function attack(thing1: Attackable, thing2: Defendable): Defendable {
    thing2.health -= thing1.attack;
    return thing2;
}

export function getEarnedExperience(thing2: Defendable): number {
    return thing2.fullHealth;
}

export function getEarnedCoin(thing2: Defendable): bigint {
    return BigInt(thing2.fullHealth * 2);
}