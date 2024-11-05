"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONHandler = void 0;
const JsonModuleBaseFunction_1 = require("./JsonModuleBaseFunction");
const JsonModuleConstants_1 = require("./JsonModuleConstants");
class JSONHandler {
    static serialize(obj, scheme = JsonModuleConstants_1.BASE_SCHEME) {
        var o = JSONHandler.serializeRaw(obj, scheme);
        var str = JSON.stringify(o);
        // if there is an After serialize function get it and run it. 
        let ObjectMeta = (0, JsonModuleBaseFunction_1.getOwnMetaDataKeys)(obj);
        if (ObjectMeta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_AFTER_SERIALIZATION)) {
            let f = (0, JsonModuleBaseFunction_1.getOwnMetaData)(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_AFTER_SERIALIZATION, obj, scheme);
            if (f)
                str = f(str);
        }
        return str;
    }
    static serializeRaw(obj, scheme = JsonModuleConstants_1.BASE_SCHEME, parentName = 'FIRST') {
        if (!obj) {
            return obj;
        }
        // if this is a base type just return
        const type = typeof obj;
        switch (type) {
            case 'string':
                return JSONHandler.deserializeAndForceSimple('string', obj, scheme);
                break;
            case 'boolean':
            case 'number':
                return obj;
        }
        // in case this is a regular object with no decorators 
        if (!(0, JsonModuleBaseFunction_1.hasMetaData)(obj, scheme)) {
            try {
                return (obj);
            }
            catch (e) {
                return {};
            }
        }
        // serializedObject is a new object, without non Jsonproperties
        let result = {};
        // EVENT BFORE SERIALIZATION
        let ObjectMeta = (0, JsonModuleBaseFunction_1.getOwnMetaDataKeys)(obj);
        // if there is an After serialize function get it and run it. 
        if (ObjectMeta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_BEFORE_SERIALIZATION)) {
            // get meta data function and run it on the resulting object
            let f = (0, JsonModuleBaseFunction_1.getOwnMetaData)(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_BEFORE_SERIALIZATION, obj, scheme);
            if (f)
                f(obj);
        }
        // get propertynames and loop through 
        let propertyNames;
        propertyNames = Object.getOwnPropertyNames(obj);
        for (let i = 0; i < propertyNames.length; i++) {
            // get basic properties
            const key = propertyNames[i];
            let meta = (0, JsonModuleBaseFunction_1.getMetaDataKeys)(obj, key, scheme);
            // check if the scheme we are about to export have The Property in it
            if (!meta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY)) {
                continue;
            }
            // create the name of the property, but if there is a mapped out name, get that instead
            let PropertyName = key;
            if (meta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_NAME_MAP_OUT)) {
                PropertyName = (0, JsonModuleBaseFunction_1.getMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_NAME_MAP_OUT, obj, key, scheme);
            }
            // if the item is typed, then we excange the prototypes for each object as we deserialize. 
            // we do this in a funciton to minimize if statement chaos;
            let typedconversion = (v, ser) => v;
            let skipForceType = false;
            if (meta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_TYPED_SKIP_FORCED)) {
                skipForceType = (0, JsonModuleBaseFunction_1.getMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_TYPED_SKIP_FORCED, obj, key, scheme);
            }
            if (meta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_TYPED) && !skipForceType) {
                typedconversion = (v, ser) => {
                    // get prototypes;
                    let during = ((0, JsonModuleBaseFunction_1.getMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_TYPED, obj, key, scheme)).prototype;
                    let before = (0, JsonModuleBaseFunction_1.getPrototype)(v);
                    // set prototype serialize then set prototype back 
                    (0, JsonModuleBaseFunction_1.setPrototype)(v, during);
                    let r = ser(v);
                    (0, JsonModuleBaseFunction_1.setPrototype)(v, before);
                    // done
                    return r;
                };
            }
            // if there is a mapping function
            let out = null;
            if (meta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FUNC_MAP_OUT)) {
                let outFunction = (0, JsonModuleBaseFunction_1.getMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FUNC_MAP_OUT, obj, key, scheme);
                let _outF = (o1) => outFunction(o1, (o2) => typedconversion(o2, (o3) => JSONHandler.serializeRaw(o3, scheme, parentName + ':' + key)));
                out = _outF(obj[key]);
            }
            else if (meta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FORCE_ARRAY)) {
                out = [];
                if (obj[key]) {
                    if (Array.isArray(obj[key])) {
                        for (let j = 0; j < obj[key].length; j++) {
                            const e = typedconversion(obj[key][j], (o) => JSONHandler.serializeRaw(o, scheme, parentName + ':[' + j + ']:' + key));
                            out.push(e);
                        }
                    }
                    else {
                        out.push(typedconversion(obj[key], (o) => JSONHandler.serializeRaw(o, scheme, parentName + ':' + key)));
                    }
                }
            }
            else {
                out = typedconversion(obj[key], (o) => JSONHandler.serializeRaw(o, scheme, parentName + ':' + key));
            }
            // HANDLE Force Typing
            if (meta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE)) {
                let typekey = (0, JsonModuleBaseFunction_1.getMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE, obj, key, scheme);
                let convFunc = (e) => JSONHandler.deserializeAndForceSimple(typekey, e, scheme);
                if (meta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FORCE_ARRAY)) {
                    let temp = out;
                    let newout = [];
                    for (let i = 0; i < temp.length; i++) {
                        newout.push(convFunc(temp[i]));
                    }
                    out = newout;
                }
                else {
                    out = convFunc(obj[key]);
                }
            }
            result[PropertyName] = out;
        }
        // if there is an After serialize function get it and run it. 
        if (ObjectMeta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_AFTER_SERIALIZATION_BEFORE_STRING)) {
            let f = (0, JsonModuleBaseFunction_1.getOwnMetaData)(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_AFTER_SERIALIZATION_BEFORE_STRING, obj, scheme);
            if (f)
                f(result);
        }
        return result;
    }
    static deserialize(target, json, scheme = JsonModuleConstants_1.BASE_SCHEME, writeOut) {
        if (!writeOut) {
            writeOut = JsonModuleConstants_1.NoOutput;
        }
        const type = typeof json;
        if (type == 'string') {
            json = JSON.parse(json);
        }
        switch (type) {
            case 'boolean':
            case 'number':
                writeOut.outError('Cannot derserialize type of ' + type);
                return;
        }
        if (Array.isArray(json)) {
            let arr = [];
            for (let i = 0; i < json.length; i++) {
                arr.push(this.deserializeRaw(target, json[i], scheme));
            }
            return arr;
        }
        else {
            return this.deserializeRaw(target, json, scheme);
        }
    }
    static deserializeAndForceSimple(typekey, obj, scheme = JsonModuleConstants_1.BASE_SCHEME) {
        let out = obj;
        let convFunc = (e) => e;
        switch (typekey) {
            case JsonModuleConstants_1.JSON_BASETYPES.bool:
                convFunc = (input) => Boolean(input);
                break;
            case JsonModuleConstants_1.JSON_BASETYPES.string:
                if (obj == null)
                    return "";
                if (typeof obj == 'string') {
                    //const str = obj.replaceAll("<<dp>>",'\\"');
                    return obj;
                }
                else if (Array.isArray(obj)) {
                    let str = JSON.stringify(obj);
                    //str = str.replaceAll("<<dp>>",'\\"');
                    return str;
                }
                else if (typeof obj == 'object') {
                    if ((0, JsonModuleBaseFunction_1.hasMetaData)(obj, scheme)) {
                        return JSONHandler.serialize(obj, scheme);
                    }
                    else {
                        //let str = JSON.stringify(obj);
                        //str = str.replaceAll('\\"',"<<dp>>");
                        //return str
                        return JSON.stringify(obj);
                    }
                }
                convFunc = (input) => String(input);
                break;
            case JsonModuleConstants_1.JSON_BASETYPES.number:
                if (obj == null) {
                    return 0;
                }
                if (typeof obj == 'object') {
                    return 1;
                }
                convFunc = (e) => {
                    const numberValue = Number(e);
                    return isNaN(numberValue) ? 0 : numberValue;
                };
                break;
        }
        out = convFunc(out);
        return out;
    }
    static deserializeRaw(target, obj, scheme = JsonModuleConstants_1.BASE_SCHEME, parentName = 'FIRST') {
        if (!obj) {
            return obj;
        }
        // serializedObject is a new object, without non Jsonproperties
        let result = new target();
        let prototype = target.prototype;
        // EVENT ON AFTER DESERIALIZE
        let ObjectMeta = (0, JsonModuleBaseFunction_1.getOwnMetaDataKeys)(target);
        if (ObjectMeta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_BEFORE_DE_SERIALIZATION)) {
            // get meta data function and run it on the resulting object
            let f = (0, JsonModuleBaseFunction_1.getOwnMetaData)(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_BEFORE_DE_SERIALIZATION, result, scheme);
            if (f)
                result = f(result, obj);
            // incase the Before has changed the type 
            if (!JSONHandler.areSamePrototypes(result, target)) {
                target = (0, JsonModuleBaseFunction_1.getPrototype)(result).constructor;
            }
        }
        // get propertynames and loop through 
        let propertyNames = Object.getOwnPropertyNames(obj);
        for (let i = 0; i < propertyNames.length; i++) {
            // get basic properties
            let key = propertyNames[i];
            let inKey = key;
            let meta = (0, JsonModuleBaseFunction_1.getMetaDataKeys)(target, key, scheme);
            let PropertyName = key;
            if (meta.length == 0) {
                continue;
            }
            // if this is an Out key, convert it to an IN Key, so we can get the right meta data. 
            if (meta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_NAME_MAP_IN)) {
                // get out key from the in Key
                key = (0, JsonModuleBaseFunction_1.getMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_NAME_MAP_IN, prototype, key, scheme);
                // in case that a key belonged to another scheme, then the key is undefined
                //	if(key==undefined){
                //		continue;
                //	} 
                meta = (0, JsonModuleBaseFunction_1.getMetaDataKeys)(target, key, scheme);
                PropertyName = key;
            }
            // Get the constructor if there is any, Generics take priority
            let out = null;
            let constr = (0, JsonModuleBaseFunction_1.getMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_TYPED, prototype, key, scheme);
            if (meta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FUNC_MAP_IN)) {
                let inFunction = (0, JsonModuleBaseFunction_1.getMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FUNC_MAP_IN, prototype, key, scheme);
                if (constr) {
                    out = inFunction(obj[inKey], (obj) => {
                        let res = JSONHandler.deserializeRaw(constr, obj, scheme, key);
                        return res;
                    });
                }
                else {
                    out = inFunction(obj[inKey], (obj) => obj);
                }
            }
            else if (meta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FORCE_ARRAY)) {
                // if it needs deserializing
                let convert = (e) => e;
                if (constr) {
                    convert = (e) => JSONHandler.deserializeRaw(constr, e, scheme, key);
                }
                else {
                    // as stated above
                }
                // if it needs to be converted to a simple type. EVEN after deserializing
                let convert2 = (e, typekey) => convert(e);
                if (meta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE)) {
                    convert2 = (e, typekey) => {
                        return JSONHandler.deserializeAndForceSimple(typekey, e);
                    };
                }
                else {
                    // as stated above
                }
                out = [];
                const typekey = (0, JsonModuleBaseFunction_1.getMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE, prototype, key, scheme);
                for (let j = 0; j < obj[inKey].length; j++) {
                    let e = obj[inKey][j];
                    let r = convert2(e, typekey);
                    out.push(r);
                }
            }
            else {
                if (constr) {
                    out = JSONHandler.deserializeRaw(constr, obj[inKey], scheme, key);
                }
                else if (meta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE)) {
                    let typeKey = (0, JsonModuleBaseFunction_1.getMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE, target, key, scheme);
                    out = JSONHandler.deserializeAndForceSimple(typeKey, obj[inKey]);
                }
                else {
                    out = obj[inKey];
                }
            }
            result[PropertyName] = out;
        }
        // EVENT ON AFTER DESERIALIZE
        ObjectMeta = (0, JsonModuleBaseFunction_1.getOwnMetaDataKeys)(result);
        // if there is an After serialize function get it and run it. 
        if (ObjectMeta.includes(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_AFTER_DE_SERIALIZATION)) {
            // get meta data function and run it on the resulting object
            let f = (0, JsonModuleBaseFunction_1.getOwnMetaData)(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_AFTER_DE_SERIALIZATION, result, scheme);
            if (f)
                f(result);
        }
        return result;
    }
    static changePrototype(target, source) {
        const prototype = (0, JsonModuleBaseFunction_1.getPrototype)(source);
        (0, JsonModuleBaseFunction_1.setPrototype)(target, prototype);
    }
    static areSamePrototypes(target, source) {
        const prototype1 = (0, JsonModuleBaseFunction_1.getPrototype)(source);
        const prototype2 = (0, JsonModuleBaseFunction_1.getPrototype)(target);
        return prototype1 == prototype2;
    }
}
exports.JSONHandler = JSONHandler;
