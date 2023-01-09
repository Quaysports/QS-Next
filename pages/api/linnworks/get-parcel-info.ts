import {NextApiRequest, NextApiResponse} from "next";
import {getLinnQuery} from "../../../server-modules/linn-api/linn-api";

const currentYear = new Date().getFullYear()
export interface QueryResponse {
    source:string, service:string, count:string, year:string
}

export interface SourceData {
    source:string, service:{[key:string]:string}
}

export type ParcelInfo ={
    year:string,
    data:SourceData[],
    totals:{
        total:number,
        [key:string]:number
    }
}

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    let query = `SELECT 
                    Source as source, 
                    PostalServiceName as service,
                    count(postalServiceName) as count,
                    YEAR(dProcessedOn) as year
                 FROM [Order] o 
                 INNER JOIN PostalServices ps ON o.fkPostalServiceId = ps.pkPostalServiceId
                 AND o.dProcessedOn > '${currentYear-1}-01-01'
                 AND o.bProcessed = 'True'
                 AND Source NOT IN('Shop', 'SHOP')
                 AND PostalServiceName NOT IN ('Standard', 'Expedited', 'DON''T DESPATCH', 'CHANNEL ISLAND ORDERS')
                 GROUP BY Source, PostalServiceName, YEAR(dProcessedOn)`
    let data = await getLinnQuery<QueryResponse>(query)

    if(!data?.Results) res.end()

    let response:ParcelInfo[] = []

    function processYear(year:number, index:number, item:QueryResponse){
        if(!response[index]){
            response[index] = {
                year:year.toString(),
                data:[
                    {source:item.source, service:{[item.service]:item.count}}
                ],
                totals:{
                    total:Number(item.count),
                    [item.source]:Number(item.count)}
            }
        } else {
            let pos = response[index].data.findIndex((data)=>data.source === item.source)
            if(pos === -1){
                response[index].data.push({source:item.source, service:{[item.service]:item.count}})
            } else {
                response[index].data[pos].service[item.service] ??= item.count
            }
            response[index].totals.total += Number(item.count)
            response[index].totals[item.source]
                ? response[index].totals[item.source] += Number(item.count)
                : response[index].totals[item.source] = Number(item.count)
        }
    }

    for(let source of data.Results) {
        processYear(Number(source.year), currentYear - Number(source.year), source)
    }

    res.status(200).json(response)
}