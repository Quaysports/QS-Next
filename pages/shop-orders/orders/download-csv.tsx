export default function exportToCSV(order){
    if(!order || !order.order) return
    let string = "SKU,Title,Quantity\n"
    for(let item of order.order){
        string += `${item.SKU},${item.TITLE},${item.qty}\n`
    }

    let blob = new Blob([string], {
        type: 'application/html;charset=utf-8;'
    });
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.setAttribute('download', `${order.supplier}-${order.id}.csv`);
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.click();
}