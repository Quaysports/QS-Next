import {NextApiRequest, NextApiResponse} from "next";
import {updateExtendedProperties, updateItemImage, updateLinnItem} from "../../../server-modules/linn-api/linn-api";
import {updateItem} from "../../../server-modules/items/items";
import {guid} from "../../../server-modules/core/core";
import {jariloHtml} from "../../../components/jarilo-template";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    function fixedEncodeURIComponent(str: string | number) {
        return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
            return '%' + c.charCodeAt(0).toString(16);
        })
    }

    function formatAndEncodeDescription(desc:string){
        return encodeURIComponent(desc.replace(/"/g, "'"))
    }

    let promises = []

    console.log("Linnworks Update!")

    let dbUpdate = await updateItem(req.body)
    const item: schema.Item = req.body
    if (!dbUpdate.acknowledged) {
        res.send({status: 404, statusText: "DB update failed"})
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
            }
        }
        testForProperty('Tags', item.tags.reduce((string, tag)=>{return `${string}, ${tag}`},""));
        testForProperty('Brand', item.brand);
        testForProperty('Short Description', item.shortDescription);
        let searchTerms:string = ""
        let extendedProperties = item.mappedExtendedProperties
        searchTerms += extendedProperties.searchTerm1 ? extendedProperties.searchTerm1 + ' ' : null;
        searchTerms += extendedProperties.searchTerm2 ? extendedProperties.searchTerm2 + ' ' : null;
        searchTerms += extendedProperties.searchTerm3 ? extendedProperties.searchTerm3 + ' ' : null;
        searchTerms += extendedProperties.searchTerm4 ? extendedProperties.searchTerm4 + ' ' : null;
        searchTerms += extendedProperties.searchTerm5 ? extendedProperties.searchTerm5 + ' ' : null;
        testForProperty('Search Terms', searchTerms);

        if (newExtendedProperties.length > 0) {
            promises.push(await updateExtendedProperties("/api/Inventory/CreateInventoryItemExtendedProperties", "inventoryItemExtendedProperties=" + JSON.stringify(newExtendedProperties)).catch(err => err))
        }
        if (oldExtendedProperties.length > 0) {
            promises.push(await updateExtendedProperties("/api/Inventory/UpdateInventoryItemExtendedProperties", "inventoryItemExtendedProperties=" + JSON.stringify(oldExtendedProperties)).catch(err => err))
        }
    }

    console.log("Linnworks Update 101!")

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
    promises.push(await updateLinnItem('//api/Inventory/UpdateInventoryItemTitles', websitesTitleString).catch(err => err))
    console.log("Linnworks Update 201!")

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
    promises.push(await updateLinnItem('//api/Inventory/UpdateInventoryItemDescriptions', descString).catch(err => err))
    console.log("Linnworks Update 301!")

    let titleString = `inventoryItemId=${item.linnId}&fieldName=Title&fieldValue=${fixedEncodeURIComponent(item.title)}`;
    await updateLinnItem('//api/Inventory/UpdateInventoryItemField', titleString).catch(err => err)
    console.log("Linnworks Update 401!")

    for (let image in item.images) {
        let imageDetails = {
            "ItemNumber": item.SKU,
            "StockItemId": item.linnId,
            "IsMain": false,
            "ImageUrl": ""
        }

        let imageKey = image as keyof schema.Images

        imageDetails.IsMain = image === "main"

        imageDetails.ImageUrl = item.images[imageKey].link
            ? `http://141.195.190.47:4000/images/${item.images[imageKey].link}/${item.images[imageKey].filename}`
            : `http://141.195.190.47:4000/images/${item.SKU}/${item.images[imageKey].filename}`

        await updateItemImage(imageDetails).catch(err => err)
        console.log("Linnworks Update 501!")

    }
    console.log("Bunch of promises",promises)
    return await Promise.all(promises)
}