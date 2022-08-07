import { Player } from "./models/player";

const exponent = 1.5;
const baseXP = 100;



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
export function findLevelFromExperience(exp: number): number {
    return Math.ceil(Math.pow((exp / baseXP), (1 / exponent)));
}

/**
 * find the base Exp level for the passed level
 * @param level 
 * @returns { number } baseExpereince "number" for the current level
 */
export function getExpBaseForLevel(level: number): number {
    return Math.floor(baseXP * Math.pow((level - 1), exponent));
}

export function levelUpPlayer(plr: Player, newLevel: number | null): Player {
    const nxtLvl = newLevel || plr.level + 1;
    // here we could check for items that incress on updates
    plr.baseLevelExperience = getExpBaseForLevel(nxtLvl);
    plr.nextLevelExperience = getExpBaseForLevel(nxtLvl + 1);
    plr.baseAttack += 2;
    plr.baseDefence += 2;
    plr.fullHealth += 20;
    plr.level = nxtLvl;
    return plr;
}

export function enhancePlayerWithItems(plr: Player): Player {
    const enhAtt = plr.attachments?.filter((a) => a.improveAttack && a.improveAttack !== 0)
        .reduce((c, p) => c + (p?.improveAttack || 0), 0);
    plr.attack = plr.baseAttack + enhAtt;
    return plr;
}
