import {NextApiRequest, NextApiResponse} from "next";
import {updateExtendedProperties, updateItemImage, updateLinnItem} from "../../../server-modules/linn-api/linn-api";
import {updateItem} from "../../../server-modules/items/items";
import {guid} from "../../../server-modules/core/core";

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
    const item: sbt.Item = req.body
    if (!dbUpdate.acknowledged) {
        res.send({status: 404, statusText: "DB update failed"})
    } else {
        const oldExtendedProperties: { [key: string]: string | number }[] = []
        const newExtendedProperties: { [key: string]: string | number }[] = []

        function testForProperty(property: string, value: string | number) {
            let pos = item.EXTENDEDPROPERTY.map((extendedProperty) => {
                return extendedProperty.epName
            }).indexOf(property);
            pos > -1 ?
                oldExtendedProperties.push({
                    fkStockItemId: item.LINNID,
                    pkRowId: item.EXTENDEDPROPERTY[pos].pkRowId,
                    PropertyType: "Attribute",
                    PropertyValue: fixedEncodeURIComponent(value),
                    ProperyName: property
                }) :
                newExtendedProperties.push({
                    fkStockItemId: item.LINNID,
                    PropertyType: "Attribute",
                    PropertyValue: fixedEncodeURIComponent(value),
                    ProperyName: property
                })
        }

        for (const property of Object.keys(item.IDBEP)) {
            console.log(item.IDBEP)
            switch (property) {
                case "CATEGORIE1":
                    testForProperty('Amz Browse Node 1', item.IDBEP.CATEGORIE1);
                    break;
                case "CATEGORIE2":
                    testForProperty('Amz Browse Node 2', item.IDBEP.CATEGORIE2);
                    break;
                case "BULLETPOINT1":
                    testForProperty('Amz Bullet Point 1', item.IDBEP.BULLETPOINT1);
                    break;
                case "BULLETPOINT2":
                    testForProperty('Amz Bullet Point 2', item.IDBEP.BULLETPOINT2);
                    break;
                case "BULLETPOINT3":
                    testForProperty('Amz Bullet Point 3', item.IDBEP.BULLETPOINT3);
                    break;
                case "BULLETPOINT4":
                    testForProperty('Amz Bullet Point 4', item.IDBEP.BULLETPOINT4);
                    break;
                case "BULLETPOINT5":
                    testForProperty('Amz Bullet Point 5', item.IDBEP.BULLETPOINT5);
                    break;
                case "SEARCHTERM1":
                    testForProperty('Amz Search Terms 1', item.IDBEP.SEARCHTERM1);
                    break;
                case "SEARCHTERM2":
                    testForProperty('Amz Search Terms 2', item.IDBEP.SEARCHTERM2);
                    break;
                case "SEARCHTERM3":
                    testForProperty('Amz Search Terms 3', item.IDBEP.SEARCHTERM3);
                    break;
                case "SEARCHTERM4":
                    testForProperty('Amz Search Terms 4', item.IDBEP.SEARCHTERM4);
                    break;
                case "SEARCHTERM5":
                    testForProperty('Amz Search Terms 5', item.IDBEP.SEARCHTERM5);
                    break;
                case "AMAZSPORT":
                    testForProperty('Sport', item.IDBEP.AMAZSPORT);
                    break;
                case "AMZDEPARTMENT":
                    testForProperty('Amz Department', item.IDBEP.AMZDEPARTMENT);
                    break;
                case "BRAND":
                    testForProperty('Brand', item.IDBEP.BRAND);
                    break;
                case "TAGS":
                    testForProperty('Tags', item.IDBEP.TAGS);
                    break;
                case "AMZLATENCY":
                    testForProperty('Amz Fulfillment Latency', item.IDBEP.AMZLATENCY);
                    break;
            }
        }
        testForProperty('Shipping Format', item.SHIPFORMAT);
        testForProperty('Short Description', item.SHORTDESC);
        let searchTerms:string = ""
        searchTerms += item.IDBEP.SEARCHTERM1 ? item.IDBEP.SEARCHTERM1 + ' ' : null;
        searchTerms += item.IDBEP.SEARCHTERM1 ? item.IDBEP.SEARCHTERM2 + ' ' : null;
        searchTerms += item.IDBEP.SEARCHTERM1 ? item.IDBEP.SEARCHTERM3 + ' ' : null;
        searchTerms += item.IDBEP.SEARCHTERM1 ? item.IDBEP.SEARCHTERM4 + ' ' : null;
        searchTerms += item.IDBEP.SEARCHTERM1 ? item.IDBEP.SEARCHTERM5 + ' ' : null;
        testForProperty('Search Terms', searchTerms);

        if (newExtendedProperties.length > 0) {
            promises.push(await updateExtendedProperties("/api/Inventory/CreateInventoryItemExtendedProperties", "inventoryItemExtendedProperties=" + JSON.stringify(newExtendedProperties)).catch(err => err))
        }
        if (oldExtendedProperties.length > 0) {
            promises.push(await updateExtendedProperties("/api/Inventory/UpdateInventoryItemExtendedProperties", "inventoryItemExtendedProperties=" + JSON.stringify(oldExtendedProperties)).catch(err => err))
        }
    }

    console.log("Linnworks Update 101!")

    let amazTitle = {
        "pkRowId": guid(),
        "Source": "AMAZON",
        "SubSource": "Silver Bullet Trading Ltd",
        "Title": fixedEncodeURIComponent(item.TITLEWEBSITE),
        "StockItemId": item.LINNID
    }
    let websiteTitle = {
        "pkRowId": guid(),
        "Source": "MAGENTO",
        "SubSource": fixedEncodeURIComponent('http://quaysports.com'),
        "Title": fixedEncodeURIComponent(item.TITLEWEBSITE),
        "StockItemId": item.LINNID
    }
    let ebayTitle = {
        "pkRowId": guid(),
        "Source": "EBAY",
        "SubSource": "EBAY1",
        "Title": fixedEncodeURIComponent(item.TITLEWEBSITE),
        "StockItemId": item.LINNID
    }
    let websitesTitleString = 'inventoryItemTitles=' + JSON.stringify([amazTitle, websiteTitle, ebayTitle]);
    promises.push(await updateLinnItem('//api/Inventory/UpdateInventoryItemTitles', websitesTitleString).catch(err => err))
    console.log("Linnworks Update 201!")

    let amazDesc = {
        "pkRowId": guid(),
        "Source": "AMAZON",
        "SubSource": "Silver Bullet Trading Ltd",
        "Description": formatAndEncodeDescription(item.DESCRIPTION),
        "StockItemId": item.LINNID
    }
    let websiteDesc = {
        "pkRowId": guid(),
        "Source": "MAGENTO",
        "SubSource": fixedEncodeURIComponent('http://quaysports.com'),
        "Description": formatAndEncodeDescription(item.DESCRIPTION),
        "StockItemId": item.LINNID
    }
    /*let ebayDesc = {
        "pkRowId": guid(),
        "Source": "EBAY",
        "SubSource": "EBAY1",
        "Description": formatAndEncodeDescription(await jariloHtml(item.SKU, item.TITLEWEBSITE, item.DESCRIPTION)),
        "StockItemId": item.LINNID
    }*/
    let descString = 'inventoryItemDescriptions=' + JSON.stringify([amazDesc, websiteDesc, /*ebayDesc*/]);
    promises.push(await updateLinnItem('//api/Inventory/UpdateInventoryItemDescriptions', descString).catch(err => err))
    console.log("Linnworks Update 301!")

    let titleString = `inventoryItemId=${item.LINNID}&fieldName=Title&fieldValue=${fixedEncodeURIComponent(item.TITLE)}`;
    await updateLinnItem('//api/Inventory/UpdateInventoryItemField', titleString).catch(err => err)
    console.log("Linnworks Update 401!")

    for (let image in item.IMAGES) {
        let imageDetails = {
            "ItemNumber": item.SKU,
            "StockItemId": item.LINNID,
            "IsMain": false,
            "ImageUrl": ""
        }

        imageDetails.IsMain = image === "main"

        imageDetails.ImageUrl = item.IMAGES[image].link
            ? `http://141.195.190.47/images/${item.IMAGES[image].link}/${item.IMAGES[image].filename}`
            : `http://141.195.190.47/images/${item.SKU}/${item.IMAGES[image].filename}`

        await updateItemImage(imageDetails).catch(err => err)
        console.log("Linnworks Update 501!")

    }
    console.log("Bunch of promises",promises)
    return await Promise.all(promises)
}