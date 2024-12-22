import { BASE_SCHEME } from "./JsonModuleConstants";
function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const selfKey = createGuid() + "SELF";
const MetaDataTagName = 'gjmd'; // Grobax Json Meta Data;
export class Reflect {
    static getPrototype(obj) {
        let a;
        if (typeof obj == 'function') {
            a = obj.prototype;
        }
        else {
            a = obj.constructor.prototype;
        }
        return a;
    }
    static setPrototype(obj, prototype) {
        //Object.setPrototypeOf( obj , prototype )
        if (typeof obj == 'function') {
            throw new Error('Not Implemented Error, please report the scenario to me');
        }
        else {
            Object.setPrototypeOf(obj, prototype);
        }
    }
    static getOrCreateAllMetaData(obj, create = false) {
        let prototype = Reflect.getPrototype(obj);
        if (prototype === Object.prototype) {
            return null;
        }
        if (prototype == null)
            return null;
        let a = prototype;
        if (!(a['gjmd'])) {
            if (!create)
                return null;
            a['gjmd'] = {};
        }
        a = a['gjmd'];
        if (!a[prototype.constructor.name]) {
            if (!create)
                return null;
            a[prototype.constructor.name] = {};
        }
        a = a[prototype.constructor.name];
        return a;
    }
    static getOrCreateDefinedMetaData(obj, scheme, create = false) {
        let a = Reflect.getOrCreateAllMetaData(obj, create);
        if (!a)
            return null;
        if (!(a[scheme])) {
            if (!create)
                return null;
            a[scheme] = {};
        }
        return a[scheme];
    }
    // KEYS --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    static getMetadataKeys(obj, key, scheme = BASE_SCHEME) {
        let a = Reflect.getOrCreateDefinedMetaData(obj, scheme);
        if (!a || !a[key]) {
            return [];
        }
        return Object.keys(a[key]);
    }
    static getOwnMetaDataKeys(obj, scheme = BASE_SCHEME) {
        return Reflect.getMetadataKeys(obj, selfKey, scheme);
    }
    // GET --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    static getMetadata(metaTag, target, propertyKey, scheme = BASE_SCHEME) {
        var _a;
        let a = Reflect.getOrCreateDefinedMetaData(target, scheme);
        if (!a[propertyKey])
            return null;
        return (_a = a[propertyKey][metaTag]) !== null && _a !== void 0 ? _a : null;
    }
    static getOwnMetaData(metaTag, target, scheme = BASE_SCHEME) {
        return Reflect.getMetadata(metaTag, target, selfKey, scheme);
    }
    // DEFINE --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    static defineMetaData(metaTag, data, target, propertyKey, scheme = BASE_SCHEME) {
        let a = Reflect.getOrCreateDefinedMetaData(target, scheme, true);
        if (!a[propertyKey])
            a[propertyKey] = {};
        a[propertyKey][metaTag] = data;
    }
    static defineOwnMetaData(metaTag, data, target, scheme = BASE_SCHEME) {
        return Reflect.defineMetaData(metaTag, data, target, selfKey, scheme);
    }
    // has --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
    static hasMetaData(metaTag, target, key, scheme = BASE_SCHEME) {
        var _a;
        let a = Reflect.getOrCreateDefinedMetaData(target, scheme);
        if (a == null)
            return false;
        if (!(a[key]))
            return false;
        return (_a = a[key][metaTag]) !== null && _a !== void 0 ? _a : false;
    }
    static hasOwnMetaData(metaTag, target, scheme = BASE_SCHEME) {
        return Reflect.hasMetaData(metaTag, target, selfKey, scheme);
    }
    static getAllMeta(obj, scheme) {
        if (scheme) {
            return Reflect.getOrCreateDefinedMetaData(obj, scheme);
        }
        else {
            return Reflect.getOrCreateAllMetaData(obj, true);
        }
    }
}
