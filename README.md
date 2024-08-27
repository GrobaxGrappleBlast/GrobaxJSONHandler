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
*future versions should be able to define what child schemes are chosen* 
 
## Usage

```js
class MyClass{

	@JsonNumber({ name : 'c' })
	@JsonNumber({ name : 'firstNumber' , scheme:'testScheme'})
	public a = 12;

	@JsonArrayString ({ name : 'd' })
	public b = "12"
}

var obj = new MyClass();

function serialize( obj ){
	let baseScheme = JSONHandler.serialize(obj);
	let testScheme = JSONHandler.serialize(obj, 'testScheme' );

	console.log(`
		baseScheme
		**********
		${baseScheme}
	`)

	console.log(`
		testScheme
		**********
		${testScheme}
	`)
}

function derialize( json ){
	let object = JSONHandler.deserialize(MyClass, json);
	let testScheme = JSONHandler.deserialize(MyClass, json, scheme:'testScheme');
}

```

## Member Decorators 
  
### *@JsonProperty ( option )*  
This is a generic JsonProperty. This is used by other decorators. 
with this decorator you have access to decorate every function as you see fit. 
But it is recomended to use more specifik decorators.
<br><br>
Decorators beneath are facades to this. they are primarily decorators that fill in these values before hand, to make them easier to create, and read. (note that they will override settings from this that they dont define on their own.)
 
*Options*
- *scheme: *(optional) string**<br>
	what scheme to use if not sat, it will be 'BASE_SCHEME'
 
- *name: *(optional) string** <br>
	a replacement name, when going out and comming in. 

- *isArray: *(optional) boolean** <br>
	should it convert this to an array? 

- *MappingFunctions: *(optional) object** <br>
  	advanced going in out methods, inside an object. <br>
	mappingFunctions? :{ out:( t:IN , serialize?:any ) => OUT , in:( b:OUT, deserialize?:any ) => IN } , 

- *type: *(optional) constructor of a class**  <br>
	if it should try to force it to a type ( class ). <br>
	it will then on incomming create the class through a constructor.
	and it will try to force it to be the correct class on outgoing. 

- *forceBaseType: *(optional) boolean** <br>
	if this is a field that should be forced to a string|number|boolean <br>
	this field is non-compatible with type. 
 
*Note*
if you enter other options than specified, They will be ignored. 

<br><br>

### *@JsonNumber ( option )*  
This is a basetype JsonProperty that forces it self to be a number; 
 
*Options*
- *scheme: *(optional) string**<br>
	what scheme to use if not sat, it will be 'BASE_SCHEME'
 
- *name: *(optional) string** <br>
	a replacement name, when going out and comming in. 
 
- *MappingFunctions: *(optional) object** <br>
  	advanced going in out methods, inside an object. <br>
	mappingFunctions? :{ out:( t:IN , serialize?:any ) => OUT , in:( b:OUT, deserialize?:any ) => IN } , 

 <br><br>

### *@JsonString ( option )*  
This is a basetype JsonProperty that forces it self to be a string; 
 
*Options*
- *scheme: *(optional) string**<br>
	what scheme to use if not sat, it will be 'BASE_SCHEME'
 
- *name: *(optional) string** <br>
	a replacement name, when going out and comming in. 
 
- *MappingFunctions: *(optional) object** <br>
  	advanced going in out methods, inside an object. <br>
	mappingFunctions? :{ out:( t:IN , serialize?:any ) => OUT , in:( b:OUT, deserialize?:any ) => IN } , 
  
<br><br>

### *@JsonBoolean ( option )*  
This is a basetype JsonProperty that forces it self to be a boolean; 
 
*Options*
- *scheme: *(optional) string**<br>
	what scheme to use if not sat, it will be 'BASE_SCHEME'
 
- *name: *(optional) string** <br>
	a replacement name, when going out and comming in. 
 
- *MappingFunctions: *(optional) object** <br>
  	advanced going in out methods, inside an object. <br>
	mappingFunctions? :{ out:( t:IN , serialize?:any ) => OUT , in:( b:OUT, deserialize?:any ) => IN } , 
  
<br><br>

### *@JsonClassTyped ( type, option )*  
This is a basetype JsonProperty that forces it self to be a class instance.
it does this, by assuring it is an object, and then moving instance data to and from it.  
When deserializing, it uses the constructor passed to create the instance 
 
*type (mandatory)* 
	a constructor reference to the class
	it works in typescript by placing the class name in here (look in examples) 

*Options*
- *scheme: *(optional) string**<br>
	what scheme to use if not sat, it will be 'BASE_SCHEME'
 
- *name: *(optional) string** <br>
	a replacement name, when going out and comming in. 
 
