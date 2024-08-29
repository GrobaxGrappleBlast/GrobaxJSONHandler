import { BASE_SCHEME } from "./JsonModuleConstants";
function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var selfKey = createGuid() + "SELF";
var MetaDataTagName = 'gjmd'; // Grobax Json Meta Data;
var Reflect = /** @class */ (function () {
    function Reflect() {
    }
    // structure is 
    // OLD : prototype > MetaDataTagName > scheme > key > value 
    // prototype > MetaDataTagName > scheme > key > tag > value 
    Reflect.isPrototype = function (a) {
        return a && typeof a === 'object' && a.constructor === Object;
    };
    Reflect.getOrCreateDefinedMetaData = function (obj, scheme, create) {
        if (create === void 0) { create = false; }
        var a;
        if (typeof obj == 'function') {
            a = obj.prototype;
        }
        else {
            a = obj.constructor.prototype;
        }
        if (a === Object.prototype) {
            return null;
        }
        if (a == null)
            return null;
        if (!(a['gjmd'])) {
            if (!create)
                return null;
            a['gjmd'] = {};
        }
        if (!(a['gjmd'][scheme])) {
            if (!create)
                return null;
            a['gjmd'][scheme] = {};
        }
        return a['gjmd'][scheme];
    };
    // KEYS --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    Reflect.getMetadataKeys = function (obj, key, scheme) {
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        var a = Reflect.getOrCreateDefinedMetaData(obj, scheme);
        if (!a || !a[key]) {
            return [];
        }
        return Object.keys(a[key]);
    };
    Reflect.getOwnMetaDataKeys = function (obj, scheme) {
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        return Reflect.getMetadataKeys(obj, selfKey, scheme);
    };
    // GET --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    Reflect.getMetadata = function (metaTag, target, propertyKey, scheme) {
        var _a;
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        var a = Reflect.getOrCreateDefinedMetaData(target, scheme);
        if (!a[propertyKey])
            return null;
        return (_a = a[propertyKey][metaTag]) !== null && _a !== void 0 ? _a : null;
    };
    Reflect.getOwnMetaData = function (metaTag, target, scheme) {
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        return Reflect.getMetadata(metaTag, target, selfKey, scheme);
    };
    // DEFINE --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    Reflect.defineMetaData = function (metaTag, data, target, propertyKey, scheme) {
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        var a = Reflect.getOrCreateDefinedMetaData(target, scheme, true);
        if (!a[propertyKey])
            a[propertyKey] = {};
        a[propertyKey][metaTag] = data;
    };
    Reflect.defineOwnMetaData = function (metaTag, data, target, scheme) {
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        return Reflect.defineMetaData(metaTag, data, target, selfKey, scheme);
    };
    // has --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    Reflect.hasMetaData = function (metaTag, target, key, scheme) {
        var _a;
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        var a = Reflect.getOrCreateDefinedMetaData(target, scheme);
        if (a == null)
            return false;
        if (!(a[key]))
            return false;
        return (_a = a[key][metaTag]) !== null && _a !== void 0 ? _a : false;
    };
    Reflect.hasOwnMetaData = function (metaTag, target, scheme) {
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        return Reflect.hasMetaData(metaTag, target, selfKey, scheme);
    };
    Reflect.getAllMeta = function (obj, scheme) {
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        return Reflect.getOrCreateDefinedMetaData(obj, scheme);
    };
    return Reflect;
}());
export { Reflect };
//# sourceMappingURL=Reflect.js.map