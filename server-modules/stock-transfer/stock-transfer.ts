import {deleteOne, find, setData, unsetData} from "../mongo-interface/mongo-interface";
import {LowStockItem} from "../../store/stock-transfer-slice";
import * as mongoI from "../mongo-interface/mongo-interface";
import {updateLinnItem} from "../linn-api/linn-api";
import {DataWithStatus} from "../linn-api/linn-post-req";
import {object} from "prop-types";

export type TransferObject = {
    items: LowStockItem[],
    transferID: string,
    transferRef: string,
    complete: boolean
    date: string
}

export async function getInternationalLowStockItems() {
    const warehouseItems = await mongoI.find("New-Items", {
        'stock.warehouse': {$gt: 0},
        isComposite: false,
        "stock.minimum": {$gt: 0}
    }, {SKU: 1, title: 1, linnId: 1, stock: 1})
    if (!warehouseItems) return {code: 400, message: "Could not find any low stock items", items: []}
    const lowStockItems = []
    for (const item of warehouseItems) {
        if (item.stock.default <= item.stock.minimum) {
            let itemObject: LowStockItem = {
                stockIn: 0,
                title: item.title,
                stock: {...item.stock},
                linnId: item.linnId,
                SKU: item.SKU
            }
            lowStockItems.push(itemObject)
        }
    }
    return {code: 200, message: "Items found", items: lowStockItems}
}

export async function saveOpenTransfer(transfer: TransferObject) {
    let saveTransfer: TransferObject = {
        complete: false,
        date: "",
        items: [...transfer.items],
        transferID: "",
        transferRef: ""
    }
    const res = await setData("Stock-Transfers", {complete: false}, saveTransfer)
    return res ? {code: 200} : {code: 400}
}

export async function checkOpenTransfers() {
    const res = await find<TransferObject>("Stock-Transfers", {complete: false})
    if (res && res.length > 0) {
        for (let i = 0; i < res[0].items.length; i++) {
            let updatedItem = await mongoI.find<LowStockItem>("New-Items", {SKU: res[0].items[i].SKU}, {stock: 1})
            if (updatedItem) {
                res[0].items[i].stock = {...updatedItem[0].stock}
            }
        }
    }
    return res ? res : []
}

export async function deleteOpenTransfer(){
    await deleteOne("Stock-Transfers", {complete:false})
}

export async function getNewItem(sku:string){
    console.log(sku)
    let res = await find("New-Items", {SKU:sku}, {SKU: 1, title: 1, linnId: 1, stock: 1})
    console.log(res)
    if(res){
        let newItemObject: LowStockItem = {
            stockIn: 0,
            title: res[0].title,
            stock: {...res[0].stock},
            linnId: res[0].linnId,
            SKU: res[0].SKU
        }
        return newItemObject
    }
    return null
}

type NewTransferResult = {
    code: number,
    data: {
        PkTransferId:string
        ReferenceNumber: string
        OrderDate : string
    }
}
type AddedItemResult = {
    data: {PkTransferItemId: string}
}
export async function completeTransfer(transfer:TransferObject){
    const result = await updateLinnItem('/api/WarehouseTransfer/CreateTransferRequestWithReturn', 'toLocationId=00000000-0000-0000-0000-000000000000&fromLocationId=1a692c39-afc9-4844-9f11-6e6625a9c1f1') as NewTransferResult
    const itemsToAdd = []
    for(const item of transfer.items){
        itemsToAdd.push({
            fkStockItemId:item.linnId,
            Quantity: item.stockIn
        })
        const itemToAdd = `fkTransferId=${result.data.PkTransferId}&pkStockItemId=${item.linnId}`
        const itemToAddResult = await updateLinnItem('/api/WarehouseTransfer/AddItemToTransfer', itemToAdd) as AddedItemResult
        const quantityChange = `pkTransferId=${result.data.PkTransferId}&pkTransferItemId=${itemToAddResult.data.PkTransferItemId}&Quantity=${item.stockIn}`
        const quantityChangeRes = await updateLinnItem('/api/WarehouseTransfer/ChangeTransferItemRequestQuantity', quantityChange)
    }

    const completeRes = await updateLinnItem('/api/WarehouseTransfer/ChangeTransferStatus', `pkTransferId=${result.data.PkTransferId}&newStatus=7`) as NewTransferResult
    if(completeRes.code >= 400) return completeRes
    return result
}