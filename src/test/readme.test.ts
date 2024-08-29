import { JSONHandler, JsonArrayBoolean, JsonArrayClassTyped, JsonArrayNumber, JsonArrayProperty, JsonArrayString, JsonBoolean, JsonClassTyped, JsonMappingRecordInArrayOut, JsonNumber, JsonProperty, JsonString } from  "../index";


class MyClass{

	@JsonNumber({ name : 'c' })
	@JsonNumber({ name : 'firstNumber' , scheme:['testScheme']})
	public a = 12;

	@JsonArrayString ({ name : 'd' })
	public b = "12"
}


test('Readme_Example_one', () => {

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
})




class MyBooleanClass{

	@JsonBoolean({ name : 'c' })
	public CC :any;
	@JsonBoolean({ name : 'isThisABoolean' , scheme:'testScheme'})
	public a :any;
	@JsonBoolean()
	public b :any;
	@JsonBoolean()
	public d :any;
}  
test('Readme_BooleanExample', () => {

	var obj = new MyBooleanClass();
	obj.CC = true;
	obj.a="12";
	obj.b=-12.2;
	obj.d=[12,12,"12"];


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
})




class MyNumberClass{

	@JsonNumber({ name : 'c' })
	public CC :any;
	@JsonNumber({ name : 'isThisANumber' , scheme:'testScheme'})
	public a :any;
	@JsonNumber()
	public b :any;
	@JsonNumber()
	public d :any;
}  
test('Readme_NumberExample', () => {

	var obj = new MyNumberClass();
	obj.CC = true;
	obj.a="12";
	obj.b=-12.2;
	obj.d=[12,12,"12"];

 
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
})


class MyStringClass{

	@JsonString({ name : 'c' })
	public CC :any;
	@JsonString({ name : 'isThisANumber' , scheme:'testScheme'})
	public a :any;
	@JsonString()
	public b :any;
	@JsonString()
	public d :any;
}  

test('Readme_StringExample', () => {

	var obj = new MyStringClass();
	obj.CC = true;
	obj.a="12";
	obj.b=-12.2;
	obj.d=[12,12,"12"];

 
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
		{"c":"true","b":"-12.2","d":"{}"}

		testScheme
		**********
		{"isThisANumber":"12"}

	*/

	let JSONT = `{"c":"12","isThisABoolean":"falsesssy","d":"100000","a":2,"b":13 }`;
	let object1 = JSONHandler.deserialize(MyStringClass, JSONT);
	let object2 = JSONHandler.deserialize(MyStringClass, JSONT, 'testScheme');

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
		{"CC":"12","b":"13"}

		testScheme
		**********
		{"a":"2"}

	*/
})
