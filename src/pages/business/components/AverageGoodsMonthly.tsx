import { useField } from '@mantine/form';
import React, { useState } from 'react'
import { BusinessModel } from '../../../requests/models/_business';
import { notify } from '../../../requests/general/toast';
import { AxiosError } from 'axios';
import { Button, Group, NumberInput } from '@mantine/core';
import { saveAverageGoodsProducedMonthly } from '../../../requests/_businessRequests';

const AverageGoodsMonthly = ({currentBusiness,setCurrentBusiness}:{
    currentBusiness:BusinessModel|undefined,
    setCurrentBusiness: React.Dispatch<React.SetStateAction<BusinessModel|undefined>>
  }) => {
    const [loading, setLoading] = useState(false);

    const field = useField({
        initialValue: currentBusiness?.average_goods_monthly,
        validate: (value) => (value)?(value < 2 ? 'Value is too short' : null):null,
    });

    const handleSubmit = async() => {

        setLoading(true);
    
        try{
          const sendData = await saveAverageGoodsProducedMonthly({
            average_goods_monthly: field.getValue()
          })
    
          setCurrentBusiness(sendData.data);
    
          notify({
            type:'success',
            message: "Average goods per month updated",
            title: 'Successful'
          })
    
        } catch(error) {
            console.log(error);
            
            if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
              notify({
                type:'error',
                message: error.response?.data.error+" Please reload the page and try again.", // Use optional chaining to access data property
                title: 'Something went wrong'
              })
            } else {
              notify({
                type:'error',
                message: 'Please reload the page and try again.',
                title: 'Something went wrong'
              })
            }
        }
        
        setLoading(false);
      }

  return (
    <Group>
      <NumberInput {...field.getInputProps()} placeholder="100" mb="md" />
      <Button onClick={handleSubmit} loading={loading} mb="md">Save</Button>
    </Group>
  )
}

export default AverageGoodsMonthly
