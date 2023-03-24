import {postOpts, postReq} from "./linn-post-req";
import {updateItem} from "../items/items";
import {guid} from "../core/core";
import {jariloHtml} from "../../components/jarilo-template";
import {findOne, setData} from "../mongo-interface/mongo-interface";
import {linn, schema} from "../../types";

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
    );
}


export const getLinnQuery = async <T>(query: string) => {
    return await postReq(
        '/api/Dashboards/ExecuteCustomScriptQuery',
        'script=' + encodeURIComponent(query.replace(/ +(?= )/g, ''))
    ) as linn.Query<T>;
}

export const updateLinnItem = async (path: string, updateData: string) => {
    console.log(path)
    return await postReq(
        path,
        updateData,
        true
    )
}

export const updateExtendedProperties = async (path: string, extendedProperties: string) => {
    return await postReq(
        path,
        extendedProperties,
        true
    )
}

export const updateItemImage = async (data: linn.InventoryItemImage) => {
    return await postReq(
        '/api/Inventory/AddImageToInventoryItem',
        `request=${encodeURIComponent(JSON.stringify(data))}`,
        true
    )
}

export const getLinnItemDesc = async (query: string) => {
    return await postReq(
        '/api/Inventory/GetInventoryItemDescriptions',
        ('inventoryItemId=' + query).replace(/"/g, '')
    );
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
    ) as linn.AddToTransfer;
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
    ) as linn.Transfer;
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

function fixedEncodeURIComponent(str: string | number) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16);
    })
}

