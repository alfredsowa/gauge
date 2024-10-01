import axios from "axios";
import { getAuth } from "../auth/core/AuthHelpers";
// import { Params } from "react-router-dom";
// import { salesBasicCollectionModel, salesBasicModel, salesModel, salesSave, SupplierCollection, SupplierFull } from "./models/_sales";
import { Params } from "react-router-dom";
import { CustomerBasicCollectionModel, CustomerBasicModel, CustomerModel, CustomerSave, SalesBasicCollectionModel, SalesBasicModel, SalesModel, SalesSave } from "./models/_sales";
// import { SupplierBasic } from "./models/_business";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_SALES = `${API_URL}/sales`;
// export const GET_BASIC_SALES = `${API_URL}/sales-basic`;
export const GET_SALES_BY_ID = `${API_URL}/sales`;
export const CREATE_SALES = `${API_URL}/sales/save`;
export const DELETE_BY_ID = `${API_URL}/sales/delete`;
export const GET_CUSTOMERS = `${API_URL}/customers`;
export const GET_CUSTOMER_FULL = `${API_URL}/customers`;
export const SAVE_CUSTOMER = `${API_URL}/customers/save`;
export const DELETE_CUSTOMER_BY_ID = `${API_URL}/customers/delete`;

const getAuthData = getAuth()

export const api_token = getAuthData?.api_token

const config = {
  headers: { Authorization: `Bearer ${api_token}` }
};

// Server should return MaterialModel object
export function getSale(id: number) {
  return axios.get<SalesModel>(GET_SALES_BY_ID+'/'+id,config);
}

// Server should return MaterialModel object
export function getBasicSale(id: number) {
  return axios.get<SalesBasicModel>(GET_SALES_BY_ID+'/'+id,config);
}

// Server should return MaterialModel object
export function getSales() {
  return axios.get<SalesBasicCollectionModel>(GET_SALES,config);
}

//Loader function
export async function salesLoader (): Promise<SalesBasicModel[]>{
  const getSaleResponse = await getSales();
  const getSalesData: SalesBasicModel[] = getSaleResponse.data.data
  return getSalesData;
}

// Server should creates new sales
export function createSales(data: SalesSave) {
  return axios.post(CREATE_SALES,data,config);
}

// Server should return Customers object
export function getCustomers() {
  return axios.get<CustomerBasicCollectionModel>(GET_CUSTOMERS,config);
}

// Server should return Customers object
export function getCustomerById(id: number) {
  return axios.get<CustomerModel>(GET_CUSTOMER_FULL+'/'+id,config);
}

export function deleteSales(id: number|undefined) {
  return axios.post(DELETE_BY_ID,{id},config)
}

export function saveCustomers(data: CustomerSave) {
  return axios.post(SAVE_CUSTOMER,data,config)
}

export function deleteCustomer(id: number|undefined) {
  return axios.post(DELETE_CUSTOMER_BY_ID,{id},config)
}

export async function customersLoader (){
  const get_customers_response = await getCustomers();
  const get_customers_data: CustomerBasicModel[] = get_customers_response.data.data
  return get_customers_data;
}

export async function customerLoader ({ params }: { params: Params<"id"> }){
  const get_customer_response = await getCustomerById(Number(params.id));
  const get_customer_data: CustomerModel = get_customer_response.data
  return get_customer_data;
}

export async function editSalesLoader ({ params }: { params: Params<"id"> }){
  const getsalesResponse = await getBasicSale(Number(params.id));
  const getsalesData: SalesBasicModel = getsalesResponse.data
  return getsalesData;
}

export async function viewSalesLoader ({ params }: { params: Params<"id"> }){
  const getsaleResponse = await getSale(Number(params.id));
  const getsaleData: SalesModel = getsaleResponse.data
  return getsaleData;
}

// export const queryDataResponse = async () => {

//   const response = await getMaterials()
//   const allMaterials = response.data.data;
//   return {allMaterials}
  
// }
