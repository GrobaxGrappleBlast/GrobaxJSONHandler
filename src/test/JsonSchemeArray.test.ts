import { JSONHandler, JsonArrayBoolean, JsonArrayClassTyped, JsonArrayNumber, JsonArrayProperty, JsonArrayString, JsonBoolean, JsonClassTyped, JsonMappingRecordInArrayOut, JsonNumber, JsonProperty, JsonString } from  "../index";

class MyClass{

	
	@JsonNumber({ name : 'firstNumber' , scheme:['b','a']})
	public a = 12;

	@JsonNumber ({ scheme:['b'] })
	public b = 1

	@JsonNumber({ scheme:['a']})
	public c = 100
}


test('Scheme are arrays now', () => {

	var obj = new MyClass();
	let baseScheme = JSONHandler.serialize(obj, 'a');
	let testScheme = JSONHandler.serialize(obj, 'b' );
 
	let a	= JSON.parse(baseScheme); 
	let b	= JSON.parse(testScheme);
	
	
	expect(a.firstNumber).toEqual(12);
	expect(a.c).toEqual(100);
	expect(a.b).toEqual(undefined);

	expect(b.firstNumber).toEqual(12);
	expect(b.b).toEqual(1);
	expect(b.c).toEqual(undefined);

})


class MyClass2{

	
	@JsonNumber({ name : 'firstNumber' , scheme:['b','a']})
	public a = 12;

	@JsonNumber ({ scheme:'b' })
	public b = 1

	@JsonNumber({ scheme:'a'})
	public c = 100
}

test('Scheme can stil be defined as a string ', () => {

	var obj = new MyClass2();
	let baseScheme = JSONHandler.serialize(obj, 'a');
	let testScheme = JSONHandler.serialize(obj, 'b' );
 
	let a	= JSON.parse(baseScheme); 
	let b	= JSON.parse(testScheme);
	
	
	expect(a.firstNumber).toEqual(12);
	expect(a.c).toEqual(100);
	expect(a.b).toEqual(undefined);

	expect(b.firstNumber).toEqual(12);
	expect(b.b).toEqual(1);
	expect(b.c).toEqual(undefined);

})