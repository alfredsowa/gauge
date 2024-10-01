/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Button, Checkbox, Group, LoadingOverlay, Modal, Stack, Text, Textarea } from '@mantine/core'
import { useField } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconExclamationCircle, IconMessageQuestion } from '@tabler/icons-react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { removeBusiness } from '../../../requests/_businessRequests'
import { useAuth } from '../../../auth/core/Auth'
import { notify } from '../../../requests/general/toast'
import { BusinessModel } from '../../../requests/models/_business'
import PaperCard from '../../../components/PaperCard'
import PaperCardHeader from '../../../components/PaperCardHeader'
import PaperCardBody from '../../../components/PaperCardBody'

const RemoveBusiness = ({currentBusiness}:{currentBusiness: BusinessModel}) => {

  const {logout} = useAuth()
  const [disableButton, setDisableButton] = useState(true)
  // const [disableAccount, setDisableAccount] = useState(true)
  const [deactivateLoading, setdeactivateLoading] = useState(false)
  const [opened, { open, close }] = useDisclosure(false);

  const confirmDeactivateAccount = () => {
      setDisableButton((t) => !t)
  }

  const deactivateComment = useField({
    initialValue: '',
    clearErrorOnChange: false,
  });

  const deactivateAccount = async () => {
    
    setdeactivateLoading(true)

    const comment: string = deactivateComment.getValue();
    console.log(comment);
    

    const deactivated = await removeBusiness({id:currentBusiness.id,comment})

    if (deactivated.data.removed) {
      
      notify({
        title: 'Business Removed Permanently',
        message: `${deactivated.data.message}. You are always welcome back.`,
        type:'success',
      })
      logout()
      setdeactivateLoading(false)
      return <Navigate to='/' replace={true} />

    }
    else {
      notify({
        title:'Error',
        message: deactivated.data.error,
        type: 'error',
      })
    }

    setdeactivateLoading(false)
    close()
  }

  const removePermanentlyModal = () => {
    // setDisableAccount(status)
    open()
  }

  return (
    <>
    <Modal opened={opened} size="lg" onClose={close} 
    title={'Business Deletion'} overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}>
      <LoadingOverlay
        visible={deactivateLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: 'blue', type: 'bars' }}
      />

      <Alert variant="light" radius={"md"}  style={{width: '100%'}} color="blue" title="We're sorry to see you go. Your feedback and experience have been invaluable to us" 
        icon={<IconMessageQuestion />}>
          If there's anything we can do to improve your experience or address any concerns you may have had, 
          please them in the comment box below.

          <Textarea
            {...deactivateComment.getInputProps()}
            // key={deactivateComment.key}
            mt={'md'}
            mb={'md'}
            rows={3}
            radius={'md'}
            size="md"
            placeholder="Leave a comment"
          />
      </Alert>
      <Group justify="flex-end" mt={15}>
      <Button variant="default" onClick={close}>Cancel</Button>
      <Button variant="filled" color={'red'} onClick={deactivateAccount}>Remove Business Permanently</Button>
    </Group>
    </Modal>

      <PaperCard>
        <PaperCardHeader>
          <Text>Deactivate or Remove Account</Text>
        </PaperCardHeader>
        <PaperCardBody>
          <Stack 
          align="flex-start"
          justify="flex-start"
          gap="md" pt={15} pb={15}>

            <Alert variant="light" radius={"md"}  style={{width: '100%'}} color="red" title="You Are Removing Your Account" 
              icon={<IconExclamationCircle />}>
                Please note that by permamently deleting your business, you'll lose access to all data, and benefits associated. 
                If you ever decide to return, you must add a new business.
            </Alert>
            
            <Checkbox type="checkbox"
              mt="md" mb="sm" c={"red"}
              label="I understand and confirm that my business can be permamently removed"
              value="True" onChange={confirmDeactivateAccount}
              />

            <Group justify="space-between" style={{width: '100%'}}>

              <Button variant="filled"  onClick={()=>removePermanentlyModal()} color="red" 
              disabled={disableButton} radius="md">
                  Permanently Remove Business</Button>

            </Group>

          </Stack>
        </PaperCardBody>
      </PaperCard>
    </>
  )
}

export default RemoveBusiness
