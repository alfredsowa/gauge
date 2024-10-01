import axios from "axios";
import { AuthModel, UserModel } from "./_models";
import { removeAuth } from "./AuthHelpers";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
export const LOGIN_URL = `${API_URL}/login`;
export const REGISTER_URL = `${API_URL}/sign-up`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot-password`;
export const CONFIRM_PASSWORD_URL = `${API_URL}/confirm-reset-password`;
export const VERIFY_EMAIL_URL = `${API_URL}/confirm-verification-code`;
export const RESEND_VERIFY_EMAIL_URL = `${API_URL}/resend-verification-code`;
export const DEACTIVATE_ACCOUNT_URL = `${API_URL}/deactivate-account`;

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    password,
  });
}

// Server should return AuthModel
export function register(
  name: string,
  firstname: string,
  email: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    name: name,
    firstname: firstname,
    email: email,
    password: password,
    password_confirmation: password_confirmation,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function sendResetPasswordCode(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function comfirmNewPassword(
  email: string, 
  code: string, 
  password: string, 
  password_confirmation: string) {
  return axios.post<{ result: boolean }>(CONFIRM_PASSWORD_URL, {
    email,code,password,password_confirmation
  });
}

export async function getUserByToken(token: string|undefined) {

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  try {
      // return token
      const response = await axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {},config);
      return response.data as UserModel;

    } catch (error) {
      removeAuth()
    }

}

export async function verifyEmail(api_token: string,code: string) {
  const config = {
    headers: { Authorization: `Bearer ${api_token}` }
  };

  const response = await axios.post<UserModel>(VERIFY_EMAIL_URL,{'code':code},config);
  return response.data as UserModel;

}

export const resendVerifyToken = async (token: string) => {

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // return token
  const response = await axios.post(RESEND_VERIFY_EMAIL_URL, {},config);
  return response;
}

export const accountDeactivation = async (token: string|undefined, disableAccount: boolean, feedback: string|null) => {

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // return token
  const response = await axios.post(DEACTIVATE_ACCOUNT_URL, {disableAccount,feedback},config);
  return response;
}