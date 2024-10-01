// import React from 'react'
import {useDisclosure} from "@mantine/hooks";
import {Modal} from "@mantine/core";
import {WelcomePopUp} from "./WelcomePopUp.tsx";
import {useLocation} from "react-router-dom";
import {useAuth} from "../auth/core/Auth.tsx";
import {isStringInArray} from "../requests/general/_stringHelper.ts";
import {MaterialsPopUp} from "./MaterialsPopUp.tsx";
import {ProductsPopUp} from "./ProductsPopUp.tsx";
import {SalesPopUp} from "./SalesPopUp.tsx";
import {ProductionsPopUp} from "./ProductionsPopUp.tsx";
import {PurchasesPopUp} from "./PurchasesPopUp.tsx";
import {EmployeesPopUp} from "./EmployeesPopUp.tsx";
import {ReconciliationsPopUp} from "./ReconciliationsPopUp.tsx";
import {useEffect, useState} from "react";
import {getGuides, updateGuides} from "../requests/_dashboardRequests.ts";

const PopUpSetupGuide = () => {
    const {currentUser} = useAuth()
    const [guideList, setGuideList] = useState([]);
    const [opened, { close }] = useDisclosure(true);

    useEffect(() => {
        const getGuide = async () => {
            const response = await getGuides();
            if(Object.keys(response.data).length > 0) setGuideList(JSON.parse(response.data))
        }
        getGuide();
    }, []);
    const currentLocation = useLocation();
    const locationPath = currentLocation.pathname
    const locationPathArray = locationPath.split('/');

    const clearGuide = async () => {
        const guide = guideList.filter((page: string)=> page !== locationPathArray[1])
        const data = {
            guide: guide
        }
        await updateGuides(data)
        setGuideList(guide)
        close();
    }

    let view = null
    if (guideList.length > 0) {

        if (isStringInArray(locationPathArray[1],guideList)) {

            if (locationPathArray[1] === 'dashboard') {
                view = <WelcomePopUp close={clearGuide} currentUser={currentUser} />
            }
            else if (locationPathArray[1] === 'materials') {
                view = <MaterialsPopUp close={clearGuide} />
            }
            else if (locationPathArray[1] === 'products') {
                view = <ProductsPopUp close={clearGuide} />
            }
            else if (locationPathArray[1] === 'sales') {
                view = <SalesPopUp close={clearGuide} />
            }
            else if (locationPathArray[1] === 'productions') {
                view = <ProductionsPopUp close={clearGuide} />
            }
            else if (locationPathArray[1] === 'purchases') {
                view = <PurchasesPopUp close={clearGuide} />
            }
            else if (locationPathArray[1] === 'employees') {
                view = <EmployeesPopUp close={clearGuide} />
            }
            else if (locationPathArray[1] === 'reconciliations') {
                view = <ReconciliationsPopUp close={clearGuide} />
            }
        }
    }


    return (
        <>
        {
            (view)? (
            <>
                <Modal.Root opened={opened} size="xl" onClose={close} m={0} centered>
                    <Modal.Overlay color="#000" backgroundOpacity={0.6} blur={3} />
                    <Modal.Content>
                        {/*<Modal.Header>*/}
                        {/*    <Modal.Title>Modal title</Modal.Title>*/}
                        {/*    <Modal.CloseButton />*/}
                        {/*</Modal.Header>*/}
                        <Modal.Body p={0}>
                            {view}
                        </Modal.Body>
                    </Modal.Content>
                </Modal.Root>

                {/*<Button onClick={open}>Open centered Modal</Button>*/}
            </>
        ):''
        }
</>

    );
}
export default PopUpSetupGuide
