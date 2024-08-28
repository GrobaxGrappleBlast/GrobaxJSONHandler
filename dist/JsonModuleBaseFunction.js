"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasMetaDataInScheme = hasMetaDataInScheme;
exports.getMetadata = getMetadata;
exports.getOwnMetaData = getOwnMetaData;
exports.setMetadata = setMetadata;
exports.setOwnMetaData = setOwnMetaData;
exports.getOwnMetaDataKeys = getOwnMetaDataKeys;
exports.getMetaDataKeys = getMetaDataKeys;
var JsonModuleConstants_1 = require("./JsonModuleConstants");
var Reflect_1 = require("./Reflect");
function hasMetaDataInScheme(metaTag, target, propertyKey, scheme) {
    try {
        var data = Reflect_1.Reflect.getMetadata(metaTag, target, propertyKey);
        if (data[scheme] != undefined)
            return true;
        return false;
    }
    catch (e) {
        return false;
    }
}
// GET --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
function getMetadata(metaTag, target, propertyKey, scheme) {
    if (scheme === void 0) { scheme = JsonModuleConstants_1.BASE_SCHEME; }
    return Reflect_1.Reflect.getMetadata(metaTag, target, propertyKey, scheme);
}
function getOwnMetaData(metaTag, target, scheme) {
    if (scheme === void 0) { scheme = JsonModuleConstants_1.BASE_SCHEME; }
    return Reflect_1.Reflect.getOwnMetaData(metaTag, target, scheme);
}
// DEFINE --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
function setMetadata(metaTag, value, target, propertyKey, scheme) {
    if (scheme === void 0) { scheme = JsonModuleConstants_1.BASE_SCHEME; }
    Reflect_1.Reflect.defineMetaData(metaTag, value, target, propertyKey, scheme);
}
function setOwnMetaData(metaTag, target, value, scheme) {
    if (scheme === void 0) { scheme = JsonModuleConstants_1.BASE_SCHEME; }
    Reflect_1.Reflect.defineOwnMetaData(metaTag, value, target, scheme);
}
// KEYS --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
function getOwnMetaDataKeys(target, scheme) {
    if (scheme === void 0) { scheme = JsonModuleConstants_1.BASE_SCHEME; }
    var keys = Reflect_1.Reflect.getOwnMetaDataKeys(target, scheme);
    return keys;
}
function getMetaDataKeys(target, key, scheme) {
    if (scheme === void 0) { scheme = JsonModuleConstants_1.BASE_SCHEME; }
    var keys = Reflect_1.Reflect.getMetadataKeys(target, key, scheme);
    return keys;
}
//# sourceMappingURL=JsonModuleBaseFunction.js.map