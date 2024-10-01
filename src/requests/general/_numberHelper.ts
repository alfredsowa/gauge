import {useAuth} from "../../auth/core/Auth";
import {measure_units} from "./options";

const MoneyFigure = ({figure}:{figure?: number|undefined}) => {
  const { currentBusiness } = useAuth();

  if(!figure) return currentBusiness?.currency+" "+0;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentBusiness?.currency,
      minimumFractionDigits: 2,
    }).format(Number(figure));

}

const moneyFig = (figure: number|undefined) => {
  return MoneyFigure({figure})
}

const PrettyFigure = ({figure}:{figure: number|undefined}) => {

  if(IsDecimal(figure)) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
    }).format(Number(figure));
  }
    return new Intl.NumberFormat('en-US',{
      minimumFractionDigits: 0,
    }).format(Number(figure));

}

const PrettyPercentage = ({figure}:{figure: number|undefined}) => {

  return new Intl.NumberFormat('en-US',{
    minimumFractionDigits: 0,
  }).format(Math.round(Number(figure)))+'%';

}

const IsDecimal = (value: number|undefined) =>
{
  if (value === undefined) return false
  return (value - Math.floor(value)) !== 0;
}

const GetWithUnit = ({figure,unit,symbol=false}:{figure: number,unit: string|undefined,symbol?:boolean}) => {

  if(figure === undefined) return 'N/A'

  let value = PrettyFigure({figure: figure})

  if(!measure_units[unit as keyof typeof measure_units]) return value+" "+unit

  if (symbol) {
    value += ` ${measure_units[unit as keyof typeof measure_units].symbol}`
  }
  else{
    if(Number(figure) > 1) {

      value += ` ${measure_units[unit as keyof typeof measure_units].plural}`

    }
    else{
      value += ` ${unit}`
    }
  }

  return value
}


export {MoneyFigure,PrettyFigure,PrettyPercentage,IsDecimal,moneyFig, GetWithUnit};