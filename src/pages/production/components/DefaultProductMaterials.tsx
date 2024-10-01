import PaperCard from '../../../components/PaperCard'
import PaperCardBody from '../../../components/PaperCardBody'
import { Alert, Button } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { ProductionBasicModel } from '../../../requests/models/_production'
import { toHeadline } from '../../../requests/general/_stringHelper'
import { resetMaterials } from '../../../requests/_productionRequests'
import { notify } from '../../../requests/general/toast'

const DefaultProductMaterials = ({production}:{production: ProductionBasicModel}) => {

    const setDefaultMaterials = async () => {
        // TODO: implement API call to reset default materials for this production
        // await resetMaterials(production.id)
        // notify('Default materials have been reset successfully.')

        const response = await resetMaterials({production_id:Number(production.id)})
        if(response.data.saved) {
            notify({
                type:'success',
                message: response.data.message,
                title: 'Reset Default Materials'
            })

            window.location.reload()
        }
    }

  return (
    <PaperCard>
      <PaperCardBody>
        <Alert variant="light" radius="md" title={`Use current ${toHeadline(production.type)} materials`} 
            icon={<IconInfoCircle />}>
              Click on the button to update the production materials with the latest {toHeadline(production.type)} materials information. <br />
            <Button onClick={setDefaultMaterials} mt={20} variant="filled">Reset Materials</Button>
        </Alert>
      </PaperCardBody>
    </PaperCard>
  )
}

export default DefaultProductMaterials
