import * as mongoI from '../mongo-interface/mongo-interface';
import * as Linn from '../linn-api/linn-api';

interface packagingData {
    _id?: { $oid: string };
    ID: string;
    LINKEDSKU: string[];
    NAME: string;
    TYPE: string;
    PRICE?: number;
}

export let data: Map<string, packagingData> = new Map()
let firstLoad: boolean = true

export const init = async () => {
    if (firstLoad) {
        await updateAll()
    } else {
        let result = await mongoI.find<packagingData>("Packaging")
        if (!result) return
        data = new Map(result.map(packaging => {
            return [packaging.ID, packaging]
        }))
    }
}

export const get = async (id?: string) => {
    return await mongoI.find<packagingData>("Packaging", id ? {ID: id} : {})
}

export const update = async (data: packagingData) => {
    if (data._id) delete data._id
    return await mongoI.setData("Packaging", {ID: data.ID}, data)
}

export const updateAll = async () => {
    console.log('Packaging: Updating all')
    const linnData = await linnGet()
    for (let v of linnData) await mongoI.setData("Packaging", {ID: v.ID}, v)
    firstLoad = false
    await init()
    return {status: 'done'}
}

export const linnGet = async () => {
    let packaging = await Linn.getLinnQuery<{ Category: string, ID: string, Type: string, SKU: string }>(
        `SELECT pg.PackageCategory   AS Category,
                pg.PackageCategoryID AS ID,
                pt.PackageTitle      AS Type,
                si.ItemNumber        AS SKU
         FROM PackageGroups pg
                  INNER JOIN PackageTypes pt ON pg.PackageCategoryID = pt.PackageGroupID
                  INNER JOIN StockItem si ON si.PackageGroup = pg.PackageCategoryID
         WHERE pg.bLogicalDelete = 'false'
           AND si.bLogicalDelete = 0
         ORDER BY pg.PackageCategory`
    )

    let data = packaging.Results
    let process = []
    for (let v in data) {
        let pos = process.map(item=>{return item.ID}).indexOf(data[v].ID)
        if (pos === -1) {
            process.push({
                ID: data[v].ID,
                NAME: data[v].Category,
                TYPE: data[v].Type,
                LINKEDSKU: [data[v].SKU]
            })
        } else {
            process[pos].LINKEDSKU.push(data[v].SKU)
            process[pos].LINKEDSKU.sort()
        }
    }
    return process
}