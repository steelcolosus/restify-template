export function Authenticate<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        secure: boolean = true;
    }
}