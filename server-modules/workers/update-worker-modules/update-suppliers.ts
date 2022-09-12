import Linn = require('../../linn-api/linn-api');
import {auth} from "../../linn-api/linn-auth";

export const updateSuppliers = async (merge = (new Map<string, sbt.Item>()), skus?:string ) => {
    await auth(true)
    console.log("querying supplier data!")
    console.log(new Date())

    interface SQLQuery {SKU:string, SUPPLIER:string}


    let query = `Select si.ItemNumber as 'SKU', s.SupplierName as 'SUPPLIER'
                 FROM StockItem si
                          INNER JOIN ItemSupplier isup ON si.pkStockItemId = isup.fkStockItemId
                          INNER JOIN Supplier s ON isup.fkSupplierId = s.pkSupplierID
                 WHERE si.bLogicalDelete = 0
                     ${skus ? "AND si.ItemNumber IN (" + skus + ")" : ""}`

    let linnData = (await Linn.getLinnQuery<SQLQuery>(query)).Results

    if (linnData) {
        for (let item of linnData) {
            if (!merge.has(item.SKU)) merge.set(item.SKU, {SKU: item.SKU})
            merge.get(item.SKU)!.SUPPLIER = item.SUPPLIER
        }
    }

    return merge
}