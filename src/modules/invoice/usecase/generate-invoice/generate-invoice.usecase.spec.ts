import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const address = new Address("street","123","14","Sao Paulo","SP","12345678");
const product = new Product({
    id: new Id("1"),
    name: "Product 1",
    price: 100.0
});
const product2 = new Product({
    id: new Id("2"),
    name: "Product 2",
    price: 200.0
});

const invoice = new Invoice({
    id: new Id("1"),
    name: "Invoice 1",
    document:"123",
    address: address,
    items: [product, product2]    
})

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn(),
    };
};


describe("Generate invoice Usecase unit test", ()=> {
    it("should generate a invoice", async ()=> {
        const repository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(repository);

        const input = {
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

        const result = await usecase.execute(input);

        expect(repository.generate).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.street).toEqual(invoice.address.street);
        expect(result.number).toEqual(invoice.address.number);
        expect(result.complement).toEqual(invoice.address.complement);
        expect(result.city).toEqual(invoice.address.city);
        expect(result.state).toEqual(invoice.address.state);
        expect(result.zipCode).toEqual(invoice.address.zipCode);
        expect(result.items[0].id).toEqual(invoice.items[0].id.id);
        expect(result.items[0].name).toEqual(invoice.items[0].name);
        expect(result.items[0].price).toEqual(invoice.items[0].price);
        expect(result.items[1].id).toEqual(invoice.items[1].id.id);
        expect(result.items[1].name).toEqual(invoice.items[1].name);
        expect(result.items[1].price).toEqual(invoice.items[1].price);
        expect(result.total).toEqual(300.0);
    });
})