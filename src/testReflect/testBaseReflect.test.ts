
import { JsonArrayBoolean, JsonArrayClassTyped, JsonArrayNumber, JsonArrayString, JsonBoolean, JsonClassTyped, JsonMappingRecordInArrayOut, JsonNumber, JsonString } from '../Decorators';
import {Reflect} from '../Reflect';
class Myconid{
	public name:string = "Jogn";
	public lastName:string = "Bill";
	public age:number = 10;
}
export class InnerPiece {
  
	public KKey;
	private key;
 
	public getKey(){
		return this.key;
	}
	public getKKey( index ){
		return index[0]; // should cast exeption when not supplied with index
	}
	public getKK2ey( param? ){
		if( param ){
			
		}
		return this.key;
	}
	public getKK3ey( param = "asdasdad" ){
		if( param.slice(0,2) ){

		}
		return this.key;
	}
	

	@JsonString()
	public name = "HANS"

	@JsonArrayString()
	public addresser = ["1","2","3"]

	@JsonNumber()
	public id : number = 123;

	@JsonArrayNumber()
	public serials = [1,2,3]

	@JsonBoolean()
	public isValid = true;

	@JsonArrayBoolean({name:'x'})
	public subFunctions = [true,true,true]

}

export class Container {
	
	constructor(){}

	public init(){	
	 this.simple = new InnerPiece();
	 this.array= [new InnerPiece()];
	}
  
	@JsonClassTyped(InnerPiece)
	public simple : InnerPiece;

	@JsonArrayClassTyped(InnerPiece)
	public array : InnerPiece[];

	
	//@JsonMappingRecordInArrayOut({KeyPropertyName:'getKey'})
	//public collections : Record<string,InnerPiece> = {}

}

export class Container_Mapped_viaMethod {
	
	constructor(){}

	public init(){	
		for (let i = 0; i < 5; i++) {
			const c = new InnerPiece();
			this.collections[c.getKey()] = c;
		}
	}
  
	@JsonMappingRecordInArrayOut({KeyPropertyName:'getKey',type:InnerPiece})
	public collections : Record<string,InnerPiece> = {}

 
}
 
export class BoolContainer_object {
	
	constructor(){}

	public init(){	
		this.simple = {name:"ornfreyd"};

		//@ts-ignore
		this.array = {name:"Jeffrey"};
		this.simple2 = {name:"ornfreyd"};
		this.array2 =	[{name:"Jeffrey"}];
	}
	public nulify(){	
		this.simple	= null;
		this.array	= null;
		this.simple2= null;
		this.array2	= null;
	}

	@JsonBoolean()
	public simple: object | null ;

	@JsonArrayBoolean()	
	public array: object[] | null ;
		
	@JsonBoolean({name:"t"})
	public simple2: object | null;

	@JsonArrayBoolean({name:"x"})
	public array2: object[] | null;

}

const name = "name";
const tag = 'MY_TAG';
test('get the right prototype', () => {
	
	let obj = new Myconid();
 
	let a = 12;
	Reflect.defineMetaData(tag , a , obj, name);
	let b = Reflect.getAllMeta( obj )
	

	console.log(b);
})                                                                                    