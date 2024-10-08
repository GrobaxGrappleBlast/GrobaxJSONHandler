import { getMetadata, getOwnMetaData, getOwnMetaDataKeys, getMetaDataKeys, hasMetaData, getPrototype, setPrototype } from "./JsonModuleBaseFunction";
import { BASE_SCHEME, JSON_BASETYPES, JSON_TAGS, NoOutput } from "./JsonModuleConstants";
var JSONHandler = /** @class */ (function () {
    function JSONHandler() {
    }
    JSONHandler.serialize = function (obj, scheme) {
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        var o = JSONHandler.serializeRaw(obj, scheme);
        var str = JSON.stringify(o);
        // if there is an After serialize function get it and run it. 
        var ObjectMeta = getOwnMetaDataKeys(obj);
        if (ObjectMeta.includes(JSON_TAGS.JSON_OBJECT_ON_AFTER_SERIALIZATION)) {
            var f = getOwnMetaData(JSON_TAGS.JSON_OBJECT_ON_AFTER_SERIALIZATION, obj, scheme);
            if (f)
                str = f(str);
        }
        return str;
    };
    JSONHandler.serializeRaw = function (obj, scheme, parentName) {
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        if (parentName === void 0) { parentName = 'FIRST'; }
        if (!obj) {
            return obj;
        }
        // if this is a base type just return
        var type = typeof obj;
        switch (type) {
            case 'string':
                return JSONHandler.deserializeAndForceSimple('string', obj, scheme);
                break;
            case 'boolean':
            case 'number':
                return obj;
        }
        // in case this is a regular object with no decorators 
        if (!hasMetaData(obj, scheme)) {
            try {
                return (obj);
            }
            catch (e) {
                return {};
            }
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
            // check if the scheme we are about to export have The Property in it
            if (!meta.includes(JSON_TAGS.JSON_PROPERTY)) {
                return "continue";
            }
            // create the name of the property, but if there is a mapped out name, get that instead
            var PropertyName = key;
            if (meta.includes(JSON_TAGS.JSON_PROPERTY_NAME_MAP_OUT)) {
                PropertyName = getMetadata(JSON_TAGS.JSON_PROPERTY_NAME_MAP_OUT, obj, key, scheme);
            }
            // if the item is typed, then we excange the prototypes for each object as we deserialize. 
            // we do this in a funciton to minimize if statement chaos;
            var typedconversion = function (v, ser) { return v; };
            var skipForceType = false;
            if (meta.includes(JSON_TAGS.JSON_PROPERTY_TYPED_SKIP_FORCED)) {
                skipForceType = getMetadata(JSON_TAGS.JSON_PROPERTY_TYPED_SKIP_FORCED, obj, key, scheme);
            }
            if (meta.includes(JSON_TAGS.JSON_PROPERTY_TYPED) && !skipForceType) {
                typedconversion = function (v, ser) {
                    // get prototypes;
                    var during = (getMetadata(JSON_TAGS.JSON_PROPERTY_TYPED, obj, key, scheme)).prototype;
                    var before = getPrototype(v);
                    // set prototype serialize then set prototype back 
                    setPrototype(v, during);
                    var r = ser(v);
                    setPrototype(v, before);
                    // done
                    return r;
                };
            }
            // if there is a mapping function
            var out = null;
            if (meta.includes(JSON_TAGS.JSON_PROPERTY_FUNC_MAP_OUT)) {
                var outFunction_1 = getMetadata(JSON_TAGS.JSON_PROPERTY_FUNC_MAP_OUT, obj, key, scheme);
                var _outF = function (o1) { return outFunction_1(o1, function (o2) { return typedconversion(o2, function (o3) { return JSONHandler.serializeRaw(o3, scheme, parentName + ':' + key); }); }); };
                out = _outF(obj[key]);
            }
            else if (meta.includes(JSON_TAGS.JSON_PROPERTY_FORCE_ARRAY)) {
                out = [];
                if (obj[key]) {
                    if (Array.isArray(obj[key])) {
                        var _loop_2 = function (j) {
                            var e = typedconversion(obj[key][j], function (o) { return JSONHandler.serializeRaw(o, scheme, parentName + ':[' + j + ']:' + key); });
                            out.push(e);
                        };
                        for (var j = 0; j < obj[key].length; j++) {
                            _loop_2(j);
                        }
                    }
                    else {
                        out.push(typedconversion(obj[key], function (o) { return JSONHandler.serializeRaw(o, scheme, parentName + ':' + key); }));
                    }
                }
            }
            else {
                out = typedconversion(obj[key], function (o) { return JSONHandler.serializeRaw(o, scheme, parentName + ':' + key); });
            }
            // HANDLE Force Typing
            if (meta.includes(JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE)) {
                var typekey_1 = getMetadata(JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE, obj, key, scheme);
                var convFunc = function (e) { return JSONHandler.deserializeAndForceSimple(typekey_1, e, scheme); };
                if (meta.includes(JSON_TAGS.JSON_PROPERTY_FORCE_ARRAY)) {
                    var temp = out;
                    var newout = [];
                    for (var i_1 = 0; i_1 < temp.length; i_1++) {
                        newout.push(convFunc(temp[i_1]));
                    }
                    out = newout;
                }
                else {
                    out = convFunc(obj[key]);
                }
            }
            result[PropertyName] = out;
        };
        for (var i = 0; i < propertyNames.length; i++) {
            _loop_1(i);
        }
        // if there is an After serialize function get it and run it. 
        if (ObjectMeta.includes(JSON_TAGS.JSON_OBJECT_ON_AFTER_SERIALIZATION_BEFORE_STRING)) {
            var f = getOwnMetaData(JSON_TAGS.JSON_OBJECT_ON_AFTER_SERIALIZATION_BEFORE_STRING, obj, scheme);
            if (f)
                f(result);
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
        if (Array.isArray(json)) {
            var arr = [];
            for (var i = 0; i < json.length; i++) {
                arr.push(this.deserializeRaw(target, json[i], scheme));
            }
            return arr;
        }
        else {
            return this.deserializeRaw(target, json, scheme);
        }
    };
    JSONHandler.deserializeAndForceSimple = function (typekey, obj, scheme) {
        if (scheme === void 0) { scheme = BASE_SCHEME; }
        var out = obj;
        var convFunc = function (e) { return e; };
        switch (typekey) {
            case JSON_BASETYPES.bool:
                convFunc = function (input) { return Boolean(input); };
                break;
            case JSON_BASETYPES.string:
                if (obj == null)
                    return "";
                if (typeof obj == 'string') {
                    //const str = obj.replaceAll("<<dp>>",'\\"');
                    return obj;
                }
                else if (Array.isArray(obj)) {
                    var str = JSON.stringify(obj);
                    //str = str.replaceAll("<<dp>>",'\\"');
                    return str;
                }
                else if (typeof obj == 'object') {
                    if (hasMetaData(obj, scheme)) {
                        return JSONHandler.serialize(obj, scheme);
                    }
                    else {
                        //let str = JSON.stringify(obj);
                        //str = str.replaceAll('\\"',"<<dp>>");
                        //return str
                        return JSON.stringify(obj);
                    }
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
        // EVENT ON AFTER DESERIALIZE
        var ObjectMeta = getOwnMetaDataKeys(target);
        if (ObjectMeta.includes(JSON_TAGS.JSON_OBJECT_ON_BEFORE_DE_SERIALIZATION)) {
            // get meta data function and run it on the resulting object
            var f = getOwnMetaData(JSON_TAGS.JSON_OBJECT_ON_BEFORE_DE_SERIALIZATION, result, scheme);
            if (f)
                result = f(result, obj);
            // incase the Before has changed the type 
            if (!JSONHandler.areSamePrototypes(result, target)) {
                target = getPrototype(result).constructor;
            }
        }
        // get propertynames and loop through 
        var propertyNames = Object.getOwnPropertyNames(obj);
        var _loop_3 = function (i) {
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
                else if (meta.includes(JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE)) {
                    var typeKey = getMetadata(JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE, target, key, scheme);
                    out = JSONHandler.deserializeAndForceSimple(typeKey, obj[inKey]);
                }
                else {
                    out = obj[inKey];
                }
            }
            result[PropertyName] = out;
        };
        for (var i = 0; i < propertyNames.length; i++) {
            _loop_3(i);
        }
        // EVENT ON AFTER DESERIALIZE
        ObjectMeta = getOwnMetaDataKeys(result);
        // if there is an After serialize function get it and run it. 
        if (ObjectMeta.includes(JSON_TAGS.JSON_OBJECT_ON_AFTER_DE_SERIALIZATION)) {
            // get meta data function and run it on the resulting object
            var f = getOwnMetaData(JSON_TAGS.JSON_OBJECT_ON_AFTER_DE_SERIALIZATION, result, scheme);
            if (f)
                f(result);
        }
        return result;
    };
    JSONHandler.changePrototype = function (target, source) {
        var prototype = getPrototype(source);
        setPrototype(target, prototype);
    };
    JSONHandler.areSamePrototypes = function (target, source) {
        var prototype1 = getPrototype(source);
        var prototype2 = getPrototype(target);
        return prototype1 == prototype2;
    };
    return JSONHandler;
}());
export { JSONHandler };
