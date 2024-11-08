import { JSON_BASETYPES, Constructor } from "./JsonModuleConstants";
export interface propertyJSONInnerOptions<IN extends object, OUT extends object> extends JSONPropertyOptions {
    /**method to run on out and in. */
    mappingFunctions?: {
        out: (t: IN, serialize?: any) => OUT;
        in: (b: OUT, deserialize?: any) => IN;
    };
    /**if this should force the type (class) */
    type?: any;
    /**if it should force the value to be a string|number|boolean */
    forceBaseType?: false | keyof typeof JSON_BASETYPES;
}
export interface propertiesJsonMapping<IN extends object, OUT extends object> {
    /**what scheme this belongs to */
    scheme?: string[] | string;
    /**the function to operate the data, before going out */
    inFunction: (b: OUT, deserialize?: any) => IN;
    /** the function to operate the data, before going in */
    outFunction: (t: IN, serialize?: any) => OUT;
    /**if this should force the type (class) */
    type?: Constructor<IN>;
    option?: propertyJSONInnerOptions<IN, OUT>;
}
export interface propertiesSpecialRecordArrayMapping<IN extends object, OUT extends object> extends propertyJSONInnerOptions<IN, OUT> {
    /**what scheme this belongs to */
    scheme?: string[] | string;
    /**
     * what is the key on the object, that should be used as record key,
     * This can also be a method, but must be a method with no parameters
     */
    KeyPropertyName: string;
}
export interface propertiesJsonObject {
    scheme?: string[] | string;
    onBeforeSerialization?: (self: any) => any;
    onBeforeDeSerialization?: (resultingObj: any, jsonObject: any) => object;
    onAfterDeSerialization?: (self: any) => any;
    onAfterSerialization?: (self: any) => any;
    onAfterSerialization_beforeString?: (self: any) => any;
}
export interface JSONPropertyOptions {
    /**method to run on out and in. */
    mappingFunctions?: {
        out: (t: any, serialize?: any) => any;
        in: (b: any, deserialize?: any) => any;
    };
    /**what scheme this property belongs to */
    scheme?: string[] | string;
    /** what name its going out as and coming in as */
    name?: string;
    /**if this should be forced to an array */
    isArray?: boolean;
    /** skip any forcing of types when serializing */
    skipForceType?: boolean;
}
/**
 * This is the base property, this is the property that other properties use.
 * it is recommended that you use the more specifik properties when possible
*/
export declare function JsonProperty(option?: propertyJSONInnerOptions<any, any>): (target: any, propertyKey: string) => void;
/**
 * This is the base property, that ensure what ever is deserialized|serialized is an array
*/
export declare function JsonArrayProperty(option?: JSONPropertyOptions): (target: any, propertyKey: string) => void;
/**
 * This is a property that converts to a number
 */
export declare function JsonNumber(option?: JSONPropertyOptions): (target: any, propertyKey: string) => void;
/**
 * This is a property that converts to a string
 */
export declare function JsonString(option?: JSONPropertyOptions): (target: any, propertyKey: string) => void;
/**
 * This is a property that converts to a boolean
 */
export declare function JsonBoolean(option?: JSONPropertyOptions): (target: any, propertyKey: string) => void;
/**
 * This is a property that converts to a class instance,
 * when deserilizing it will be created through the constructor.
 * when serializign it will force it through the prototype.
 */
export declare function JsonClassTyped<T extends object>(type: Constructor<T>, option?: JSONPropertyOptions): (target: any, propertyKey: string) => void;
/**
 * This is a property that converts to a number array
 */
export declare function JsonArrayNumber(option?: JSONPropertyOptions): (target: any, propertyKey: string) => void;
/**
 * This is a property that converts to a string array
 */
export declare function JsonArrayString(option?: JSONPropertyOptions): (target: any, propertyKey: string) => void;
/**
 * This is a property that converts to a boolean array
 */
export declare function JsonArrayBoolean(option?: JSONPropertyOptions): (target: any, propertyKey: string) => void;
/**
 * This is a property that converts to a classinstance array
 * when deserilizing it will be created through the constructor.
 * when serializign it will force it through the prototype.
 */
export declare function JsonArrayClassTyped<T extends object>(type: Constructor<T>, option?: JSONPropertyOptions): (target: any, propertyKey: string) => void;
/**
 * This is a property that helps ease mapping something in and out
 */
export declare function JsonMapping<IN extends object, OUT extends object>(params: propertiesJsonMapping<IN, OUT>): (target: any, propertyKey: string) => void;
/**
 * This is a property to ease the action of having a record in the system but an array in the json
 */
export declare function JsonMappingRecordInArrayOut<IN extends object, OUT extends object>(option: propertiesSpecialRecordArrayMapping<IN, OUT>): (target: any, propertyKey: string) => void;
export declare function JsonObject(option: propertiesJsonObject): (target: any) => void;
