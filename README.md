# grobax-JSONHandler
This is a Project to help serializing and deserializing JSON.
With this you are able to design different schemes for your Objects, different schemes to be serialized into and deserialized from.
ensure that you have enabled experimental decorators 

## Schemes 
A scheme is a name, that the decorater wil register the property decorator to.
if no shceme is provided the scheme is 'BASE_SCHEME'
if a property is registered for one theme and you serialize as another, you will not see the properties registered for teh other schemes

### child objects.
If there are child objects, the Handler will try to serialize them with the same scheme as the parent 
**future versions should be able to define what child schemes are chosen */

## Decorators 

/**
	This is a generic JsonProperty. This is used by other decorators. 
	with this decorator you have access to decorate every function as you see fit. 

	But it is recomended to use more specifik decorators.
*/
@JsonProperty		( option?:JSONInnerPropertyOptions<any,any> )

/**
	This is a generic JsonProperty. 
	This decorator forces its result to be an array. 
*/
@JsonArrayProperty	( option?:JSONPropertyOptions )

/**
	This is a basetype JsonProperty that forces it self to be a number; 
*/
@JsonNumber			( option?:JSONPropertyOptions )
/**
	This is a basetype JsonProperty that forces it self to be a string; 
*/
@JsonString			( option?:JSONPropertyOptions )
/**
	This is a basetype JsonProperty that forces it self to be a boolean; 
*/
@JsonBoolean		( option?:JSONPropertyOptions )
/**
	This is a basetype JsonProperty that forces it self to be a class instance.
	it does this, by assuring it is an object, and then moving instance data to and from it.  


	*When deserializing, it uses the constructor passed to create the instance* 
*/
@JsonClassTyped		( type : Constructor<T> , option?:JSONPropertyOptions )



/**
	This is a basetype JsonProperty that forces it self to be  an array of numbers;
*/
@JsonArrayNumber	( option?:JSONPropertyOptions )

/**
	This is a basetype JsonProperty that forces it self to be an array of string;
*/
@JsonArrayString	( option?:JSONPropertyOptions )

/**
	This is a basetype JsonProperty that forces it self to be an array of booleans;
*/
@JsonArrayBoolean	( option?:JSONPropertyOptions )

/**
	This is a basetype JsonProperty that forces it self to be an array of class instances;

	*When deserializing, it uses the constructor passed to create the instance* 
*/
@JsonArrayClassTyped( type : Constructor<T> , option?:JSONPropertyOptions )

### parameters 

export interface JSONPropertyOptions {
	scheme?:string	, // what scheme to use 
	name?: string 	, // a replacement name, when going out and comming in. 
	isArray?:boolean  // should it convert this to an array?
}
interface JSONInnerPropertyOptions<IN extends object,OUT extends object> extends JSONPropertyOptions{
	mappingFunctions? :{ out:( t:IN , serialize?:any ) => OUT , in:( b:OUT, deserialize?:any ) => IN } , // advanced going in out methods, 
	type?: any,			// if it should try to force it to a type ( class )
	forceBaseType?:  	// if it tries to force it into a string, boolean or number
}

## Special Decorators 

### Mapping Decorator
/**
	this is a special decorator to help design a property that is mapped in and mapped out
*/
JsonMapping<IN extends object,OUT extends object>( params : JsonMappingParameters<IN,OUT> )

#### mapping paramenters
interface JsonMappingParameters<IN extends object,OUT extends object>{
	scheme?:string, 
	inFunction:( b:OUT, deserialize?:any ) => IN,	// the function is takes comming in
	outFunction:( t:IN , serialize?:any ) => OUT ,	// the function it takes going out.
	type? : Constructor<IN>,
	option? : JSONInnerPropertyOptions<IN,OUT>
}

### RecordInArrayOut
this is a special decorator designed to ease the creation of a parameter that is a record inside the program, but serialized out to an array.

JsonMappingRecordInArrayOut<IN extends object,OUT extends object>( option : specialRecordArrayMappingProperties<IN,OUT> )
JsonObject( option : JsonObjectProperties)

