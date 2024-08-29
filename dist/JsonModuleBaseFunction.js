import { BASE_SCHEME } from "./JsonModuleConstants";
import { Reflect } from "./Reflect";
export function hasMetaDataInScheme(metaTag, target, propertyKey, scheme) {
    try {
        var data = Reflect.getMetadata(metaTag, target, propertyKey);
        if (data[scheme] != undefined)
            return true;
        return false;
    }
    catch (e) {
        return false;
    }
}
// GET --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
export function getMetadata(metaTag, target, propertyKey, scheme) {
    if (scheme === void 0) { scheme = BASE_SCHEME; }
    return Reflect.getMetadata(metaTag, target, propertyKey, scheme);
}
export function getOwnMetaData(metaTag, target, scheme) {
    if (scheme === void 0) { scheme = BASE_SCHEME; }
    return Reflect.getOwnMetaData(metaTag, target, scheme);
}
// DEFINE --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
export function setMetadata(metaTag, value, target, propertyKey, scheme) {
    if (scheme === void 0) { scheme = BASE_SCHEME; }
    Reflect.defineMetaData(metaTag, value, target, propertyKey, scheme);
}
export function setOwnMetaData(metaTag, target, value, scheme) {
    if (scheme === void 0) { scheme = BASE_SCHEME; }
    Reflect.defineOwnMetaData(metaTag, value, target, scheme);
}
// KEYS --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
export function getOwnMetaDataKeys(target, scheme) {
    if (scheme === void 0) { scheme = BASE_SCHEME; }
    var keys = Reflect.getOwnMetaDataKeys(target, scheme);
    return keys;
}
export function getMetaDataKeys(target, key, scheme) {
    if (scheme === void 0) { scheme = BASE_SCHEME; }
    var keys = Reflect.getMetadataKeys(target, key, scheme);
    return keys;
}
//# sourceMappingURL=JsonModuleBaseFunction.js.map