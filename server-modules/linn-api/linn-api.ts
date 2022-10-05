import {postReq} from "./linn-post-req";

export const getLinnChannelPrices = async (id: string) => {
    return await postReq(
        '/api/Inventory/GetInventoryItemPrices',
        'inventoryItemId=' + id
    )
}
export const getLinnSuppliers = async (id: string) => {
    return await postReq(
        '/api/Inventory/GetStockSupplierStat',
        ('inventoryItemId=' + id).replace(/"/g, '')
    )
}



export const getLinnQuery = async <T>(query: string) => {
    return await postReq(
        '/api/Dashboards/ExecuteCustomScriptQuery',
        'script=' + encodeURIComponent(query.replace(/ +(?= )/g, ''))
    ) as linn.Query<T>
}

export const updateLinnItem = async (path: string, updateData: string) => {
    return await postReq(
        path,
        updateData
    )
}

export const updateItemImage = async (data: string) => {
    return await postReq(
        '/api/Inventory/AddImageToInventoryItem',
        `request=${encodeURIComponent(JSON.stringify(data))}`
    )
}

export const getLinnItemDesc = async (query: string) => {
    return await postReq(
        '/api/Inventory/GetInventoryItemDescriptions',
        ('inventoryItemId=' + query).replace(/"/g, '')
    )
}

export const getPostalServices = async () => {
    return await postReq(
        '/api/PostalServices/GetPostalServices',
        ''
    ) as linn.PostalService[]
}

export const createTransfer = async () => {
    return await postReq(
        '/api/WarehouseTransfer/CreateTransferRequestWithReturn',
        'fromLocationId=1a692c39-afc9-4844-9f11-6e6625a9c1f1&toLocationId=00000000-0000-0000-0000-000000000000'
    ) as linn.Transfer
}

export const checkTransfer = async () => {
    return await postReq(
        '/api/WarehouseTransfer/CheckForDraftTransfer',
        'toLocationId=00000000-0000-0000-0000-000000000000&fromLocationId=1a692c39-afc9-4844-9f11-6e6625a9c1f1'
    )
}

export const addItemToTransfer = async (tranId: string, itemId: string) => {
    return await postReq(
        '/api/WarehouseTransfer/AddItemToTransfer',
        ('fkTransferId=' + tranId + '&pkStockItemId=' + itemId).replace(/"/g, '')
    ) as linn.AddToTransfer
}

export const remItemFromTransfer = async (tranId: string, itemId: string) => {
    await postReq(
        '/api/WarehouseTransfer/RemoveItemFromTransfer',
        ('pkTransferId=' + tranId + '&pkTransferItemId=' + itemId).replace(/"/g, '')
    )
}

export const changeItemTransferQty = async (tranId: string, itemId: string, qty: string) => {
    await postReq(
        '/api/WarehouseTransfer/ChangeTransferItemRequestQuantity',
        ('pkTransferId=' + tranId + '&pkTransferItemId=' + itemId + '&Quantity=' + qty).replace(/"/g, '')
    )
}

export const getActiveTransfer = async (tranId: string) => {
    return await postReq(
        '/api/WarehouseTransfer/GetTransferWithItems',
        ('pkTransferId=' + tranId).replace(/"/g, '')
    ) as linn.Transfer
}

export const completeTransfer = async (tranId: string) => {
    await postReq(
        '/api/WarehouseTransfer/ChangeTransferStatus',
        'pkTransferId=' + tranId + '&newStatus=7'
    )
}

export const adjustStock = async (arr: any, id: string) => {
    return await postReq(
        '/api/Stock/UpdateStockLevelsBySKU',
        `stockLevels=${JSON.stringify(arr)}&changeSource=${id}`
    ) as linn.ItemStock[]
}

export const bulkGetImages = async (skus: string[]) => {
    return await postReq(
        '/api/Inventory/GetImagesInBulk',
        `request={"SKUS":${JSON.stringify(skus)}}`
    ) as linn.BulkGetImagesResult
}