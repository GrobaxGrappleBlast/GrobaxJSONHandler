import { BASE_SCHEME, JSON_BASETYPES, JSON_TAGS } from "./JsonModuleConstants";
import { setMetadata, setOwnMetaData } from "./JsonModuleBaseFunction";
function cleanNonAccesibleSettings(option) {
    if (!option)
        return {};
    if (!option.scheme || option.scheme.length == 0)
        option.scheme = [BASE_SCHEME];
    option.mappingFunctions = null;
    option.type = null;
    option.isArray = null;
    option.forceBaseType = null;
    return option;
}
/**
 * This is the base property, this is the property that other properties use.
 * it is recommended that you use the more specifik properties when possible
*/
export function JsonProperty(option) {
    return function (target, propertyKey) {
        let schemes;
        if (!(option === null || option === void 0 ? void 0 : option.scheme)) {
            schemes = [BASE_SCHEME];
        }
        else if (Array.isArray(option.scheme)) {
            if (option.scheme.length == 0) {
                schemes = [BASE_SCHEME];
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
            setMetadata(JSON_TAGS.JSON_PROPERTY, true, target, propertyKey, scheme);
            if (!option) {
                return;
            }
            if (option.forceBaseType) {
                switch (option.forceBaseType) {
                    case JSON_BASETYPES.string:
                    case JSON_BASETYPES.number:
                    case JSON_BASETYPES.bool:
                        setMetadata(JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE, option.forceBaseType, target, propertyKey, scheme);
                }
            }
            if (option.isArray) {
                setMetadata(JSON_TAGS.JSON_PROPERTY_FORCE_ARRAY, true, target, propertyKey, scheme);
            }
            if (option.name) {
                setMetadata(JSON_TAGS.JSON_PROPERTY_NAME_MAP_IN, propertyKey, target, option.name, scheme);
                setMetadata(JSON_TAGS.JSON_PROPERTY_NAME_MAP_OUT, option.name, target, propertyKey, scheme);
            }
            if (option.mappingFunctions) {
                setMetadata(JSON_TAGS.JSON_PROPERTY_FUNC_MAP_IN, option.mappingFunctions.in, target, propertyKey, scheme);
                setMetadata(JSON_TAGS.JSON_PROPERTY_FUNC_MAP_OUT, option.mappingFunctions.out, target, propertyKey, scheme);
            }
            if (option.type) {
                setMetadata(JSON_TAGS.JSON_PROPERTY_TYPED, option.type, target, propertyKey, scheme);
            }
        }
    };
}
/**
 * This is the base property, that ensure what ever is deserialized|serialized is an array
*/
export function JsonArrayProperty(option) {
    option = cleanNonAccesibleSettings(option);
    option.isArray = true;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a number
 */
export function JsonNumber(option) {
    option = cleanNonAccesibleSettings(option);
    option.forceBaseType = JSON_BASETYPES.number;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a string
 */
export function JsonString(option) {
    option = cleanNonAccesibleSettings(option);
    option.forceBaseType = JSON_BASETYPES.string;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a boolean
 */
export function JsonBoolean(option) {
    option = cleanNonAccesibleSettings(option);
    option.forceBaseType = JSON_BASETYPES.bool;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a class instance,
 * when deserilizing it will be created through the constructor.
 * when serializign it will force it through the prototype.
 */
export function JsonClassTyped(type, option) {
    option = cleanNonAccesibleSettings(option);
    option.type = type;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a number array
 */
export function JsonArrayNumber(option) {
    option = cleanNonAccesibleSettings(option);
    option.forceBaseType = JSON_BASETYPES.number;
    option.isArray = true;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a string array
 */
export function JsonArrayString(option) {
    option = cleanNonAccesibleSettings(option);
    option.forceBaseType = JSON_BASETYPES.string;
    option.isArray = true;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a boolean array
 */
export function JsonArrayBoolean(option) {
    option = cleanNonAccesibleSettings(option);
    option.forceBaseType = JSON_BASETYPES.bool;
    option.isArray = true;
    return JsonProperty(option);
}
/**
 * This is a property that converts to a classinstance array
 * when deserilizing it will be created through the constructor.
 * when serializign it will force it through the prototype.
 */
export function JsonArrayClassTyped(type, option) {
    option = cleanNonAccesibleSettings(option);
    option.isArray = true;
    option.type = type;
    return JsonProperty(option);
}
/**
 * This is a property that helps ease mapping something in and out
 */
export function JsonMapping(params) {
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
export function JsonMappingRecordInArrayOut(option) {
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
                    console.log(option.KeyPropertyName);
                    if (v === null || v === undefined) {
                        throw new Error(`after calling function ${option.KeyPropertyName} key value was '${v}' `);
                    }
                }
                catch (e) {
                    let messageAddon = v.length > 0 ? ', Note that message must have 0 Arguments, that arent either optional or have default values' : '';
                    let message = `Something went wrong with callign method '${option.KeyPropertyName}'${messageAddon}`;
                    console.error(e);
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
        option.scheme = [BASE_SCHEME];
    return option;
}
export function JsonObject(option) {
    option = cleanObjectOptions(option);
    return function (target) {
        let schemes = option === null || option === void 0 ? void 0 : option.scheme;
        if (!schemes || schemes.length == 0)
            schemes = [BASE_SCHEME];
        for (let i = 0; i < schemes.length; i++) {
            const scheme = schemes[i];
            if (option.onAfterDeSerialization)
                setOwnMetaData(JSON_TAGS.JSON_OBJECT_ON_AFTER_DE_SERIALIZATION, target, option.onAfterDeSerialization, scheme);
            if (option.onBeforeSerialization)
                setOwnMetaData(JSON_TAGS.JSON_OBJECT_ON_BEFORE_SERIALIZATION, target, option.onBeforeSerialization, scheme);
        }
    };
}
//# sourceMappingURL=Decorators.js.map