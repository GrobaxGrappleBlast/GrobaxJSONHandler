"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasMetaDataInScheme = hasMetaDataInScheme;
exports.getMetadata = getMetadata;
exports.getOwnMetaData = getOwnMetaData;
exports.setMetadata = setMetadata;
exports.setOwnMetaData = setOwnMetaData;
exports.getOwnMetaDataKeys = getOwnMetaDataKeys;
exports.getMetaDataKeys = getMetaDataKeys;
exports.hasMetaData = hasMetaData;
exports.getPrototype = getPrototype;
exports.setPrototype = setPrototype;
const JsonModuleConstants_1 = require("./JsonModuleConstants");
const Reflect_1 = require("./Reflect");
function hasMetaDataInScheme(metaTag, target, propertyKey, scheme) {
    try {
        let data = Reflect_1.Reflect.getMetadata(metaTag, target, propertyKey);
        if (data[scheme] != undefined)
            return true;
        return false;
    }
    catch (e) {
        return false;
    }
}
// GET --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
function getMetadata(metaTag, target, propertyKey, scheme = JsonModuleConstants_1.BASE_SCHEME) {
    return Reflect_1.Reflect.getMetadata(metaTag, target, propertyKey, scheme);
}
function getOwnMetaData(metaTag, target, scheme = JsonModuleConstants_1.BASE_SCHEME) {
    return Reflect_1.Reflect.getOwnMetaData(metaTag, target, scheme);
}
// DEFINE --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
function setMetadata(metaTag, value, target, propertyKey, scheme = JsonModuleConstants_1.BASE_SCHEME) {
    Reflect_1.Reflect.defineMetaData(metaTag, value, target, propertyKey, scheme);
}
function setOwnMetaData(metaTag, target, value, scheme = JsonModuleConstants_1.BASE_SCHEME) {
    Reflect_1.Reflect.defineOwnMetaData(metaTag, value, target, scheme);
}
// KEYS --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
function getOwnMetaDataKeys(target, scheme = JsonModuleConstants_1.BASE_SCHEME) {
    let keys = Reflect_1.Reflect.getOwnMetaDataKeys(target, scheme);
    return keys;
}
function getMetaDataKeys(target, key, scheme = JsonModuleConstants_1.BASE_SCHEME) {
    let keys = Reflect_1.Reflect.getMetadataKeys(target, key, scheme);
    return keys;
}
function hasMetaData(target, scheme) {
    let a = Reflect_1.Reflect.getAllMeta(target, scheme);
    if (!a)
        return false;
    return true;
}
function getPrototype(obj) {
    return Reflect_1.Reflect.getPrototype(obj);
}
function setPrototype(obj, prototype) {
    Reflect_1.Reflect.setPrototype(obj, prototype);
    return Reflect_1.Reflect.getPrototype(obj) == prototype;
}
//# sourceMappingURL=JsonModuleBaseFunction.js.map