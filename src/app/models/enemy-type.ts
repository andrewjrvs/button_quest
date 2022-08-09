export enum EnemyType {
    IMP
    , LIZARD
    , GNOME
    , WOLF
    , MINOTAUR
    , GOLUMN
    , GENIE
    , ENT
    , MIMIC
}
export const subType: { [key in EnemyType]: string[] } = {
    0: ['swordsmen', 'knight', 'archer', 'mag']
    , 1: ['swordsmen', 'knight', 'archer', 'mag', 'general']
    , 2: ['knifeman', 'ranger', 'theif', 'mag', 'general']
    , 3: ['footman', 'pikeman', 'knight', 'mag']
    , 4: ['axe', 'club', 'general']
    , 5: ['rock', 'gold', 'copper', 'laval', 'bones']
    , 6: ['generic']
    , 7: ['generic']
    , 8: ['generic']
}