- *MappingFunctions: *(optional) object** <br>
  	advanced going in out methods, inside an object. <br>
	mappingFunctions? :{ out:( t:IN , serialize?:any ) => OUT , in:( b:OUT, deserialize?:any ) => IN } , 
  
<br><br>

### *@JsonArrayNumber ( option )*  
This is a basetype JsonProperty that forces it self to be an array of numbers 
 
*Options*
- *scheme: *(optional) string**<br>
	what scheme to use if not sat, it will be 'BASE_SCHEME'
 
- *name: *(optional) string** <br>
	a replacement name, when going out and comming in. 
 
- *MappingFunctions: *(optional) object** <br>
  	advanced going in out methods, inside an object. <br>
	mappingFunctions? :{ out:( t:IN , serialize?:any ) => OUT , in:( b:OUT, deserialize?:any ) => IN } , 

<br><br>

### *@JsonArrayString ( option )*  
This is a basetype JsonProperty that forces it self to be an array of strings 
  
*Options*
- *scheme: *(optional) string**<br>
	what scheme to use if not sat, it will be 'BASE_SCHEME'
 
- *name: *(optional) string** <br>
	a replacement name, when going out and comming in. 
 
- *MappingFunctions: *(optional) object** <br>
  	advanced going in out methods, inside an object. <br>
	mappingFunctions? :{ out:( t:IN , serialize?:any ) => OUT , in:( b:OUT, deserialize?:any ) => IN } , 

<br><br>


### *@JsonArrayBoolean ( option )*  
This is a basetype JsonProperty that forces it self to be an array of booleans 
 
*Options*
- *scheme: *(optional) string**<br>
	what scheme to use if not sat, it will be 'BASE_SCHEME'
 
- *name: *(optional) string** <br>
	a replacement name, when going out and comming in. 
 
- *MappingFunctions: *(optional) object** <br>
  	advanced going in out methods, inside an object. <br>
	mappingFunctions? :{ out:( t:IN , serialize?:any ) => OUT , in:( b:OUT, deserialize?:any ) => IN } , 

<br><br>

### *@JsonArrayClassTyped ( type, option )*  
This is a basetype JsonProperty that forces it self to be an array of class instances.
it does this, by assuring that each element is an object, and ensuring that it is an object of the correct type.
When deserializing, it uses the constructor passed to create each instance 
 
*type (mandatory)* 
	a constructor reference to the class
	it works in typescript by placing the class name in here (look in examples) 

*Options*
- *scheme: *(optional) string**<br>
	what scheme to use if not sat, it will be 'BASE_SCHEME'
 
- *name: *(optional) string** <br>
	a replacement name, when going out and comming in. 
 
- *MappingFunctions: *(optional) object** <br>
  	advanced going in out methods, inside an object. <br>
	mappingFunctions? :{ out:( t:IN , serialize?:any ) => OUT , in:( b:OUT, deserialize?:any ) => IN } , 
  
<br><br>

### *@JsonMapping ( type, option )*  
This is a basetype JsonProperty that forces it self to be an array of class instances.
it does this, by assuring that each element is an object, and ensuring that it is an object of the correct type.
When deserializing, it uses the constructor passed to create each instance 
 
*Options*
- *scheme: *(optional) string**<br>
	what scheme to use if not sat, it will be 'BASE_SCHEME'
 
- *inFunction: *(mandatory) function** <br>
	a replacement name, when going out and comming in. 

- *outFunction: *(mandatory) function** <br>
	a replacement name, when going out and comming in. 

- *type *(optional)**
	a constructor reference to the class

- *MappingFunctions: *(optional) object** <br>
  	advanced going in out methods, inside an object. <br>
	mappingFunctions? :{ out:( t:IN , serialize?:any ) => OUT , in:( b:OUT, deserialize?:any ) => IN } , 

<br><br>

### *@JsonMappingRecordInArrayOut ( type, option )*  
This is a qualityofLife decorator that does the work of the JsonMapping. 
if you want a record in the code. but an array in the JSON 
 
*Options*
- *scheme: *(optional) string**<br>
	what scheme to use if not sat, it will be 'BASE_SCHEME'
- *KeyPropertyName: *(mandatory)**
	this is the name of the member or function on the object, that gives the key.

<br><br>

## Object Decorators Decorators 

### *@JsonObject ( option )*  
an Object decorator you can add if you want a special serialization|deserializatiion methods. 
this will run when ever this class with this scheme, is deserialized or serialized. even if it is on a member class. 
 
*Options*
- *scheme: *(optional) string**<br>
	what scheme to use if not sat, it will be 'BASE_SCHEME'
- *onBeforeSerialization: *(optional)**
	a method to run on the object before we serialize it into text. 
- *onAfterDeSerialization: *(optional)**
	a method to run on the object before after serialize it into text.
