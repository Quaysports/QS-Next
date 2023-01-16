import {onOrder} from "../../pages/stock-forecast";

type StockForecastPick = Pick<schema.Item, "stockHistory" | "stock" | "checkboxStatus" | "SKU" | "title">
export interface StockForecastItem extends StockForecastPick {
    rowId: number;
    hist: {
        perDay: number;
        [key: number]: number;
    };
    stockOOS: string;
    oneMonthOOS: string;
    fourMonthOOS: string;
    oo: number;
    oneMonth: number;
    fourMonth: number;
    onOrder: onOrder;
    months: Months[];
}

export interface StockForecastChecks {
    HIDE?: boolean;
    LIST?: boolean
}

interface DayBreakdown {
    stock: number;
    stock1: number;
    stock4: number;
    onOrderFlag: boolean;
    restock: boolean;
}

interface Months {
    style: string;
    dayBreakdown: DayBreakdown[];
    year: number;
    month: number;
    monthText: string;
    eom: number;
}

function dayInfoCalculation(item: StockForecastItem, monthData: Months, day: number, stock: number, hist: number) {

    const onOrder = item.onOrder?.[monthData.year]?.[monthData.month]?.[day + 1] ?? 0;
    const previousDay = monthData.dayBreakdown[day - 1];
    const currentDay = monthData.dayBreakdown[day];

    currentDay.stock = stock + onOrder
    currentDay.stock1 = stock + onOrder
    currentDay.stock4 = stock + onOrder
    currentDay.onOrderFlag = onOrder > 0

    switch (true) {
        case day === 0:
            return firstDayOfMonthChecks();
        case day < (new Date().getDate()) && (new Date().getMonth()) === monthData.month:
            return historicOnOrderThisMonth();
        default:
            calculateStockForDay();
    }

    function firstDayOfMonthChecks() {
        if (!item.onOrder?.late || item.stock.total > 0) return
        currentDay.restock = true;
        currentDay.onOrderFlag = true;
    }

    function historicOnOrderThisMonth() {
        if (previousDay.onOrderFlag) currentDay.onOrderFlag = true;
    }

    function calculateStockForDay() {
        currentDay.stock = setStock(previousDay.stock, hist === 0 ? item.fourMonth : hist) + onOrder
        if (onOrder) currentDay.restock = true;
        if (previousDay.onOrderFlag || (onOrder && previousDay.stock <= 0)) currentDay.onOrderFlag = true;
        if (day <= 90) {
            currentDay.stock4 = setStock(previousDay.stock4, item.fourMonth) + onOrder
            currentDay.stock1 = setStock(previousDay.stock1, item.oneMonth) + onOrder
        }
    }

    function setStock(oldLevel: number, newLevel: number) {
        return Math.floor(oldLevel - newLevel > 0 ? oldLevel - newLevel : 0)
    }
}

export function processData(item: StockForecastItem, index: number) {
    if (item.rowId) return item
    item.rowId = index
    item.hist = {perDay: 0}
    item.months = timeSpan()
    item.onOrder ??= {late: 0, total: 0}
    item.fourMonth = lastFourMonthAvg(item.stockHistory)
    item.oneMonth = lastMonthAvg(item.stockHistory)

    item.fourMonthOOS = ''
    item.oneMonthOOS = ''
    item.stockOOS = ''


    let initialStock = item.stock.total + item.onOrder?.late

    let cm = 0

    for (let month of item.months) {
        let hist = historicAvg(month, item.stockHistory);
        let day = 0

        item.hist.perDay += hist
        item.hist[month.month] = hist ? hist : Math.max(item.oneMonth, item.fourMonth)

        for (day; day < month.eom; day++) {

            dayInfoCalculation(item, month, day, initialStock, hist);

            switch (true) {
                case month.dayBreakdown[day].stock4! <= 0 && item.fourMonthOOS === '':
                    item.fourMonthOOS = createDateString(month.year, month.month, day);
                    break;
                case month.dayBreakdown[day].stock1! <= 0 && item.oneMonthOOS === '':
                    item.oneMonthOOS = createDateString(month.year, month.month, day);
                    break;
                case month.dayBreakdown[day].stock! <= 0 && item.stockOOS === '':
                    item.stockOOS = createDateString(month.year, month.month, day);
                    break;
            }
        }

        function createDateString(year: number, month: number, day: number) {
            return (new Date(year, month - 1, day + 1)).toLocaleDateString()
        }

        initialStock = month.dayBreakdown[month.dayBreakdown.length - 1].stock
        month.style = `linear-gradient(90deg, ${createStyle(month.dayBreakdown, cm, month.eom)})`
        cm++
    }
    if (item.hist.perDay > 0) item.hist.perDay = item.hist.perDay / item.months.length

    return item
}

