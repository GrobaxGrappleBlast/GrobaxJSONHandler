"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonProperty = JsonProperty;
exports.JsonArrayProperty = JsonArrayProperty;
exports.JsonNumber = JsonNumber;
exports.JsonString = JsonString;
exports.JsonBoolean = JsonBoolean;
exports.JsonClassTyped = JsonClassTyped;
exports.JsonArrayNumber = JsonArrayNumber;
exports.JsonArrayString = JsonArrayString;
exports.JsonArrayBoolean = JsonArrayBoolean;
exports.JsonArrayClassTyped = JsonArrayClassTyped;
exports.JsonMapping = JsonMapping;
exports.JsonMappingRecordInArrayOut = JsonMappingRecordInArrayOut;
exports.JsonObject = JsonObject;
const JsonModuleConstants_1 = require("./JsonModuleConstants");
const JsonModuleBaseFunction_1 = require("./JsonModuleBaseFunction");
function cleanNonAccesibleSettings(option) {
    if (!option)
        return {};
    if (!option.scheme || option.scheme.length == 0)
        option.scheme = [JsonModuleConstants_1.BASE_SCHEME];
    //(option as any).mappingFunctions	= null;
    option.type = null;
    option.isArray = null;
    option.forceBaseType = null;
    return option;
}
/**
 * This is the base property, this is the property that other properties use.
 * it is recommended that you use the more specifik properties when possible
*/
function JsonProperty(option) {
    return function (target, propertyKey) {
        let schemes;
        if (!(option === null || option === void 0 ? void 0 : option.scheme)) {
            schemes = [JsonModuleConstants_1.BASE_SCHEME];
        }
        else if (Array.isArray(option.scheme)) {
            if (option.scheme.length == 0) {
                schemes = [JsonModuleConstants_1.BASE_SCHEME];
            }
            else {
                schemes = option.scheme;
            }
        }
        else {
            schemes = [option.scheme];
        }
        for (let i = 0; i < schemes.length; i++) {
            const scheme = schemes[i];
            (0, JsonModuleBaseFunction_1.setMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY, true, target, propertyKey, scheme);
            if (!option) {
                return;
            }
            if (option.forceBaseType) {
                switch (option.forceBaseType) {
                    case JsonModuleConstants_1.JSON_BASETYPES.string:
                    case JsonModuleConstants_1.JSON_BASETYPES.number:
                    case JsonModuleConstants_1.JSON_BASETYPES.bool:
                        (0, JsonModuleBaseFunction_1.setMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE, option.forceBaseType, target, propertyKey, scheme);
                }
            }
            if (option.isArray) {
                (0, JsonModuleBaseFunction_1.setMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FORCE_ARRAY, true, target, propertyKey, scheme);
            }
            if (option.name) {
                (0, JsonModuleBaseFunction_1.setMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_NAME_MAP_IN, propertyKey, target, option.name, scheme);
                (0, JsonModuleBaseFunction_1.setMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_NAME_MAP_OUT, option.name, target, propertyKey, scheme);
            }
            if (option.mappingFunctions) {
                (0, JsonModuleBaseFunction_1.setMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FUNC_MAP_IN, option.mappingFunctions.in, target, propertyKey, scheme);
                (0, JsonModuleBaseFunction_1.setMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_FUNC_MAP_OUT, option.mappingFunctions.out, target, propertyKey, scheme);
            }
            if (option.type) {
                (0, JsonModuleBaseFunction_1.setMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_TYPED, option.type, target, propertyKey, scheme);
            }
            if (option.skipForceType) {
                (0, JsonModuleBaseFunction_1.setMetadata)(JsonModuleConstants_1.JSON_TAGS.JSON_PROPERTY_TYPED_SKIP_FORCED, true, target, propertyKey, scheme);
            }
        }
    };
}
/**
 * This is the base property, that ensure what ever is deserialized|serialized is an array
*/
function JsonArrayProperty(option) {
    option = cleanNonAccesibleSettings(option);
    option.isArray = true;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a number
 */
function JsonNumber(option) {
    option = cleanNonAccesibleSettings(option);
    option.forceBaseType = JsonModuleConstants_1.JSON_BASETYPES.number;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a string
 */
function JsonString(option) {
    option = cleanNonAccesibleSettings(option);
    option.forceBaseType = JsonModuleConstants_1.JSON_BASETYPES.string;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a boolean
 */
function JsonBoolean(option) {
    option = cleanNonAccesibleSettings(option);
    option.forceBaseType = JsonModuleConstants_1.JSON_BASETYPES.bool;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a class instance,
 * when deserilizing it will be created through the constructor.
 * when serializign it will force it through the prototype.
 */
function JsonClassTyped(type, option) {
    option = cleanNonAccesibleSettings(option);
    option.type = type;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a number array
 */
function JsonArrayNumber(option) {
    option = cleanNonAccesibleSettings(option);
    option.forceBaseType = JsonModuleConstants_1.JSON_BASETYPES.number;
    option.isArray = true;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a string array
 */
function JsonArrayString(option) {
    option = cleanNonAccesibleSettings(option);
    option.forceBaseType = JsonModuleConstants_1.JSON_BASETYPES.string;
    option.isArray = true;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a boolean array
 */
function JsonArrayBoolean(option) {
    option = cleanNonAccesibleSettings(option);
    option.forceBaseType = JsonModuleConstants_1.JSON_BASETYPES.bool;
    option.isArray = true;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a classinstance array
 * when deserilizing it will be created through the constructor.
 * when serializign it will force it through the prototype.
 */
function JsonArrayClassTyped(type, option) {
    option = cleanNonAccesibleSettings(option);
    option.isArray = true;
    option.type = type;
    return JsonProperty(option);
}
/**
 * This is a property that helps ease mapping something in and out
 */
function JsonMapping(params) {
    var _a;
    // clean the input.
    let option = cleanNonAccesibleSettings((_a = params.option) !== null && _a !== void 0 ? _a : {});
    // set the type
    if (params.type)
        option.type = params.type;
    // Set mapping functions 
    option.mappingFunctions = {
        out: params.outFunction,
        in: params.inFunction,
    };
    return JsonProperty(option);
}
/**
 * This is a property to ease the action of having a record in the system but an array in the json
 */
function JsonMappingRecordInArrayOut(option) {
    // clean the input.
    let type = option.type;
    option = cleanNonAccesibleSettings(option !== null && option !== void 0 ? option : {});
    let outfunc = (col, s) => { return Object.values(col).map(p => s(p)); };
    let infunc = (col, d) => {
        let r = {};
        // @ts-ignore
        col.map(p => {
            let o = d(p);
            let v = o[option.KeyPropertyName];
            if (typeof v == 'function') {
                try {
                    v = o[option.KeyPropertyName]();
                    if (v === null || v === undefined) {
                        throw new Error(`after calling function ${option.KeyPropertyName} key value was '${v}' `);
                    }
                }
                catch (e) {
                    let messageAddon = v.length > 0 ? ', Note that message must have 0 Arguments, that arent either optional or have default values' : '';
                    let message = `Something went wrong with callign method '${option.KeyPropertyName}'${messageAddon}`;
                    throw new Error(message);
                }
            }
            r[v] = o;
        });
        return r;
    };
    if (type) {
        option.type = type;
    }
    // Set mapping functions 
    option.mappingFunctions = {
        out: outfunc,
        in: infunc,
    };
    return JsonProperty(option);
}
function cleanObjectOptions(option) {
    if (!option)
        option = {};
    if (!option.onAfterDeSerialization) {
        option.onAfterDeSerialization = (o) => { };
    }
    if (!option.scheme || option.scheme.length == 0)
        option.scheme = [JsonModuleConstants_1.BASE_SCHEME];
    return option;
}
function JsonObject(option) {
    option = cleanObjectOptions(option);
    return function (target) {
        let schemes = option === null || option === void 0 ? void 0 : option.scheme;
        if (!schemes || schemes.length == 0)
            schemes = [JsonModuleConstants_1.BASE_SCHEME];
        for (let i = 0; i < schemes.length; i++) {
            const scheme = schemes[i];
            // SERIALIZATION 
            if (option.onAfterDeSerialization)
                (0, JsonModuleBaseFunction_1.setOwnMetaData)(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_AFTER_DE_SERIALIZATION, target, option.onAfterDeSerialization, scheme);
            if (option.onAfterSerialization_beforeString)
                (0, JsonModuleBaseFunction_1.setOwnMetaData)(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_AFTER_SERIALIZATION_BEFORE_STRING, target, option.onAfterSerialization_beforeString, scheme);
            if (option.onAfterSerialization)
                (0, JsonModuleBaseFunction_1.setOwnMetaData)(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_AFTER_SERIALIZATION, target, option.onAfterSerialization, scheme);
            // DE SERIALIZATION 
            if (option.onBeforeSerialization)
                (0, JsonModuleBaseFunction_1.setOwnMetaData)(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_BEFORE_SERIALIZATION, target, option.onBeforeSerialization, scheme);
            if (option.onBeforeDeSerialization)
                (0, JsonModuleBaseFunction_1.setOwnMetaData)(JsonModuleConstants_1.JSON_TAGS.JSON_OBJECT_ON_BEFORE_DE_SERIALIZATION, target, option.onBeforeDeSerialization, scheme);
        }
    };
}
