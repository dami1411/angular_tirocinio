import { Prodotti } from "./prodotti.model";
import { Utenti } from "./utenti.model";

export interface WishList {
    id: string,
    email: string,
    productKey: string
}
