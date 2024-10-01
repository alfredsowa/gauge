export const DefaultDate = ({dateFormat}:{dateFormat: string|undefined}) => {
    if (dateFormat) {
        // const date = new Date();
        const d = new Date(dateFormat);
        // const formatter = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
        // const formattedTime = formatter.format(d);
        return d.toLocaleDateString()
        // return d.getFullYear()+'-'+((d.getMonth() < 10)?0:'')+d.getMonth()+'-'+((d.getDay() < 10)?0:'')+d.getDay();
    }
    return '-';
}

export const DefaultDateTime = ({dateFormat}:{dateFormat: string|Date}) => {
    if (dateFormat) {
        const d = new Date(dateFormat);
        return d.getFullYear()+'-'+((d.getMonth() < 10)?0:'')+d.getMonth()+'-'+((d.getDay() < 10)?0:'')+d.getDay()+' '+((d.getHours() < 10)?0:'')+d.getHours() + ':' + ((d.getMinutes() < 10)?0:'')+d.getMinutes()+((d.getHours() < 10)?' AM':'');
    }
    return '-';
}

export const DefaultReadableDate = ({dateFormat}:{dateFormat: string|undefined}) => {
    if (dateFormat) {
        const d = new Date(dateFormat);
        return d.toDateString();
    }
    return '-';
}

export const getFullMonth = (index?: number) => {
    const d = new Date();

    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August','September','October','November','December'];

    if(index && index < 11 && index >= 0) {

        return month[index-1]
    }
    return month[d.getMonth()];

}

export const getShortMonth = (index?: number) => {
    const d = new Date();
    
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep','Oct','Nov','Dec'];

    if(index && index < 11 && index >= 0) {
        return month[index-1]
    }
    return month[d.getMonth()];

}

export const getMonthYear = (string: string) => {
    const d = new Date(string);
    
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep','Oct','Nov','Dec'];

    return month[d.getMonth()]+" "+d.getFullYear();

}