import { Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceModel } from "../invoice/invoice.model";

@Table({
    tableName: "products",
    timestamps: false,
})
export default class ProductModel extends Model {
   @PrimaryKey
   @Column({allowNull: false})
   id: string;

   @Column({allowNull: false})
   name: string;

   @Column({allowNull: false})
   price: number;

   @ForeignKey(() => InvoiceModel)
   @Column({ allowNull: false, field: "invoice_id" })
   invoice_id: string;

}