import { Sequelize } from "sequelize-typescript";


import { InvoiceModel } from "./invoice.model";
import ProductModel from '../product/product.model';
import InvoiceRepository from "./invoice.repository";
import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import Address from "../../../@shared/domain/value-object/address.value-object";


describe("Client Repository Test", ()=> {

    let sequelize: Sequelize;

    beforeEach(async ()=> {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true}
        });

        await sequelize.addModels([InvoiceModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async ()=> {
      await sequelize.close();
    });

    it("should find a invoice", async () => {

        const invoice = new Invoice({
            id:  new Id("1"),
            name:  "Product 1",
            document:  "document",
            address: new Address(
                "street",
                "123",
                "14",
                "Sao Paulo",
                "SP",
                "123456",
            ),
            items: [
                new Product({id: new Id("1"), name: "Product 1", price: 100.0}),
                new Product({id: new Id("2"), name: "Product 2", price: 200.0})
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const repository = new InvoiceRepository();
        await repository.generate(invoice);
        const result = await repository.find(invoice.id.id);
      
        expect(result.id.id).toEqual(invoice.id.id);
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.address.street).toEqual(invoice.address.street);
        expect(result.address.number).toEqual(invoice.address.number);
        expect(result.address.complement).toEqual(invoice.address.complement);
        expect(result.address.city).toEqual(invoice.address.city);
        expect(result.address.state).toEqual(invoice.address.state);
        expect(result.address.zipCode).toEqual(invoice.address.zipCode);
        expect(result.createdAt).toEqual(invoice.createdAt);
        expect(result.updatedAt).toEqual(invoice.updatedAt);
        expect(result.total).toBe(300.0);
        expect(result.items[0].id.id).toBe(invoice.items[0].id.id);
        expect(result.items[0].name).toBe(invoice.items[0].name);
        expect(result.items[0].price).toBe(invoice.items[0].price);
        expect(result.items[1].id.id).toBe(invoice.items[1].id.id);
        expect(result.items[1].name).toBe(invoice.items[1].name);
        expect(result.items[1].price).toBe(invoice.items[1].price);  
    });

    it("should generate a invoice", async () => {
        const invoice = new Invoice({
            id:  new Id("1"),
            name:  "Product 1",
            document:  "document",
            address: new Address(
                "street",
                "123",
                "14",
                "Sao Paulo",
                "SP",
                "123456",
            ),
            items: [
                new Product({id: new Id("1"), name: "Product 1", price: 100.0}),
                new Product({id: new Id("2"), name: "Product 2", price: 200.0})
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const repository = new InvoiceRepository();
        const result = await repository.generate(invoice);

        expect(result.id.id).toEqual(invoice.id.id);
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.address.street).toEqual(invoice.address.street);
        expect(result.address.number).toEqual(invoice.address.number);
        expect(result.address.complement).toEqual(invoice.address.complement);
        expect(result.address.city).toEqual(invoice.address.city);
        expect(result.address.state).toEqual(invoice.address.state);
        expect(result.address.zipCode).toEqual(invoice.address.zipCode);
        expect(result.createdAt).toEqual(invoice.createdAt);
        expect(result.updatedAt).toEqual(invoice.updatedAt);
        expect(result.total).toBe(300.0);
        expect(result.items[0].id.id).toBe(invoice.items[0].id.id);
        expect(result.items[0].name).toBe(invoice.items[0].name);
        expect(result.items[0].price).toBe(invoice.items[0].price);
        expect(result.items[1].id.id).toBe(invoice.items[1].id.id);
        expect(result.items[1].name).toBe(invoice.items[1].name);
        expect(result.items[1].price).toBe(invoice.items[1].price);  
    });


});
