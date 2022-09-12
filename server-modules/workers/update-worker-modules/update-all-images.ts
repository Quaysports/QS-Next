import Linn = require('../../linn-api/linn-api');
import {auth} from "../../linn-api/linn-auth";
import * as fs from "fs";
import * as https from "https";

export const updateAllImages = async (merge = (new Map<string, sbt.Item>())) => {
    await auth(true)
    const linnData = await Linn.bulkGetImages(Array.from(merge.keys()))

    const getImage = async (id: number, fileExt: string, image:linn.BulkGetImagesImage) => {
        const makeImagesFolder = async () => {
            if (!fs.existsSync('../images')) await fs.mkdirSync("../images");
            return '../images'
        }

        const makeSkuFolder = async (root:string) => {
            let path = `${root}/${image.SKU.replace(/([ \/])+/g, "-")}`
            if (!fs.existsSync(path)) await fs.mkdirSync(path);
            return path
        }

        const path = await makeSkuFolder(await makeImagesFolder())

        const files = fs.readdirSync(path)
        if (!files) return
        console.log(`Downloading ${image.SKU} - ${path}/${id}.${fileExt}`)
        https.get(image["FullSource"], (response) => {
            let data: Uint8Array[] = [];
            response.on('data', function (chunk) {
                data.push(chunk);
            }).on('end', async function () {
                let buffer = Buffer.concat(data);
                await fs.writeFileSync(`${path}/${id}.${fileExt}`, buffer)
                return
            })
        })
    }

    for (let image of linnData.Images) {
        if(!merge.has(image.SKU)) merge.set(image.SKU, { SKU: image.SKU })
        merge.get(image.SKU)!.IMAGES ??= {}

        let id = merge.get(image.SKU)!.IMAGES!.main
            ? Object.keys(merge.get(image.SKU)!.IMAGES!).length
            : Object.keys(merge.get(image.SKU)!.IMAGES!).length + 1

        let currentDetails = image.FullSource.split('/')
        let fileExt = currentDetails[currentDetails.length - 1].split('.')[1]

        if (image.IsMain) {
            id = 0
            merge.get(image.SKU)!.IMAGES!.main = {
                id: image.pkRowId,
                filename: `${id}.${fileExt}`
            }
            await getImage(id, fileExt, image)
        } else {
            if (!merge.get(image.SKU)?.ISCOMPOSITE) {
                merge.get(image.SKU)!.IMAGES!["image" + id] = {
                    id: image.pkRowId,
                    filename: `${id}.${fileExt}`
                }
                await getImage(id, fileExt, image)
            }
        }
    }

    return merge
}