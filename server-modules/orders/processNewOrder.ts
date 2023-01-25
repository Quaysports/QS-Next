import * as mongoI from '../mongo-interface/mongo-interface';

import {LinnOrdersSQLResult} from "./orders";
import {sbt} from "../../types";

export const processNewOrder = async (data:LinnOrdersSQLResult[]) => {
    let arr = []
    for (const item of data) {
        let i = arr.map(item=>{return item.id}).indexOf(item.id)
        if (i === -1) {
            let obj:sbt.OnlineOrder = {
                totalWeight: 0,
                address1: item.address1,
                address2: item.address2,
                address3: item.address3,
                date: item.date,
                email: item.email,
                extRef: item.extRef,
                id: item.id,
                name: item.name,
                packaging: [],
                phone: item.phone,
                postalid: item.postalid,
                postcode: item.postcode,
                region: item.region,
                town: item.town,
                source: item.source,
                tracking: item.tracking,
                price: item.price,
                items: [],
                composite: [],
                prices: []
            }

            if (parseFloat(item.unitPrice) > 0) {
                obj.prices.push({
                    sku: item.sku,
                    qty: parseFloat(item.qty),
                    price: parseFloat(item.unitPrice),
                })
            }

            if (item.composite === "False") {
                obj.packaging.push({
                    type: item.packaging,
                    weight: parseFloat(item.packagingWeight)
                })
                obj.items.push({
                    sku: item.sku,
                    qty: parseFloat(item.qty),
                    weight: parseFloat(item.weight),
                })

                arr.push(obj)
            } else {
                obj.packaging.push({
                    type: item.packaging,
                    weight: parseFloat(item.packagingWeight)
                })
                obj.composite.push({
                    sku: item.sku,
                    qty: parseFloat(item.qty)
                })
                arr.push(obj)
            }
        } else {

            if (parseFloat(item.unitPrice) > 0) {
                arr[i].prices.push({
                    sku: item.sku,
                    qty: parseFloat(item.qty),
                    price: parseFloat(item.unitPrice),
                })
            }

            if (item.composite === "False") {
                arr[i].packaging.push({
                    type: item.packaging,
                    weight: parseFloat(item.packagingWeight)
                })
                arr[i].items.push({
                    sku: item.sku,
                    qty: parseFloat(item.qty),
                    weight: parseFloat(item.weight)
                })
            } else {
                arr[i].packaging.push({
                    type: item.packaging,
                    weight: parseFloat(item.packagingWeight)
                })
                arr[i].composite.push({
                    sku: item.sku,
                    qty: parseFloat(item.qty)
                })
            }
        }
    }

    for (let item of arr) {
        item.totalWeight = 0
        if (item.packaging.length > 1) {
            let heaviest = 0
            for (const v of item.packaging) {
                if (v.weight > heaviest) heaviest = v.weight
            }
            item.totalWeight += heaviest
        } else {
            item.totalWeight += item.packaging[0].weight
        }

        for (const v of item.items) {
            item.totalWeight += v.qty * v.weight
        }

    }

    await mongoI.bulkUpdateAny("Orders", arr, "id")

    return
}