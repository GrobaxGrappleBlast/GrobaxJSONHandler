import { debug } from "console";
import { JSONHandler, JsonArrayBoolean, JsonArrayClassTyped, JsonArrayNumber, JsonArrayString, JsonBoolean, JsonClassTyped, JsonMapping, JsonMappingRecordInArrayOut, JsonNumber, JsonObject, JsonProperty, JsonString } from "../index";
import { setPrototype , getPrototype, getMetaDataKeys, getOwnMetaDataKeys} from "../JsonModuleBaseFunction";
import { Reflect } from '../Reflect'



@JsonObject({
	onAfterSerialization	: ( json : string|any )=>{ 
		var res = json.replaceAll('@',"#");
		res = res.replaceAll('1',"9");
		return res;
	},
	onAfterSerialization_beforeString	: ( self : any )=>{
		self.someVariable = 12; 
		self.varNum++;
	},
	onBeforeSerialization	: (self : SerialTestObj)=>{
		self.varString += "BeforeSerialization";
		self.varNum++;

	}
})
export class SerialTestObj {
	@JsonString()
	public varString = "@1";

	@JsonNumber()
	public varNum = 1;
}


test('Events at Serialization Tests', () => {

	let c = new SerialTestObj();
	let json = JSONHandler.serialize(c);
	let obj = JSON.parse(json);

	expect(obj.varString)	.toBe('#9BeforeSerialization');
	expect(obj.someVariable).toBe(92); 
	expect(obj.varNum)		.toBe(3);

})


@JsonObject({
	onAfterDeSerialization	: ( json : DeSerialTestObj )=>{ 
		
	},
	onBeforeDeSerialization	: ( self : any , jsonObj:any )=>{
		return new DeSerialTestObj2();
	}
})
export class DeSerialTestObj {
	@JsonString()
	public varString = "@1";

	@JsonNumber()
	public varNum = 1;
}
export class DeSerialTestObj2 {

	@JsonString({name:'varString'})
	public varString2 = "@1";

	@JsonNumber({name:'varNum'})
	public varNum2 = 1;

	public TESTVAR = 1231321312;
}


test('Events at DESerialization Tests', () => {

	let c = new DeSerialTestObj();
	let json = JSONHandler.serialize(c);
	let obj = JSONHandler.deserialize(DeSerialTestObj,json) as DeSerialTestObj2; 

	expect(obj['varString']).toBe(undefined);
	expect(obj['varNum'])	.toBe(undefined);
	expect(obj['varString2'])	.toBe('@1');
	expect(obj['varNum2'])		.toBe(1);
	expect(obj['TESTVAR'])		.toBe(1231321312);


})




@JsonObject({
	onBeforeSerialization 	: (self) => {},
	onBeforeDeSerialization : (self, JsonObject ) => { 

		console.log(JsonObject['type']);
		switch(JsonObject['type']){
			case 'Feature_string' 				: return new Feature_string()
			case 'Feature_arrayString' 			: return new Feature_arrayString()
			case 'Feature_number' 				: return new Feature_number()
			case 'Feature_arrayNumber' 			: return new Feature_arrayNumber()
			case 'Feature_boolean' 				: return new Feature_boolean()
			case 'Feature_arrayBoolean' 		: return new Feature_arrayBoolean()
			case 'Feature_class' 				: return new Feature_class()
			case 'Feature_arrayClass' 			: return new Feature_arrayClass()
			case 'Feature' 						: return new Feature()
			default:
				return self;
		}
	}
})
 
export class Feature {

	@JsonString()
	public type : string = "Feature";
	public init(){}
	
}

export class Feature_string extends Feature {
	public type : string = 'Feature_string';

	@JsonString()
	public str : string;

	public init(){
		this.str = 'textTextText';
	}
}

export class Feature_arrayString extends Feature {
	public type : string = 'Feature_arrayString';

	@JsonArrayString()
	public arr : string[] ;

	public init(){
		this.arr = ['string1','string2','string3'];
	}
}

export class Feature_number extends Feature {
	public type : string = 'Feature_number';

	@JsonNumber()
	public num : number ;

	public init(){
		this.num = 5;
	}
}

export class Feature_arrayNumber extends Feature {
	public type : string = 'Feature_arrayNumber';

	@JsonArrayNumber()
	public arr : number[] ;

	public init(){
		this.arr =  [1,2,3,4,5];
	}
}

export class Feature_boolean extends Feature {
	public type : string = 'Feature_boolean';

	@JsonBoolean()
	public bol : boolean ;

	public init(){
		this.bol = true;
	}
}

export class Feature_arrayBoolean extends Feature {
	public type : string = 'Feature_arrayBoolean';

	@JsonArrayBoolean()
	public arr : boolean[] ;

	public init(){
		this.arr = [false,false,true,false,true];
	}
}

export class Box{
	
	@JsonString()
	color:string = "brown";
	
	@JsonNumber()
	width:number = 20;

	@JsonNumber()
	height:number = 20;
}
export class Feature_class extends Feature {
	public type : string = 'Feature_class';

	@JsonClassTyped(Box)
	public box : Box ;

	public init(){
		this.box = new Box();
	}
}

export class Feature_arrayClass extends Feature {
	public type : string = 'Feature_arrayClass';

	@JsonArrayClassTyped(Box)
	public arr : Box[] ;

	public init(){
		this.arr =[new Box(), new Box()];
	}
} 
class FeatureList {
	
	@JsonArrayClassTyped(Feature, { skipForceType: true })
	public features : Feature[] = [
		new Feature_string()	,
		new Feature_arrayString()	,
		new Feature_number()	,
		new Feature_arrayNumber()	,
		new Feature_boolean()	,
		new Feature_arrayBoolean()	,
		new Feature_class()	,
		new Feature_arrayClass()	, 
		new Feature()	,
	]

	public init(){
		this.features.forEach( f  => {
			f.init();
		});
	}
}

test('advanced DESerialization Tests', () => {

	let c = new FeatureList();
	c.init();
	let json = JSONHandler.serialize(c);
	let obj = JSONHandler.deserialize(FeatureList,json); 
	let ref = JSON.parse(json);


	let arr = [
		'Feature_string',
		'Feature_arrayString',
		'Feature_number',
		'Feature_arrayNumber',
		'Feature_boolean',
		'Feature_arrayBoolean',
		'Feature_class',
		'Feature_arrayClass',
		'Feature'
	];
	
	for (let i = 0; i < obj.features.length; i++) {
		const type = arr[i];
		const feature = obj.features[i];
		console.log(type, feature.type);
		expect( feature.type ).toBe(type);

		switch(type){
			case 'Feature_string' 				: expect( feature.str )		.toEqual('textTextText')					; break;
			case 'Feature_arrayString' 			: expect( feature.arr )		.toEqual(['string1','string2','string3'])	; break;
			case 'Feature_number' 				: expect( feature.num )		.toEqual(5)									; break;
			case 'Feature_arrayNumber' 			: expect( feature.arr )		.toEqual([1,2,3,4,5])						; break;
			case 'Feature_boolean' 				: expect( feature.bol )		.toEqual(true)								; break;
			case 'Feature_arrayBoolean' 		: expect( feature.arr )		.toEqual([false,false,true,false,true])		; break;
			case 'Feature_class' 				: expect( feature.box )		.toEqual(new Box())							; break;
			case 'Feature_arrayClass' 			: expect( feature.arr )		.toEqual([new Box(), new Box()])			; break;
		}
	}


})




