import {onOrder} from "../../pages/stock-forecast";

export interface StockForecastItem {
    rowId: number;
    hist: {
        perDay: number;
        [key:number]:number;
    };
    stockOOS?: string;
    oneMonthOOS?: string;
    fourMonthOOS?: string;
    oo?: number;
    stock?: any;
    oneMonth?: number;
    fourMonth?: number;
    MONTHSTOCKHIST?: any;
    STOCKTOTAL:number;
    onOrder?: onOrder;
    CHECK?: { SF?: StockForecastChecks };
    SKU: string;
    TITLE: string;
    months: Months[];
}

export interface StockForecastChecks {
    HIDE?: boolean;
    LIST?:boolean
}

interface DayBreakdown {
    stock: number;
    stock1?: number;
    stock4?:number;
    onOrderFlag?: boolean;
    restock?: boolean;
}

interface Months {
    style: string;
    dayBreakdown: DayBreakdown[];
    year: number;
    month: number;
    monthText: string;
    eom: number;
}

function dayInfoCalculation(item: StockForecastItem, monthData: Months, day: number, stock:number, hist: number) {
    let currentDay = new Date().getDate();
    let currentMonth = new Date().getMonth();
    let qtyOnOrder = 0
    if (item.onOrder?.[monthData.year]?.[monthData.month]?.[day+1]) {
        qtyOnOrder += item.onOrder[monthData.year][monthData.month][day+1]
    }
    if (day === 0) {
        if (item.onOrder?.late && item.STOCKTOTAL <= 0) {
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
        monthData.dayBreakdown[day].stock = setStock(monthData.dayBreakdown[day - 1].stock!, hist === 0 ? item.fourMonth! : hist, qtyOnOrder)
        if (qtyOnOrder) monthData.dayBreakdown[day].restock = true;
        if (monthData.dayBreakdown[day - 1].onOrderFlag || (qtyOnOrder && monthData.dayBreakdown[day - 1].stock! <= 0)) monthData.dayBreakdown[day].onOrderFlag = true;
        if (day <= 90) {
            monthData.dayBreakdown[day].stock4 = setStock(monthData.dayBreakdown[day - 1].stock4!, item.fourMonth!, qtyOnOrder)
            monthData.dayBreakdown[day].stock1 = setStock(monthData.dayBreakdown[day - 1].stock1!, item.oneMonth!, qtyOnOrder)
        }
    }

    function setStock(old:number, change:number, oo:number) {
        let newStock = old - change;
        if (newStock < 0) newStock = 0
        if (oo) newStock += oo
        return Math.floor(newStock)
    }
}

export function processData(item:StockForecastItem, index:number) {
    if(item.rowId) return item
    item.rowId = index
    item.hist = {perDay: 0}
    item.months = timeSpan()
    item.CHECK ??= {}
    item.CHECK.SF ??= {}
    item.onOrder ??= {late:0, total:0}
    item.fourMonth = lastFourMonthAvg(item.MONTHSTOCKHIST)
    item.oneMonth = lastMonthAvg(item.MONTHSTOCKHIST)

    item.fourMonthOOS = ''
    item.oneMonthOOS = ''
    item.stockOOS = ''


    let initialStock = item.STOCKTOTAL + item.onOrder?.late

    let cm = 0

    for (let month of item.months) {
        let hist = historicAvg(month, item.MONTHSTOCKHIST);
        let day = 0
        item.hist.perDay += hist
        item.hist[month.month] = hist ? hist : Math.max(item.oneMonth, item.fourMonth)
        for (day; day < month.eom ; day++) {

            dayInfoCalculation(item, month, day, initialStock, hist);

            if (month.dayBreakdown[day].stock4! <= 0 && item.fourMonthOOS === '') {
                item.fourMonthOOS = (new Date(month.year, month.month - 1, day+1)).toLocaleDateString()
            }
            if (month.dayBreakdown[day].stock1! <= 0 && item.oneMonthOOS === '') {
                item.oneMonthOOS = (new Date(month.year, month.month - 1, day+1)).toLocaleDateString()
            }
            if (month.dayBreakdown[day].stock! <= 0 && item.stockOOS === '') {
                item.stockOOS = (new Date(month.year, month.month - 1, day+1)).toLocaleDateString()
            }
        }
        initialStock = month.dayBreakdown[month.dayBreakdown.length -1].stock
        month.style = `linear-gradient(90deg, ${createStyle(month.dayBreakdown, cm, month.eom)})`
        cm++
    }
    if(item.hist.perDay > 0) item.hist.perDay = item.hist.perDay / item.months.length

    return item
}

function historicAvg(date:Months, hist:sbt.MonthStockHistory) {
    let cd = new Date();
    let years = 0
    let sales = 0
    for (let y in hist) {
        if (Number(y) === cd.getFullYear()) continue;
        years++
        for (const [month, value] of Object.entries(hist[y])) {
            if (date.month === Number(month)) sales += Number(value)
        }
    }
    if (sales === 0 || years === 0) {
        return 0
    } else {
        let avg = (sales / years) * 1.1
        return avg / date.eom
    }
}

function lastFourMonthAvg(hist:sbt.MonthStockHistory) {
    let cd = new Date()
    let sales = 0;
    let days = 0;

    for (let i = 0; i <= 3; i++) {
        if (hist?.[cd.getFullYear()]) {
            const monthData = hist[cd.getFullYear()][cd.getMonth() + 1 as keyof sbt.MonthStockHistoryMonth]
            if (monthData) {
                sales += Number(monthData)
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

function lastMonthAvg(hist:sbt.MonthStockHistory) {
    let cd = new Date()
    let sales = 0;
    let days = 0;
    if (hist?.[cd.getFullYear()]) {
        const stockThisMonth = hist[cd.getFullYear()][cd.getMonth() + 1 as keyof sbt.MonthStockHistoryMonth]
        if (stockThisMonth) {
            sales += Number(stockThisMonth)
            days += cd.getDate()
        }
        cd.setDate(0)
        const stockLastMonth = hist[cd.getFullYear()][cd.getMonth() + 1 as keyof sbt.MonthStockHistoryMonth]
        if (stockLastMonth) {
            let eom = cd.getDate()
            let daysTaken = eom - days
            days += daysTaken
            let per = (100 / eom) * daysTaken
            sales += (Number(stockLastMonth) / 100) * per
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
    let data: Months[] = []
    for (let i = 0; i < 24; i++) {
        let arr:DayBreakdown[] = []
        for (let ai = 0; ai < endOfMonth(cd); ai++) {
            arr.push({
                stock: 0
            })
        }
        data.push({
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

    function endOfMonth(cd:Date) {
        let eom = new Date(cd.getFullYear(), cd.getMonth() + 1, 0)
        return eom.getDate()
    }
}

function createStyle(data:DayBreakdown[], cm:number, eom:number) {
    let cd = new Date()
    let arr:string[] = []
    for (let i in data) {
        if (data[i].stock > 0) arr[i] = 'var(--traffic-light-red)'
        if (data[i].stock > 0 && cm >= 9) arr[i] = 'var(--traffic-light-green)'
        if (data[i].stock > 0 && cm >= 6 && cm < 9) arr[i] = 'var(--traffic-light-orange)'
        if (data[i].onOrderFlag) arr[i] = '#a6a6a6'
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