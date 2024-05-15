import { Product } from "src/app/order/models/product.model";

export class ContractProduct {
    id: number = -1;
    contractId: number = -1;
    product: Product = new Product();
    productId: number = -1;
    qty: number = 0;
    price: number = 0;
    createdAt: string = '';
    updatedAt: string = '';
}