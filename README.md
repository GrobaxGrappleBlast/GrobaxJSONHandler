# grobax-JSONHandler
This is a Project to help serializing and deserializing JSON.
With this you are able to design different schemes for your Objects, different schemes to be serialized into and deserialized from.
ensure that you have enabled experimental decorators 

The project was originaly made because i could not find good JSON libraries for TS, there was always something they either couldent do, or something complex i needed to do, to get them working. this is plug and play, just Serialize with JSONHandler's static functions. 

The project was made as a framework for my own project, that needed complex deserialization. 

## Required Settings 
In typescript you want to have your config settings under compilerOptions
- "emitDecoratorMetadata": true,
- "experimentalDecorators": true,
 
  

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


## Schemes 
A scheme is a name, that the decorater wil register the property decorator to.
if no shceme is provided the scheme is 'BASE_SCHEME'
if a property is registered for one theme and you serialize as another, you will not see the properties registered for teh other schemes

### child objects.
If there are child objects, the Handler will try to serialize them with the same scheme as the parent 
*future versions should be able to define what child schemes are chosen* 




## Member Decorators 
  
### *@JsonProperty ( option )*  
 
```js
	var obj = new MyClass();
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

	/**
		PRINTS OUT 
		
		baseScheme
		**********
		{"c":12,"d":["12"]}

		testScheme
		**********
		 {"firstNumber":12}

	*/

	let JSONT = `{"c":"12","firstNumber":"5","d":"100000","a":2,"b":13 }`;
	let object1 = JSONHandler.deserialize(MyClass, JSONT);
	let object2 = JSONHandler.deserialize(MyClass, JSONT, 'testScheme');

	console.log(
		`
		Deserialized1
		**********
		${JSON.stringify(object1)}

		`
	)
	console.log(
		`
		Deserialized2
		**********
		${JSON.stringify(object2)}
		`
	)
		 
	//console.log(JSON.stringify(object2))

	/**
		PRINTS OUT 
		
		baseScheme
		**********
		 {"a":2,"b":[],"firstNumber":"5"}

		testScheme
		**********
		{"a":2,"b":"12"}

	*/

```
<br><br>

### *@JsonNumber ( option )*  
```js 
	class MyNumberClass{

		@JsonNumber({ name : 'c' })
		public CC :any;
		@JsonNumber({ name : 'isThisANumber' , scheme:'testScheme'})
		public a :any;
		@JsonNumber()
		public b :any;
		@JsonNumber()
		public c :any;
	} 

	var obj = new MyNumberClass();
	obj.CC = true;
	obj.a="12";
	obj.b=-12.2;
	obj.c=[12,12,"12"];

 
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

	/**
		PRINTS OUT 
		
		baseScheme
		**********
		{"c":1,"b":-12.2}

		testScheme
		**********
		{"isThisANumber":12}

	*/

	let JSONT = `{"c":"12","isThisABoolean":"falsesssy","d":"100000","a":2,"b":13 }`;
	let object1 = JSONHandler.deserialize(MyNumberClass, JSONT);
	let object2 = JSONHandler.deserialize(MyNumberClass, JSONT, 'testScheme');

	console.log(
		`
		Deserialized1
		**********
		${JSON.stringify(object1)}

		`
	)
	console.log(
		`
		Deserialized2
		**********
		${JSON.stringify(object2)}
		`
	)
		 
	//console.log(JSON.stringify(object2))

	/**
		PRINTS OUT 
		
		baseScheme
		**********
		{"CC":12,"b":13}

		testScheme
		**********
		{"a":2}

	*/

```
 <br><br>

### *@JsonString ( option )*  

### note if a string value contains " or \ 
```js 
	
	class MyStringClass2 { 
		@JsonString()
		public data :any;
	} 
	test('Readme_StringExample', () => {

		debugger
		var obj = new MyStringClass2();
		obj.data = { text : 'asdadsad " \\ \" '}	 
	
		let baseScheme = JSONHandler.serialize(obj);

		console.log(`
			baseScheme
			**********
			${baseScheme}
		`);


	})


```
<br><br>

### *@JsonBoolean ( option )*  
 
```js 


	class MyBooleanClass{

		@JsonBoolean({ name : 'c' })
		public CC :any;
		@JsonBoolean({ name : 'isThisABoolean' , scheme:'testScheme'})
		public a :any;
		@JsonBoolean()
		public b :any;
		@JsonBoolean()
		public c :any;
	}

	var obj = new MyBooleanClass();
	obj.CC = true;
	obj.a="12";
	obj.b=-12.2;
	obj.c=[12,12,"12"];


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

	/**
		PRINTS OUT 
		
		baseScheme
		**********
		{"c":true,"b":true}

		testScheme
		**********
		{"isThisABoolean":true}

	*/

	let JSONT = `{"c":"12","isThisABoolean":"falsesssy","d":"100000","a":2,"b":13 }`;
	let object1 = JSONHandler.deserialize(MyBooleanClass, JSONT);
	let object2 = JSONHandler.deserialize(MyBooleanClass, JSONT, 'testScheme');

	console.log(
		`
		Deserialized1
		**********
		${JSON.stringify(object1)}

		`
	)
	console.log(
		`
		Deserialized2
		**********
		${JSON.stringify(object2)}
		`
	)
		 
	//console.log(JSON.stringify(object2))

	/**
		PRINTS OUT 
		
		baseScheme
		**********
		{"CC":true,"b":true}

		testScheme
		**********
		{"a":true}

	*/
```
<br><br>

### *@JsonClassTyped ( type, option )*  
 
<br><br>

### *@JsonArrayNumber ( option )*  
 
<br><br>

### *@JsonArrayString ( option )*  
 
<br><br>


### *@JsonArrayBoolean ( option )*  
 
<br><br>

### *@JsonArrayClassTyped ( type, option )*  
 
<br><br>

### *@JsonMapping ( type, option )*  
 
<br><br>

### *@JsonMappingRecordInArrayOut ( type, option )*  
 
<br><br>
 