export const bulkUpdateLinnItem = async (item: schema.Item) => {

    function formatAndEncodeDescription(desc: string) {
        return encodeURIComponent(desc.replace(/"/g, "'"))
    }

    let results = {
        'New Extended Property': 204,
        'Old Extended Property': 204,
        'Web Title': 204,
        Title: 200,
        'Long Description': 204,
        'Update Image': 204
    }

    let dbUpdate = await updateItem(item)
    if (!dbUpdate.acknowledged) {
        return ({status: 404, statusText: "DB update failed"})
    } else {
        const oldExtendedProperties: { [key: string]: string | number }[] = []
        const newExtendedProperties: { [key: string]: string | number }[] = []

        function testForProperty(property: string, value: string | number) {
            let pos = item.extendedProperties.map((extendedProperty) => {
                return extendedProperty.epName
            }).indexOf(property);
            pos > -1 ?
                oldExtendedProperties.push({
                    fkStockItemId: item.linnId,
                    pkRowId: item.extendedProperties[pos].pkRowId,
                    PropertyType: "Attribute",
                    PropertyValue: fixedEncodeURIComponent(value),
                    ProperyName: property
                }) :
                newExtendedProperties.push({
                    fkStockItemId: item.linnId,
                    SKU: item.SKU,
                    PropertyType: "Attribute",
                    PropertyValue: fixedEncodeURIComponent(value),
                    ProperyName: property
                })
        }

        for (const property of Object.keys(item.mappedExtendedProperties)) {
            switch (property) {
                case "category1":
                    testForProperty('Amz Browse Node 1', item.mappedExtendedProperties.category1);
                    break;
                case "category2":
                    testForProperty('Amz Browse Node 2', item.mappedExtendedProperties.category2);
                    break;
                case "bulletPoint1":
                    testForProperty('Amz Bullet Point 1', item.mappedExtendedProperties.bulletPoint1);
                    break;
                case "bulletPoint2":
                    testForProperty('Amz Bullet Point 2', item.mappedExtendedProperties.bulletPoint2);
                    break;
                case "bulletPoint3":
                    testForProperty('Amz Bullet Point 3', item.mappedExtendedProperties.bulletPoint3);
                    break;
                case "bulletPoint4":
                    testForProperty('Amz Bullet Point 4', item.mappedExtendedProperties.bulletPoint4);
                    break;
                case "bulletPoint5":
                    testForProperty('Amz Bullet Point 5', item.mappedExtendedProperties.bulletPoint5);
                    break;
                case "searchTerm1":
                    testForProperty('Amz Search Terms 1', item.mappedExtendedProperties.searchTerm1);
                    break;
                case "searchTerm2":
                    testForProperty('Amz Search Terms 2', item.mappedExtendedProperties.searchTerm2);
                    break;
                case "searchTerm3":
                    testForProperty('Amz Search Terms 3', item.mappedExtendedProperties.searchTerm3);
                    break;
                case "searchTerm4":
                    testForProperty('Amz Search Terms 4', item.mappedExtendedProperties.searchTerm4);
                    break;
                case "searchTerm5":
                    testForProperty('Amz Search Terms 5', item.mappedExtendedProperties.searchTerm5);
                    break;
                case "amazonSport":
                    testForProperty('Sport', item.mappedExtendedProperties.amazonSport);
                    break;
                case "amazonDepartment":
                    testForProperty('Amz Department', item.mappedExtendedProperties.amazonDepartment);
                    break;
                case "amazonLatency":
                    testForProperty('Amz Fulfillment Latency', item.mappedExtendedProperties.amazonLatency);
                    break;
                case "shippingFormat":
                    testForProperty('Shipping Format', item.mappedExtendedProperties.shippingFormat);
                    break;
                case "age":
                    testForProperty('Age', item.mappedExtendedProperties.age);
                    break;
                case "gender":
                    testForProperty('Gender', item.mappedExtendedProperties.gender);
                    break;
                case "size":
                    testForProperty('Size', item.mappedExtendedProperties.size);
                    break;
                case "color":
                    testForProperty('Color', item.mappedExtendedProperties.color);
                    break;
            }
        }
        if (item.tags.length > 0) testForProperty('Tags', item.tags.reduce((string, tag) => {
            return string === "" ? tag : `${string}, ${tag}`
        }, ""));
        testForProperty('Brand', item.brand);
        testForProperty('Short Description', item.shortDescription);
        let searchTerms: string = ""
        let extendedProperties = item.mappedExtendedProperties
        searchTerms += extendedProperties.searchTerm1 ? extendedProperties.searchTerm1 + ' ' : "";
        searchTerms += extendedProperties.searchTerm2 ? extendedProperties.searchTerm2 + ' ' : "";
        searchTerms += extendedProperties.searchTerm3 ? extendedProperties.searchTerm3 + ' ' : "";
        searchTerms += extendedProperties.searchTerm4 ? extendedProperties.searchTerm4 + ' ' : "";
        searchTerms += extendedProperties.searchTerm5 ? extendedProperties.searchTerm5 + ' ' : "";
        testForProperty('Search Terms', searchTerms);

        if (newExtendedProperties.length > 0) {
            let res = await updateExtendedProperties("/api/Inventory/CreateInventoryItemExtendedProperties", "inventoryItemExtendedProperties=" + JSON.stringify(newExtendedProperties)) as { code: number }
            results['New Extended Property'] = res.code
        }
        if (oldExtendedProperties.length > 0) {
            let res = await updateExtendedProperties("/api/Inventory/UpdateInventoryItemExtendedProperties", "inventoryItemExtendedProperties=" + JSON.stringify(oldExtendedProperties)) as { code: number }
            results['Old Extended Property'] = res.code
        }
    }

    let amazonTitle = {
        "pkRowId": guid(),
        "Source": "AMAZON",
        "SubSource": "Silver Bullet Trading Ltd",
        "Title": fixedEncodeURIComponent(item.webTitle),
        "StockItemId": item.linnId
    }
    let websiteTitle = {
        "pkRowId": guid(),
        "Source": "MAGENTO",
        "SubSource": fixedEncodeURIComponent('http://quaysports.com'),
        "Title": fixedEncodeURIComponent(item.webTitle),
        "StockItemId": item.linnId
    }
    let ebayTitle = {
        "pkRowId": guid(),
        "Source": "EBAY",
        "SubSource": "EBAY1",
        "Title": fixedEncodeURIComponent(item.webTitle),
        "StockItemId": item.linnId
    }
    let websitesTitleString = 'inventoryItemTitles=' + JSON.stringify([amazonTitle, websiteTitle, ebayTitle]);
    let webTitleRes = await updateLinnItem('//api/Inventory/UpdateInventoryItemTitles', websitesTitleString) as { code: number }
    results['Web Title'] = webTitleRes.code


    let amazonDesc = {
        "pkRowId": guid(),
        "Source": "AMAZON",
        "SubSource": "Silver Bullet Trading Ltd",
        "Description": formatAndEncodeDescription(item.description),
        "StockItemId": item.linnId
    }
    let websiteDesc = {
        "pkRowId": guid(),
        "Source": "MAGENTO",
        "SubSource": fixedEncodeURIComponent('http://quaysports.com'),
        "Description": formatAndEncodeDescription(item.description),
        "StockItemId": item.linnId
    }
    let ebayDesc = {
        "pkRowId": guid(),
        "Source": "EBAY",
        "SubSource": "EBAY1",
        "Description": formatAndEncodeDescription(jariloHtml(item.SKU, item.webTitle, item.description)),
        "StockItemId": item.linnId
    }
    let descString = 'inventoryItemDescriptions=' + JSON.stringify([amazonDesc, websiteDesc, ebayDesc]);
    let descriptionResult = await updateLinnItem('//api/Inventory/UpdateInventoryItemDescriptions', descString) as { code: number }
    results['Long Description'] = descriptionResult.code

    let titleString = `inventoryItemId=${item.linnId}&fieldName=Title&fieldValue=${fixedEncodeURIComponent(item.title)}`;
    let titleRes = await updateLinnItem('//api/Inventory/UpdateInventoryItemField', titleString) as { code: number }
    results.Title = titleRes.code

    for (let image in item.images) {
        if (item.images[image as keyof schema.Images].filename === "") continue
        let imageDetails = {
            "ItemNumber": item.SKU,
            "StockItemId": item.linnId,
            "IsMain": false,
            "ImageUrl": ""
        }

        let imageKey = image as keyof schema.Images

        imageDetails.IsMain = image === "main"

        imageDetails.ImageUrl = item.images[imageKey].link
            ? `https://141.195.190.47/images/${item.images[imageKey].link}/${item.images[imageKey].filename}`
            : `https://141.195.190.47/images/${item.SKU}/${item.images[imageKey].filename}`

        let imageRes = await updateItemImage(imageDetails) as {
            code: number,
            data: {
                StockItemId: string,
                ImageId: string,
                ImageUrl: string,
                ImageThumbnailUrl: string
            }
        }
        if (imageRes.data.ImageId) item.images[imageKey].id = imageRes.data.ImageId
        if (imageRes.data.ImageUrl) item.images[imageKey].url = imageRes.data.ImageUrl
        console.log(imageRes.data)
        results['Update Image'] = imageRes.code
    }
    await setData("New-Items", {SKU: item.SKU}, item)
    return results
}

type NewItemLinnResult = {
    code: number
    data: {
        Items: {
            StockItemId: string
            SKU: string
        }[]
    }
}
export const createNewItems = async (items: { [key: number]: schema.Item }) => {

    const linnHeaders = await postOpts("")
    const opts = {
        method: 'POST',
        headers: linnHeaders.headers
    }
    const suppliers = await fetch('https://'+linnHeaders.hostname+'/api/Inventory/GetSuppliers', opts)
                            .then(async(res)=>await res.json()) as { SupplierName: string, pkSupplierID: string }[]

    const itemsArray = Object.values(items)
    const newItemsBulkUpload = []
    const skuArray = []
    let duplicateSKUS = []
    for (const item of itemsArray) {
        item.supplier = suppliers.find(supplier => supplier.SupplierName === item.supplier)?.pkSupplierID || ""
        const brand = await findOne<{ prefix: string }>('Brand-Prefixes', {brand: item.brand}, {prefix: 1})
        item.SKU = `${brand ? brand.prefix : ""}-${item.SKU.toUpperCase()}`
        const skuCheck = await findOne<string>('New-Items', {SKU:item.SKU}, {SKU:1})
        if(skuCheck) duplicateSKUS.push(item.SKU)
        item.title = `${item.brand.toUpperCase()} ${item.title}`
        newItemsBulkUpload.push(bulkUploadFormat(item))
        skuArray.push(item.SKU)
    }
    if(duplicateSKUS.length > 0) return duplicateSKUS

    const errors = []
    let inventoryUploadResult = await updateLinnItem(
        '/api/Inventory/AddInventoryItemBulk',
        `request={"InventoryItems":${encodeURIComponent(JSON.stringify(newItemsBulkUpload))}}`
    ) as NewItemLinnResult
    if(inventoryUploadResult.code >= 400) errors.push("Bulk inventory upload failed")
    console.log(inventoryUploadResult)

    let stockItemIDsResult = await updateLinnItem(
        "/api/Inventory/GetStockItemIdsBySKU",
        `request={"SKUS":${JSON.stringify(skuArray)}}`
    ) as NewItemLinnResult
    if(stockItemIDsResult.code >= 400) errors.push("Stock item ID download failed")

    const StockLevelArray = []
    const SupplierArray = []
    for (let i = 0; i < itemsArray.length; i++) {

        itemsArray[i].linnId = stockItemIDsResult.data.Items.find(response => response.SKU === itemsArray[i].SKU)?.StockItemId ||  ""
        let extendedPropertiesResult = await updateLinnItem(
            "/api/Inventory/CreateInventoryItemExtendedProperties",
            `inventoryItemExtendedProperties=${JSON.stringify(updateItemFormat(itemsArray[i]))}`
        ) as NewItemLinnResult
        if(extendedPropertiesResult.code >= 400) errors.push("Extended Properties Upload for " + itemsArray[i].SKU + " failed")

        StockLevelArray.push(bulkStockLevelFormat(itemsArray[i]))
        SupplierArray.push(bulkSupplierFormat(itemsArray[i]))
    }

    let updateStockLevelsResult = await updateLinnItem(
        "/api/Stock/UpdateStockLevelsBulk",
        `request={"Items":${JSON.stringify(StockLevelArray)}}`
    ) as NewItemLinnResult
    if(updateStockLevelsResult.code >= 400) errors.push("Bulk stock level upload failed")

    let itemSupplierAssignationResult = await updateLinnItem(
        '/api/Inventory/CreateStockSupplierStat',
        `itemSuppliers=${JSON.stringify(SupplierArray)}`
    ) as NewItemLinnResult
    if(itemSupplierAssignationResult.code >= 400) errors.push("Bulk default supplier assignation failed")
    return errors
}
const bulkSupplierFormat = (item: schema.Item) => ({
    IsDefault: true,
    SupplierID: item.supplier,
    StockItemId: item.linnId
})
const bulkStockLevelFormat = (item: schema.Item) => ({
    StockLevel: item.stock.total,
    MinimumLevel: 2,
    StockItemId: item.linnId,
    StockLocationName: 'Default'
})
const bulkUploadFormat = (item: schema.Item) => ({
    ItemNumber: item.SKU,
    ItemTitle: item.title,
    BarcodeNumber: item.EAN,
    PurchasePrice: item.prices.purchase,
    RetailPrice: item.prices.retail,
    Weight: 0.1
})

function updateItemFormat(item: schema.Item) {
    const tags = item.tags.reduce((string, tag) => string === "" ? tag : `${string}, ${tag}`, "")
    return [
        {
            fkStockItemId: item.linnId,
            SKU: item.SKU,
            PropertyType: "Attribute",
            PropertyValue: fixedEncodeURIComponent(item.mappedExtendedProperties.shippingFormat),
            ProperyName: 'Shipping Format'
        }, {
            fkStockItemId: item.linnId,
            SKU: item.SKU,
            PropertyType: "Attribute",
            PropertyValue: fixedEncodeURIComponent(tags),
            ProperyName: 'Tags'
        }, {
            fkStockItemId: item.linnId,
            SKU: item.SKU,
            PropertyType: "Attribute",
            PropertyValue: fixedEncodeURIComponent(item.brand),
            ProperyName: 'Brand'
        }
    ]
}

export async function addNewSupplier(newSupplier:string) {
    let match = false
    const linnHeaders = await postOpts("")
    const opts = {
        method: 'POST',
        headers: linnHeaders.headers
    }
    const currentSuppliers = await fetch('https://'+linnHeaders.hostname+'/api/Inventory/GetSuppliers', opts)
        .then(async(res)=>await res.json()) as { SupplierName: string, pkSupplierID: string }[]

    for(const supplier in currentSuppliers){
        if(supplier.toUpperCase() === newSupplier.toUpperCase()) match = true
    }
    if(match) return {code:300, message:"Supplier already exists"}

    const {code} = await updateLinnItem('/api/Inventory/AddSupplier', `supplier={"SupplierName": "${newSupplier}"}`) as {code:number}
    if(code >= 400) return {code:400, message:"Linnworks error"}
    return {code:200, message: "New supplier added"}
}