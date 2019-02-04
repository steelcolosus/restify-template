export interface AllowMethod {
    methodName: string,
    allow: boolean,
    roles: []
}

export function AllowAny(allow: boolean = true, ...roless) {
    return (target: any, name: string, descriptor: PropertyDescriptor) => {
        if (!target.allowed) {
            target.allowed = [];
        }
        const allowMethod: AllowMethod = {
            methodName: name,
            allow: allow,
            roles: []
        }

        target.allowed.push(allowMethod);
    }
}