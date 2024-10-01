import axios from "axios";
import { getAuth } from "../../auth/core/AuthHelpers";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const SAVE_PERSONAL_DETAILS = `${API_URL}/save-personal-profile`;
export const CHANGE_EMAIL_ADDRESS = `${API_URL}/change-email`;
export const UPDATE_PASSWORD = `${API_URL}/update-password`;
export const CHANGE_PROFILE_PHOTO = `${API_URL}/change-profile-photo`;
export const REMOVE_PROFILE_PHOTO = `${API_URL}/remove-profile-photo`;

const getAuthData = getAuth()

export const api_token = getAuthData?.api_token

const config = {
  headers: { Authorization: `Bearer ${api_token}` }
};

type PersonalDetails = {
  name: string,
  firstname: string,
  phone: string|undefined,
  country: string|undefined,
}
// Server should return AuthModel
export function personalDetails(data: PersonalDetails) {
  return axios.post(SAVE_PERSONAL_DETAILS, data,config);
}

export function changeEmailAddress({ email, password }:{ email: string, password: string}) {
  return axios.post(CHANGE_EMAIL_ADDRESS,{ email: email, password: password},config)
}

type changePassword = { 
  current_password: string, 
  password: string, 
  password_confirmation: string 
}

export function updatePassword(data: changePassword) {
  return axios.post(UPDATE_PASSWORD,data,config)
}

export function removeProfilePhoto() {
  return axios.post(REMOVE_PROFILE_PHOTO,null,config)
}

export const changeProfilePhoto = async (imageFile: unknown) => {
  return axios.post(CHANGE_PROFILE_PHOTO,imageFile,{
    headers: {
      Authorization: `Bearer ${api_token}`,
      "Content-Type": "multipart/form-data",
    },
  })
}