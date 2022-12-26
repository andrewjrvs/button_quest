import { Actor, Hero } from "../models";
import { Experienced } from "../models/experienced";
import * as SysUtil from "./system-util";


const exponent = 1.4;
const baseXP = BigInt(264);

/**
 * Calculates what the player level is based on
 * their current experience level
 * step1 := float64(exp) / float64(baseXP)
 * step2 := 1 / exponent
 * step3 := math.Pow(float64(step1), step2)
 * step4 := math.Ceil(step3)
 * step5 := int(step4) + 1
 * 
 * @param exp current Player experience
 * @returns { number } player level
 */
 export function findLevelFromExperience(exp: bigint): number {
    return Math.ceil(Math.pow((Number(exp) / Number(baseXP)), (1 / exponent)));
}

/**
 * find the base Exp level for the passed level
 * @param level 
 * @returns { number } baseExpereince "number" for the current level
 */
export function getExpBaseForLevel(level: number): bigint {
    return BigInt(Math.floor(Number(baseXP) * Math.pow((level - 1), exponent)));
}

export function levelUpPlayer(plr: Actor, newLevel?: number): Actor {
    const rtnHero = SysUtil.clone(plr);
    const nxtLvl = newLevel || plr.level + 1;
    const levelDiff = Math.abs(plr.level - nxtLvl);
    // here we could check for items that incress on updates
    rtnHero.currentBreakpoint = getExpBaseForLevel(nxtLvl);
    rtnHero.nextBreakpoint = getExpBaseForLevel(nxtLvl + 1);
    // user only updates now.
    // rtnHero.attack += levelDiff;
    // rtnHero.defence += levelDiff;
    rtnHero.fullHealth += (5 * levelDiff);
    rtnHero.level = nxtLvl;
 
    rtnHero.sack.limit += (10 * levelDiff);

    // add one point for user assigning
    if (!rtnHero.property) {
        rtnHero.property = {};
    }
    if (!rtnHero.property['assignable'] || Number.isNaN(rtnHero.property['assignable'])) {
        rtnHero.property['assignable'] = 0;
    }
    rtnHero.property['assignable'] += levelDiff;
    return rtnHero;
}

/** 
 * figures out the 'experience' that would generate when the passed
 * actor is 'dead'
 * 
 * it will be based on the level difference, attack/defence, and health..
 * ... 
 * (
 * secondary.attack
 * + primary.attack - seconary.defence
 * + (secondary.fullHealth - prinary.fullHeath) / 100)
 * ) * ( 
 *      if level diff > 5  ~ 10
 *      if level diff < 5 && > -5 ~ 1
 *      if level diff < -5 ~ .1
 *      ) 
 */
export function calculateChallengeExperience(primary: Actor, secondary: Actor): bigint {
    const levelDiff = primary.level - secondary.level;
    const directAtt = secondary.defence - primary.attack;
    const wasPrimaryOverpowered = levelDiff < 0;
    let levelMod = Math.abs(levelDiff);
    levelMod = levelMod > 4 ? 4 : levelMod;
    levelMod = levelMod * 2;
    levelMod = wasPrimaryOverpowered ? levelMod : (1 - (levelMod / 10));
    let baseVal = (secondary.attack + directAtt + (secondary.fullHealth - primary.fullHealth));
    baseVal = baseVal < 10 ? 10 : baseVal;
    return BigInt(Math.ceil(baseVal * levelMod));
}
