import Id from '../../../@shared/domain/value-object/id.value-object';
import Invoice from '../../domain/invoice.entity';
import InvoiceGateway from '../../gateway/invoice.gateway';
import { GenerateInvoiceInputDto, GenerateInvoiceOutputDto } from './generate-invoice.usecase.dto';
import Product from '../../domain/product.entity';
import Address from '../../../@shared/domain/value-object/address.value-object';
export default class GenerateInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository;
  }

  async execute(input: GenerateInvoiceInputDto): Promise<GenerateInvoiceOutputDto>{

    const address = new Address(
      input.street,
      input.number,
      input.complement,
      input.city,
      input.state,
      input.zipCode
    );
    const product = input.items.map((item) => (
        new Product({
            id: new Id(item.id), 
            name: item.name, 
            price: item.price})
    ))
    const props = {
        id: new Id(),
        name: input.name,
        document: input.document,
        address: address,
        items: product,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    const invoice = new Invoice(props);
    await this._invoiceRepository.generate(invoice);

    return {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        items: invoice.items.map((item) => ({
            id: item.id.id,
            name: item.name,
            price: item.price
        })),
        total: invoice.total
      }

  }
}