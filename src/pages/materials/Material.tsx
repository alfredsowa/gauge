
import useDocumentTitle from '../../hooks/use-document-title'
import MaterialsList from './components/MaterialsList';
import PageTitle from '../../components/PageTitle';
import PopUpSetupGuide from "../../components/PopUpSetupGuide.tsx";

const Material = () => {
  // const [materialsList, setMaterialsList] = useState<MaterialCollectionData[] | undefined>();
  //
  //
  //
  // useEffect(() => {
  //   const queryDataResponse = async () => {
  //     const response = await getMaterials()
  //     if(response.data.data){
  //       setMaterialsList(response.data.data)
  //     }
  //   }
  //   queryDataResponse()
  // },[])
  useDocumentTitle("Materials")
  return (
    <>
      
      <PageTitle back={false} title="Materials"  />

      <MaterialsList />


      <PopUpSetupGuide />
      {/* <Pagination total={materialsPaginate?.meta.total} value={materialsPaginate?.meta.current_page} onChange={setPage} mt="sm" /> */}

    </>
  );
}

export default Material