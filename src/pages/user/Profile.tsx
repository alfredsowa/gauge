import { Navigate} from "react-router-dom";
import { useAuth } from "../../auth/core/Auth";
import 'react-image-upload/dist/index.css'
import { Divider, Grid, Group, Skeleton, Stack, Text } from "@mantine/core";
import PersonalDetails from "./components/PersonalDetails";
import ChangeEmail from "./components/ChangeEmail";
import UpdatePassword from "./components/UpdatePassword";
import DeactivateAccount from "./components/DeactivateAccount";
import { useEffect, useState } from "react";
import { api_token } from "../../requests/profile/_requests";
import { getUserByToken } from "../../auth/core/_requests";
import ProfilePhoto from "./components/ProfilePhoto";
import useDocumentTitle from '../../hooks/use-document-title'
import PageTitle from "../../components/PageTitle";
import PaperCard from "../../components/PaperCard";
import PaperCardHeader from "../../components/PaperCardHeader";
import PaperCardBody from "../../components/PaperCardBody";

const Profile = () => {
  const {currentUser, setCurrentUser} = useAuth()
  const [profileImage, setProfileImage] = useState<string|undefined>()
  const [loading, setLoading] = useState(false);
  useDocumentTitle('Profile')

  useEffect(() => {

    setLoading(true)

    const getUserDetailsResponse = async()=> {
      const response = await getUserByToken(api_token)
      setCurrentUser(response);
    }
    
    getUserDetailsResponse()
    setProfileImage(currentUser?.avatar_url);

    
    setLoading(false)

  },[setCurrentUser,currentUser?.avatar_url]);
  

  if (!currentUser) {
    return <Navigate to='/login' />
  }

  return (
  <>
    <PageTitle title="Profile"  />
    {(loading)?(
      <>
      <Skeleton height={50} circle mb="xl" />
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </>
    ):(
      <>
      {/* <Container> */}
      
      <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>

        <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>

          <PaperCard>
            <PaperCardBody>
              <Group wrap="wrap">

                <ProfilePhoto profileImage={profileImage} setProfileImage={setProfileImage}  />

              </Group>
            </PaperCardBody>
          </PaperCard>

          <PersonalDetails currentUser={currentUser} setCurrentUser={setCurrentUser}  />

          <PaperCard>
            <PaperCardHeader>
              <Text>Sign-in Method</Text>
            </PaperCardHeader>
            <PaperCardBody>
            <Stack 
              align="flex-start"
              justify="flex-start"
              gap="md" pt={15} pb={15}>

              <ChangeEmail currentUser={currentUser} setCurrentUser={setCurrentUser}  />
              
              <Divider variant="dashed" />
              
              <UpdatePassword  />

            </Stack>
            </PaperCardBody>
          </PaperCard>

          <DeactivateAccount  />

        </Grid.Col>
      </Grid>
      </>
    )}
    </>
  );
}

export default Profile