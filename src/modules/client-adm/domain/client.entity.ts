import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type ClientProps = {
  id?: Id;
  name: string;
  email: string;
  address: string;
  document: string;
  street: string;
  complement: string;
  city: string;
  state: string;
  zipcode: string;
  number: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Client extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _email: string;
  private _address: string;
  private _document: string;
  private _street: string;
  private _complement: string;
  private _city: string;
  private _state: string;
  private _zipcode: string;
  private _number: string;

  constructor(props: ClientProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._email = props.email;
    this._address = props.address;
    this._document = props.document;
    this._street = props.street;
    this._complement = props.complement;
    this._city = props.city;
    this._state = props.state;
    this._zipcode = props.zipcode;
    this._number = props.number;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get address(): string {
    return this._address;
  }
  get city() { return this._city;}
  get complement() { return this._complement;}
  get document() { return this._document;}
  get street() { return this._street;}
  get state() { return this._state;}
  get zipcode() { return this._zipcode;}
  get number() { return this._number;}
}
