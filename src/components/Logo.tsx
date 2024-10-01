import { useEffect, useState } from 'react'
import light_logo from '../assets/images/gauge-primary.png'
import dark_logo from '../assets/images/gauge-logo-light.png'
import { Image } from '@mantine/core'

const Logo = () => {
  const [logo, setLogo] = useState(light_logo)

  useEffect(() => {
    // Add event listener to change logo color based on theme
    const themeListener = () => {
      if(localStorage.getItem('mantine-color-scheme-value') === 'light'){
        setLogo(light_logo)
      }
      else {
        setLogo(dark_logo)
      }
    }
    window.addEventListener('storage', themeListener)
    return () => window.removeEventListener('storage', themeListener)  // Remove event listener when component unmounts to prevent memory leak
  },[])

  return (
    <>
      <Image src={logo} />
    </>
  )
}

export default Logo
