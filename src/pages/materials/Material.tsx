
import useDocumentTitle from '../../hooks/use-document-title'
import MaterialsList from './components/MaterialsList';
import PageTitle from '../../components/PageTitle';
import PopUpSetupGuide from "../../components/PopUpSetupGuide.tsx";
// import Categories from "./components/Categories.tsx";
import {Button} from "@mantine/core";
import {Link} from "react-router-dom";
import {IconPlus} from "@tabler/icons-react";

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
      
        <PageTitle back={false} title="Materials">
            <div>
            {/*    <Categories  />*/}
                <Button ml={'sm'} size={'sm'} component={Link} to={'/materials/add'} variant='filled'
                        leftSection={<IconPlus size={16} />}>Add</Button>
            </div>

        </PageTitle>

      <MaterialsList />


      <PopUpSetupGuide />
      {/* <Pagination total={materialsPaginate?.meta.total} value={materialsPaginate?.meta.current_page} onChange={setPage} mt="sm" /> */}

    </>
  );
}

export default Material