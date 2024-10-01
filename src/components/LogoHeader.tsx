import { useEffect, useState } from 'react'
import light_logo from '../assets/images/gauge-primary.png'
import dark_logo from '../assets/images/gauge-logo-white.png'
import { Image, useComputedColorScheme } from '@mantine/core'

const LogoHeader = () => {
    const [logo, setLogo] = useState(light_logo)
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    useEffect(() => {
      // Add event listener to change logo color based on theme
      const themeListener = () => {
        (computedColorScheme === 'light')?setLogo(light_logo):setLogo(dark_logo)
      }
      themeListener()
      return () => window.removeEventListener('storage', themeListener)  // Remove event listener when component unmounts to prevent memory leak
    },[computedColorScheme])

  return (
    <>
      <Image
        h={35}
        radius="sm"
        src={logo}
        // mb={"sm"}
      />
    </>
  )
}

export default LogoHeader
