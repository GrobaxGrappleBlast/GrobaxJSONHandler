import { BASE_SCHEME } from "./JsonModuleConstants";


function createGuid () {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
	.replace(/[xy]/g, function (c) {
		const r = Math.random() * 16 | 0, 
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
const selfKey = createGuid() + "SELF";
const MetaDataTagName = 'gjmd' // Grobax Json Meta Data;
export class Reflect2 {


	private static getOrCreateDefinedMetaData(obj,scheme, ...args){
		let a = Object.getPrototypeOf(obj)
		if(a == undefined)
			return;

		if(!(a.__proto__[MetaDataTagName]))
			a.__proto__[MetaDataTagName] = {};

		if(!(a.__proto__[MetaDataTagName][scheme]))
			a.__proto__[MetaDataTagName][scheme] = {};

		let seg = a.__proto__[MetaDataTagName][scheme];
		for (let i = 0; i < args.length; i++) {
			const arg = args[i];
			if(!(seg[arg]))
				seg[arg] = {};
		}

		return a.__proto__[MetaDataTagName][scheme];
	}
	
	public static getMetaDataKeys	(obj, key ,propertyKey ,scheme = BASE_SCHEME){
		let a = Reflect2.getOrCreateDefinedMetaData(obj,scheme);
		return Object.keys(a);
	}
	public static getOwnMetaDataKeys	(obj, key, scheme = BASE_SCHEME){
		return Reflect2.getMetaDataKeys(obj,key,selfKey,scheme);
	}

	public static getMetaData		(metaTag, target, propertyKey, scheme = BASE_SCHEME ){
		let a = Reflect2.getOrCreateDefinedMetaData(target,scheme);
		if ( !a[propertyKey] )
			return null;

		return a[propertyKey][metaTag] ?? null;
	}
	public static getOwnMetaData	(metaTag, target, scheme = BASE_SCHEME){
		return Reflect2.getMetaData(metaTag,target,selfKey,scheme);
	}


	public static defineMetaData	(metaTag, data, target, propertyKey, scheme = BASE_SCHEME ){
		/*
			let a = Reflect2.getOrCreateDefinedMetaData(target,scheme);
			if ( !a[propertyKey] )
				return null;

			return a[propertyKey][metaTag] ?? null;
		*/
		
		
		let a = Reflect2.getOrCreateDefinedMetaData(target,scheme);


	}
	public static defineOwnMetaData	(metaTag, data, target, scheme = BASE_SCHEME ){
		let a = Reflect2.getOrCreateDefinedMetaData(target,scheme);

	}


}