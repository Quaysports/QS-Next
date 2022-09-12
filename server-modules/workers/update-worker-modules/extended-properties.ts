import Linn = require('../../linn-api/linn-api');
import {auth} from "../../linn-api/linn-auth";

interface linnQueryResult {
    SKU:string,
    pkRowId:string,
    epName:string,
    epType:string
    epValue: string,
}

export const extendedProperties = async (skus?:string):Promise<Map<string, sbt.Item>> => {
    await auth(true)
    let merge:Map<string,sbt.Item> = new Map()

    let queryString = `SELECT si.ItemNumber   AS SKU,
                              ep.pkRowId      AS pkRowId,
                              ep.ProperyName  AS epName,
                              ep.ProperyValue AS epValue,
                              ep.ProperyType  AS epType
                       FROM StockItem si
                                LEFT JOIN StockItem_ExtendedProperties ep ON si.pkStockItemID = ep.fkStockItemId
                       WHERE ep.pkRowId IS NOT NULL
                         AND (si.bLogicalDelete = 0 OR si.IsVariationGroup = 1)
                           ${skus ? "AND si.ItemNumber IN (" + skus + ")" : ""}
                       ORDER BY SKU`
    const linnData = (await Linn.getLinnQuery<linnQueryResult>(queryString)).Results
    if (linnData.length === 0) return merge

    for (let item of linnData) {
        if (!merge.has(item.SKU)) {
            merge.set(item.SKU, {
                SKU: item.SKU,
                EXTENDEDPROPERTY: [],
                IDBEP: {
                    AMZLATENCY: 1,
                    COMISO2: "GB",
                    COMISO3: "GBR",
                    TARIFFCODE: "9507",
                }
            })
        } else {
            merge.get(item.SKU)!.IDBEP ??= {
                AMZLATENCY: 1,
                COMISO2: "GB",
                COMISO3: "GBR",
                TARIFFCODE: "9507"
            }
        }
        if (item.epName) processExtendedProperties(item, merge.get(item.SKU)!)
    }

    return merge
}

export const processExtendedProperties = (item:linnQueryResult, mergeItem:sbt.Item) => {
    if(!mergeItem.IDBEP) mergeItem.IDBEP = <sbt.itemDatabaseExtendedProperties>{}
    if (item.epName === 'Brand') {
        mergeItem.IDBEP.BRAND = item.epValue
        mergeItem.BRAND = item.epValue
    }
    if (item.epName === 'Amz Browse Node 1') mergeItem.IDBEP.CATEGORIE1 = item.epValue
    if (item.epName === 'Amz Browse Node 2') mergeItem.IDBEP.CATEGORIE2 = item.epValue
    if (item.epName === 'Amz Bullet Point 1') mergeItem.IDBEP.BULLETPOINT1 = item.epValue
    if (item.epName === 'Amz Bullet Point 2') mergeItem.IDBEP.BULLETPOINT2 = item.epValue
    if (item.epName === 'Amz Bullet Point 3') mergeItem.IDBEP.BULLETPOINT3 = item.epValue
    if (item.epName === 'Amz Bullet Point 4') mergeItem.IDBEP.BULLETPOINT4 = item.epValue
    if (item.epName === 'Amz Bullet Point 5') mergeItem.IDBEP.BULLETPOINT5 = item.epValue
    if (item.epName === 'Amz Search Terms 1') mergeItem.IDBEP.SEARCHTERM1 = item.epValue
    if (item.epName === 'Amz Search Terms 2') mergeItem.IDBEP.SEARCHTERM2 = item.epValue
    if (item.epName === 'Amz Search Terms 3') mergeItem.IDBEP.SEARCHTERM3 = item.epValue
    if (item.epName === 'Amz Search Terms 4') mergeItem.IDBEP.SEARCHTERM4 = item.epValue
    if (item.epName === 'Amz Search Terms 5') mergeItem.IDBEP.SEARCHTERM5 = item.epValue
    if (item.epName === 'QS Cat 1') mergeItem.IDBEP.QSCAT1 = item.epValue
    if (item.epName === 'QS Cat 2') mergeItem.IDBEP.QSCAT2 = item.epValue
    if (item.epName === 'Sport') mergeItem.IDBEP.AMAZSPORT = item.epValue
    if (item.epName === 'Amz Department') mergeItem.IDBEP.AMZDEPARTMENT = item.epValue
    if (item.epName === 'TradePack') mergeItem.IDBEP.TRADEPACK = item.epValue
    if (item.epName === 'TillFilter') mergeItem.TILLFILTER = item.epValue
    if (item.epName === 'Short Description') mergeItem.SHORTDESC = item.epValue
    if (item.epName === 'Shipping Format') mergeItem.SHIPFORMAT = item.epValue
    if (item.epName === 'IDB_Filter') {
        if (item.epValue === 'true') mergeItem.IDBFILTER = 'true'
        if (item.epValue === 'packaging') mergeItem.IDBFILTER = 'packaging'
        if (item.epValue === 'domestic') mergeItem.IDBFILTER = 'domestic'
        if (item.epValue === 'bait') mergeItem.IDBFILTER = 'bait'
    }
    if (mergeItem.EXTENDEDPROPERTY!.map(function (e) {
        return e.epName
    }).indexOf(item.epName) === -1) {
        mergeItem.EXTENDEDPROPERTY!.push({
            epName: item.epName,
            epType: item.epType,
            epValue: item.epValue,
            pkRowId: item.pkRowId
        })
    }
}

