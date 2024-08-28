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

	// structure is 
	// OLD : prototype > MetaDataTagName > scheme > key > value 
	// prototype > MetaDataTagName > scheme > key > tag > value 
	private static isPrototype( a : any){
		return a && typeof a === 'object' && a.constructor === Object;
	}
	private static getOrCreateDefinedMetaData(obj : Constructor<any> | object ,scheme, create = false ){
		let a
		if( typeof obj == 'function'){
			a = obj.prototype
		}else{
			a = obj.constructor.prototype
		}
		 
		
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

		if(!(a['gjmd'][scheme])){
			if(!create)
				return null;
			a['gjmd'][scheme] = {};
		}
 
		return a['gjmd'][scheme];
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

	public static getAllMeta(obj, scheme = BASE_SCHEME ){
		return Reflect.getOrCreateDefinedMetaData(obj,scheme);
	}
}	
