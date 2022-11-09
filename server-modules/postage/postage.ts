import * as mongoI from '../mongo-interface/mongo-interface';
import * as Linn from '../linn-api/linn-api';

interface postalData {
    _id?: { $oid: string };
    POSTALFORMAT: string;
    POSTID: string;
    VENDOR: string;
    POSTCOSTEXVAT: number;
    SFORMAT: string;
    LINNSHIPPING: string;
    LASTUPDATE: string;
}

export let data:Map<string,postalData>

export const init = async () => {
    let result = await mongoI.find<postalData>("Postage")
    if(!result) return
    data = new Map(result.map(postage=>{return [postage.POSTID, postage]}))
}

export const get = async ()=> {
    return await mongoI.find<postalData>("Postage")
}

export const update = async (data:postalData) => {
    if (data._id !== undefined) delete data._id;
    await mongoI.setData("Postage", {POSTALFORMAT: data.POSTALFORMAT}, data)
    await init()
    return data
}

export const updateAll = async () => {
    const linnPostalServices = await Linn.getPostalServices()
    for (let service of linnPostalServices) {
        if (service.hasMappedShippingService) {
            let postService = {
                POSTALFORMAT: service.PostalServiceName,
                POSTID: service.id,
                VENDOR: service.Vendor
            };
            await mongoI.setData("Postage", {POSTALFORMAT: postService.POSTALFORMAT}, postService)
        }
    }
    await init()
    return
}

export const remove = async (data:postalData) => {
    if (data._id !== undefined) delete data._id
    await mongoI.deleteOne("Postage", {POSTALFORMAT: data.POSTALFORMAT})
    await init()
    return data
}