import { BASE_SCHEME, Constructor } from "./JsonModuleConstants";


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
export class Reflect { 
 
 
	public static getPrototype( obj : object | Constructor<any>){
		let a
		if( typeof obj == 'function'){
			a = obj.prototype
		}else{
			a = obj.constructor.prototype
		}
		return a;
	}
	public static setPrototype(obj , prototype){
 
		//Object.setPrototypeOf( obj , prototype )
		if( typeof obj == 'function'){
			throw new Error('Not Implemented Error, please report the scenario to me');
		} 
		else{
			Object.setPrototypeOf( obj , prototype )
		}
	}

	private static getOrCreateAllMetaData(obj : Constructor<any> | object ,create = false){
		let a = Reflect.getPrototype(obj); 
		if ( a === Object.prototype) {
			return null;
		}

		if(a == null)
			return null;
   
		if(!(a['gjmd'])){
			if(!create)
				return null;
			a['gjmd'] = {};
		}
		return a['gjmd'];
	}
	private static getOrCreateDefinedMetaData(obj : Constructor<any> | object , scheme , create = false ){
		let a = Reflect.getOrCreateAllMetaData(obj,create);
		if(!a)
			return null;
 
		if(!(a[scheme])){
			if(!create)
				return null;
			a[scheme] = {};
		}
 
		return a[scheme];
	}
	
	// KEYS --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
	public static getMetadataKeys	(obj, key ,scheme = BASE_SCHEME){
		let a = Reflect.getOrCreateDefinedMetaData(obj,scheme);
		if(!a || !a[key]){
			return [];
		}
		

		return Object.keys(a[key]);
	}
	public static getOwnMetaDataKeys	(obj, scheme = BASE_SCHEME){
		return Reflect.getMetadataKeys(obj, selfKey,scheme);
	} 

	// GET --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
	public static getMetadata		(metaTag, target, propertyKey, scheme = BASE_SCHEME ){
		let a = Reflect.getOrCreateDefinedMetaData(target,scheme);
		if ( !a[propertyKey] )
			return null;

		return a[propertyKey][metaTag] ?? null;
	}
	public static getOwnMetaData	(metaTag, target, scheme = BASE_SCHEME){
		return Reflect.getMetadata(metaTag,target,selfKey,scheme);
	} 
 
	// DEFINE --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
	public static defineMetaData	(metaTag, data, target, propertyKey, scheme = BASE_SCHEME ){ 
		let a = Reflect.getOrCreateDefinedMetaData(target,scheme,true); 
		if(!a[propertyKey])
			a[propertyKey] = {};

		a[propertyKey][metaTag] = data; 
	}
	public static defineOwnMetaData	(metaTag, data, target, scheme = BASE_SCHEME ){
		return  Reflect.defineMetaData(metaTag, data, target, selfKey , scheme ); 
	}

	// has --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
	public static hasMetaData	(metaTag,target,key,scheme = BASE_SCHEME ){
		let a = Reflect.getOrCreateDefinedMetaData(target,scheme);
		if(a == null)
			return false;
 
	
		if(!(a[key]))
			return false;
 
		return a[key][metaTag] ?? false 

	}
	public static hasOwnMetaData	(metaTag , target, scheme = BASE_SCHEME ){
		return Reflect.hasMetaData(metaTag,target,selfKey,scheme); 
	}

	public static getAllMeta(obj, scheme? : string|null ){
		if (scheme){
			return Reflect.getOrCreateDefinedMetaData(obj,scheme);
		}
		else{
			return Reflect.getOrCreateAllMetaData(obj,true);
		} 
	}
}	

