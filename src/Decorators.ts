
import { BASE_SCHEME, JSON_BASETYPES, JSON_TAGS , Constructor } from "./JsonModuleConstants";
import { setMetadata, setOwnMetaData } from "./JsonModuleBaseFunction";

function cleanNonAccesibleSettings( option?:JSONPropertyOptions ){
	if(!option)
		return {};

	if(!option.scheme || option.scheme.length == 0)
		option.scheme = [BASE_SCHEME];

	(option as any).mappingFunctions	= null;
	(option as any).type 				= null;
	(option as any).isArray				= null;
	(option as any).forceBaseType		= null;
	return option;
}

export interface propertyJSONInnerOptions<IN extends object,OUT extends object> extends JSONPropertyOptions{
	
	/**method to run on out and in. */
	mappingFunctions? :{ out:( t:IN , serialize?:any ) => OUT , in:( b:OUT, deserialize?:any ) => IN } , 
	
	/**if this should force the type (class) */
	type?: any, 
	
	/**if it should force the value to be a string|number|boolean */
	forceBaseType?: false | keyof typeof JSON_BASETYPES 

} 
export interface propertiesJsonMapping<IN extends object,OUT extends object>{
	
	/**what scheme this belongs to */
	scheme?:string[] | string , 

	/**the function to operate the data, before going out */
	inFunction:( b:OUT, deserialize?:any ) => IN, 

	/** the function to operate the data, before going in */
	outFunction:( t:IN , serialize?:any ) => OUT , 

	/**if this should force the type (class) */
	type? : Constructor<IN>, 
	option? : propertyJSONInnerOptions<IN,OUT> 
}
export interface propertiesSpecialRecordArrayMapping<IN extends object,OUT extends object> extends propertyJSONInnerOptions<IN,OUT>{
	
	/**what scheme this belongs to */
	scheme?:string[] | string ,

	/** 
	 * what is the key on the object, that should be used as record key,
	 * This can also be a method, but must be a method with no parameters 
	 */
	KeyPropertyName:string,
}
export interface propertiesJsonObject {
	scheme?:string[] | string ,
	onBeforeSerialization?:(self:any) => any,
	onBeforeDeSerialization?:(self:any) => object,


	onAfterDeSerialization?: ( self:any ) => any,
	onAfterSerialization?: ( self:any ) => any,
	onAfterSerialization_beforeString?: ( self:any ) => any
	
}

export interface JSONPropertyOptions {
	/**what scheme this property belongs to */
	scheme?:string[] | string , 
	
	/** what name its going out as and coming in as */
	name?: string ,	

	/**if this should be forced to an array */
	isArray?:boolean 
}


/**
 * This is the base property, this is the property that other properties use.
 * it is recommended that you use the more specifik properties when possible
*/
export function JsonProperty( option?:propertyJSONInnerOptions<any,any> ) { 

	return function (target: any, propertyKey: string ) {

		let schemes;
		if (!option?.scheme){
			schemes = [BASE_SCHEME];
		}
		else if ( Array.isArray(option.scheme) ){
			if(option.scheme.length == 0){
				schemes = [BASE_SCHEME];
			}else{
				schemes = option.scheme;
			}
		}
		else{
			schemes = [option.scheme];
		}

 

		for (let i = 0; i < schemes.length; i++) {
			const scheme = schemes[i];
	
			setMetadata( JSON_TAGS.JSON_PROPERTY , true		, target, propertyKey, scheme );
			if(!option){
				return;
			} 

			if(option.forceBaseType){
				switch(option.forceBaseType){
					case JSON_BASETYPES.string: 
					case JSON_BASETYPES.number:
					case JSON_BASETYPES.bool:	
						setMetadata( 	JSON_TAGS.JSON_PROPERTY_FORCE_BASE_TYPE	,	option.forceBaseType,	target,	propertyKey, scheme 	);
				}
			}

			if(option.isArray){
				setMetadata( JSON_TAGS.JSON_PROPERTY_FORCE_ARRAY, true	, target, propertyKey , scheme);
			}	

			if(option.name){
				setMetadata( JSON_TAGS.JSON_PROPERTY_NAME_MAP_IN, propertyKey	, target, option.name, scheme);
				setMetadata( JSON_TAGS.JSON_PROPERTY_NAME_MAP_OUT, option.name	, target, propertyKey , scheme);
			}	

			if(option.mappingFunctions){
				setMetadata( JSON_TAGS.JSON_PROPERTY_FUNC_MAP_IN, option.mappingFunctions.in	, target, propertyKey , scheme);
				setMetadata( JSON_TAGS.JSON_PROPERTY_FUNC_MAP_OUT, option.mappingFunctions.out	, target, propertyKey , scheme);
			}	
	
			if(option.type){
				setMetadata( JSON_TAGS.JSON_PROPERTY_TYPED		, option.type	, target, propertyKey , scheme);
			}
		}
		
	};
} 

/**
 * This is the base property, that ensure what ever is deserialized|serialized is an array
*/
export function JsonArrayProperty	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option); 
	( option as propertyJSONInnerOptions<any,any>).isArray 		 = true;
	return JsonProperty(option);
}

/**
 * This is a property that converts to a number
 */
export function JsonNumber	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as propertyJSONInnerOptions<any,any>).forceBaseType = JSON_BASETYPES.number
	return JsonProperty(option);
}


/**
 * This is a property that converts to a string
 */
export function JsonString	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as propertyJSONInnerOptions<any,any>).forceBaseType = JSON_BASETYPES.string
	return JsonProperty(option);
}


/**
 * This is a property that converts to a boolean
 */
export function JsonBoolean	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as propertyJSONInnerOptions<any,any>).forceBaseType = JSON_BASETYPES.bool
	return JsonProperty(option);
}


