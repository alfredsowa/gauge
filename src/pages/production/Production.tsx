import useDocumentTitle from '../../hooks/use-document-title'
// import { useQuery } from '@tanstack/react-query'
// import { getProductions } from '../../requests/_productionRequests'
import ProductionList from './components/ProductionList'
import PageTitle from '../../components/PageTitle'
// import { useLoaderData } from 'react-router-dom'
// import { ProductionBasicModel } from '../../requests/models/_production'
import PopUpSetupGuide from "../../components/PopUpSetupGuide.tsx";

const Production = () => {
  // const productions = useLoaderData() as ProductionBasicModel[]
  // const {data} = useQuery({
  //   queryKey: ['productions'],
  //   queryFn: getProductions
  // })

  useDocumentTitle("Productions")

  return (
    <>
      <PageTitle back={false} title='Production' />
      
      <ProductionList />

      <PopUpSetupGuide />
    </>
  )
}

export default Production
