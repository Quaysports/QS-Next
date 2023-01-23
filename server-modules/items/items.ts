import * as mongoI from '../mongo-interface/mongo-interface'

const fs = require("fs");

type DbImage = {
    _id:schema.Item["_id"]
    SKU:schema.Item["SKU"]
    images:Partial<schema.Images>
}
export const dbUpdateImage = async (item: DbImage) => {
    if (item._id !== undefined) delete item._id

    let result = await mongoI.findOne<Pick<schema.Item, "SKU" | "_id" | "images">>("New-Items", {SKU: item.SKU}, {images: 1})
    if (result) {
        if (result.images) {
            for (let i in item.images) result.images[i as keyof schema.Images] = item.images[i as keyof schema.Images] as schema.Image
        } else {
            result.images = <schema.Images>item.images
        }
        await mongoI.setData("New-Items", {SKU: item.SKU}, result)
        return result
    } else {
        return result
    }
}

export const getItem = async (query:object, projection:object = {}) => {
    return await mongoI.findOne<schema.Item>("New-Items", query, projection)
}

export const updateItem = async (item:schema.Item) => {
    if (item._id !== undefined) delete item._id
    let res = await mongoI.setData("New-Items", {SKU: item.SKU}, item)
    return res ? res : {acknowledged: false}
}

export const getItems = async (query:object = {}, projection:object = {}, sort:object = {}) => {
    return await mongoI.find<schema.Item>("New-Items", query, projection, sort)
}

export const getLinkedItems = async (sku: string) => {
    let linkedSkus = await mongoI.findDistinct("New-Items", "SKU", {"compositeItems.SKU": sku})
    return linkedSkus ? linkedSkus : []
}

export const getDefaultSuppliers = async (filter: object = {}) => {
    return await mongoI.findDistinct("New-Items", "supplier", filter)
}

export const getAllBrands = async (filter: object = {}) => {
    return await mongoI.findDistinct("New-Items", "brand", filter)
}

export const getAllSuppliers = async (filter: object = {}) => {
    return await mongoI.findDistinct("New-Items", "suppliers", filter)
}

export const searchItems = async (query: { opts?: { isListingVariation?: boolean }; type: string; id: string; }) => {

    interface dbQueryTitle {
        $and: [{ $or: [{ $text: { $search: string } }, { title: { $regex: string, $options: string } }] }]
    }

    interface dbQuery {
        [key: string]: { $regex: string, $options: string }
    }

    interface SearchOpts {
        isListingVariation?: boolean
    }

    let dbQuery: SearchOpts & dbQuery | SearchOpts & dbQueryTitle
    let dbSort
    let dbProject

    let opts = query.opts ? query.opts : {}

    if (query.type === "TITLE") {
        dbQuery = {$and: [{$or: [{$text: {$search: query.id}}, {title: {$regex: query.id, $options: "i"}}]}]}
        dbSort = {score: {$meta: "textScore"}}
        dbProject = {
            SKU: 1,
            title: 1,
            EAN: 1,
            score: {$meta: "textScore"}
        }
    } else {
        dbQuery = {[query.type]: {$regex: query.id, $options: "i"}}
        dbSort = {[query.type]: 1}
        dbProject = {
            "SKU": 1,
            "title": 1,
            "EAN": 1,
        }
    }

    if (opts.isListingVariation !== undefined) dbQuery.isListingVariation = opts.isListingVariation
    return await mongoI.find<schema.Item>("New-Items", dbQuery, dbProject, dbSort)
}

