import { ProductBasicModel } from '../../../requests/models/_product'
import { ActionIcon, Anchor, Badge, Button, Card, Grid, Group, Image, Menu, rem, Text, Title } from '@mantine/core'
import { IconCopy, IconDots, IconEye, 
    // IconGasStation, IconGauge, IconManualGearbox, IconUsers, 
    IconTrash } from '@tabler/icons-react';
import classes from '../assets/ProductGrid.module.css';
import product_image from '../../../assets/images/no-product.jpg';
import { PrettyFigure } from '../../../requests/general/_numberHelper';
import { Link } from 'react-router-dom';

// const mockdata = [
//     { label: '4 passengers', icon: IconUsers },
//     { label: '100 km/h in 4 seconds', icon: IconGauge },
//     { label: 'Automatic gearbox', icon: IconManualGearbox },
//     { label: 'Electric', icon: IconGasStation },
//   ];

const ProductListGrid = ({row,duplicateProductData,openDeleteModal}:{row: ProductBasicModel,duplicateProductData: (id: number) => Promise<void>,
    openDeleteModal: (id: number) => void
}) => {
    // const features = mockdata.map((feature) => (
    //     <Center key={feature.label}>
    //       <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
    //       <Text size="xs">{feature.label}</Text>
    //     </Center>
    //   ));

  return (
    <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }} style={{ minHeight: "350px" }}>
    <Card className={classes.card} h={'100%'}>
      <Card.Section className={classes.imageSection}>
        <Anchor component={Link} to={`/products/${row.slug}/view`}>
        <Image src={row.image?row.image:product_image} width={'100%'} alt={row.name} />
        </Anchor>
      </Card.Section>

      <Group justify="space-between" mt="md">
        <div>
          <Title fz={'h5'} fw={600}>{row.name}</Title>
          <Text fz="sm" c="dimmed">
            Quantity Available: <PrettyFigure figure={row.stock_quantity} />
          </Text>
        </div>
        {
            (row.stock_quantity <= 0)? 
            (<Badge variant="outline" color="red">Out of stock </Badge>):
            (row.min_stock_quantity > row.stock_quantity)? 
            (<Badge variant="outline" color={'yellow'}> Running out </Badge>):
            (<Badge variant="outline" color={'green'}> In stock </Badge>)
        }
        {/* <Badge variant="outline">25% off</Badge> */}
      </Group>

      <Card.Section className={classes.section}>
        <Group gap={30}>
            <Button component={Link} to={`/products/${row.slug}/edit`} variant={'outline'} size='sm' radius="sm" style={{ flex: 1 }}>
                Edit
            </Button>
            <div>
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                    <ActionIcon size={'lg'} color='gray' variant="light" aria-label="Settings">
                        <IconDots style={{ width: '70%', height: '70%' }} stroke={2} />
                    </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item component={Link} to={`/products/${row.slug}/view`}
                            leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                            View
                        </Menu.Item>
                        
                        <Menu.Item onClick={()=>duplicateProductData(row.id)}
                            leftSection={<IconCopy style={{ width: rem(14), height: rem(14) }} />}>
                            Duplicate
                        </Menu.Item>
                    <Menu.Divider />

                    <Menu.Label>Danger zone</Menu.Label>
                    
                    <Menu.Item 
                        onClick={()=>openDeleteModal(row.id)}
                            color="red"
                            leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                        >
                        Delete
                    </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </div>
        </Group>
      </Card.Section>
    </Card>
    </Grid.Col>
  )
}

export default ProductListGrid
