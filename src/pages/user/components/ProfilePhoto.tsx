import { Avatar, Button, Group, LoadingOverlay, Modal, Stack, Text } from '@mantine/core'
import { IconPhoto, IconX } from '@tabler/icons-react';
import React, { ChangeEvent, useState } from 'react'
import '../../../assets/css/ImageUploader.css';
import { changeProfilePhoto, removeProfilePhoto } from '../../../requests/profile/_requests';
import { notify } from '../../../requests/general/toast';
import { AxiosError } from 'axios';


const ProfilePhoto = ({profileImage,setProfileImage}:{
    setProfileImage: React.Dispatch<React.SetStateAction<string|undefined>>,
    profileImage: string|undefined
}) => {

    const [fileM, setFileM] = useState<File|null>()
    const [opened, setOpened] = useState(false);
    const [imageLoading, setimageLoading] = useState(false);
    const open = () => setOpened(true);
    const close = () => setOpened(false);
    const [enableSubmit, setEnableSubmit] = useState(false);

    const imageContainerClass = {
        width: '150px',
        overflow: 'hidden', 
        height: '150px', 
        borderRadius: '20px', 
        backgroundImage: `url('../../../assets/images/user.png')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundColor: '#cecece', 
    }
    const imgTagClass = {
        width: 'auto', 
        height: '100%'
    }
    const fileInputClass = {
        marginBottom: '5px', 
        padding: '7px',
        border: '1px solid #cecece'
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const output = document.getElementById('photoProfile') as HTMLImageElement;
        const files = event.target.files;

        if (!files || files.length === 0) {
            return;
        }

        const selectedFile = files[0];

        if(selectedFile.size > 2000000) {
            (document.getElementById('profilePhoto') as HTMLInputElement).value = '';
            notify({
                type:'error',
                message: 'Image is too large. Please select a file less than 2MB.',
            })
            // selectedFile.value = null;
            setEnableSubmit(false);
            return
        }

        setEnableSubmit(true);
        if (output) {
            output.src = URL.createObjectURL(selectedFile);
            output.onload = function() {
                URL.revokeObjectURL(output.src) // free memory
            }
        }
        setFileM(selectedFile);
    }

    const getImageFileObject = async() => {

        setimageLoading(true)

        try {
            if (fileM) {
                const formData = new FormData();
                formData.append('file', fileM);
                const changedPhoto = await changeProfilePhoto(formData);
                if (changedPhoto.data.saved) {
                    setProfileImage(changedPhoto.data.path)
                    setimageLoading(false)
                    setOpened(false)
                    notify({
                    type:'success',
                    message: 'Profile photo has been updated.',
                    })
                }
            }
        } catch(error) {
            setimageLoading(false)
                if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
                  notify({
                    type:'error',
                    message: error.response?.data.message, // Use optional chaining to access data property
                    title: 'Something went wrong'
                  })
                } else {
                  notify({
                    type:'error',
                    message: 'An unexpected error occurred',
                    title: 'Something went wrong'
                  })
                }
        }
    }

    const removePhoto = async() => {
    try {
        const removePhotoForm = await removeProfilePhoto()
        if (removePhotoForm.data.saved) {
            setProfileImage(undefined)
            setimageLoading(false)
            notify({
                type:'success',
                message: removePhotoForm.data.message,
            })
        }
    } catch (err) {
        console.log(err);
    }
    }
      
  return (
    <>
        <Modal opened={opened} size="lg" radius={"lg"} onClose={close} 
        title="Upload Profile Photo" 
        overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
        }}>
            <LoadingOverlay
                visible={imageLoading}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 1 }}
                loaderProps={{ color: 'blue', type: 'bars' }}
            />
                <Group wrap="nowrap" p={20}>
                <div style={imageContainerClass}>
                    <img id="photoProfile" style={imgTagClass}/>
                </div>
                <Stack>
                    <Text c={'orange'} size='sm'>Profile Photo must be less than 2MB</Text>
                    <input type="file" required id='profilePhoto' accept='image/*' onChange={handleChange} style={fileInputClass} />
                    <div>
                        <Button onClick={getImageFileObject} disabled={!enableSubmit} style={{marginRight:'10px'}}>Upload Photo</Button>
                        <Button color='red' variant='light' onClick={close}>Cancel</Button>
                    </div>
                    
                </Stack>
                
                </Group>
                {/* </Card> */}
        </Modal>

        <Avatar
            src={profileImage?profileImage:null}
            size={150}
            radius="md"
        />

        <Stack>
            <Button variant="light" onClick={open} 
                leftSection={<IconPhoto size={14} />} >
                Change
            </Button>
            <Button variant="light" disabled={profileImage?false:true} color='red' onClick={removePhoto}  
                leftSection={<IconX size={14} />} >
                Remove
            </Button>
        </Stack>
    
    </>
  )
}

export default ProfilePhoto