export const uploadImages = async (file: { _id: string, SKU: string, id: string, filename: string, image: string }) => {
    const makeImagesFolder = async () => {
        if (!fs.existsSync('../images')) await fs.mkdir("../images")
        return '../images'
    }

    const makeSkuFolder = async (root: string) => {
        if (!fs.existsSync(`${root}/${file.SKU.replaceAll("/", "-")}`)) {
            await fs.mkdir(`${root}/${file.SKU.replaceAll("/", "-")}`)
        }
        return `${root}/${file.SKU.replaceAll("/", "-")}`
    }

    function decodeBase64Image(dataString: string): { type: string | null, data: Buffer | null, error: Error | null } {
        let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (!matches || matches.length !== 3) return {type: null, data: null, error: new Error('Invalid input string')};

        return {type: matches[1], data: Buffer.from(matches[2], 'base64'), error: null};
    }

    //check for existing files
    const root = await makeImagesFolder()
    const path = await makeSkuFolder(root)

    const dbImage = {
        _id: file._id,
        SKU: file.SKU,
        images:  {
            [file.id]: {
                filename: file.filename
            },
        }
    }
    let image = decodeBase64Image(file.image)

    if (image.error) {
        console.error(image.error)
        return
    }

    fs.readdir(path, function (err: Error, files: any) {
        if (!files) {
            fs.writeFile(`${path}/${file.filename}`, image.data!.toString(), async (err: Error) => {
                if (err) console.log(err)
                return await dbUpdateImage(dbImage)
            })
        } else {
            for (let foundFile of files) {
                if (foundFile.split(".")[0] === file.filename.split(".")[0]) {
                    fs.unlinkSync(`${path}/${foundFile}`)
                }
            }
            fs.writeFile(`${path}/${file.filename}`, image.data!.toString(), async (err: Error) => {
                if (err) console.log(err)
                return await dbUpdateImage(dbImage)
            })
        }
    })
}

export const deleteImage = async (id:keyof schema.Images, item:schema.Item) => {
    const result = await mongoI.unsetData("New-Items", {SKU: item.SKU}, {["images." + id]: ""})
    if (result && result.modifiedCount === 0) return {status: "No image found"}

    const files = await fs.readdir(`../images/${item.SKU}/`)

    if (files.indexOf(item.images[id].filename) !== -1) {
        if (!item.images[id].link) fs.unlinkSync(`../images/${item.SKU}/${item.images[id].filename}`)
    }

    return {status: "Deleted"}
}

export const archiveSKU = async (data: { [key: string]: string }) => {
    await mongoI.setData("Archived-SKU", {}, data)
    return {status: "Archived"}
}

export const getBrandLabelImages = async () => {
    try {
        return await fs.readdir("../brand-label-images")
    } catch (e) {
        console.error(e)
    }
}

export const getBrands = async (filter = {}) => {
    return await mongoI.findDistinct("New-Items", "brand", filter)
}

export const getTags = async () => {
    const tags = await mongoI.findDistinct("New-Items", "tags", {tags:{$not:{$size:0}}})
    return tags ? tags : []
}

export const getStockValues = async (domestic: boolean) => {

    let query = {
        $and: [
            {isListingVariation: false},
            {isComposite: false},
            {"stock.value": {$gt: 0}},
            {tags: {$nin: ['domestic', 'bait', 'filtered']}},
        ]
    }

    let domesticQuery = {
        $and: [
            {isListingVariation: false},
            {isComposite: false},
            {"stock.value": {$gt: 0}},
            {tags: {$in: ['domestic']}},
            {tags: {$nin: ['bait, filtered']}},
        ]
    }

    let totalsQuery = [
        {
            '$match': domestic ? domesticQuery : query
        }, {
            '$group': {
                '_id': null,
                'total': {
                    '$sum': {
                        '$multiply': [
                            '$prices.purchasePrice', '$stock.total'
                        ]
                    }
                }
            }
        }
    ]

    return await mongoI.findAggregate<{ _id: string, total: number }>("New-Items", totalsQuery)
}

export const getStockValueCSVData = async (domestic: boolean) => {
    let query = {
        $and: [
            {isListingVariation: false},
            {isComposite: false},
            {"stock.value": {$gt: 0}},
            {tags: {$nin: ['filtered', 'domestic', 'bait']}}
        ]
    }

    let domesticQuery = {
        $and: [
            {isListingVariation: false},
            {isComposite: false},
            {"stock.value": {$gt: 0}},
            {tags: {$nin: ['filtered', 'bait']}},
            {tags: {$in: 'domestic'}},
        ]
    }

    let totalsQuery = [
        {
            '$match': domestic ? domesticQuery : query
        }, {
            '$project': {
                'SKU': 1,
                'price': '$prices.purchasePrice',
                'quantity': '$stock.total',
                'value': {$multiply: ['$prices.purchasePrice', '$stock.total']}
            }
        }
    ]

    return await mongoI.findAggregate<{ _id: string, SKU: string, price: number, quantity:number, value:number}>("New-Items", totalsQuery)
}