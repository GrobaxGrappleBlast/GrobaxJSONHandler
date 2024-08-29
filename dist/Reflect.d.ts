import { Constructor } from "./JsonModuleConstants";
export declare class Reflect {
    static getPrototype(obj: object | Constructor<any>): any;
    static setPrototype(obj: any, prototype: any): void;
    private static getOrCreateAllMetaData;
    private static getOrCreateDefinedMetaData;
    static getMetadataKeys(obj: any, key: any, scheme?: string): string[];
    static getOwnMetaDataKeys(obj: any, scheme?: string): string[];
    static getMetadata(metaTag: any, target: any, propertyKey: any, scheme?: string): any;
    static getOwnMetaData(metaTag: any, target: any, scheme?: string): any;
    static defineMetaData(metaTag: any, data: any, target: any, propertyKey: any, scheme?: string): void;
    static defineOwnMetaData(metaTag: any, data: any, target: any, scheme?: string): void;
    static hasMetaData(metaTag: any, target: any, key: any, scheme?: string): any;
    static hasOwnMetaData(metaTag: any, target: any, scheme?: string): any;
    static getAllMeta(obj: any, scheme?: string | null): any;
}
