import 'react-image-upload/dist/index.css'
import { Grid, Group } from "@mantine/core";
import { useState } from "react";
import BusinessDetails from './components/BusinessDetails';
import { useAuth } from '../../auth/core/Auth';
import BusinessIdentity from './components/BusinessIdentity';
import BusinessLocation from './components/BusinessLocation';
import BusinessOthersInfo from './components/BusinessOthersInfo';
import RemoveBusiness from './components/RemoveBusiness';
import ProfilePhoto from './components/ProfilePhoto';
import useDocumentTitle from '../../hooks/use-document-title'
import PageTitle from '../../components/PageTitle';
import OverheadCost from './components/OverheadCost';
import PaperCard from '../../components/PaperCard';
import PaperCardBody from '../../components/PaperCardBody';

const BusinessProfile = () => {
  const {currentBusiness, setCurrentBusiness} = useAuth()
  const [profileImage, setProfileImage] = useState<string|undefined>(currentBusiness?.logo)

  useDocumentTitle("Business Profile");
  return (
  <>
    <PageTitle title="Busniess Profile"  />
      
      <Grid gutter={{ base: 5, xs: 'd', md: 'xl', xl: 50 }}>
        <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
          <PaperCard>
            <PaperCardBody>
              <Group wrap="nowrap">
                <ProfilePhoto  profileImage={profileImage} setProfileImage={setProfileImage} />
              </Group>
            </PaperCardBody>
          </PaperCard>

          {currentBusiness && (
          <>
          <BusinessDetails currentBusiness={currentBusiness} setCurrentBusiness={setCurrentBusiness}  />

          <BusinessIdentity currentBusiness={currentBusiness} setCurrentBusiness={setCurrentBusiness} />
          
          <BusinessLocation currentBusiness={currentBusiness} setCurrentBusiness={setCurrentBusiness} />
          
          <BusinessOthersInfo currentBusiness={currentBusiness} setCurrentBusiness={setCurrentBusiness} />
          
          <RemoveBusiness currentBusiness={currentBusiness} />
          </>
          
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <OverheadCost  />
        </Grid.Col>
      </Grid>
      {/* </Container> */}
      </>
    // )}
    // </>
  );
}

export default BusinessProfile