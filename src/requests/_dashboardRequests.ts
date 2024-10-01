import axios from "axios";
import { getAuth } from "../auth/core/AuthHelpers";
import { CardAnalyticsModel } from "./models/_dashboard";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_ANALYTICS = `${API_URL}/dashboard/analytics`;
export const GET_GUIDES = `${API_URL}/get-guides`;
export const SET_GUIDES = `${API_URL}/update-guides`;
export const SEND_FEEDBACK = `${API_URL}/submit-feedback`;

const getAuthData = getAuth()

export const api_token = getAuthData?.api_token

const config = {
  headers: { Authorization: `Bearer ${api_token}` }
};

type dateParam = {
  month?: number|undefined,year?: number|undefined
}
// // Server should return Product object
export function getCardAnalytics(date?:dateParam) {
 
  if(date) {
      const dateFormat = `${date.year}-${date.month}-01`
    return axios.get<CardAnalyticsModel>(GET_ANALYTICS+'?date='+dateFormat,config);

  }
  return axios.get<CardAnalyticsModel>(GET_ANALYTICS,config);
}

export function getGuides() {
  return axios.get(GET_GUIDES,config);
}
export function updateGuides(data:{guide: string[]}) {
  return axios.post(SET_GUIDES,data,config);
}
export function sendFeedback(data:{type: string,feedback: string}) {
  return axios.post(SEND_FEEDBACK,data,config);
}
