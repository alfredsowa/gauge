import useDocumentTitle from '../../hooks/use-document-title'
// import { useLoaderData } from 'react-router-dom'
import ProductsList from './components/ProductsList'
// import { ProductBasicModel } from '../../requests/models/_product'
import PageTitle from '../../components/PageTitle'
import PopUpSetupGuide from "../../components/PopUpSetupGuide.tsx";

const Product = () => {

  // const productsLoader = useLoaderData() as ProductBasicModel[]
  
  useDocumentTitle("Products")

  return (
    <>
      <PageTitle back={false} title='Products' />
      
      <ProductsList />

        <PopUpSetupGuide />
    </>
  )
}

export default Product
