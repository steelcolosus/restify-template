export function GET(...args: any) {
    return analyzeDecorator('get', ...args);
}

export function POST(...args: any) {
    return analyzeDecorator('post', ...args);
}

export function PUT(...args: any) {
    return analyzeDecorator('put', ...args);
}

export function DELETE(...args: any) {
    return analyzeDecorator('del', ...args);
}
export function HEAD(...args: any) {
    return analyzeDecorator('head', ...args);
}

function analyzeDecorator(method: string, ...args: any) {
    if (args.length > 1) {
        buildVerb(args[0], args[1], method, '');
        return args[2];
    } else {
        return function (target: any, name: string, descriptor: PropertyDescriptor) {
            const path: string = args[0];
            buildVerb(target, name, method, path);
        };
    }
}

function buildVerb(resourcePrototype, name, httpMethod, methodPath) {
    if (!resourcePrototype.endpoints) {
        resourcePrototype.endpoints = [];
    }
    const newEndpoint = {
        methodName: name,
        http: httpMethod,
        methodPath: methodPath
    };

    resourcePrototype.endpoints.push(newEndpoint);
}
