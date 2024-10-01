import { Table, Text } from '@mantine/core'
import { ProductCost, ProductModel } from '../../../requests/models/_product'
import { MoneyFigure } from '../../../requests/general/_numberHelper'

const ProductCostAndPricing = ({product,productCosts}:{product: ProductModel|undefined,productCosts: ProductCost|undefined}) => {

    let wholesale_price: number|undefined = product?.wholesale_price
    let retail_price: number|undefined = product?.price

    if(product) {
        
        if(!product?.use_manual_pricing) {

            if(product && productCosts) {
                wholesale_price = productCosts.materials_cost * Number(product.wholesale_markup)
                retail_price = wholesale_price * Number(product.retail_markup)
            }
        
        }
    }
    
    
  return (
    <>
    <Text mb={15}>
        The Wholesale and Retail Prices varies based on your pricing settings.
    </Text>
      <Table withColumnBorders striped withTableBorder verticalSpacing="md">
      <Table.Tbody>
        <Table.Tr>
            <Table.Th>Cost of Materials</Table.Th>
            <Table.Td><MoneyFigure figure={productCosts?.materials_cost}  /></Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Th>Overhead Cost</Table.Th>
            <Table.Td>
                {productCosts && (
                    <MoneyFigure figure={productCosts.overheaad} />
                )}
            </Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Th>Total Cost of Goods</Table.Th>
            <Table.Td><MoneyFigure figure={productCosts?.total_cost_of_goods}  /></Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Th>Wholesale Price</Table.Th>
            <Table.Td>
                <MoneyFigure figure={wholesale_price}  />
            </Table.Td>
        </Table.Tr>
        <Table.Tr>
            <Table.Th>Retail Price</Table.Th>
            <Table.Td><MoneyFigure figure={retail_price}  /></Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
    </>
  )
}

export default ProductCostAndPricing
