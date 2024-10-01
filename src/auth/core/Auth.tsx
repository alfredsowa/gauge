/* eslint-disable react-refresh/only-export-components */
import {useState, useEffect, createContext, useContext, Dispatch, SetStateAction, ReactNode} from 'react'
import {AuthModel, UserModel} from './_models'
import * as authHelper from './AuthHelpers'
import {getUserByToken} from './_requests'
import SplashScreen from '../../pages/SplashScreen'
import { BusinessModel } from '../../requests/models/_business'
import { initBusiness } from '../../requests/_businessRequests'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  currentBusiness: BusinessModel | undefined
  setCurrentBusiness: Dispatch<SetStateAction<BusinessModel | undefined>>
  logout: () => void
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  currentBusiness: undefined,
  setCurrentBusiness: () => {},
  logout: () => {},
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider = ({children}: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()
  const [currentBusiness, setCurrentBusiness] = useState<BusinessModel | undefined>()
  
  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const logout = () => {
    saveAuth(undefined)
    setCurrentUser(undefined)
  }

  return (
    <AuthContext.Provider value={{auth, saveAuth, currentUser, setCurrentUser, currentBusiness, setCurrentBusiness, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit = ({children}: { children: ReactNode }) => {
  const {auth, currentUser, logout, setCurrentUser, setCurrentBusiness} = useAuth()
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    const requestUser = async (apiToken: string) => {
      try {
        if (!currentUser) {

          const data = await getUserByToken(apiToken)
          
          if (data) {
            setCurrentUser(data)
            const businessData = await initBusiness(apiToken)
            setCurrentBusiness(businessData.data)
          }
          else {
            logout()
          }
        }
      } catch (error) {
        if (currentUser) {
          logout()
        }
      } finally {
        setShowSplashScreen(false)
      }
    }

    if (auth && auth.api_token) {
      requestUser(auth.api_token)
    } else {
      logout()
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <SplashScreen  /> : <>{children}</>
}

export {AuthProvider, AuthInit, useAuth}
