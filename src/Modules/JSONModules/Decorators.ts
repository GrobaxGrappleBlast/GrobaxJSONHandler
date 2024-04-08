import "reflect-metadata"; 

enum JSON_TAGS{
	JSON_PROPERTY				= "JsonProperty"				, 
	JSON_PROPERTY_TYPED 		= "JsonPropertyTyped"			, 
	JSON_PROPERTY_NAME_MAP_IN	= "JsonPropertyNameMapping_in"	,
	JSON_PROPERTY_NAME_MAP_OUT	= "JsonPropertyNameMapping_out"	,
	JSON_PROPERTY_FUNC_MAP_IN	= "JsonPropertyFuncMapping_in"	,
	JSON_PROPERTY_FUNC_MAP_OUT	= "JsonPropertyFuncMapping_out" ,
	JSON_PROPERTY_FORCE_BASE_TYPE	= "JsonPropertyForceBaseType" , 
	JSON_PROPERTY_FORCE_ARRAY 		= "JsonPropertyForceArray"	 , 
}
enum JSON_BASETYPES{
	string 	= 'string',
	bool 	= 'bool',
	number	= 'number'
}

type Constructor<T extends object> = new () => T;


export interface JSONPropertyOptions {
	name?: string ,
	isArray?:boolean
}
interface JSONInnerPropertyOptions<IN extends object,OUT extends object> extends JSONPropertyOptions{
	mappingFunctions? :{ out:( t:IN , serialize?:any ) => OUT , in:( b:OUT, deserialize?:any ) => IN } , 
	type?: any,
	forceBaseType?: false | keyof typeof JSON_BASETYPES
}

export function JsonProperty( option?:JSONInnerPropertyOptions<any,any> ) { 
	return function (target: any, propertyKey: string) {

		Reflect.defineMetadata( JSON_TAGS.JSON_PROPERTY						, true		, target, propertyKey);
		if(!option)
			return;

			
		if(option.forceBaseType){
			switch(option.forceBaseType){
				case JSON_BASETYPES.string: 
				case JSON_BASETYPES.number:
				case JSON_BASETYPES.bool:	
				Reflect.defineMetadata( 
					JSON_TAGS.JSON_PROPERTY_NAME_MAP_IN	,
					option.forceBaseType,
					target,
					propertyKey
				);
			}
		}

		if(option.name){
			Reflect.defineMetadata( JSON_TAGS.JSON_PROPERTY_NAME_MAP_IN		, propertyKey	, target, option.name);
			Reflect.defineMetadata( JSON_TAGS.JSON_PROPERTY_NAME_MAP_OUT	, option.name	, target, propertyKey);
		}	

		if(option.mappingFunctions){
			Reflect.defineMetadata( JSON_TAGS.JSON_PROPERTY_FUNC_MAP_IN	, option.mappingFunctions.in	, target, propertyKey );
			Reflect.defineMetadata( JSON_TAGS.JSON_PROPERTY_FUNC_MAP_OUT, option.mappingFunctions.out	, target, propertyKey);
		}	
 
		if(option.type){
			Reflect.defineMetadata( JSON_TAGS.JSON_PROPERTY_TYPED				, option.type	, target, propertyKey);
		}
		
	};
} 
function cleanNonAccesibleSettings( option?:JSONPropertyOptions ){
	(option as any).mappingFunctions	= null;
	(option as any).type 				= null;
	(option as any).isArray				= null;
	(option as any).forceBaseType		= null;
	return option;
}

export function JsonNumber	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).forceBaseType = JSON_BASETYPES.number
	return JsonProperty(option);
}
export function JsonString	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).forceBaseType = JSON_BASETYPES.string
	return JsonProperty(option);
}
export function JsonBoolean	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).forceBaseType = JSON_BASETYPES.bool
	return JsonProperty(option);
}
export function JsonClassTyped<T extends object>( type : Constructor<T> , option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).type 	= type;
	return JsonProperty(option);
}

export function JsonArrayNumber	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).forceBaseType = JSON_BASETYPES.number;
	( option as JSONInnerPropertyOptions<any,any>).isArray 		 = true;
	return JsonProperty(option);
}
export function JsonArrayString	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).forceBaseType = JSON_BASETYPES.string;
	( option as JSONInnerPropertyOptions<any,any>).isArray 		 = true;
	return JsonProperty(option);
}
export function JsonArrayBoolean	( option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).forceBaseType = JSON_BASETYPES.bool;
	( option as JSONInnerPropertyOptions<any,any>).isArray 		 = true;
	return JsonProperty(option);
}
export function JsonArrayClassTyped<T extends object>( type : Constructor<T> , option?:JSONPropertyOptions ){
	option = cleanNonAccesibleSettings(option);
	( option as JSONInnerPropertyOptions<any,any>).isArray 		= true;
	( option as JSONInnerPropertyOptions<any,any>).type			= type;
	return JsonProperty(option);
}
 
// Mappings
interface JsonMappingParameters<IN extends object,OUT extends object>{
	inFunction:( b:OUT, deserialize?:any ) => IN,
	outFunction:( t:IN , serialize?:any ) => OUT ,
	type? : Constructor<IN>,
	option? : JSONInnerPropertyOptions<IN,OUT>
}
export function JsonMapping<IN extends object,OUT extends object>( params : JsonMappingParameters<IN,OUT> ){
	// clean the input.
	let option : JSONInnerPropertyOptions<IN,OUT> = cleanNonAccesibleSettings(params.option ?? ({} as JSONInnerPropertyOptions<IN,OUT>)) as JSONInnerPropertyOptions<IN,OUT>;
	
	// set the type
	if(params.type)
		option.type = params.type;
	
	// Set mapping functions 
	(option as JSONInnerPropertyOptions<IN,OUT>).mappingFunctions = {
		out:params.outFunction,
		in:params.inFunction
	}
	return JsonProperty(option);
}

