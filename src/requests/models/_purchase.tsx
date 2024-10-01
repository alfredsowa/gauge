import { SupplierBasic, SupplierModel } from "./_business";
import { MaterialModel } from "./_material";

export interface PurchaseModel extends PurchaseBasicModel{
    error: string
    supplier?: SupplierModel;
    material?: MaterialModel;
}
export interface PurchaseBasicModel {
    id: number;
    business_id: number;
    supplier_id: number;
    material_id: number;
    added_by: number;
    status: string;
    purchase_date: string;
    purchase_details?: string;
    quantity: number;
    unit_price: number;
    amount_paid: number;
    tax?: number;
    discounts?: number;
    shipping: string;
    invoice_number: string;
    invoice_upload: string;
    notes: string;
    created_at: string;
    updated_at: string;
    addedBy: AddedBy;
    material_name: string;
    material_image: string;
    supplier_name: string;
    supplier_contact: string;
}
export interface PurchaseBasicCollectionModel {
    data: PurchaseBasicModel[];
}

export interface AddedBy {
    name: string;
    firstname: string;
}

export interface SupplierCollection {
    data: SupplierBasic[];
}

export interface SupplierFull extends SupplierModel{
    purchases: PurchaseBasicModel[];
}

export interface PurchaseSave {
    id?: number;
    supplier_id: number;
    material_id: number;
    status: string;
    purchase_date: string|Date;
    purchase_details?: string;
    quantity: number;
    unit_price: number;
    amount_paid: number;
    tax?: number;
    discounts?: number;
    shipping?: number;
    invoice_number: string;
    invoice_upload?: string;
    notes: string;
}