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