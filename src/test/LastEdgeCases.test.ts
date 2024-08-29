import { JSONHandler, JsonArrayBoolean, JsonArrayClassTyped, JsonArrayNumber, JsonArrayProperty, JsonArrayString, JsonBoolean, JsonClassTyped, JsonMappingRecordInArrayOut, JsonNumber, JsonProperty, JsonString } from  "../index";



 

 


function startTest( c, type : any ){
	var json = JSONHandler.serialize(c);
	var deser= JSONHandler.deserialize(type,json); 
	return [c,json,deser];
}

function compareObject( obj1, obj2 ){

	expect( Object.keys(obj1) ).toEqual( Object.keys(obj2) )

	let p1 = Object.getPrototypeOf(obj1 ).constructor.name;
	let p2 = Object.getPrototypeOf(obj2 ).constructor.name;
	expect(p1).toBe(p2);

	Object.keys(obj1).forEach( key  => {
		let p1 = Object.getPrototypeOf(obj1[key])?.constructor?.name;
		let p2 = Object.getPrototypeOf(obj2[key])?.constructor?.name;
		expect(p1).toBe(p2);
	});

	Object.keys(obj1).forEach( key  => {
		let p1 = obj1[key];
		let p2 = obj2[key];
		expect(p1).toEqual(p2);
	});
}
	 

export class Piece_NullProperty{

	//@ts-ignore 
	@JsonProperty(null)
	public name = "HEJ";

} 

test('if a Property is Null', () => {
	let c = new Piece_NullProperty(); 
	var [orig, json, des ] = startTest( c , Piece_NullProperty);
	
	compareObject(des,orig);
})


test('Try to deserialize a number', () => {
	
	var des= JSONHandler.deserialize(Piece_NullProperty,2); 
	expect(des ?? null).toEqual(null)

})


test('Try to deserialize a bool', () => {
	
	var des= JSONHandler.deserialize(Piece_NullProperty,true); 
	expect(des ?? null).toEqual(null)
	
})

test('Try to deserialize a null', () => {
	
	var des= JSONHandler.deserialize(Piece_NullProperty,null); 
	expect(des ?? null).toEqual(null)
	
})

test('Try to deserialize a undefined', () => {
	
	var des= JSONHandler.deserialize(Piece_NullProperty,undefined); 
	expect(des ?? null).toEqual(null)
	
})


export class Piece_array{

	@JsonArrayProperty()
	public name = [2,2,2];
} 
export class Piece_arrayOut{

	@JsonProperty()
	public name = 2;

} 
test('Try to deserialize an array from Non Array', () => {
	var json = JSONHandler.serialize(new Piece_arrayOut());
	var des:Piece_array= JSONHandler.deserialize(Piece_array,json); 
	expect(des.name.length == 1);
	expect(des.name[0] == 2);
})





class ObjectA{
	
	@JsonString({name:'NAMED'})
	public name : string ; 
	
	@JsonNumber({name:'VersionNumber'})
	public version: number;

}

class ObjectB {

	@JsonArrayClassTyped(ObjectA, {name:'data'})
	public As : ObjectA[];

	initWrong(){
		//@ts-ignore
		this.As = [ 
			//@ts-ignore
			{name:'NAME1', version:3},
			//@ts-ignore
			{name:'NAME2', version:"3"},
			//@ts-ignore	
			{name:'NAME3', version:{} } // object to number gives 1.
		]
	} 
}
test('Deserialize object with NON class instantiated objects ', () => {
	let B = new ObjectB();
	B.initWrong();
	var json = JSONHandler.serialize(B);

	// test that despite not being class instances. they are still serialized as if that class
	var des1 : any = JSON.parse(json) as any;
	expect(des1.data.length).toBe(3);
	expect(des1.As).toBe(undefined);
	
	// each element checked
	expect(des1.data[0].NAMED).toEqual("NAME1")
	expect(des1.data[1].NAMED).toEqual("NAME2")
	expect(des1.data[2].NAMED).toEqual("NAME3")
	expect(des1.data[0].name).toEqual(undefined)
	expect(des1.data[1].name).toEqual(undefined)
	expect(des1.data[2].name).toEqual(undefined)


	expect(des1.data[0].VersionNumber).toEqual(3)
	expect(des1.data[1].VersionNumber).toEqual(3)
	expect(des1.data[2].VersionNumber).toEqual(1)
	expect(des1.data[0].version).toEqual(undefined)
	expect(des1.data[1].version).toEqual(undefined)
	expect(des1.data[2].version).toEqual(undefined)



	var deser= JSONHandler.deserialize(ObjectB,json);  



})

