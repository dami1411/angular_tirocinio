export class Prodotti {
    
    constructor(private id:number, private title:string, private description:string){}
    getProductId(){
        return this.id;
    }

    getProductTitle(){
        return this.title;
    }

    getProductDescription(){
        return this.description;
    }

}
