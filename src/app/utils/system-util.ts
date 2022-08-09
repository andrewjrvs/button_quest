export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
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