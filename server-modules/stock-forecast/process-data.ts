import {onOrder} from "../../pages/stock-forecast";

interface stockForecastItem {
    hist?: {
        perDay?: number;
    };
    stockOOS?: string;
    oneMonthOOS?: string;
    fourMonthOOS?: string;
    oo?: number;
    stock?: any;
    oneMonth?: number;
    fourMonth?: number;
    MONTHSTOCKHIST?: any;
    onOrder?: onOrder;
    CHECK?: { SF?: { HIDE?: boolean } };
    SKU?: string;
    months: Months[];
}

interface DayBreakdown {
    stock?: number;
    stock1?: number;
    stock4?:number;
    onOrderFlag?: boolean;
    restock?: boolean;
    day: number;
    month: number;
    year: number;
}

interface Months {
    style: string;
    dayBreakdown: DayBreakdown[];
    year: number;
    month: number;
    monthText: string;
    eom: number;
}


function dayInfoCalculation(item: stockForecastItem, monthData: Months, day: number, data, stock, hist: number) {
    let currentDay = new Date().getDate();
    let currentMonth = new Date().getMonth();
    let qtyOnOrder = 0
    if (item.onOrder?.[monthData.year]?.[monthData.month]?.[day+1]) {
        qtyOnOrder += item.onOrder[monthData.year][monthData.month][day+1]
    }
    if (day === 0) {
        if (item.onOrder?.late && data.STOCKTOTAL <= 0) {
            monthData.dayBreakdown[day].restock = true;
            monthData.dayBreakdown[day].onOrderFlag = true;
        }
        monthData.dayBreakdown[day].stock = setStock(stock, 0, qtyOnOrder)
        monthData.dayBreakdown[day].stock4 = setStock(stock, 0, qtyOnOrder)
        monthData.dayBreakdown[day].stock1 = setStock(stock, 0, qtyOnOrder)
    } else if (day < currentDay && currentMonth === monthData.month) {
        if (monthData.dayBreakdown[day - 1].onOrderFlag) monthData.dayBreakdown[day].onOrderFlag = true;
        monthData.dayBreakdown[day].stock = setStock(stock, 0, qtyOnOrder)
        monthData.dayBreakdown[day].stock4 = setStock(stock, 0, qtyOnOrder)
        monthData.dayBreakdown[day].stock1 = setStock(stock, 0, qtyOnOrder)
    } else {
        monthData.dayBreakdown[day].stock = setStock(monthData.dayBreakdown[day - 1].stock, hist === 0 ? item.fourMonth : hist, qtyOnOrder)
        if (qtyOnOrder) monthData.dayBreakdown[day].restock = true;
        if (monthData.dayBreakdown[day - 1].onOrderFlag || (qtyOnOrder && monthData.dayBreakdown[day - 1].stock <= 0)) monthData.dayBreakdown[day].onOrderFlag = true;
        if (day <= 90) {
            monthData.dayBreakdown[day].stock4 = setStock(monthData.dayBreakdown[day - 1].stock4, item.fourMonth, qtyOnOrder)
            monthData.dayBreakdown[day].stock1 = setStock(monthData.dayBreakdown[day - 1].stock1, item.oneMonth, qtyOnOrder)
        }
    }

    function setStock(old, change, oo) {
        let newStock = old - change;
        if (newStock < 0) newStock = 0
        if (oo) newStock += oo
        return newStock
    }
}

export function processData(data) {
    let item = timeSpan()
    item.SKU = data.SKU
    item.CHECK = data.CHECK
    item.CHECK ??= {}
    item.CHECK.SF ??= {}

    item.onOrder = data.onOrder ? data.onOrder : {late:0, total:0}
    item.fourMonth = lastFourMonthAvg(data.MONTHSTOCKHIST)
    item.oneMonth = lastMonthAvg(data.MONTHSTOCKHIST)
    item.stock = data.STOCKTOTAL

    item.fourMonthOOS = ''
    item.oneMonthOOS = ''
    item.stockOOS = ''


    let initialStock = data.STOCKTOTAL + item.onOrder?.late

    let cm = 0
    for (let month of item.months) {
        let hist = historicAvg(month, data.MONTHSTOCKHIST);
        let day = 0
        item.hist ??= {perDay:0}
        item.hist.perDay += hist
        item.hist[month.month] = hist ? hist : Math.max(item.oneMonth, item.fourMonth)
        for (day; day < month.eom ; day++) {

            dayInfoCalculation(item, month, day, data, initialStock, hist);

            if (month.dayBreakdown[day].stock4 <= 0 && item.fourMonthOOS === '') {
                item.fourMonthOOS = dateFromDayBreakDown(month.dayBreakdown[day])
            }
            if (month.dayBreakdown[day].stock1 <= 0 && item.oneMonthOOS === '') {
                item.oneMonthOOS = dateFromDayBreakDown(month.dayBreakdown[day])
            }
            if (month.dayBreakdown[day].stock <= 0 && item.stockOOS === '') {
                item.stockOOS = dateFromDayBreakDown(month.dayBreakdown[day])
            }
        }
        initialStock = month.dayBreakdown[month.dayBreakdown.length -1].stock
        month.style = `linear-gradient(90deg, ${createStyle(month.dayBreakdown, cm, month.eom)})`
        cm++
    }
    item.hist.perDay = item.hist.perDay / item.months.length

    return item

    function dateFromDayBreakDown(data) {
        let date = new Date(data.year, data.month - 1, data.day)
        return date.toLocaleDateString()
    }
}


