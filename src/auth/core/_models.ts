import { SetStateAction } from "react"
import { BusinessModel } from "../../requests/models/_business"

export interface AuthModel {
    error: unknown
    api_token: string
    verified: boolean
    refreshToken?: string
  }
  
  export interface UserAddressModel {
    addressLine: string
    city: string
    state: string
    postCode: string
  }
  
  export interface UserCommunicationModel {
    email: boolean
    sms: boolean
    phone: boolean
  }
  
  export interface UserEmailSettingsModel {
    emailNotification?: boolean
    sendCopyToPersonalEmail?: boolean
    activityRelatesEmail?: {
      youHaveNewNotifications?: boolean
      youAreSentADirectMessage?: boolean
      someoneAddsYouAsAsAConnection?: boolean
      uponNewOrder?: boolean
      newMembershipApproval?: boolean
      memberRegistration?: boolean
    }
  }
  
  export interface UserSocialNetworksModel {
    linkedIn: string
    facebook: string
    twitter: string
    instagram: string
  }
  
  export interface UserModel {
    data: SetStateAction<UserModel | undefined>
    id: number
    name: string
    password: string | undefined
    email: string
    firstname: string
    verified: boolean
    api_token: string
    country?: string
    guide?: string
    avatar_url?: string
    phone?: string
    business_id: number
    business?: BusinessModel 
    auth?: AuthModel
  }
  