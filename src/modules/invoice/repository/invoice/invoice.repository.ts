import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import invoiceEntity from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import ProductModel from "../product/product.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

    async generate(invoice: invoiceEntity): Promise<Invoice> {
        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map((item)=> {
                return {
                    id: item.id.id,
                    name: item.name,
                    price: item.price
                }
            }),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        }, 
        {
            include: [ProductModel]
        })

        return new Invoice({
            id: invoice.id,
            name: invoice.name,
            document: invoice.document,
            address: invoice.address,
            items: invoice.items,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt   
        })
    }

    async find(id: string): Promise<invoiceEntity> {
        const invoice = await InvoiceModel.findOne({where: {id},
            include: [ProductModel] });
        
        if(!invoice) {
            throw new Error("Invoice not found");
        }

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address(invoice.street,invoice.number,invoice.complement,invoice.city,invoice.state,invoice.zipCode),
            items: invoice.items.map((item)=>  new Product({
                id: new Id(item.id), 
                name: item.name, 
                price: item.price})
        ),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        })
    }
}