import { getMetadata, getOwnMetaData, getOwnMetaDataKeys, getMetaDataKeys } from "./JsonModuleBaseFunction";
import { BASE_SCHEME, JSON_BASETYPES, JSON_TAGS, NoOutput } from "./JsonModuleConstants";
var JSONHandler = /** @class */ (function () {
    function JSONHandler() {
    }
    JSONHandler.serialize = function (obj, scheme) {
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        return JSON.stringify(JSONHandler.serializeRaw(obj, scheme));
    };
    JSONHandler.serializeRaw = function (obj, scheme) {
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        if (!obj) {
            return obj;
        }
        // if this is a base type just return
        var type = typeof obj;
        switch (type) {
            case 'string':
            case 'boolean':
            case 'number':
                return obj;
        }
        // serializedObject is a new object, without non Jsonproperties
        var result = {};
        // EVENT BFORE SERIALIZATION
        var ObjectMeta = getOwnMetaDataKeys(obj);
        // if there is an After serialize function get it and run it. 
        if (ObjectMeta.includes(JSON_TAGS.JSON_OBJECT_ON_BEFORE_SERIALIZATION)) {
            // get meta data function and run it on the resulting object
            var f = getOwnMetaData(JSON_TAGS.JSON_OBJECT_ON_BEFORE_SERIALIZATION, obj, scheme);
            if (f)
                f(obj);
        }
        // get propertynames and loop through 
        var propertyNames;
        propertyNames = Object.getOwnPropertyNames(obj);
        var _loop_1 = function (i) {
            // get basic properties
            var key = propertyNames[i];
            var meta = getMetaDataKeys(obj, key, scheme);
            //let meta = Reflect.getMetadataKeys( obj , key );	
            // check if the scheme we are about to export have The Property in it
            if (!meta.includes(JSON_TAGS.JSON_PROPERTY)) {
                return "continue";
            }
            // create the name of the property, but if there is a mapped out name, get that instead
            var PropertyName = key;
            if (meta.includes(JSON_TAGS.JSON_PROPERTY_NAME_MAP_OUT)) {
                PropertyName = getMetadata(JSON_TAGS.JSON_PROPERTY_NAME_MAP_OUT, obj, key, scheme);
            }
            // if there is a mapping function
            var out = null;
            if (meta.includes(JSON_TAGS.JSON_PROPERTY_FUNC_MAP_OUT)) {
                var outFunction = getMetadata(JSON_TAGS.JSON_PROPERTY_FUNC_MAP_OUT, obj, key, scheme);
                out = outFunction(obj[key], function (o) { return JSONHandler.serializeRaw(o, scheme); });
            }
            else if (meta.includes(JSON_TAGS.JSON_PROPERTY_FORCE_ARRAY)) {
                out = [];
                if (obj[key]) {
                    if (Array.isArray(obj[key])) {
                        for (var j = 0; j < obj[key].length; j++) {
                            var e = JSONHandler.serializeRaw(obj[key][j], scheme);
                            out.push(e);
                        }
                    }
                    else {
                        out.push(JSONHandler.serializeRaw(obj[key], scheme));
                    }
                }
            }
            else {
                out = JSONHandler.serializeRaw(obj[key], scheme);
            }
            // HANDLE Force Typing
            if (meta.includes(JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE)) {
                var typekey_1 = getMetadata(JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE, obj, key, scheme);
                var convFunc = function (e) { return JSONHandler.deserializeAndForceSimple(typekey_1, e); };
                if (meta.includes(JSON_TAGS.JSON_PROPERTY_FORCE_ARRAY)) {
                    var temp = out;
                    var newout = [];
                    for (var i_1 = 0; i_1 < temp.length; i_1++) {
                        newout.push(convFunc(temp[i_1]));
                    }
                    out = newout;
                }
                else {
                    out = convFunc(out);
                }
            }
            result[PropertyName] = out;
        };
        for (var i = 0; i < propertyNames.length; i++) {
            _loop_1(i);
        }
        return result;
    };
    JSONHandler.deserialize = function (target, json, scheme, writeOut) {
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        if (!writeOut) {
            writeOut = NoOutput;
        }
        var type = typeof json;
        if (type == 'string') {
            json = JSON.parse(json);
        }
        switch (type) {
            case 'boolean':
            case 'number':
                writeOut.outError('Cannot derserialize type of ' + type);
                return;
        }
        return this.deserializeRaw(target, json, scheme);
    };
    JSONHandler.deserializeAndForceSimple = function (typekey, obj) {
        var out = obj;
        // HANDLE Force Typing
        //if( meta.includes(JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE)){
        //let typekey = Reflect.getMetadata( JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE , obj , key )
        var convFunc = function (e) { return e; };
        switch (typekey) {
            case JSON_BASETYPES.bool:
                convFunc = function (input) { return Boolean(input); };
                break;
            case JSON_BASETYPES.string:
                if (obj == null)
                    return "";
                if (typeof obj == 'object') {
                    return JSON.stringify(obj);
                }
                convFunc = function (input) { return String(input); };
                break;
            case JSON_BASETYPES.number:
                if (obj == null) {
                    return 0;
                }
                if (typeof obj == 'object') {
                    return 1;
                }
                convFunc = function (e) {
                    var numberValue = Number(e);
                    return isNaN(numberValue) ? 0 : numberValue;
                };
                break;
        }
        out = convFunc(out);
        return out;
    };
    JSONHandler.deserializeRaw = function (target, obj, scheme, parentName) {
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        if (parentName === void 0) { parentName = 'FIRST'; }
        if (!obj) {
            return obj;
        }
        // serializedObject is a new object, without non Jsonproperties
        var result = new target();
        var prototype = target.prototype;
        // get propertynames and loop through 
        var propertyNames = Object.getOwnPropertyNames(obj);
        var _loop_2 = function (i) {
            // get basic properties
            var key = propertyNames[i];
            var inKey = key;
            var meta = getMetaDataKeys(target, key, scheme);
            var PropertyName = key;
            if (meta.length == 0) {
                return "continue";
            }
            // if this is an Out key, convert it to an IN Key, so we can get the right meta data. 
            if (meta.includes(JSON_TAGS.JSON_PROPERTY_NAME_MAP_IN)) {
                // get out key from the in Key
                key = getMetadata(JSON_TAGS.JSON_PROPERTY_NAME_MAP_IN, prototype, key, scheme);
                // in case that a key belonged to another scheme, then the key is undefined
                //	if(key==undefined){
                //		continue;
                //	} 
                meta = getMetaDataKeys(target, key, scheme);
                PropertyName = key;
            }
            // Get the constructor if there is any, Generics take priority
            var out = null;
            var constr = getMetadata(JSON_TAGS.JSON_PROPERTY_TYPED, prototype, key, scheme);
            if (meta.includes(JSON_TAGS.JSON_PROPERTY_FUNC_MAP_IN)) {
                var inFunction = getMetadata(JSON_TAGS.JSON_PROPERTY_FUNC_MAP_IN, prototype, key, scheme);
                if (constr) {
                    out = inFunction(obj[inKey], function (obj) {
                        var res = JSONHandler.deserializeRaw(constr, obj, scheme, key);
                        return res;
                    });
                }
                else {
                    out = inFunction(obj[inKey], function (obj) { return obj; });
                }
            }
            else if (meta.includes(JSON_TAGS.JSON_PROPERTY_FORCE_ARRAY)) {
                // if it needs deserializing
                var convert_1 = function (e) { return e; };
                if (constr) {
                    convert_1 = function (e) { return JSONHandler.deserializeRaw(constr, e, scheme, key); };
                }
                else {
                    // as stated above
                }
                // if it needs to be converted to a simple type. EVEN after deserializing
                var convert2 = function (e, typekey) { return convert_1(e); };
                if (meta.includes(JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE)) {
                    convert2 = function (e, typekey) {
                        return JSONHandler.deserializeAndForceSimple(typekey, e);
                    };
                }
                else {
                    // as stated above
                }
                out = [];
                var typekey = getMetadata(JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE, prototype, key, scheme);
                for (var j = 0; j < obj[inKey].length; j++) {
                    var e = obj[inKey][j];
                    var r = convert2(e, typekey);
                    out.push(r);
                }
            }
            else {
                if (constr) {
                    out = JSONHandler.deserializeRaw(constr, obj[inKey], scheme, key);
                }
                else {
                    out = obj[inKey];
                }
            }
            result[PropertyName] = out;
        };
        for (var i = 0; i < propertyNames.length; i++) {
            _loop_2(i);
        }
        // EVENT ON AFTER DESERIALIZE
        var ObjectMeta = getOwnMetaDataKeys(result);
        // if there is an After serialize function get it and run it. 
        if (ObjectMeta.includes(JSON_TAGS.JSON_OBJECT_ON_AFTER_DE_SERIALIZATION)) {
            // get meta data function and run it on the resulting object
            var f = getOwnMetaData(JSON_TAGS.JSON_OBJECT_ON_AFTER_DE_SERIALIZATION, result, scheme);
            if (f)
                f(result);
        }
        return result;
    };
    return JSONHandler;
}());
export { JSONHandler };
//# sourceMappingURL=JsonHandler.js.map