function historicAvg(date: Months, hist: schema.Item["stockHistory"]) {
    let cd = new Date();
    let years = 0
    let sales = 0
    for (let year of hist) {
        if (Number(year[0]) === cd.getFullYear()) continue;
        years++
        for (const [month, value] of Object.entries(year)) {
            if(month === '0') continue
            if (date.month === Number(month)) sales += Number(value)
        }
    }

    return sales === 0 || years === 0 ? 0 : ((sales / years) * 1.1) / date.eom
}

function lastFourMonthAvg(hist: schema.Item["stockHistory"]) {
    let cd = new Date()
    let sales = 0;
    let days = 0;

    for (let i = 0; i <= 3; i++) {
        let year = hist.find((year) => Number(year[0]) === cd.getFullYear())
        if(year !== undefined){
            const monthData = hist[cd.getFullYear()][cd.getMonth() + 1]
            if (monthData) {
                sales += Number(monthData)
                days += cd.getDate()
            }
        }
        cd.setDate(0)
    }

    return sales === 0 && days === 0 ? 0 : sales / days
}

function lastMonthAvg(hist: schema.Item["stockHistory"]) {
    let cd = new Date()
    let sales = 0;
    let days = 0;
    let month = cd.getMonth() + 1
    let year = hist.find((year) => Number(year[0]) === cd.getFullYear())
    let lastYear = hist.find((year) => Number(year[0]) === cd.getFullYear() - 1)
    if(year !== undefined && month -1 > 0){
        const stockThisMonth = year[month]
        if (stockThisMonth) {
            sales += Number(stockThisMonth)
            days += cd.getDate()
        }
        cd.setDate(0)
        const stockLastMonth = year[month -1]
        if (stockLastMonth) {
            let eom = cd.getDate()
            let daysTaken = eom - days
            days += daysTaken
            let per = (100 / eom) * daysTaken
            sales += (Number(stockLastMonth) / 100) * per
        }
    } else {
        if(lastYear !== undefined){
            const stockLastMonth = lastYear[12]
            if (stockLastMonth) {
                let eom = cd.getDate()
                let daysTaken = eom - days
                days += daysTaken
                let per = (100 / eom) * daysTaken
                sales += (Number(stockLastMonth) / 100) * per
            }
        }
    }

    return sales === 0 && days === 0 ? 0 : sales / days

}

export function timeSpan() {
    let cd = new Date()
    cd.setDate(1)
    let monthDisplay = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let data: Months[] = []
    for (let i = 0; i < 24; i++) {
        data.push({
            dayBreakdown: Array.from(
                {length: endOfMonth(cd)},
                () => ({stock: 0, stock1: 0, stock4: 0, onOrderFlag: false, restock: false})
            ),
            style: "",
            year: cd.getFullYear(),
            month: cd.getMonth() + 1,
            monthText: monthDisplay[cd.getMonth()],
            eom: endOfMonth(cd)
        })
        cd.setMonth(cd.getMonth() + 1)
    }
    return data;

    function endOfMonth(cd: Date) {
        return (new Date(cd.getFullYear(), cd.getMonth() + 1, 0)).getDate()
    }
}

function createStyle(data: DayBreakdown[], cm: number, eom: number) {
    let cd = new Date()
    let arr: string[] = Array.from(data, () => '')
    for (let i in data) {
        arr[i] = selectColour(data[i], cd, Number(i))
    }

    function selectColour(day:DayBreakdown, cd:Date, i:number){
        switch(true){
            case day.restock && day.stock !== 0: return '#3333ff'
            case Number(i) < cd.getDate() - 1 && cm === 0 : return '#b3b3b3'
            case day.stock === 0 : return 'transparent'
            case day.stock1 === 0 : return '#dd03ff'//'#ffffff'
            case day.stock4 === 0 : return '#5cff00'//'#e6e6e6'

            case day.onOrderFlag : return '#a6a6a6'
            case day.stock > 0 && cm >= 9 : return 'var(--traffic-light-green)'
            case day.stock > 0 && cm >= 6 && cm < 9 : return 'var(--traffic-light-orange)'
            case day.stock > 0 : return 'var(--traffic-light-red)'

            default: return ""
        }
    }
    function compressArray(array: any[], eom: number) {
        let compressed = []
        for (let i in array) {
            let previousIndex = Number(i) - 1
            if (i === "0") {
                compressed.push({color: array[i], count: 1})
                continue
            }

            if (array[previousIndex] === array[i]) {
                compressed[compressed.length - 1].count++
            } else {
                compressed.push({color: array[i], count: 1})
            }
        }

        let string = ""
        let previousPercent = 0
        let previousColor = ""
        for (let v of compressed) {
            if (previousPercent === 0) {
                previousPercent = Math.floor((100 / eom) * v.count)
                string += `${v.color} ${previousPercent}%, ${v.color} ${previousPercent}%`
            } else {
                string += `, ${previousColor} ${Math.floor((100 / eom) * v.count)}%, ${v.color} ${Math.floor((100 / eom) * v.count)}%`
            }

            previousPercent = Math.floor((100 / eom) * v.count)
            previousColor = v.color
        }
        return string
    }

    return compressArray(arr, eom)
}