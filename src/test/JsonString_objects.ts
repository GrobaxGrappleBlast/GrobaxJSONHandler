import { JsonArrayClassTyped , JsonString } from  "../index";

// This failed so we create a test to ensure it works 

export class KeyManager {
	private keyCounter = 0;	
	getNewKey(){
		let num = this.keyCounter++;
		return num.toString(16);
	}
}

export var keyManager = new KeyManager();
export class CNode		{
	public constructor( type:string = 'NONE', data:string = '{}' ){
		this.id = keyManager.getNewKey();
		this.type = type;
		this.dataNN = JSON.parse(data);
	}
	
	@JsonString()
	id:string;

	@JsonString()
	type:string;

	@JsonString()
	dataNN:any;
}
export class SheetColumn{
	public constructor( data:any[] = [] ){
		this.id = keyManager.getNewKey();
		this.data = [];
		data.forEach( d  => {
			if ( d != null && d.data && d.type){
				this.data.push( new CNode( d.type ,d.data ))
			}
			else{
				this.data.push(new CNode( ))
			}
		});
	}

	@JsonString()
	id : string; 

	@JsonArrayClassTyped( CNode )
	data : (CNode|null)[] = [];
	public addItem(){
		this.data.push(new CNode())
	}
}
export class SheetRow	{
	public constructor( data:any[] = [] ){
		this.id = keyManager.getNewKey();
		this.data = [];
		data.forEach( d  => {
			this.data.push( new SheetColumn(d.data) );
		});
	}

	@JsonString()
	id : string; 

	@JsonArrayClassTyped( SheetColumn )
	data : (SheetColumn|null)[] = [];
	public addColumn(){
		this.data.push(new SheetColumn())
	}
}
export class SheetData	{

	public constructor( json: string | object | null = null ){

		if (!json ){
			json = {data:[]}
		}
		if ( typeof json == 'string'){
			json = JSON.parse(json);
		}
		let data = (json as any).data as any[] ?? []; 
		this.id = keyManager.getNewKey();
		this.data = [];
		data.forEach( d  => {
			if (d.data)
			this.data.push( new SheetRow( d.data ))
		});
	}
	
	@JsonString()
	id : string;

	@JsonArrayClassTyped( SheetRow )
	data : SheetRow[] = [];	 

	public addRow(){
		this.data.push(new SheetRow())
	}
}
