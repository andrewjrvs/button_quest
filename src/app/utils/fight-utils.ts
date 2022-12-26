import { Actor, Attackable, Defendable } from '../models';
import * as SysUtil from './system-util';

/** calulate the 'attack amount' */
export function calculateActorAttack(attacker: Attackable): number {
    const attchdNum = attacker.attached.reduce((p, c) => p + (c.improveAttack || 0), 0);
    const num = attchdNum + attacker.attack + 5;
    const min = Math.max(num - 13, 0);
    return SysUtil.getNormalDistRandomInt(min, num, 2);
}

/** calculate the 'defence number' */
export function calculateActorDefence(defender: Defendable): number {
    const attchdNum = defender.attached.reduce((p, c) => p + (c.improveDefence || 0), 0);
    const num = Math.max(0, attchdNum + defender.defence - 1);
    if (num === 0) {
        return 0;
    }
    const min = 0
    return SysUtil.getRandomInt(min, num);
}

/** use defence and attach to return the health change. */
export function getCalcluatedHealthKnock(attacker: Attackable, defender: Defendable): number {
    const attNum = calculateActorAttack(attacker);
    const defNum = calculateActorDefence(defender);
    return Math.max(0, attNum - defNum);
}

/**
 * Process the fight, and return an updated defender
 * @returns { Actor } defender
 */
export function processFight(attacker: Actor, defender: Actor, logger?: (...args: any[]) => void): Actor {
    const rtnDef = SysUtil.clone(defender);
    const healthKnock = getCalcluatedHealthKnock(attacker, defender);
    if (logger) {
        logger(`Damage - ${attacker.name} did ${healthKnock} to ${defender.name}`);
    }
    rtnDef.health -= healthKnock;
    return rtnDef;
}