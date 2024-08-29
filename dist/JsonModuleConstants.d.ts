export declare const BASE_SCHEME = "_base";
export interface IOutputHandler {
    outError(msg: any): any;
    outLog(msg: any): any;
}
export declare const NoOutput: IOutputHandler;
export declare enum JSON_TAGS {
    JSON_PROPERTY = "JSON_PROPERTY",
    JSON_PROPERTY_TYPED = "JSON_PROPERTY_TYPED",
    JSON_PROPERTY_NAME_MAP_IN = "JSON_PROPERTY_NAME_MAP_IN",
    JSON_PROPERTY_NAME_MAP_OUT = "JSON_PROPERTY_NAME_MAP_OUT",
    JSON_PROPERTY_FUNC_MAP_IN = "JSON_PROPERTY_FUNC_MAP_IN",
    JSON_PROPERTY_FUNC_MAP_OUT = "JSON_PROPERTY_FUNC_MAP_OUT",
    JSON_PROPERTY_FORCE_BASE_TYPE = "JSON_PROPERTY_FORCE_BASE_TYPE",
    JSON_PROPERTY_FORCE_ARRAY = "JSON_PROPERTY_FORCE_ARRAY",
    JSON_OBJECT_ON_AFTER_DE_SERIALIZATION = "JSON_OBJECT_AFTER_DE_SERIALIZATION",
    JSON_OBJECT_ON_BEFORE_SERIALIZATION = "JSON_OBJECT_ON_BEFORE_SERIALIZATION"
}
export declare enum JSON_BASETYPES {
    string = "string",
    bool = "bool",
    number = "number"
}
export type Constructor<T extends object> = new () => T;