export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function getNormalDistRandomInt(min: number, max: number, skew: number = 1): number {
    //from @joshuakcockrell -> https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve

    let u = 0, v = 0;
    while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
    
    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) 
      num = getNormalDistRandomInt(min, max, skew) // resample between 0 and 1 if out of range
    
    else{
      num = Math.pow(num, skew) // Skew
      num *= max - min // Stretch to fill range
      num += min // offset to min
    }
    num = Math.round(num);
    return num
  }

/** custom to account for bigint */
export function jsonStringify(obj: any): string {
    return JSON.stringify(obj, (_, value) => typeof value === 'bigint'
        ? "<bigint>:" + value.toString()
        : value);
}

/** custom JSON parse to account for bigint */
export function jsonParse<T>(obj: string): T | null {
    let rtn: T | null = null;
    try {
        rtn = JSON.parse(obj, (key, value) => typeof value === 'string' &&
            value.startsWith('<bigint>:')
            ? BigInt(value.substring(9))
            : value);
    } catch (ex) {

    }
    return rtn;
}

/** custom cloner */
export function clone<T>(obj: T): T {
    return <T>jsonParse(jsonStringify(obj))
}

export function isNotNullOrUndefined<T>(input: null | undefined | T): input is T {
    return input != null;
  }