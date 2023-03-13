import {Shipment, ShipmentItem} from "./shipping";

export {
    emailExport,
    shippingExport
}

function shippingExport(shipment:Shipment){
    console.log(shipment)
    let csvContent = `Code,SKU,Supplier,Description,HS Code,Bill of Lading Description,Qty Required,Duty %,Duty Value,FOB Price Per Item $,Total $, FOB Price Per Item £,Total £, % Of Orders,Total Per Item Landed £,Qty Per Box,No. of Boxes,Length,Height,Width,M3 Per Box,M3 Total`
    for(const item of shipment.data){
        let string = `\r\n${item.code},${item.sku},${item.supplier},${item.desc},${item.hscode},${item.billDesc},${item.qty},${item.dutyPer},${item.dutyValue},${item.fobDollar},${item.dollarTotal},${item.fobPound},${item.poundTotal},${item.perOfOrder},${item.totalPerItem},${item.qtyPerBox},${item.numOfBoxes},${item.length},${item.height},${item.width},${item.m3perBox},${item.m3total}`
        csvContent += string
    }

    let summaryFirstRow = `\r\n,,,,,,,,,Sub Total $,${shipment.subTotal},,${shipment.subTotal / shipment.exchangeRate},,,Total Boxes,${shipment.totalCartons},,,,M3 Total,${shipment.m3total}`
    csvContent += summaryFirstRow

    const summaryRow = (title:string,doller:string | number,pound:string | number)=>{
        return `\r\n,,,,,,,,,${title},${doller},,${pound},,,,,,,,,`
    }

    csvContent += summaryRow('Credit from last order', '', shipment.credit)
    csvContent += summaryRow('Total', shipment.total, shipment.total / shipment.exchangeRate)
    csvContent += summaryRow('30% Deposit Required', shipment.depReq, shipment.depReq / shipment.exchangeRate)
    csvContent += summaryRow('Outstanding', shipment.outstanding, shipment.outstanding / shipment.exchangeRate)
    csvContent += summaryRow('Shipping', '', shipment.shipping)
    csvContent += summaryRow('Duty', shipment.duty, shipment.duty / shipment.exchangeRate)
    csvContent += summaryRow('Bank Charges', '', shipment.bankCharges)
    csvContent += summaryRow('Total Ex. VAT', '', shipment.totalExVat)
    csvContent += summaryRow('VAT', '', shipment.vat)
    csvContent += summaryRow('Grand Total', '', shipment.grandTotal)

    const blob = new Blob(['\uFEFF'+csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${shipment.intId ? 'ID'+shipment.intId + '-' : ''}${shipment.tag ? shipment.tag : ''}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
}

async function emailExport(shipment:Shipment){

    const table = document.createElement('table')
    const headerRow = document.createElement('tr')
    table.appendChild(headerRow)

    const columnTitles = ['Code', 'Supplier', 'Description', 'HS Code', 'SKU', 'Bill of Lading', 'Quantity', 'Boxes', 'Length', 'Width', 'Height', 'Box m³', 'Total m³']
    for (const v of columnTitles) {
        const tableCell = document.createElement('th')
        tableCell.innerText = v
        headerRow.appendChild(tableCell)
    }

    for (const item of shipment.data) {
        const createCell = (text:string | number | undefined = "") => {
            const tableCell = document.createElement('td')
            tableCell.innerText =typeof text === 'number'
                ? parseFloat(String(text)).toFixed(2)
                : text
            return tableCell
        }

        const columns = ['code', 'supplier', 'desc', 'hscode', 'sku', 'billDesc', 'qty', 'numOfBoxes', 'length', 'width', 'height', 'm3perBox', 'm3total']
        let row = document.createElement('tr')
        for (let k of columns) {
            row.appendChild(createCell(item[k as keyof ShipmentItem]))
        }
        table.appendChild(row)
    }

    const columnTotals = ['', '', '', '', '', '', 'Total Boxes', shipment.totalCartons.toFixed(2), '', '', '', 'Shipment m³:', shipment.m3total.toFixed(2)]
    let totalsRow = document.createElement('tr')
    table.appendChild(totalsRow)
    for (const v of columnTotals) {
        const tableCell = document.createElement('th')
        tableCell.innerText = v
        totalsRow.appendChild(tableCell)
    }

    let style = `<style>
    table {
        border-collapse: collapse;
    }
    td, th, table {
        border:1px solid black;
    }
    th, td {
        padding: 2px 5px;
        text-align: left;
    }
    </style>`

    let text = style + '<p>' + shipment.tag + '</p>' + table.outerHTML + '<p></p>';
    let textInput = document.createElement('textarea')
    textInput.value = text
    document.body.appendChild(textInput)
    textInput.select()
    textInput.setSelectionRange(0, 99999)
    await navigator.clipboard.writeText(textInput.value)
    document.body.removeChild(textInput)

}