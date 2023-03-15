import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto"
import PlaceOrderUseCase from "./place-order.usecase"

// Date
const mockDate = new Date(2000, 1, 1);


describe("PlaceOrderUseCase unit test", () => {

    /**
     * ValidadeProducs method
     */
    describe("ValidadeProducs method", () => {
        //@ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase()

        /**
         * Shoulnd throw an error if no products are selected
         */
        it("shoulnd throw an error if no products are selected", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "",
                products: []
            }

            await expect(placeOrderUseCase['validateProducts'](input)).rejects.toThrow(
                new Error("No products selected")
            )
        });


        /**
         * Should throw an error when product is out of stock
         */
        it("should throw an error when product is out of stock", async () => {
            // Mock
            const mockProductFacade = {
                checkStock: jest.fn(({ productId }: { productId: string }) =>
                Promise.resolve({
                    productId,
                    stock: productId === "1" ? 0 : 1,
                })
                ),
            };
        
            //@ts-expect-error - force set productFacade
            placeOrderUseCase["_productFacade"] = mockProductFacade;
        
            let input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{ productId: "1" }],
            };
        
            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
                new Error("Product 1 is not available in stock")
            );
        

            // Input
            input = {
                clientId: "0",
                products: [{ productId: "0" }, { productId: "1" }],
            };
        
            await expect(
                placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrow(new Error("Product 1 is not available in stock"));
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);
        

            // Input
            input = {
                clientId: "0",
                products: [{ productId: "0" }, { productId: "1" }, { productId: "1" }],
            };
        
            await expect(
                placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrow(new Error("Product 1 is not available in stock"));
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
        });
    });


    /**
     * GetProducts method
     */
    describe("GetProducts method", () => {

        // Dates
        beforeAll(() => {
            jest.useFakeTimers('modern'),
            jest.setSystemTime(mockDate)
        });

        afterAll(() => {
            jest.useRealTimers()
        });

        //@ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw an error when client not found", async () => {
            
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null),
            };

            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase['_catalogFacade'] = mockCatalogFacade;

            await expect(placeOrderUseCase['getProduct']("0")).rejects.toThrow(
                new Error("Product not found")
            );
        });

        it("should return a product", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "0",
                    name: "Product 0",
                    description: "Product 0 description",
                    salesPrice: 0,
                }),
            };

            // @ts-expect-error - force set catalogFacade
            placeOrderUseCase['_catalogFacade'] = mockCatalogFacade;

            await expect(placeOrderUseCase['getProduct']("0")).resolves.toEqual(
                new Product({
                    id: new Id("0"),
                    name: "Product 0",
                    description: "Product 0 description",
                    salesPrice: 0,
                })
            );

            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);

        });

    });

    /**
     * Execute method
     */
    describe("Execute method", () => {

        beforeAll(() => {
            jest.useFakeTimers('modern'),
            jest.setSystemTime(mockDate)
        });

        afterAll(() => {
            jest.useRealTimers()
        });

        /**
         * Should throw an error when client not found
         */
        it("should throw an error when client not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null)
            }

            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase()

            //@ts-expect-error - force set clientFacade
            placeOrderUseCase['_clientFacade'] = mockClientFacade

            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: []
            }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error("Client not found")
            )
        })

        /**
         * should throw an error when products are not valid
         */
        it("should throw an error when products are not valid", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true)
            }

            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase()

            const mockValidateProducts = jest
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                //@ts-expect-error - not return never
                .mockRejectedValue(new Error("No products selected"));

            //@ts-expect-error - force set clientFacade
            placeOrderUseCase['_clientFacade'] = mockClientFacade

            const input: PlaceOrderInputDto = { 
                clientId: "1", 
                products: []
            }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error("No products selected")
            )

            expect(mockValidateProducts).toHaveBeenCalledTimes(1)
        })


        /**
         * Place an order
         */
        describe("Place an order", () => {

            // Input
            const ClientProps = {
                id: "1c",
                name: "Client 0",
                document: "0000",
                email: "client@user.com",
                street: "some address",
                number: "1",
                complement: "",
                city: "some city",
                state: "some state",
                zipCode: "000",
            };

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(ClientProps)
            }

            const mockPaymentFacade = {
                process: jest.fn(),
            }

            const mockCheckoutRepo = {
                addOrder: jest.fn(),
            }

            const mockInvoiceFacade = {
                create: jest.fn().mockResolvedValue({ id: "1i"})
            }

            const placeOrderUseCase = new PlaceOrderUseCase(
                mockClientFacade as any,
                null,
                null,
                mockCheckoutRepo as any,
                mockInvoiceFacade as any,
                mockPaymentFacade
            );

            const products = {
                "1" : new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "some description 1",
                    salesPrice: 40,
                }),
                "2" : new Product({
                    id: new Id("2"),
                    name: "Product 2",
                    description: "some description 2",
                    salesPrice: 30,
                }),
            }

            const mockValidateProducts = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "validateProducts")
            //@ts-expect-error - spy on private method
            .mockResolvedValue(null)

            const mockGetProduct = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "getProduct")
            //@ts-expect-error - spy on private method
            .mockImplementation((productId: keyof typeof products) => {
                return products[productId];
            });


            it("should not be approved", async () => {

                // Mock
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "error",
                    createAt: new Date(),
                    updateAt: new Date(),
                });

                // Input
                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [{productId: "1"}, {productId: "2"}]
                };

                // Output
                let output = await placeOrderUseCase.execute(input);

                // Expect output
                expect(output.invoiceId).toBeNull()
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    {productId: "1"},
                    {productId: "2"}
                ]);

                // MockClientFacade
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c"});

                // mockValidateProducts
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockValidateProducts).toHaveBeenCalledWith(input);

                // mockGetProduct
                expect(mockGetProduct).toHaveBeenCalledTimes(2);

                // mockCheckoutRepo
                expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);

                // mockPaymentFacade
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });

                // mockInvoiceFacade
                expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(0)

            });

            /**
             * 
             */
            it("should be approved", async () => {

                // Mock
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                  transactionId: "1t",
                  orderId: "1o",
                  amount: 100,
                  status: "approved",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [{ productId: "1" }, { productId: "2" }],
                };
        
                let output = await placeOrderUseCase.execute(input);


                expect(output.invoiceId).toBe("1i");
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                  { productId: "1" },
                  { productId: "2" },
                ]);

                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });

                expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(1);

                expect(mockInvoiceFacade.create).toHaveBeenCalledWith({
                    name: ClientProps.name,
                    document: ClientProps.document,
                    street: ClientProps.street,
                    number: ClientProps.number,
                    complement: ClientProps.complement,
                    city: ClientProps.city,
                    state: ClientProps.state,
                    zipCode: ClientProps.zipCode,
                    items: [
                      {
                        id: products["1"].id.id,
                        name: products["1"].name,
                        price: products["1"].salesPrice,
                      },
                      {
                        id: products["2"].id.id,
                        name: products["2"].name,
                        price: products["2"].salesPrice,
                      },
                    ],
                  });

            });
    

        });
    });

});