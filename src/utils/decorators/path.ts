import { resource, endpoint } from '../access';

export default function path(path) {
    return (...args) => {
        if (args.length === 1) {
            return rootPath(path, args[0]);
        } else {
            return endpointPath(path, args[0], args[1]);
        }
    };
}

function rootPath(path, Resource) {
    const resourceDescription = resource(Resource);
    resourceDescription.basePath = path;
    return Resource;
}

function endpointPath(path, resourcePrototype, name) {
    const endpointDescription = endpoint(resourcePrototype.constructor, name);
    endpointDescription.methodPath = path;
}