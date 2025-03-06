import { Button, Group, Modal, MultiSelect, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';
import { MaterialCategory } from '../../../requests/models/_business';
import { getMaterialCategories } from '../../../requests/_materialsRequests';
import { useNavigate } from 'react-router-dom';
import { IconFilter} from '@tabler/icons-react';

const FilterModal = ({setSearchParams}:{setSearchParams:(params: { categories: string }) => void}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [value, setValue] = useState<string[]>([]);
    const navigate = useNavigate()
    const [categories, setCategories] = useState<MaterialCategory[]>([]);
    useEffect(()=>{
        const categoriesResponse = async() => {
          const response = await getMaterialCategories();
          const data = response.data.data;
          setCategories(data);
        }
        categoriesResponse().then()
    },[]);

    const materialCategories = useMemo(
        () => {
          return categories?.map((category) => ({
            value: `${category.id}`,
            label: category.title,
          }));
        },
        [categories]
      );

    const openFilter = () => {
        open()
    }

    const runFilter = () => {
        
        if (value.length > 0) {
            setSearchParams({ categories: value.toString() });
        }
        else{
            navigate('/materials')
        }
        close()
    }

    const clearFilter = () => {
        setValue([])
        navigate('/materials')
        close()
    }

  return (
    <>

    <Modal opened={opened} size="md" padding='lg' onClose={close}
        // centered
        title={<Text fw={600} fz={17}>Filter Materials</Text>} overlayProps={{
        backgroundOpacity: 0.55,
        blur: 1,
      }}>

        <MultiSelect
        label="Categories"
        placeholder="Choose Categories"
        value={value} onChange={setValue}
        data={materialCategories}
        maxDropdownHeight={200}
        checkIconPosition="right"
        clearable
        />      

        <Group justify='space-between'>
        <Button variant="filled" mt={20} size={'sm'} mr={5} color="gauge-primary" onClick={runFilter}>
            Apply
        </Button>

        <Button variant="light" size={'sm'} mt={20} ml={5} color="red" onClick={clearFilter}>
            Clear
        </Button>
        </Group>
        
    </Modal>
    <Button size={'sm'} variant='light' leftSection={<IconFilter />} title={"Filter"} onClick={openFilter} aria-label="Filter">
         Filter
    </Button>
    </>
  )
}

export default FilterModal
