import {
    setIncorrectStockSplice,
    setZeroStockSplice
} from "../../store/incorrect-stock-slice";


export default function UpdateIncorrectStock(pageRerenderHandler, incorrectStockState,zeroStockState, validDataState, dispatch) {

    if (validDataState) {
        let tempArray = []
        for(const brand in zeroStockState) {
            for (let i = 0; i < zeroStockState[brand].length; i++) {
                if (zeroStockState[brand][i].CHECKED) {
                    tempArray.push(zeroStockState[brand][i])
                    dispatch(setZeroStockSplice({brand:brand, index: i, amount:1 }))
                }
            }
        }
        for(const brand in incorrectStockState) {
            for (let i = 0; i < incorrectStockState[brand].length; i++) {
                if (incorrectStockState[brand][i].CHECKED) {
                    tempArray.push(incorrectStockState[brand][i])
                    dispatch(setIncorrectStockSplice({brand:brand, index: i, amount:1 }))
                }
            }
        }
        const opts = {
            method: "POST",
            headers: {
                'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({QUERY: "StockAdjust - " + date(), DATA: tempArray})
        }
        fetch("/api/incorrect-stock-adjust-and-mongo-clean-up", opts)
            .then(res => res.json())
            .then(res => {
                window.confirm(`${res.deletedCount} items updated`)
                pageRerenderHandler()
            })
    } else {
        window.alert("Please enter only numbers in stock levels")
    }
}

function date() {
    let date = new Date();
    let day = date.getDay()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    return (`${day}/${month}/${year}`)
}