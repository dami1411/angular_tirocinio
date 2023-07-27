/*export class Utenti {
    
    constructor(private id:string,private username:string,private email:string, private password:string) {}
    
    getUserId(){
        return this.id;
    } 
    getUsername(){
        return this.username;
    }

    getUserEmail(){
        console.log(this.email);
        return this.email;
    }

    getUserPassword(){
        return this.password;
    }
}*/
export interface Utenti{
    id:string,
    username:string,
    email:string,
    password:string,
    role: string
}

