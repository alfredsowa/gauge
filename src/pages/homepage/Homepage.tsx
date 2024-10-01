import { HomepageHeader } from '../../layouts/components/HomepageHeader.tsx'
import LandingPage from './LandingPage.tsx'
import {useAuth} from "../../auth/core/Auth.tsx";
import BenefitSection from "../../layouts/components/BenefitSection.tsx";
import {HomepageFooter} from "../../layouts/components/HomepageFooter.tsx";
import CallToAction from "./CallToAction.tsx";
import ScrollToTop from "../../components/ScrollToTop.tsx";

const Homepage = () => {

    const {currentUser,logout} = useAuth()
  return (
    <div style={{minHeight: '100vh'}}>
        <HomepageHeader currentUser={currentUser} logout={logout} />
        <LandingPage currentUser={currentUser} />
        <BenefitSection />
        <CallToAction />
        <ScrollToTop />
        <HomepageFooter />
    </div>
  )
}

export default Homepage
