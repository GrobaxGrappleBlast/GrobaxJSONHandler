import "reflect-metadata";  
import { BASE_SCHEME, JSON_BASETYPES, JSON_TAGS , Constructor } from "./JsonModuleConstants";
import { setMetadata, setOwnMetaData } from "./JsonModuleBaseFunction";

function cleanNonAccesibleSettings( option?:JSONPropertyOptions ){
	if(!option)
		return {};

	option.scheme = option.scheme == '' ? BASE_SCHEME : option.scheme;
	option.scheme = option.scheme ?? BASE_SCHEME;

	(option as any).mappingFunctions	= null;
	(option as any).type 				= null;
	(option as any).isArray				= null;
	(option as any).forceBaseType		= null;
	return option;
}

export interface JSONPropertyOptions {
	/**what scheme this property belongs to */
	scheme?:string, 
	
	/** what name its going out as and coming in as */
	name?: string ,	

	/**if this should be forced to an array */
	isArray?:boolean 
}
interface JSONInnerPropertyOptions<IN extends object,OUT extends object> extends JSONPropertyOptions{
	
	/**method to run on out and in. */
	mappingFunctions? :{ out:( t:IN , serialize?:any ) => OUT , in:( b:OUT, deserialize?:any ) => IN } , 
	
	/**if this should force the type (class) */
	type?: any, 
	
	/**if it should force the value to be a string|number|boolean */
	forceBaseType?: false | keyof typeof JSON_BASETYPES 

}


/**
 * This is the base property, this is the property that other properties use.
 * it is recommended that you use the more specifik properties when possible
*/
export function JsonProperty( option?:JSONInnerPropertyOptions<any,any> ) { 

	return function (target: any, propertyKey: string ) {

		let scheme = option?.scheme ?? BASE_SCHEME;
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
		
	};
} 

/**
 * This is the base property, that ensure what ever is deserialized|serialized is an array
*/
export function JsonArrayProperty	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option); 
	( option as JSONInnerPropertyOptions<any,any>).isArray 		 = true;
	return JsonProperty(option);
}

/**
 * This is a property that converts to a number
 */
export function JsonNumber	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).forceBaseType = JSON_BASETYPES.number
	return JsonProperty(option);
}


/**
 * This is a property that converts to a string
 */
export function JsonString	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).forceBaseType = JSON_BASETYPES.string
	return JsonProperty(option);
}


/**
 * This is a property that converts to a boolean
 */
export function JsonBoolean	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).forceBaseType = JSON_BASETYPES.bool
	return JsonProperty(option);
}


/**
 * This is a property that converts to a class instance,
 * when deserilizing it will be created through the constructor. 
 * when serializign it will force it through the prototype.
 */
export function JsonClassTyped<T extends object>( type : Constructor<T> , option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).type 	= type;
	return JsonProperty(option);
}

/**
 * This is a property that converts to a number array
 */
export function JsonArrayNumber	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).forceBaseType = JSON_BASETYPES.number;
	( option as JSONInnerPropertyOptions<any,any>).isArray 		 = true;
	return JsonProperty(option);
}

/**
 * This is a property that converts to a string array
 */
export function JsonArrayString	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).forceBaseType = JSON_BASETYPES.string;
	( option as JSONInnerPropertyOptions<any,any>).isArray 		 = true;
	return JsonProperty(option);
}

/**
 * This is a property that converts to a boolean array
 */
export function JsonArrayBoolean	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).forceBaseType = JSON_BASETYPES.bool;
	( option as JSONInnerPropertyOptions<any,any>).isArray 		 = true;
	return JsonProperty(option);
}

/**
 * This is a property that converts to a classinstance array
 * when deserilizing it will be created through the constructor. 
 * when serializign it will force it through the prototype.
 */
export function JsonArrayClassTyped<T extends object>( type : Constructor<T> , option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).isArray 		= true;
	( option as JSONInnerPropertyOptions<any,any>).type			= type;
	return JsonProperty(option);
}


