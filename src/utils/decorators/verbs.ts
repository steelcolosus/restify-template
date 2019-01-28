export type Target = {
  new (...args: any[]): any;
  path: string;
};

export function GET(...args: any) {
  return analyzeDecorator('get', args);
}

export function POST(...args: any) {
  return analyzeDecorator('post', args);
}

export function PUT(...args: any) {
  return analyzeDecorator('put', args);
}

export function DELETE(...args: any) {
  return analyzeDecorator('del', args);
}
export function HEAD(...args: any) {
  return analyzeDecorator('head', args);
}

function analyzeDecorator(method: string, ...args: any) {
  if (args[0].length > 1) {
    buildVerb(args[0][0], args[0][1], method, '');
    return args[0][2];
  } else {
    return function(target: any, name: string, descriptor: PropertyDescriptor) {
      const path: string = args[0][0];
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
    methodPath: methodPath,
    filters: []
  };

  resourcePrototype.endpoints.push(newEndpoint);
}