function historicAvg(date, hist) {
    let cd = new Date();
    let years = 0
    let sales = 0
    for (let y in hist) {
        if (Number(y) === cd.getFullYear()) continue;
        years++
        for (let m in hist[y]) {
            if (date.month === Number(m)) sales += Number(hist[y][m])
        }
    }
    if (sales === 0 || years === 0) {
        return 0
    } else {
        let avg = (sales / years) * 1.1
        return avg / date.eom
    }
}

function lastFourMonthAvg(hist) {
    let cd = new Date()
    let sales = 0;
    let days = 0;

    for (let i = 0; i <= 3; i++) {
        if (hist?.[cd.getFullYear()]) {
            if (hist[cd.getFullYear()][cd.getMonth() + 1]) {
                sales += Number(hist[cd.getFullYear()][cd.getMonth() + 1])
                days += cd.getDate()
            }
        }
        cd.setDate(0)
    }
    if (sales === 0 && days === 0) {
        return 0
    } else {
        return sales / days
    }
}

function lastMonthAvg(hist) {
    let cd = new Date()
    let sales = 0;
    let days = 0;
    if (hist?.[cd.getFullYear()]) {
        if (hist[cd.getFullYear()][cd.getMonth() + 1]) {
            sales += Number(hist[cd.getFullYear()][cd.getMonth() + 1])
            days += cd.getDate()
        }
        cd.setDate(0)
        if (hist[cd.getFullYear()][cd.getMonth() + 1]) {
            let eom = cd.getDate()
            let daysTaken = eom - days
            days += daysTaken
            let per = (100 / eom) * daysTaken
            sales += (Number(hist[cd.getFullYear()][cd.getMonth() + 1]) / 100) * per
        }
    }
    if (sales === 0 && days === 0) {
        return 0
    } else {
        return sales / days
    }
}

export function timeSpan() {
    let cd = new Date()
    cd.setDate(1)
    let monthDisplay = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let data:stockForecastItem = {months: []}
    for (let i = 0; i < 24; i++) {
        let arr:DayBreakdown[] = []
        for (let ai = 0; ai < endOfMonth(cd); ai++) {
            arr.push({
                day: ai + 1,
                month: cd.getMonth() + 1,
                year: cd.getFullYear(),
            })
        }
        data.months.push({
            dayBreakdown: arr,
            style: "",
            year: cd.getFullYear(),
            month: cd.getMonth() + 1,
            monthText: monthDisplay[cd.getMonth()],
            eom: endOfMonth(cd)
        })
        cd.setMonth(cd.getMonth() + 1)
    }
    return data;

    function endOfMonth(cd) {
        let eom = new Date(cd.getFullYear(), cd.getMonth() + 1, 0)
        return eom.getDate()
    }
}

function createStyle(data, cm, eom) {
    let cd = new Date()
    let arr = []
    for (let i in data) {
        if (data[i].stock > 0) arr[i] = 'var(--traffic-light-red)'
        if (data[i].stock > 0 && cm >= 9) arr[i] = 'var(--traffic-light-green)'
        if (data[i].stock > 0 && cm >= 6 && cm < 9) arr[i] = 'var(--traffic-light-orange)'
        if (data[i].ooFlag) arr[i] = '#a6a6a6'
        if (data[i].stock1 === 0) arr[i] = '#ffffff'
        if (data[i].stock4 === 0) arr[i] = '#e6e6e6'
        if (data[i].stock === 0) arr[i] = 'transparent'

        if (Number(i) < cd.getDate() - 1 && cm === 0) arr[i] = '#b3b3b3'
        if (data[i].restock) arr[i] = '#3333ff'
    }

    function compressArray(array:any[], eom:number){
        let compressed = []
        for(let i in array){
            let previousIndex = Number(i) - 1
            if(i === "0"){
                compressed.push({color:array[i], count:1})
                continue
            }

            if(array[previousIndex] === array[i]){
                compressed[compressed.length - 1].count ++
            } else {
                compressed.push({color:array[i], count:1})
            }
        }

        let string = ""
        let previousPercent = 0
        let previousColor = ""
        for(let v of compressed){
            if(previousPercent === 0){
                previousPercent = Math.floor((100/eom)*v.count)
                string += `${v.color} ${previousPercent}%, ${v.color} ${previousPercent}%`
            } else {
                string += `, ${previousColor} ${Math.floor((100/eom)*v.count)}%, ${v.color} ${Math.floor((100/eom)*v.count)}%`
            }

            previousPercent = Math.floor((100/eom)*v.count)
            previousColor = v.color
        }
        return string
    }

    return compressArray(arr, eom)
}