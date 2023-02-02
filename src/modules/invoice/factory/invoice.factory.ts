import InvoiceRepository from '../repository/invoice/invoice.repository';
import GenerateInvoiceUseCase from '../usecase/generate-invoice/generate-invoice.usecase';
import FindInvoiceUseCase from '../usecase/find-invoice/find-invoice.usecase';
import InvoiceFacade from '../facade/invoice.facade';
export default class InvoiceFactory {


    static create() {
        const repository = new InvoiceRepository();
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository);
        const findInvoiceUseCase = new FindInvoiceUseCase(repository);

        const facade = new InvoiceFacade({
            generateUseCase: generateInvoiceUseCase,
            findUseCase: findInvoiceUseCase
        });

        return facade;
    }
}