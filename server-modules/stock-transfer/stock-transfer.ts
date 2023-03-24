import {deleteOne, find, setData} from "../mongo-interface/mongo-interface";
import {LowStockItem} from "../../store/stock-transfer-slice";
import * as mongoI from "../mongo-interface/mongo-interface";
import {updateLinnItem} from "../linn-api/linn-api";
import {schema} from "../../types";


export type TransferObject = {
    _id?: string
    items: LowStockItem[],
    transferID: string,
    transferRef: string,
    complete: boolean
    createdDate: string
    completedDate: string
}

interface WarehouseItem {
    SKU: string,
    title: string,
    linnId: string,
    stock: schema.Stock
}

export async function getInternationalLowStockItems() {
    const warehouseItems = await mongoI.find<WarehouseItem>("New-Items", {
        'stock.warehouse': {$gt: 0},
        isComposite: false,
        "stock.minimum": {$gt: 0}
    }, {SKU: 1, title: 1, linnId: 1, stock: 1})
    if (!warehouseItems) return {code: 400, message: "Could not find any low stock items", items: []}
    const lowStockItems = []
    for (const item of warehouseItems) {
        if (item.stock.default <= item.stock.minimum) {
            let itemObject: LowStockItem = {
                transfer: 0,
                title: item.title,
                stock: {
                    default: item.stock.default,
                    warehouse: item.stock.warehouse,
                    minimum: item.stock.minimum
                },
                linnId: item.linnId,
                SKU: item.SKU,
                newStockLevels: {
                    default: 0,
                    warehouse: 0
                }
            }
            lowStockItems.push(itemObject)
        }
    }
    return {code: 200, message: "Items found", items: lowStockItems}
}

export async function saveOpenTransfer(transfer: TransferObject) {
    let saveTransfer: TransferObject = {
        complete: false,
        createdDate: transfer.createdDate,
        completedDate: "",
        items: [...transfer.items],
        transferID: "",
        transferRef: ""
    }
    const res = await setData("Stock-Transfers", {complete: false}, saveTransfer)
    return res ? {code: 200} : {code: 400}
}

export async function saveCompleteTransfer(transfer: TransferObject) {
    if (transfer._id) delete transfer._id
    const res = await setData("Stock-Transfers", {createdDate: transfer.createdDate}, transfer)
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

export async function deleteOpenTransfer() {
    await deleteOne("Stock-Transfers", {complete: false})
}

type NewStockItem = {
    SKU: string,
    title: string,
    linnId: string,
    stock: {
        default: number,
        warehouse: number,
        minimum: number
    }
}

export async function getNewItem(sku: string) {
    let res = await find("New-Items", {SKU: sku}, {SKU: 1, title: 1, linnId: 1, stock: 1}) as NewStockItem[]
    if (res) {
        let newItemObject: LowStockItem = {
            transfer: 0,
            title: res[0].title,
            stock: {...res[0].stock},
            linnId: res[0].linnId,
            SKU: res[0].SKU,
            newStockLevels: {
                default: 0,
                warehouse: 0
            }
        }
        return newItemObject
    }
    return null
}

export async function getWarehouseStock(transfer: TransferObject) {
    const warehouseList = await find<NewStockItem>("New-Items", {
        'stock.warehouse': {$gt: 0},
        isComposite: false,
        tags:{$nin:['filtered']}
    }, {SKU: 1, title: 1, linnId: 1, stock: 1})
    if (!warehouseList) return []
    const filteredWarehouseList:LowStockItem[] = []
    for (let i = 0; i < warehouseList.length; i++) {
        const index = transfer.items.findIndex(transferItem => transferItem.SKU === warehouseList[i].SKU)
        if (index === -1) {
            let newItemObject: LowStockItem = {
                transfer: 0,
                title: warehouseList[i].title,
                stock: {...warehouseList[i].stock},
                linnId: warehouseList[i].linnId,
                SKU: warehouseList[i].SKU,
                newStockLevels: {
                    default: 0,
                    warehouse: 0
                }
            }
            filteredWarehouseList.push(newItemObject)
        }
    }
    filteredWarehouseList.sort((a, b) => a.SKU > b.SKU ? 1 : -1)
    return filteredWarehouseList
}

type NewTransferResult = {
    code: number,
    data: {
        PkTransferId: string
        ReferenceNumber: string
        OrderDate: string
    }
}
type AddedItemResult = {
    data: { PkTransferItemId: string }
}

export async function completeTransfer(transfer: TransferObject) {
    const result = await updateLinnItem('/api/WarehouseTransfer/CreateTransferRequestWithReturn', 'toLocationId=00000000-0000-0000-0000-000000000000&fromLocationId=1a692c39-afc9-4844-9f11-6e6625a9c1f1') as NewTransferResult
    if (result.code >= 400) return result
    for (const item of transfer.items) {
        if (item.transfer === 0) continue
        const itemToAdd = `fkTransferId=${result.data.PkTransferId}&pkStockItemId=${item.linnId}`
        const itemToAddResult = await updateLinnItem('/api/WarehouseTransfer/AddItemToTransfer', itemToAdd) as AddedItemResult
        const quantityChange = `pkTransferId=${result.data.PkTransferId}&pkTransferItemId=${itemToAddResult.data.PkTransferItemId}&Quantity=${item.transfer}`
        await updateLinnItem('/api/WarehouseTransfer/ChangeTransferItemRequestQuantity', quantityChange)
    }

    const completeRes = await updateLinnItem('/api/WarehouseTransfer/ChangeTransferStatus', `pkTransferId=${result.data.PkTransferId}&newStatus=7`) as NewTransferResult
    if (completeRes.code >= 400) return completeRes

    type StockRequestLevel = { data: { StockLevel: { StockLevel: number } } }

    for (const item of transfer.items) {
        if (item.transfer === 0) {
            item.newStockLevels.default = item.stock.default
            item.newStockLevels.warehouse = item.stock.warehouse
            continue
        }
        let warehouseStock = await updateLinnItem('/api/Stock/GetStockLevelByLocation', `request={"StockItemId":"${item.linnId}","LocationId":"1a692c39-afc9-4844-9f11-6e6625a9c1f1"}`) as StockRequestLevel
        let defaultStock = await updateLinnItem('/api/Stock/GetStockLevelByLocation', `request={"StockItemId":"${item.linnId}","LocationId":"00000000-0000-0000-0000-000000000000"}`) as StockRequestLevel
        item.newStockLevels.default = defaultStock.data.StockLevel.StockLevel
        item.newStockLevels.warehouse = warehouseStock.data.StockLevel.StockLevel
    }
    return {
        code: 200, data: {
            completedDate: Date.now().toString(),
            items: [...transfer.items],
            transferId: result.data.PkTransferId,
            transferRef: result.data.ReferenceNumber
        }
    }
}

export async function getCompleteTransfers() {
    const res = await find<TransferObject>("Stock-Transfers", {complete: true})
    return res ? res : []
}