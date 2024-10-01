import useDocumentTitle from '../../hooks/use-document-title'
import PageTitle from '../../components/PageTitle'
import SalesList from './components/SalesList'
import PopUpSetupGuide from "../../components/PopUpSetupGuide.tsx";

const Sale = () => {
  
  useDocumentTitle("Sales")

  return (
    <>
        <PageTitle back={false} title='Sales' />
      
        <SalesList />

        <PopUpSetupGuide />
    </>
  )
}

export default Sale
