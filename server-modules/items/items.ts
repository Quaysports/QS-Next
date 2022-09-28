import * as mongoI from '../mongo-interface/mongo-interface'
const fs = require("fs");

export const dbUpdateImage = async (item: { _id?: string; SKU: string; IMAGES: { [p: string]: { filename: string } }; }) => {
    if (item._id !== undefined) delete item._id

    let result = await mongoI.findOne<sbt.Item>("Items", {SKU: item.SKU}, {IMAGES: 1})
    if (result) {
        if (result.IMAGES) {
            for (let i in item.IMAGES) result.IMAGES[i] = item.IMAGES[i]
        } else {
            result.IMAGES = item.IMAGES
        }
        await mongoI.setData("Items", {SKU: item.SKU}, result)
        return result
    } else {
        return result
    }
}

export const getItem = async (query:object, projection:object) => {
    return await mongoI.findOne<sbt.Item>("Items", query, projection)
}

export const updateItem = async (item:sbt.Item) => {
    if (item._id !== undefined) delete item._id
    return await mongoI.setData("Items", {SKU: item.SKU}, item)
}

export const getItems = async (query:object = {}, projection:object = {}, sort:object = {}) => {
    return await mongoI.find<sbt.Item>("Items", query, projection, sort)
}

export const searchItems = async (query: { opts?: {LISTINGVARIATION?:boolean}; type: string; id: string; }) => {

    interface dbQueryTitle {
        $and: [{$or: [{$text: {$search: string}}, {TITLE: {$regex: string, $options: string}}]}]
    }
    interface dbQuery {
        [key:string]:{$regex: string, $options: string}
    }
    interface SearchOpts {
        LISTINGVARIATION?:boolean
    }

    let dbQuery: SearchOpts & dbQuery | SearchOpts & dbQueryTitle
    let dbSort
    let dbProject

    let opts = query.opts ? query.opts : {}

    if (query.type === "TITLE") {
        dbQuery = {$and: [{$or: [{$text: {$search: query.id}}, {TITLE: {$regex: query.id, $options: "i"}}]}]}
        dbSort = {score: {$meta: "textScore"}}
        dbProject = {
            SKU: 1,
            TITLE: 1,
            EAN: 1,
            score: {$meta: "textScore"}
        }
    } else {
        dbQuery = {[query.type]: {$regex: query.id, $options: "i"}}
        dbSort = {[query.type]: 1}
        dbProject = {
            "SKU": 1,
            "TITLE": 1,
            "EAN": 1,
        }
    }

    if (opts.LISTINGVARIATION !== undefined) dbQuery.LISTINGVARIATION = opts.LISTINGVARIATION
    return await mongoI.find<sbt.Item>("Items", dbQuery, dbProject, dbSort)
}

export const getImages = async (sku:string, type:string) => {
    const item = await mongoI.findOne<sbt.Item>("Items", {SKU: sku}, {IMAGES: 1})
    if (!item) return
    if (!item.IMAGES) return
    if (type) {
        let path = item.IMAGES[type].link ? "/images/" + item.IMAGES[type].link + "/" : "/images/" + sku + "/"
        return path + item.IMAGES[type].filename
    } else {
        let arr = []
        for (let i in item.IMAGES) {
            let path = item.IMAGES[i].link ? "/images/" + item.IMAGES[i].link + "/" : "/images/" + sku + "/"
            arr.push(path + item.IMAGES[i].filename)
        }
        return arr
    }
}

export const uploadImages = async (file:{_id:string, SKU:string, id:string, filename: string, image:string}) => {
    const makeImagesFolder = async () => {
        if (!fs.existsSync('../images')) await fs.mkdir("../images")
        return '../images'
    }

    const makeSkuFolder = async (root:string) => {
        if (!fs.existsSync(`${root}/${file.SKU.replaceAll("/", "-")}`)) {
            await fs.mkdir(`${root}/${file.SKU.replaceAll("/", "-")}`)
        }
        return `${root}/${file.SKU.replaceAll("/", "-")}`
    }

    function decodeBase64Image(dataString:string): { type: string | null, data: Buffer | null, error: Error | null } {
        let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (!matches || matches.length !== 3) return {type: null, data: null, error: new Error('Invalid input string')};

        return {type: matches[1], data: Buffer.from(matches[2], 'base64'), error: null};
    }

    //check for existing files
    const root = await makeImagesFolder()
    const path = await makeSkuFolder(root)
    let dbImage = {
        _id: file._id,
        SKU: file.SKU,
        IMAGES: {
            [file.id]: {
                filename: file.filename
            }
        }
    }

    let image = decodeBase64Image(file.image)

    if (image.error) {
        console.error(image.error)
        return
    }

    fs.readdir(path, function (err:Error, files: any) {
        if (!files) {
            fs.writeFile(`${path}/${file.filename}`, image.data!.toString(), async (err:Error) => {
                if (err) console.log(err)
                return await dbUpdateImage(dbImage)
            })
        } else {
            for (let foundFile of files) {
                if (foundFile.split(".")[0] === file.filename.split(".")[0]) {
                    fs.unlinkSync(`${path}/${foundFile}`)
                }
            }
            fs.writeFile(`${path}/${file.filename}`, image.data!.toString(), async (err:Error) => {
                if (err) console.log(err)
                return await dbUpdateImage(dbImage)
            })
        }
    })
}

export const deleteImage = async (id:string, item:sbt.Item) => {
    const result = await mongoI.unsetData("Items", {SKU: item.SKU}, {["IMAGES." + id]: ""})
    if (result && result.modifiedCount === 0) return {status: "No image found"}

    const files = await fs.readdir(`../images/${item.SKU}/`)

    if (files.indexOf(item.IMAGES![id].filename) !== -1) {
        if (!item.IMAGES![id].link) fs.unlinkSync(`../images/${item.SKU}/${item.IMAGES![id].filename}`)
    }

    return {status: "Deleted"}
}

export const archiveSKU = async (data: {[key:string]:string}) => {
    await mongoI.setData("Archived-SKU", {}, data)
    return {status: "Archived"}
}

export const getBrandLabelImages = async () => {
    try {
        return await fs.readdir("../brand-label-images")
    }
    catch(e) {
        console.error(e)
    }
}

export const getBrands = async () => {
    let result = await mongoI.findDistinct("Items", "IDBEP.BRAND", {})
    console.log(result)
     return result
}