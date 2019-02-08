export default function path(path) {
    return (...args: any) => {
        if (args.length === 1) {
            return rootPath(path, args[0]);
        } else {
            throw new Error('path decorator is a  class level annotation')
        }
    };
}
function rootPath(path, Resource) {
    Resource.prototype.basePath = path;
    return Resource;
}