interface specialRecordArrayMappingProperties<IN extends object,OUT extends object> extends JSONInnerPropertyOptions<IN,OUT>{
	KeyPropertyName:string
}

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
				v = v();
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
		in:infunc
	}

	return JsonProperty(option);
}






export class JSONHandler{
 
	public static serialize(obj: any): string {
		return JSON.stringify(JSONHandler.serializeRaw(obj));
	} 
	private static serializeRaw( obj:any ): object{

		if(!obj){
			return obj;
		}

		// if this is a base type just return
		const type =  typeof obj;
		switch(type){
			case 'string':
			case 'boolean':
			case 'number':
				return obj;
		}
		
		// serializedObject is a new object, without non Jsonproperties
		let result = {};

		// get propertynames and loop through 
		let propertyNames;
		try{
			propertyNames = Object.getOwnPropertyNames( obj );
		}catch( e ){
			debugger;
			return obj;
		} 
		for (let i = 0; i < propertyNames.length; i++) {
			
			// get basic properties
			const key = propertyNames[i];
			let meta = Reflect.getMetadataKeys( obj , key );	
			
			// create the name of the property, but if there is a mapped out name, get that instead
			let PropertyName = key;
			if ( meta.includes(JSON_TAGS.JSON_PROPERTY_NAME_MAP_OUT )){
				PropertyName = Reflect.getMetadata( JSON_TAGS.JSON_PROPERTY_NAME_MAP_OUT , obj , key ); 
			}

			// if there is a mapping function
			let out : any = null;
			if ( meta.includes(JSON_TAGS.JSON_PROPERTY_FUNC_MAP_OUT )){
				let outFunction = Reflect.getMetadata( JSON_TAGS.JSON_PROPERTY_FUNC_MAP_OUT , obj , key ); 
				out = outFunction(obj[key], JSONHandler.serializeRaw );
			} 
			else if( meta.includes(JSON_TAGS.JSON_PROPERTY_FORCE_ARRAY ) ){
				out = [];
				for (let j = 0; j < obj[key].length; j++) {
					const e = obj[key][j];
					out.push(e)
				}
			}
			else {
				out = JSONHandler.serializeRaw(obj[key]);
			}

			result[PropertyName] = out;
		}
		return result;
	}

	public static deserialize<T extends object>( target: Constructor<T> , json:any){
		
		const type = typeof json;
		if(type == 'string'){
			json = JSON.parse(json);
		}

		switch(type){
			case 'boolean':
			case 'number':
				console.error( 'Cannot derserialize type of ' + type );
				return;
		}

		return this.deserializeRaw(target,json);
	} 
	private static deserializeRaw<T extends object>(target : Constructor<T>, obj : any){
		
		if(!obj){
			return obj;
		}

		// serializedObject is a new object, without non Jsonproperties
		let result = new target();
		let prototype = target.prototype;

		// get propertynames and loop through 
		let propertyNames = Object.getOwnPropertyNames( obj );
		for (let i = 0; i < propertyNames.length; i++) {
			
			// get basic properties
			let key = propertyNames[i];
			let inKey = key;
			let meta = Reflect.getMetadataKeys( prototype , key );	
			let PropertyName = key;

			// if this is an Out key, convert it to an IN Key, so we can get the right meta data. 
			if ( meta.includes(JSON_TAGS.JSON_PROPERTY_NAME_MAP_IN ) ){
				// get out key from the in Key
				key = Reflect.getMetadata( JSON_TAGS.JSON_PROPERTY_NAME_MAP_IN , prototype , key ); 
				meta = Reflect.getMetadataKeys( prototype , key );
				PropertyName = key;
			} 
 
			// Get the constructor if there is any, Generics take priority
			let out : any = null; 
			let	constr	= Reflect.getMetadata( JSON_TAGS.JSON_PROPERTY_TYPED			, prototype , key )
			
			if ( meta.includes(JSON_TAGS.JSON_PROPERTY_FUNC_MAP_IN )) {
				let inFunction = Reflect.getMetadata( JSON_TAGS.JSON_PROPERTY_FUNC_MAP_IN , prototype , key ); 
				if (constr) {
					out = inFunction(obj[inKey], (obj) => JSONHandler.deserializeRaw(constr, obj) );
				} 
				else {
					out = inFunction(obj[inKey], (obj) => obj );
				}
			} else {
				if (constr) {
					out = JSONHandler.deserializeRaw(constr, obj[inKey]);
				} 
				else{
					out = obj[inKey];
				}
			}


			// handle if there is a force array
			if ( meta.includes(JSON_TAGS.JSON_PROPERTY_FORCE_ARRAY) ) {
				if( obj == null ){
					out = [];
				}
				else if( !meta.includes(JSON_TAGS.JSON_PROPERTY_FUNC_MAP_IN) && !(Array.isArray(obj)) ){
					out = [out];
				}
			}  

			result[PropertyName] = out;
			let a = 1;
		}
		return result;
	}
}


/*
HANDLE 

isCorrect = true;
func =  ( e : any ) => { 

	if(typeof e == 'string')
		return e;

	return e.toString(); 
};
*/

/*
isCorrect = true;
( e : any ) => { 
	let t = Number(e) ?? 0;
	return t;
};
*/

/*
isCorrect = true;
( e : any ) => { 
	let t = e ? true : false;
	return t;
} 
*/