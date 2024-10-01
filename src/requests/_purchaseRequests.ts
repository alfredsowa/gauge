import axios from "axios";
import { getAuth } from "../auth/core/AuthHelpers";
// import { Params } from "react-router-dom";
import { PurchaseBasicCollectionModel, PurchaseBasicModel, PurchaseModel, PurchaseSave, SupplierCollection, SupplierFull } from "./models/_purchase";
import { Params } from "react-router-dom";
import { SupplierBasic } from "./models/_business";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_PURCHASES = `${API_URL}/purchases`;
export const GET_BASIC_PURCHASES = `${API_URL}/purchases-basic`;
export const GET_PURCHASE_BY_ID = `${API_URL}/purchases`;
export const CREATE_PURCHASE = `${API_URL}/purchase/create`;
export const DELETE_BY_ID = `${API_URL}/purchase/delete`;
export const GET_SUPPLIERS = `${API_URL}/suppliers`;
export const GET_SUPPLIER_FULL = `${API_URL}/supplier`;
export const SAVE_SUPPLIER = `${API_URL}/suppliers/save`;
export const DELETE_SUPPLIER_BY_ID = `${API_URL}/suppliers/delete`;

const getAuthData = getAuth()

export const api_token = getAuthData?.api_token

const config = {
  headers: { Authorization: `Bearer ${api_token}` }
};

// Server should return MaterialModel object
export function getPurchase(id: number) {
  return axios.get<PurchaseModel>(GET_PURCHASE_BY_ID+'/'+id,config);
}

// Server should return MaterialModel object
export function getBasicPurchase(id: number) {
  return axios.get<PurchaseBasicModel>(GET_PURCHASE_BY_ID+'/'+id,config);
}

// Server should return MaterialModel object
export function getPurchases() {
  return axios.get<PurchaseBasicCollectionModel>(GET_BASIC_PURCHASES,config);
}

// Server should creates new Purchase
export function createPurchase(data: PurchaseSave) {
  return axios.post(CREATE_PURCHASE,data,config);
}

// Server should return SuppliersModel object
export function getSuppliers() {
  return axios.get<SupplierCollection>(GET_SUPPLIERS,config);
}

// Server should return SuppliersModel object
export function getSupplierFull(id: number) {
  return axios.get<SupplierFull>(`${GET_SUPPLIER_FULL}/${id}`,config);
}

export function deletePurchase(id: number|undefined) {
  return axios.post(DELETE_BY_ID,{id},config)
}

export function saveSupplier(data: SupplierBasic) {
  return axios.post(SAVE_SUPPLIER,data,config)
}

export function deleteSupplier(id: number|undefined) {
  return axios.post(DELETE_SUPPLIER_BY_ID,{id},config)
}

export async function purchaseLoader ({ params }: { params: Params<"id"> }){
  const getPurchaseResponse = await getBasicPurchase(Number(params.id));
  const getPurchaseData: PurchaseBasicModel = getPurchaseResponse.data
  return getPurchaseData;
}
