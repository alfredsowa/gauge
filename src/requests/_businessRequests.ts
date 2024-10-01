import axios from "axios";
import { getAuth } from "../auth/core/AuthHelpers";
import { BusinessModel, Overhead, SaveOverhead } from "./models/_business";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_BUSINESS_BY_ID = `${API_URL}/business`;
export const REMOVE_BUSINESS = `${API_URL}/remove-business`;
export const CHANGE_LOGO = `${API_URL}/change-business-logo`;
export const REMOVE_LOGO = `${API_URL}/remove-business-logo`;
export const GET_DEFAULT_BUSINESS_BY_ID = `${API_URL}/default-business`;
export const CREATE_BUSINESS = `${API_URL}/setup-business/details`;
export const UPDATE_BUSINESS_COMPONENTS = `${API_URL}/setup-business/components`;
export const UPDATE_BUSINESS_LOCATION = `${API_URL}/setup-business/location`;
export const UPDATE_BUSINESS_COMPLETED = `${API_URL}/setup-business/complete`;
export const UPDATE_BUSINESS_AVERAGE_GOODS_PRODUCED_MONTHLY = `${API_URL}/save-average-monthly-goods`;
export const SAVE_OVERHEAD = `${API_URL}/save-overhead`;
export const REMOVE_OVERHEAD = `${API_URL}/remove-overhead`;
export const GET_OVERHEADS = `${API_URL}/overheads`;
export const UPDATE_BUSINESS_OTHER_INFORMATION = `${API_URL}/setup-business/other-information`;

const getAuthData = getAuth()

export const api_token = getAuthData?.api_token

const config = {
  headers: { Authorization: `Bearer ${api_token}` }
};

export interface OnboardingData {
  business_id?: number|undefined;
  business_name?: string|undefined;
  business_email?: string|undefined;
  business_contact?: string|undefined;
  business_website?: string|undefined;
  business_city?: string|undefined;
  business_country?: string|undefined;
  business_type?: string|undefined;
  business_industry?: string|undefined;
  business_size?: string|undefined;
  business_logo?: string|undefined;
  business_currency?: string|undefined;
  business_language?: string|undefined;
  business_timezone?: string|undefined;
  business_address?: string|undefined;
  business_tax_identification_number?: string|undefined;
}

// Server should return BusinessModel
export function businessDetails(business_id: number|undefined) {
  return axios.get<BusinessModel>(`${GET_BUSINESS_BY_ID}/${business_id}`,config);
}

// Server should return BusinessModel
export function initBusiness(bearer_token: string|undefined) {
  return axios.get<BusinessModel>(GET_DEFAULT_BUSINESS_BY_ID,{
    headers: { Authorization: `Bearer ${bearer_token}` }
  });
}

// Server should return BusinessModel
export function defaultBusiness() {
  return axios.get<BusinessModel>(GET_DEFAULT_BUSINESS_BY_ID,config);
}

// Server should return BusinessModel
export function createBusiness(data: {name: string|undefined, email: string|undefined, id: number|undefined}) {
  return axios.post<BusinessModel>(CREATE_BUSINESS,data,config);
}

// Server should return BusinessModel
export function updateBusinessComponents(data: {business_type: string|undefined, business_size: string|undefined, industry: string|undefined, id: number}) {
  return axios.post<BusinessModel>(UPDATE_BUSINESS_COMPONENTS,data,config);
}

// Server should return BusinessModel
export function updateBusinessLocation(data: {country: string|undefined, city: string|undefined, currency: string|undefined, id: number|undefined}) {
  return axios.post<BusinessModel>(UPDATE_BUSINESS_LOCATION,data,config);
}

// Server should return BusinessModel
export function updateBusinessOtherInformation(data: {
  language: string|undefined, 
  website: string|undefined, 
  address: string|undefined, 
  contact: string|undefined, 
  tax_identification_number: string|undefined, 
  id: number|undefined
}) {
  return axios.post<BusinessModel>(UPDATE_BUSINESS_OTHER_INFORMATION,data,config);
}

export function updateBusinessCompleted(data: {id: number|undefined}) {
  return axios.post<BusinessModel>(UPDATE_BUSINESS_COMPLETED,data,config);
}

export function saveAverageGoodsProducedMonthly(data: {average_goods_monthly: number|undefined}) {
  return axios.post<BusinessModel>(UPDATE_BUSINESS_AVERAGE_GOODS_PRODUCED_MONTHLY,data,config);
}

export function getOverheads() {
  return axios.get<Overhead[]>(GET_OVERHEADS, config);
}

export function removeOverhead(data: {id: number|undefined}) {
  return axios.post<SaveOverhead>(REMOVE_OVERHEAD,data,config);
}

export function saveOverhead(data: {title: string|undefined,cost: number|undefined}) {
  return axios.post<SaveOverhead>(SAVE_OVERHEAD,data,config);
}

export function removeBusiness(data: {id: number|undefined, comment: string|null}) {
  return axios.post(REMOVE_BUSINESS,data,config);
}

export function removeBusinessLogo() {
  return axios.post(REMOVE_LOGO,null,config)
}

export const changeBusinessLogo = async (imageFile: unknown) => {
  return axios.post(CHANGE_LOGO,imageFile,{
    headers: {
      Authorization: `Bearer ${api_token}`,
      "Content-Type": "multipart/form-data",
    },
  })
}