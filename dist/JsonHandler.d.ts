import type { IOutputHandler } from "./JsonModuleConstants";
import { type Constructor } from "./JsonModuleConstants";
export declare class JSONHandler {
    static serialize(obj: any, scheme?: string): string;
    private static serializeRaw;
    static deserialize<T extends object>(target: Constructor<T>, json: any, scheme?: string, writeOut?: IOutputHandler): any;
    private static deserializeAndForceSimple;
    private static deserializeRaw;
}
