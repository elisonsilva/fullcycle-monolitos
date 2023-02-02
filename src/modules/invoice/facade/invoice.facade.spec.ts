import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice/invoice.model";
import ProductModel from "../repository/product/product.model";
import InvoiceFactory from '../factory/invoice.factory';

describe("InvoiceFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        await sequelize.addModels([InvoiceModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });


    it("should generate a invoice", async () => {
        const facade = InvoiceFactory.create();

        const input = {
            id: "1",
            name: "Invoice 1",
            document: "123",
            street: "street",
            number: "123",
            complement: "14",
            city: "Sao Paulo",
            state: "SP",
            zipCode: "12345678",
            items: [
                { id: "1", name: "Product 1", price: 100.0 },
                { id: "2", name: "Product 2", price: 200.0 }
            ]
        };

        const invoice = await facade.generate(input);

        expect(invoice).toBeDefined();
        expect(invoice.id).toBeDefined();
        expect(invoice.name).toEqual(input.name);
        expect(invoice.document).toEqual(input.document);
        expect(invoice.street).toEqual(input.street);
        expect(invoice.number).toEqual(input.number);
        expect(invoice.complement).toEqual(input.complement);
        expect(invoice.city).toEqual(input.city);
        expect(invoice.state).toEqual(input.state);
        expect(invoice.zipCode).toEqual(input.zipCode);
        expect(invoice.items[0].id).toBe(input.items[0].id);
        expect(invoice.items[0].name).toBe(input.items[0].name);
        expect(invoice.items[0].price).toBe(input.items[0].price);
        expect(invoice.items[1].id).toBe(input.items[1].id);
        expect(invoice.items[1].name).toBe(input.items[1].name);
        expect(invoice.items[1].price).toBe(input.items[1].price);
    });


    it("should find a invoice", async () => {
        const facade = InvoiceFactory.create();

        const input = {
            id: "1",
            name: "Invoice 1",
            document: "123",
            street: "street",
            number: "123",
            complement: "14",
            city: "Sao Paulo",
            state: "SP",
            zipCode: "12345678",
            items: [
                { id: "1", name: "Product 1", price: 100.0 },
                { id: "2", name: "Product 2", price: 200.0 }
            ]
        };

        await InvoiceModel.create({
            id: input.id,
            name: input.name,
            document: input.document,
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,

            items: input.items.map((p) => {
                return {
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
            }),
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            include: [ProductModel]
        });

        const invoice = await facade.find({ id: "1" });

        expect(invoice).toBeDefined();
        expect(invoice.id).toBeDefined();
        expect(invoice.name).toEqual(input.name);
        expect(invoice.document).toEqual(input.document);
        expect(invoice.address.street).toEqual(input.street);
        expect(invoice.address.number).toEqual(input.number);
        expect(invoice.address.complement).toEqual(input.complement);
        expect(invoice.address.city).toEqual(input.city);
        expect(invoice.address.state).toEqual(input.state);
        expect(invoice.address.zipCode).toEqual(input.zipCode);
        expect(invoice.items[0].id).toBe(input.items[0].id);
        expect(invoice.items[0].name).toBe(input.items[0].name);
        expect(invoice.items[0].price).toBe(input.items[0].price);
        expect(invoice.items[1].id).toBe(input.items[1].id);
        expect(invoice.items[1].name).toBe(input.items[1].name);
        expect(invoice.items[1].price).toBe(input.items[1].price);
    });


})