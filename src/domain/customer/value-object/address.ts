export default class Address{
    _street: string = "";
    _number: number;
    _city: string = "";    
    _zip: string = "";
    
    constructor(street:string,number:number,city:string,zip:string){
        this._street = street;
        this._city = city;
        this._number = number;
        this._zip = zip;
    }  

    get street(): string{
        return this._street;
    }

    get number(): number{
        return this._number;
    }

    get city(): string{
        return this._city;
    }

    get zip(): string{
        return this._zip;
    }

    validate(){
        if(this._street.length === 0){  
            throw new Error("Street is required");
        }

        if(this._city.length === 0){  
            throw new Error("City is required");
        }

        if(this._number === undefined){  
            throw new Error("Number is required");
        }

        if(this._zip.length === 0){  
            throw new Error("Zip is required");
        }
    }

    toString(){
        return `${this._street}, ${this._city}, ${this._number}, ${this._zip}`;
    }
}