import {
  Button,
  Card,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  rem,
  Anchor
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {IconArrowRight, IconPlus, IconQrcode, IconX} from "@tabler/icons-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { createMaterial, getMaterialCategories } from "../../requests/_materialsRequests";
import { MaterialCategory } from "../../requests/models/_business";
import TextFieldToolTip from "../../components/TextFieldToolTip";
import { useAuth } from "../../auth/core/Auth";
import { notify } from "../../requests/general/toast";
import { useNavigate } from "react-router-dom";
import PageBreadCrumb from "../../components/PageBreadCrumb";
import { LinkItem, } from "../../requests/models/_general";
import PageTitle from "../../components/PageTitle";
import { AxiosError } from "axios";
import MaterialCategoryForm from "./components/MaterialCategoryForm";
import { unitsAndSymbols } from "../../requests/general/options";

const AddMaterial = () => {
  const [categories, setCategories] = useState<MaterialCategory[]|undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [hasImage, setHasImage] = useState<string|undefined>();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [fileM, setFileM] = useState<File | null>(null)
  const hiddenNewCategory = useRef<HTMLAnchorElement>(null);
  const {currentBusiness} = useAuth()

  const navigate  = useNavigate()

  useEffect(()=>{
    const categoriesResponse = async() => {
      const response = await getMaterialCategories();
      const data = response.data.data;
      setCategories(data);
    }

    categoriesResponse()
  },[])

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleCategoryButtonClick = () => {
    hiddenNewCategory.current?.click();
  };

  const materialCatogories = useMemo(
    () => {
      
      // categoriesResponse()
      return categories?.map((category) => ({
        value: `${category.id}`,
        label: category.title,
      }));
    },
    [categories]
  );

  // const materialMeasureUnit = Object.keys(measure_units)
  // console.log(units);
  
  // useMemo(
  //   () => {
      
  //     // categoriesResponse()
  //     return categories?.map((category) => ({
  //       value: `${category.id}`,
  //       label: category.title,
  //     }));
  //   },
  //   [categories]
  // );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const output = document.getElementById('materialPhoto') as HTMLImageElement;
    const files = event.target.files;

    if (!files || files.length === 0) {
        return;
    }
    const selectedFile = files[0];

    if(selectedFile.size > 5000000) {
        (document.getElementById('materialPhoto') as HTMLInputElement).value = '';
        notify({
            type:'error',
            message: 'Image is too large. Please select a file less than 5MB.',
        })
        return
    }

    if (output) {
        const imageSRC = URL.createObjectURL(selectedFile);
        output.src = URL.createObjectURL(selectedFile);
        setHasImage(imageSRC)
        output.onload = function() {
            URL.revokeObjectURL(output.src) // free memory
        }
    }
    setFileM(selectedFile);
  }
  
  const generalInformation = useForm({
    initialValues: {
      name: '',
      code: '',
      type: '',
      category: '',
      description: '',
      image: '',
      current_stock_level: '',
      minimum_stock_level: '',
      unit_of_measurement: '',
      cost_per_unit: '',
      // total_cost: '',
      // total_items: '',
      is_reusable_after_damaged: false,
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name is too small' : null),
      code: (value) => (value.length > 0 && value.length < 2 ? 'Code is too small' : null),
      type: (value) => ((value !== 'In-house' && value !== 'Sourced') ? 'Invalid type selected' : null),
      category: (value) => ((parseInt(value) < 1) ? 'Invalid category selected' : null),
      current_stock_level: (value) => ((parseInt(value) < 0) ? 'Enter a positive number' : null),
      minimum_stock_level: (value) => ((parseInt(value) < 0) ? 'Enter a positive number' : null),
      cost_per_unit: (value) => ((parseInt(value) < 0) ? 'Enter a positive number' : null),
      // total_cost: (value) => ((parseInt(value) < 0) ? 'Enter a positive number' : null),
      // total_items: (value) => ((parseInt(value) < 0) ? 'Enter a positive number' : null),
      unit_of_measurement: (value) => (value.length < 2 ? 'Must be 2 or more characters' : null),
      description: (value) => value.length < 0 ?(value.length < 2 ? 'Description is too small' : null):null,
    },
  });

  const handleSubmit = async(values: typeof generalInformation.values) => {

    setFormLoading(true)

    if(fileM) {
      const formData = new FormData();
      formData.append('file', fileM);
    }
    else {
      setFileM(null)
    }

    const data = {
      name: values.name,
      code: values.code,
      type: values.type,
      description: values.description,
      image: fileM,
      material_category_id: parseInt(values.category),
      is_reusable_after_damaged: values.is_reusable_after_damaged,
      current_stock_level: parseFloat(values.current_stock_level),
      cost_per_unit: parseFloat(values.cost_per_unit),
      minimum_stock_level: parseFloat(values.minimum_stock_level),
      unit_of_measurement: values.unit_of_measurement,
    }

    try{

      const response = await createMaterial(data)
      
      if(response.data.saved) {

        notify({
          type:'success',
          message: response.data.message,
          title: 'Great'
        })
        setFormLoading(false);

        return navigate('/materials')

      }

    } catch(error) {
      
      if (error instanceof AxiosError) { // Check if error is an instance of AxiosError
        notify({
          type:'error',
          message: error.response?.data.error, // Use optional chaining to access data property
          title: 'Something went wrong'
        })
      } else {
        notify({
          type:'error',
          message: 'An unexpected error occurred',
          title: 'Something went wrong'
        })
      }
      setFormLoading(false);
    }
    
    setFormLoading(false);
  }
  
  const imageContainerClass = {
    width: '150px',
    overflow: 'hidden', 
    height: '150px', 
    borderRadius: '20px', 
    backgroundColor: 'rgb(241 241 241)', 
  }
  const imgTagClass = {
      width: 'auto', 
      height: '100%'
  }
  const fileInputClass = {
      marginBottom: '5px', 
      padding: '7px',
      border: 0,
      display:'none'
  }
  
  const items: Array<LinkItem> = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Materials', href: '/materials' },
    { title: 'Add new material', href: '#' },
  ]

  const clearImage = () => {
    const output = document.getElementById('materialImage') as HTMLImageElement;
    URL.revokeObjectURL(output.src)
    setHasImage(undefined)
  }

  return (
    <>
    <PageTitle title="New Material">
      <PageBreadCrumb pageBreadCrumbs={items} />
    </PageTitle>

    <Group justify="flex-end">
      <MaterialCategoryForm setCategories={setCategories} hiddenNewCategory={hiddenNewCategory} />
    </Group>

    <Stack mt={20} pos={'relative'}>

      <LoadingOverlay
        visible={formLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: 'gauge-primary.4', type: 'bars' }}
      />

      <form method='POST' onSubmit={generalInformation.onSubmit(handleSubmit)}>
        <Card radius={'md'} mb={'lg'} p={30}>

          <Grid mb={40} gutter={{ base: 5, sm: 'md', md: 'xl', xl: 50 }}>
            <Grid.Col span={{ base: 12, sm: 3, md: 3, lg: 3 }}>
                <>

                    <div style={imageContainerClass}>
                      <img id="materialPhoto" src={hasImage} style={imgTagClass}/>
                    </div>
                  

                  <>
                    <Text mt={10} size='md'>Upload material image. <span style={{fontWeight:'500'}}><br />It must be less than 5MB</span></Text>
                    <Button mt={10} mb={4} className="button-upload" variant="light" onClick={handleClick}>
                      Upload a file
                    </Button>
                    <input type="file" id='materialImage' accept='image/*' ref={hiddenFileInput} onChange={handleChange} style={fileInputClass} />
                    <div>
                        {/* <Button onClick={getImageFileObject} disabled={!enableSubmit} mr={5}>Upload Photo</Button> */}
                        
                        {/* <Button color='red' variant='light' onClick={close}>Cancel</Button> */}
                        {
                          hasImage?(
                            <Button mb={4} variant="light" disabled={hasImage?false:true} mr={5} color='red' onClick={clearImage}
                                leftSection={<IconX size={14} />} >
                                Remove
                            </Button>
                          ):null
                        }
                    </div>
                  </>
                </>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 9, md: 9, lg: 9 }}>
            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>

            {/* Material Name */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
              <TextInput
                {...generalInformation.getInputProps('name')}
                key={generalInformation.key('name')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                
                label="Name"
                withAsterisk
                required
                placeholder="White cotton thread"
              />
            </Grid.Col>

            {/* Type */}
            <Grid.Col pt={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
              <Select
                {...generalInformation.getInputProps('type')}
                key={generalInformation.key('type')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                // c={'dimmed'}
                required
                withAsterisk
                
                label="Type"
                placeholder="Pick one"
                data={['In-house', 'Sourced']}
              />
            </Grid.Col>

            {/* Category */}
            <Grid.Col pt={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
              <Select
                {...generalInformation.getInputProps('category')}
                key={generalInformation.key('category')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                // c={'dimmed'}
                required
                withAsterisk
                
                label="Category"
                placeholder="Pick one"
                data={materialCatogories}
                // searchable
                nothingFoundMessage="Not Found"
              />
              <Anchor variant='filled' fw={500} fz={'xs'} onClick={handleCategoryButtonClick}>
                <IconPlus size={10} /> Add New Category
              </Anchor>
            </Grid.Col>
            

            {/* Code */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
              <TextInput
                {...generalInformation.getInputProps('code')}
                key={generalInformation.key('code')}
                radius={"md"}
                leftSection={<IconQrcode style={{ width: rem(16), height: rem(16) }} />}
                variant="filled"
                // c={'dimmed'}
                
                label="Code"
                placeholder="Code"
              />
            </Grid.Col>

            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
              <Divider mb={12}  />
            </Grid.Col>

            {/* Current Stock Level */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
              <NumberInput
                {...generalInformation.getInputProps('current_stock_level')}
                key={generalInformation.key('current_stock_level')}
                radius={"md"}
                variant="filled"
                // c={'dimmed'}
                min={0}
                
                label="Current Stock Level"
                withAsterisk
                thousandSeparator=","
                required
                placeholder="0"
              />
            </Grid.Col>

            {/* Minimum Stock Level */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
              <NumberInput
                {...generalInformation.getInputProps('minimum_stock_level')}
                key={generalInformation.key('minimum_stock_level')}
                radius={"md"}
                leftSection={<TextFieldToolTip title="A alert will be shown when level is equal or less"/>}
                variant="filled"
                // c={'dimmed'}
                 
                min={0}
                label="Min. Stock Level"
                required
                thousandSeparator=","
                withAsterisk
                placeholder="0"
              />
            </Grid.Col>
              
            {/* Unit Cost */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
              <NumberInput
                {...generalInformation.getInputProps('cost_per_unit')}
                key={generalInformation.key('cost_per_unit')}
                radius={"md"}
                variant="filled"
                prefix={currentBusiness?.currency_symbol}
                thousandSeparator=","
                
                step={0.01}
                label="Unit Cost"
                min={0}
                required
                withAsterisk
                placeholder="0"
              />
            </Grid.Col>


            {/* Unit of measure */}
            <Grid.Col pt={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
              <Select
                {...generalInformation.getInputProps('unit_of_measurement')}
                key={generalInformation.key('unit_of_measurement')}
                radius={"md"}
                variant="filled"
                checkIconPosition="right"
                // c={'dimmed'}
                required
                withAsterisk
                
                label="Measure Per Unit"
                placeholder="Pick one"
                data={unitsAndSymbols}
                searchable
                nothingFoundMessage="Not Found"
              />
            </Grid.Col>
            {/* Unit of Measure */}
            {/* <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
              <TextInput
                {...generalInformation.getInputProps('unit_of_measurement')}
                key={generalInformation.key('unit_of_measurement')}
                radius={"md"}
                leftSection={<IconRuler style={{ width: rem(16), height: rem(16) }} />}
                variant="filled"
                // c={'dimmed'}
                
                label="Measure per unit"
                required
                withAsterisk
                placeholder="Kg"
              />
            </Grid.Col> */}

            {/* Reusability */}
            <Grid.Col pt={10} pb={10} span={{ base: 12, sm: 12, md: 8, lg: 8 }}>
              <Switch mb={12} mt={12}
              defaultChecked={false}
              {...generalInformation.getInputProps('is_reusable_after_damaged')}
              key={generalInformation.key('is_reusable_after_damaged')}
              label="Is the material reusable after a damaged production?"
              description="Resusable items are added back to inventory after a damaged production."
              />
            </Grid.Col>

            {/* Description */}
            <Grid.Col pt={10} span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
              <Textarea
                {...generalInformation.getInputProps('description')}
                key={generalInformation.key('description')}
                radius={"md"}
                variant="filled"
                placeholder="You can add more information or specifications..."
                label="Item Description"
                autosize
                minRows={3}
              />
            </Grid.Col>

            {/* Save Button */}
            <Grid.Col pt={10} span={{ base: 12, md: 12, lg: 12 }}>
              <Button  
                type="submit"
                disabled={formLoading}
                px={40}
                variant="filled"
                rightSection={<IconArrowRight size={14} />}>
                Save
              </Button>
            </Grid.Col>
            </Grid>
            </Grid.Col>
          </Grid>
          
        </Card>

      </form>
    </Stack>
    </>
  );
}

export default AddMaterial