import { toHeadline } from "./_stringHelper"

export const purchaseStatusOptions = ['Draft', 'Supplied']
export const guideModules = [
    "dashboard",
    "materials",
    "products",
    "sales",
    "productions",
    "purchases",
    "suppliers",
    "employees",
    "reconciliations",
]

export const priorityOptions = ['low', 'normal','critical']

export const productionTypeOptions = ['intermediate_good', 'product']

export const productionCategoryOptions = ['product', 'sample','training']
export const productionCategoryList = [
     {
        name: 'product',
        label: 'Allows for labour cost and estimated time. The items produced are added to inventory.',
    },{
        name:'sample',
        label: 'Items produced does not update inventory and allows for labour cost only. It is suitable for testing out new designs or products.',
    },{
        name:'training',
        label: 'Both labour cost and estimated hours are not allowed. It is recommended for training purposes only.',
    }
]
export const productionStatusList = [
     {
        name:   'in_progress',
        label: 'The production is up and running. Additional materials can be added to the production during this stage.',
    },
    {
        name:   'on_hold',
        label:  'Indicates that the production has been halted. Additional materials can be added to the production during this stage',
    },
    {
        name:   'quality_control',
        label:  'The production  has been halted for quality control. No additional materials can be added to the production during this stage',
    },
    {
        name:   'cancel',
        label:  'The production will be cancel and all materials will be returned to inventory.',
    },
    {
        name:   'damaged',
        label:  'The production will be ended and only resuable materials will be returned to inventory.',
    }
]

export const productionStatusOptions = ['backlog', 'in_progress', 'on_hold', 'quality_control', 'cancel', 'damaged', 'completed']
export const productionDontAlterMaterials = ['quality_control', 'cancel', 'damaged', 'completed']
export const productionEnds = ['cancel', 'damaged', 'completed']

export const saleStatusOptions = [
    "pending",
    "returned",
    "completed",
]

export const salesTypeOptions = ['retail','wholesale']
export const salesChannelOptions = ['in-person','website','social_media','exhibition']

export const paymentMethodOptions = [
    "cash",
    "mobile_payment",
    "debit_card",
    "online_banking",
    "cheque",
    "other"
]

export const overhead = [
    "Rent and Utilities",
    "Salaries and Wages",
    "Depreciation",
    "Maintenance and Repairs",
    "Insurance",
    "Office Supplies",
    "Legal and Accounting Fees",
    "Advertising and Marketing",
    "Shipping and Freight",
    "Quality Control",
    "Training and Development",
    "IT and Software Expenses",
    "Administrative Expenses",
    "Equipment Leasing",
    "Interest on Loans"
];

export const paymentStatusOptions = [
    "pending",
    "paid",
    "refunded",
    // "partially_refunded",
    "on_hold"
]

export const measure_units = 
    {
        "Bag": {
            "plural": "Bags",
            "symbol": "bag"
        },
        "Box": {
            "plural": "Boxes",
            "symbol": "bx"
        },
        "Centimeter": {
            "plural": "Centimeters",
            "symbol": "cm"
        },
        "Cubic Meter": {
            "plural": "Cubic Meters",
            "symbol": "m³"
        },
        "Gallon": {
            "plural": "Gallons",
            "symbol": "gal"
        },
        "Gram": {
            "plural": "Grams",
            "symbol": "g"
        },
        "Inch": {
            "plural": "Inches",
            "symbol": "in"
        },
        "Kilogram": {
            "plural": "Kilograms",
            "symbol": "kg"
        },
        "Liter": {
            "plural": "Liters",
            "symbol": "L"
        },
        "Meter": {
            "plural": "Meters",
            "symbol": "m"
        },
        "Milliliter": {
            "plural": "Milliliters",
            "symbol": "mL"
        },
        "Millimeter": {
            "plural": "Millimeters",
            "symbol": "mm"
        },
        "Ounce": {
            "plural": "Ounces",
            "symbol": "oz"
        },
        "Pack": {
            "plural": "Packs",
            "symbol": "pk"
        },
        "Piece": {
            "plural": "Pieces",
            "symbol": "pc"
        },
        "Pound": {
            "plural": "Pounds",
            "symbol": "lb"
        },
        "Roll": {
            "plural": "Rolls",
            "symbol": "rl"
        },
        "Square Meter": {
            "plural": "Square Meters",
            "symbol": "m²"
        },
        "Ton": {
            "plural": "Tons",
            "symbol": "t"
        },
        "Yard": {
            "plural": "Yards",
            "symbol": "yd"
        }
    }
    
export const units = Object.keys(measure_units)
export const unitsAndSymbols = Object.keys(measure_units).map(((measure: string)=>{
    return {
        value: measure,
        label: `${measure} (${measure_units[measure as keyof typeof measure_units].symbol})`,
    }
}))

export const setSingleOptions = (arrayList: string[]) => {
    if(arrayList.length > 0) {
        return arrayList.map((item: string) => {
            return {
                value: item,
                label: toHeadline(item),
            }
        })
    }
}

export const getUnit = (figure: number,unit: string|undefined,symbol=false) => {
    let value = `${figure} ${unit}`

    if (symbol) {
        value = `${figure} ${measure_units[unit as keyof typeof measure_units].symbol}`
    }  else if(figure > 1) {
        value = `${figure} ${measure_units[unit as keyof typeof measure_units].plural}`
    }

    return value
}

//Audit
export const reconciliationTypes = [
    'materials',
    // 'sales'
]
