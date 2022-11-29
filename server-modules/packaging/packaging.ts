import * as mongoI from '../mongo-interface/mongo-interface';
import * as Linn from '../linn-api/linn-api';

export interface Packaging {
    _id?: { $oid: string };
    ID: string;
    LINKEDSKU: string[];
    NAME: string;
    TYPE: string;
    PRICE?: number;
}

export const get = async (id?: string) => {
    return await mongoI.find<Packaging>("Packaging", id ? {ID: id} : {})
}

export const update = async (data: Packaging) => {
    if (data._id) delete data._id
    return await mongoI.setData("Packaging", {ID: data.ID}, data)
}

export const updateAll = async () => {
    const linnData = await linnGet()
    for (let v of linnData) await mongoI.setData("Packaging", {ID: v.ID}, v)
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