// Mappings
interface JsonMappingParameters<IN extends object,OUT extends object>{
	
	/**what scheme this belongs to */
	scheme?:string, 

	/**the function to operate the data, before going out */
	inFunction:( b:OUT, deserialize?:any ) => IN, 

	/** the function to operate the data, before going in */
	outFunction:( t:IN , serialize?:any ) => OUT , 

	/**if this should force the type (class) */
	type? : Constructor<IN>, 
	option? : JSONInnerPropertyOptions<IN,OUT> 
}


/**
 * This is a property that helps ease mapping something in and out
 */
export function JsonMapping<IN extends object,OUT extends object>( params : JsonMappingParameters<IN,OUT> ){
	// clean the input.
	let option : JSONInnerPropertyOptions<IN,OUT> = cleanNonAccesibleSettings(params.option ?? ({} as JSONInnerPropertyOptions<IN,OUT>)) as JSONInnerPropertyOptions<IN,OUT>;
	
	// set the type
	if(params.type)
		option.type = params.type;
	
	// Set mapping functions 
	(option as JSONInnerPropertyOptions<IN,OUT>).mappingFunctions = {
		out:params.outFunction,
		in:params.inFunction, 
	}
	return JsonProperty(option);
}

interface specialRecordArrayMappingProperties<IN extends object,OUT extends object> extends JSONInnerPropertyOptions<IN,OUT>{
	
	/**what scheme this belongs to */
	scheme?:string,

	/** 
	 * what is the key on the object, that should be used as record key,
	 * This can also be a method, but must be a method with no parameters 
	 */
	KeyPropertyName:string,
}


/**
 * This is a property to ease the action of having a record in the system but an array in the json
 */
export function JsonMappingRecordInArrayOut<IN extends object,OUT extends object>( option : specialRecordArrayMappingProperties<IN,OUT> ){
	// clean the input.
	let type = option.type;
	option = cleanNonAccesibleSettings(option ?? ({} as JSONInnerPropertyOptions<IN,OUT>)) as specialRecordArrayMappingProperties<IN,OUT>;
	let outfunc = ( col : IN , s ) => { return Object.values(col).map( p => s(p) ) as OUT };
	let infunc = ( col: OUT , d ) => { 
		let r = {};
		// @ts-ignore
		col.map( p =>{ 
			let o = d(p); 
			let v = o[option.KeyPropertyName]; 
			if(typeof v == 'function'){
				try{
					v = o[option.KeyPropertyName]();
				}catch(e){
					let messageAddon = v.length > 0 ? ', Note that message must have 0 Arguments, that arent either optional or have default values': ''; 
					let message = `Something went wrong with callign method '${option.KeyPropertyName}'${messageAddon}`
					console.error(e);
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

interface JsonObjectProperties {
	scheme?:string,
	onBeforeSerialization?:(self:any) => any,
	onAfterDeSerialization?: ( self:any ) => any
}
function cleanObjectOptions( option?:JsonObjectProperties ){

	if(!option)
		option = {};

	if(!option.onAfterDeSerialization){
		option.onAfterDeSerialization = ( o ) => {};
	}

	if(option.scheme == '')
		option.scheme = undefined;
	option.scheme = option.scheme ?? BASE_SCHEME;
	return option;
}
export function JsonObject( option : JsonObjectProperties){
	option = cleanObjectOptions(option);
	return function (target: any ) {
		
		if(option.onAfterDeSerialization)
			setOwnMetaData( JSON_TAGS.JSON_OBJECT_ON_AFTER_DE_SERIALIZATION	, target , option.onAfterDeSerialization , option.scheme );

		if(option.onBeforeSerialization)
			setOwnMetaData( JSON_TAGS.JSON_OBJECT_ON_BEFORE_SERIALIZATION	, target , option.onBeforeSerialization , option.scheme );

	}
}
