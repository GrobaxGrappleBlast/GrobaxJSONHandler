import { JSONHandler, JsonArrayBoolean, JsonBoolean, JsonClassTyped, JsonMapping, JsonMappingRecordInArrayOut, JsonNumber, JsonObject, JsonProperty, JsonString } from "../index";
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










