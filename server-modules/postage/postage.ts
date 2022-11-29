import * as mongoI from '../mongo-interface/mongo-interface';
import * as Linn from '../linn-api/linn-api';

export interface Postage {
    _id?: { $oid: string };
    POSTALFORMAT: string;
    POSTID: string;
    VENDOR: string;
    POSTCOSTEXVAT: number;
    SFORMAT: string;
    LINNSHIPPING: string;
    LASTUPDATE: string;
}

export const get = async ()=> {
    return await mongoI.find<Postage>("Postage")
}

export const update = async (data:Postage) => {
    if (data._id !== undefined) delete data._id;
    return await mongoI.setData("Postage", {POSTALFORMAT: data.POSTALFORMAT}, data)
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
    return
}

export const remove = async (data:Postage) => {
    if (data._id !== undefined) delete data._id
    return mongoI.deleteOne("Postage", {POSTALFORMAT: data.POSTALFORMAT})
}