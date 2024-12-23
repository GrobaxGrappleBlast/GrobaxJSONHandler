import { BASE_SCHEME } from "./JsonModuleConstants";
import { Reflect } from "./Reflect";
export function hasMetaDataInScheme(metaTag, target, propertyKey, scheme) {
    try {
        let data = Reflect.getMetadata(metaTag, target, propertyKey);
        if (data[scheme] != undefined)
            return true;
        return false;
    }
    catch (e) {
        return false;
    }
}
// GET --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
export function getMetadata(metaTag, target, propertyKey, scheme = BASE_SCHEME) {
    return Reflect.getMetadata(metaTag, target, propertyKey, scheme);
}
export function getOwnMetaData(metaTag, target, scheme = BASE_SCHEME) {
    return Reflect.getOwnMetaData(metaTag, target, scheme);
}
// DEFINE --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
export function setMetadata(metaTag, value, target, propertyKey, scheme = BASE_SCHEME) {
    Reflect.defineMetaData(metaTag, value, target, propertyKey, scheme);
}
export function setOwnMetaData(metaTag, target, value, scheme = BASE_SCHEME) {
    Reflect.defineOwnMetaData(metaTag, value, target, scheme);
}
// KEYS --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
export function getOwnMetaDataKeys(target, scheme = BASE_SCHEME) {
    let keys = Reflect.getOwnMetaDataKeys(target, scheme);
    return keys;
}
export function getMetaDataKeys(target, key, scheme = BASE_SCHEME) {
    let keys = Reflect.getMetadataKeys(target, key, scheme);
    return keys;
}
export function hasMetaData(target, scheme) {
    let a = Reflect.getAllMeta(target, scheme);
    if (!a)
        return false;
    return true;
}
export function getPrototype(obj) {
    return Reflect.getPrototype(obj);
}
export function setPrototype(obj, prototype) {
    Reflect.setPrototype(obj, prototype);
    return Reflect.getPrototype(obj) == prototype;
}
