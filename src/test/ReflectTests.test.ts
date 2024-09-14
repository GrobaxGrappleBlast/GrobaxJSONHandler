import { debug } from "console";
import { JSONHandler, JsonArrayBoolean, JsonArrayClassTyped, JsonArrayNumber, JsonArrayString, JsonBoolean, JsonClassTyped, JsonMapping, JsonMappingRecordInArrayOut, JsonNumber, JsonObject, JsonProperty, JsonString } from "../index";
import { setPrototype , getPrototype, getMetaDataKeys, getOwnMetaDataKeys} from "../JsonModuleBaseFunction";
import { Reflect } from '../Reflect'



export class SerialTestObj {
	public varString = "@1";
	public varNum = 1;
}
 
export class Feature {

	@JsonString()
	public type : string = "Feature";
	public init(){}
	
}

export class Feature_string extends Feature {
	public type : string = 'Feature_string';

	@JsonString()
	public str : string = "asdsadasda";

	public init(){
		this.str = 'textTextText';
	}
}

test('fail', () => {

	let json = JSONHandler.serialize( new Feature_string ());
	let obj = JSONHandler.deserialize( Feature_string , json);

});


test('Correctly State No Meta data', () => {

	var instance = new SerialTestObj();
	let a = Reflect.getAllMeta(instance);
	expect(a).toEqual({})

});

test('Define MetaData and GetIt Again', () => {

	var instance = new SerialTestObj();
	Reflect.defineMetaData	( 'TAG' , true , instance , 'varNum' );
	let a = Reflect.getMetadata		( 'TAG' , instance , 'varNum' );
	expect(a).toBe(true);

	expect(Reflect.hasMetaData( 'TAG' , instance , 'varNum')).toBe(true);
});