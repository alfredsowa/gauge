
import useDocumentTitle from '../../hooks/use-document-title'
import MaterialsList from './components/MaterialsList';
import PageTitle from '../../components/PageTitle';
import PopUpSetupGuide from "../../components/PopUpSetupGuide.tsx";
import {Button} from "@mantine/core";
import {Link} from "react-router-dom";
import {IconPlus} from "@tabler/icons-react";

const Material = () => {

    useDocumentTitle("Materials")

    return (
        <>
            <PageTitle
                back={false}
                title="Materials"
                button={
                    <Button
                        ml={'sm'}
                        size={'sm'}
                        component={Link}
                        to={'/materials/add'}
                        variant='filled'
                        leftSection={<IconPlus size={16} />}>
                        Add
                    </Button>
                }
            />

            <MaterialsList />

            <PopUpSetupGuide />
        </>
    );
}

export default Material