/**
 * This is a property that converts to a class instance,
 * when deserilizing it will be created through the constructor. 
 * when serializign it will force it through the prototype.
 */
export function JsonClassTyped<T extends object>( type : Constructor<T> , option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as propertyJSONInnerOptions<any,any>).type 	= type;
	return JsonProperty(option);
}

/**
 * This is a property that converts to a number array
 */
export function JsonArrayNumber	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as propertyJSONInnerOptions<any,any>).forceBaseType = JSON_BASETYPES.number;
	( option as propertyJSONInnerOptions<any,any>).isArray 		 = true;
	return JsonProperty(option);
}

/**
 * This is a property that converts to a string array
 */
export function JsonArrayString	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as propertyJSONInnerOptions<any,any>).forceBaseType = JSON_BASETYPES.string;
	( option as propertyJSONInnerOptions<any,any>).isArray 		 = true;
	return JsonProperty(option);
}

/**
 * This is a property that converts to a boolean array
 */
export function JsonArrayBoolean	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as propertyJSONInnerOptions<any,any>).forceBaseType = JSON_BASETYPES.bool;
	( option as propertyJSONInnerOptions<any,any>).isArray 		 = true;
	return JsonProperty(option);
}

/**
 * This is a property that converts to a classinstance array
 * when deserilizing it will be created through the constructor. 
 * when serializign it will force it through the prototype.
 */
export function JsonArrayClassTyped<T extends object>( type : Constructor<T> , option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as propertyJSONInnerOptions<any,any>).isArray 		= true;
	( option as propertyJSONInnerOptions<any,any>).type			= type;
	return JsonProperty(option);
}




/**
 * This is a property that helps ease mapping something in and out
 */
export function JsonMapping<IN extends object,OUT extends object>( params : propertiesJsonMapping<IN,OUT> ){
	// clean the input.
	let option : propertyJSONInnerOptions<IN,OUT> = cleanNonAccesibleSettings(params.option ?? ({} as propertyJSONInnerOptions<IN,OUT>)) as propertyJSONInnerOptions<IN,OUT>;
	
	// set the type
	if(params.type)
		option.type = params.type;
	
	// Set mapping functions 
	(option as propertyJSONInnerOptions<IN,OUT>).mappingFunctions = {
		out:params.outFunction,
		in:params.inFunction, 
	}
	return JsonProperty(option);
}



/**
 * This is a property to ease the action of having a record in the system but an array in the json
 */
export function JsonMappingRecordInArrayOut<IN extends object,OUT extends object>( option : propertiesSpecialRecordArrayMapping<IN,OUT> ){
	// clean the input.
	let type = option.type;
	option = cleanNonAccesibleSettings(option ?? ({} as propertyJSONInnerOptions<IN,OUT>)) as propertiesSpecialRecordArrayMapping<IN,OUT>;
	let outfunc = ( col : IN , s ) => { return Object.values(col).map( p => s(p) ) as OUT };
	let infunc = ( col: OUT  , d ) => { 
		let r = {};
		// @ts-ignore
		col.map( p =>{ 
			let o = d(p); 
			let v = o[option.KeyPropertyName]; 
			if(typeof v == 'function'){
				try{
					v = o[option.KeyPropertyName](); 
					if(v === null || v === undefined){
						throw new Error(`after calling function ${option.KeyPropertyName} key value was '${v}' ` )
					}
				}catch(e){
					let messageAddon = v.length > 0 ? ', Note that message must have 0 Arguments, that arent either optional or have default values': ''; 
					let message = `Something went wrong with callign method '${option.KeyPropertyName}'${messageAddon}` 
					throw new Error(message);
				}
			}
			r[v] = o;
		});
		return r as IN;
	} 


	if(type){
		option.type = type;
	}

	// Set mapping functions 
	option.mappingFunctions = {
		out:outfunc,
		in:infunc, 
	}

	return JsonProperty(option);
}

function cleanObjectOptions( option?:propertiesJsonObject ){

	if(!option)
		option = {};

	if(!option.onAfterDeSerialization){
		option.onAfterDeSerialization = ( o ) => {};
	}

	if(!option.scheme || option.scheme.length == 0)
		option.scheme = [BASE_SCHEME];
 
	return option;
}
export function JsonObject( option : propertiesJsonObject){
	option = cleanObjectOptions(option);
	return function (target: any ) {
		
		let schemes = option?.scheme ;
		if (!schemes ||schemes.length==0)
			schemes = [BASE_SCHEME];

		for (let i = 0; i < schemes.length; i++) {
			const scheme = schemes[i];

			// SERIALIZATION 
			if(option.onAfterDeSerialization)
				setOwnMetaData( JSON_TAGS.JSON_OBJECT_ON_AFTER_DE_SERIALIZATION				, target , option.onAfterDeSerialization , scheme);

			if(option.onAfterSerialization_beforeString)
				setOwnMetaData( JSON_TAGS.JSON_OBJECT_ON_AFTER_SERIALIZATION_BEFORE_STRING	, target , option.onAfterSerialization_beforeString , scheme);

			if(option.onAfterSerialization)
				setOwnMetaData( JSON_TAGS.JSON_OBJECT_ON_AFTER_SERIALIZATION				, target , option.onAfterSerialization , scheme);


			// DE SERIALIZATION 
			if(option.onBeforeSerialization)
				setOwnMetaData( JSON_TAGS.JSON_OBJECT_ON_BEFORE_SERIALIZATION		, target , option.onBeforeSerialization , scheme );

			if(option.onBeforeDeSerialization)
				setOwnMetaData( JSON_TAGS.JSON_OBJECT_ON_BEFORE_DE_SERIALIZATION	, target , option.onBeforeDeSerialization , scheme );

		}
	}
}
