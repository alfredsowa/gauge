import { HomepageHeader } from '../../layouts/components/HomepageHeader.tsx'
import LandingPage from './LandingPage.tsx'
import {useAuth} from "../../auth/core/Auth.tsx";
import BenefitSection from "./BenefitSection.tsx";
import {HomepageFooter} from "../../layouts/components/HomepageFooter.tsx";
import CallToAction from "./CallToAction.tsx";
import ScrollToTop from "../../components/ScrollToTop.tsx";
import WhySection from './WhySection.tsx';

const Homepage = () => {

    const {currentUser,logout} = useAuth()
  return (
    <div style={{minHeight: '100vh'}}>
        <HomepageHeader currentUser={currentUser} logout={logout} />
        <LandingPage currentUser={currentUser} />
        <WhySection />
        <BenefitSection />
        <CallToAction />
        <ScrollToTop />
        <HomepageFooter />
    </div>
  )
}

export default Homepage
