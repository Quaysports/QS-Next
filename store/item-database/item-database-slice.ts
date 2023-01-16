import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {rodLocationObject} from "../../pages/item-database";
import {dispatchNotification} from "../../components/notification/dispatch-notification";

/**
 * @property {itemDatabaseState} itemDatabase
 */
export interface itemDatabaseWrapper {
    itemDatabase: itemDatabaseState
}

/**
 * @property {string} brand
 * @property {string} sku
 * @property {string} supplier
 * @property {string} barcode
 * @property {string} filter
 * @property {string} title
 * @property {string} weight
 * @property {string} retailPrice
 * @property {string} costPrice
 * @property {string} shipping
 * @property {string} minimum
 * @property {string} quantity
 */
export interface newItem {
    brand: string;
    sku: string;
    supplier: string;
    barcode: string;
    filter: string;
    title: string;
    weight: string;
    retailPrice: string;
    costPrice: string;
    shipping: string;
    minimum: string;
    quantity: string;
    tags: string[];
}


/**
 * @property {schema.Item | null} item
 * @property {string[]} suppliers
 * @property {Array string} brands
 * @property {string} [currentSupplier]
 * @property {newItem[]} newItems
 */
export interface itemDatabaseState {
    item: schema.Item;
    suppliers: string[];
    brands: string[];
    currentSupplier?: string;
    newItems: { [key: number]: newItem };
    rodLocations: rodLocationObject[];
    tags: string[];
}

const initialState: itemDatabaseState = {
    item: itemTemplate(),
    suppliers: [],
    brands: [],
    currentSupplier: "",
    newItems: {},
    rodLocations: [],
    tags: []
}

const newItem: newItem = {
    brand: "",
    sku: "",
    supplier: "",
    barcode: "",
    filter: "domestic",
    title: "",
    weight: "",
    retailPrice: "0",
    costPrice: "0",
    shipping: "",
    minimum: "2",
    quantity: "0",
    tags: []
}

export const itemDatabaseSlice = createSlice({
        name: "itemDatabase",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.itemDatabase
                }
            },
        },
        reducers: {
            setItem: (state, action) => {
                state.item = {...itemTemplate(), ...action.payload}
            },
            setItemBrand: (state, action: PayloadAction<string>) => {
                state.item.brand = action.payload
                databaseSave(state.item)
            },
            setItemSupplier: (state, action: PayloadAction<string>) => {
                state.item.supplier = action.payload
                databaseSave(state.item)
            },
            setItemLocation: (state, action: PayloadAction<{ value: string, key: keyof schema.ShelfLocation }>) => {
                const {key, value} = action.payload
                state.item.shelfLocation[key] = value
                databaseSave(state.item)
            },
            setItemTitle: (state, action: PayloadAction<string>) => {
                state.item.title = action.payload
                databaseSave(state.item)
            },
            setItemWebsiteTitle: (state, action: PayloadAction<string>) => {
                state.item.webTitle = action.payload
                databaseSave(state.item)
            },
            setItemStatusBoxes: (state, action: PayloadAction<{ checked: boolean, title: keyof schema.DoneStatus}>) => {
                const {title, checked} = action.payload
                state.item.checkboxStatus.done[title] = checked
                databaseSave(state.item)
            },
            setItemChannelStatus: (state, action: PayloadAction<{ channel: string, status: string }>) => {
                let {channel, status} = action.payload
                switch (status) {
                    case "done":
                        state.item.checkboxStatus.done[channel as keyof schema.DoneStatus] = true;
                        state.item.checkboxStatus.notApplicable[channel as keyof schema.NotApplicableStatus] = false;
                        state.item.checkboxStatus.ready[channel as keyof schema.ReadyStatus] = false;
                        break;
                    case "ready":
                        state.item.checkboxStatus.done[channel as keyof schema.DoneStatus] = false;
                        state.item.checkboxStatus.notApplicable[channel as keyof schema.NotApplicableStatus] = false;
                        state.item.checkboxStatus.ready[channel as keyof schema.ReadyStatus] = true;
                        break;
                    case "notApplicable":
                        state.item.checkboxStatus.done[channel as keyof schema.DoneStatus] = false;
                        state.item.checkboxStatus.notApplicable[channel as keyof schema.NotApplicableStatus] = true;
                        state.item.checkboxStatus.ready[channel as keyof schema.ReadyStatus] = false;
                        break;
                }
                databaseSave(state.item)
            },
            setItemAmazonBulletPoints: (state, action: PayloadAction<{ value: string, index: number }>) => {
                let {value, index} = action.payload;
                switch (index) {
                    case 1:
                        state.item.mappedExtendedProperties.bulletPoint1 = value
                        break;
                    case 2:
                        state.item.mappedExtendedProperties.bulletPoint2 = value
                        break;
                    case 3:
                        state.item.mappedExtendedProperties.bulletPoint3 = value
                        break;
                    case 4:
                        state.item.mappedExtendedProperties.bulletPoint4 = value
                        break;
                    case 5:
                        state.item.mappedExtendedProperties.bulletPoint5 = value
                        break;
                }
                databaseSave(state.item)
            },
            setItemAmazonCategories: (state, action: PayloadAction<{ categoryID: string, id: number }>) => {
                let {categoryID, id} = action.payload
                if (id === 1) {
                    state.item.mappedExtendedProperties.category1 = categoryID
                }
                if (id === 2) {
                    state.item.mappedExtendedProperties.category2 = categoryID
                }
                databaseSave(state.item)
            },
            setItemShortDescription: (state, action: PayloadAction<string>) => {
                state.item.shortDescription = action.payload
                databaseSave(state.item)
            },
            setItemLongDescription: (state, action: PayloadAction<string>) => {
                state.item.description = action.payload
                databaseSave(state.item)
            },
            setItemSearchTerms: (state, action: PayloadAction<{ value: string, index: number }>) => {
                let {index, value} = action.payload
                switch (index) {
                    case 1:
                        state.item.mappedExtendedProperties.searchTerm1 = value
                        break;
                    case 2:
                        state.item.mappedExtendedProperties.searchTerm2 = value
                        break;
                    case 3:
                        state.item.mappedExtendedProperties.searchTerm3 = value
                        break;
                    case 4:
                        state.item.mappedExtendedProperties.searchTerm4 = value
                        break;
                    case 5:
                        state.item.mappedExtendedProperties.searchTerm5 = value
                        break;
                }
                databaseSave(state.item)
            },
            setItemImportDetails: (state, action: PayloadAction<{[key:string]:schema.MappedExtendedProperties | string}>) => {
                for (const key in action.payload) {
                    switch (key) {
                        case "mappedExtendedProperties":
                            state.item.mappedExtendedProperties = {...state.item.mappedExtendedProperties, ...action.payload.mappedExtendedProperties as schema.MappedExtendedProperties}
                            break;
                        case "description":
                            state.item.description = action.payload[key] as string
                            break;
                        case "shortDescription":
                            state.item.shortDescription = action.payload[key] as string
                            break;
                    }
                }
                databaseSave(state.item)
            },
            setItemImages: (state, action: PayloadAction<{ image: string, index: keyof schema.Images, extension: string }>) => {
                let {image, index, extension} = action.payload
                state.item.images[index] = {
                    ...state.item.images[index],
                    ...{filename: `${index === "main" ? "0" : index}.${extension}`}
                }
                let body = {
                    _id: state.item._id,
                    SKU: state.item.SKU,
                    id: index === "main" ? "main" : "image" + index,
                    filename: `${index}.${extension}`,
                    image: image
                }
                const opts = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: 'POST',
                    body: JSON.stringify(body)
                }
                fetch("api/item-database/upload-image", opts).then(res => {
                    if (res.ok) {
                        console.log("Uploaded image")
                    } else {
                        throw new Error(`Status: ${res.status}, ${res.statusText}`)
                    }
                })
                    .catch((error) => {
                        dispatchNotification({type: "alert", content: error.message, title: "Upload Failed"})
                    })
            },
            setTags: (state, action: PayloadAction<string[]>) => {
                state.tags = action.payload
            },
            setItemTags: (state, action: PayloadAction<{ checked: boolean, tag: string }>) => {
                const {checked, tag} = action.payload
                if (checked) {
                    state.item.tags.push(tag.toLowerCase())
                } else {
                    for (let i = 0; i < state.item.tags.length; i++) {
                        if (state.item.tags[i] === tag) {
                            state.item.tags.splice(i, 1)
                            break;
                        }
                    }
                }
                databaseSave(state.item)
            },
            setUpdateTags: (state, action: PayloadAction<string>) => {
                let tag = action.payload.trim().toLowerCase()
                let tagsCopy = state.tags
                tagsCopy.push(tag)
                tagsCopy.sort()
                state.tags = tagsCopy
                state.item.tags.push(tag)
                databaseSave(state.item)
            },
            setItemBrandLabel: (state, action: PayloadAction<schema.BrandLabel>) => {
                state.item.brandLabel = action.payload
                databaseSave(state.item)
            },
            setItemShipping: (state, action: PayloadAction<string>) => {
                state.item.mappedExtendedProperties.shippingFormat = action.payload
            },
            setSuppliers: (state, action) => {
                state.suppliers = action.payload
            },
            setCurrentSupplier: (state, action) => {
                state.currentSupplier = action.payload
            },
            setNewItemValues: (state, action: PayloadAction<{ key: number, nestedKey: keyof newItem, value: string }>) => {
                const {key, nestedKey, value} = action.payload;
                state.newItems[key] ?
                    nestedKey === "tags" ? state.newItems[key][nestedKey] = tagsArray(state.newItems[key][nestedKey], value) : state.newItems[key][nestedKey] = value
                    : state.newItems[key] = newProducts(nestedKey, value);
            },
            setRodLocations: (state, action) => {
                state.rodLocations = action.payload;
            },
        },
    })
;

export const {
    setItem,
    setSuppliers,
    setCurrentSupplier,
    setNewItemValues,
    setItemBrand,
    setRodLocations,
    setItemSupplier,
    setItemLocation,
    setItemWebsiteTitle,
    setItemTitle,
    setItemStatusBoxes,
    setItemChannelStatus,
    setItemAmazonCategories,
    setItemAmazonBulletPoints,
    setItemShortDescription,
    setItemLongDescription,
    setItemSearchTerms,
    setItemImages,
    setItemBrandLabel,
    setTags,
    setUpdateTags,
    setItemTags,
    setItemShipping,
    setItemImportDetails
} = itemDatabaseSlice.actions

export const selectItem = (state: itemDatabaseWrapper) => state.itemDatabase.item;
export const selectSuppliers = (state: itemDatabaseWrapper) => state.itemDatabase.suppliers;
export const selectCurrentSupplier = (state: itemDatabaseWrapper) => state.itemDatabase.currentSupplier;
export const selectTags = (state: itemDatabaseWrapper) => state.itemDatabase.tags;
export const selectRodLocations = (state: itemDatabaseWrapper) => state.itemDatabase.rodLocations;
export const selectNewItems = (state: itemDatabaseWrapper) => state.itemDatabase.newItems;

export default itemDatabaseSlice.reducer;

function tagsArray(tags: string[], value: string) {
    let newTags = [...tags]
    let index = newTags.findIndex(tag => tag === value)
    index === -1 ? newTags.push(value) : newTags.splice(index, 1)
    return newTags
}

function newProducts(key: keyof newItem, value: string) {
    let newProduct: newItem = {
        brand: "",
        sku: "",
        supplier: "",
        barcode: "",
        filter: "",
        title: "",
        weight: "",
        retailPrice: "",
        costPrice: "",
        shipping: "",
        minimum: "",
        quantity: "",
        tags: []
    }
    key === "tags" ? newProduct[key].push(value) : newProduct[key] = value
    return newProduct
}

function databaseSave(item: schema.Item) {
    const opts = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item)
    }
    fetch('/api/items/update-item', opts).then(res => {
        console.log(res)
    })
}

function itemTemplate(): schema.Item {
    return {
        EAN: "",
        SKU: "",
        _id: "",
        brand: "",
        brandLabel: {brand: "", image: "", location: "", path: "", title1: "", title2: ""},
        channelData: [],
        channelPrices: {amazon: {id: "", price: "", status: 0, subSource: "", updateRequired: false, updated: ""}, ebay: {
                id: "",
                price: "",
                status: 0,
                subSource: "",
                updateRequired: false,
                updated: ""
            }, magento: {id: "", price: "", status: 0, subSource: "", updateRequired: false, updated: ""}, shop: {
                price: "",
                status: 0
            }},
        checkboxStatus: {
            done: {
                EAN: false,
                addedToInventory: false,
                amazon: false,
                amazonStore: false,
                ebay: false,
                ebayDraft: false,
                goodsReceived: false,
                inventoryLinked: false,
                jariloTemplate: false,
                magento: false,
                marginsCalculated: false,
                photos: false,
                zenTackle: false
            },
            marginCalculator: {hide: false, amazonOverride: false, ebayOverride: false, magentoOverride: false},
            notApplicable: {amazon: false, amazonStore: false, ebay: false, magento: false, zenTackle: false},
            prime: false,
            ready: {amazon: false, amazonStore: false, ebay: false, magento: false, zenTackle: false},
            stockForecast: {hide: false, list: false}
        },
        compositeItems: [],
        description: "",
        discounts: {magento: 0, shop: 0},
        extendedProperties: [],
        images: {
            image1: {filename: "", id: "", link: ""},
            image2: {filename: "", id: "", link: ""},
            image3: {filename: "", id: "", link: ""},
            image4: {filename: "", id: "", link: ""},
            image5: {filename: "", id: "", link: ""},
            image6: {filename: "", id: "", link: ""},
            image7: {filename: "", id: "", link: ""},
            image8: {filename: "", id: "", link: ""},
            image9: {filename: "", id: "", link: ""},
            image10: {filename: "", id: "", link: ""},
            image11: {filename: "", id: "", link: ""},
            main: {filename: "", id: "", link: ""}
        },
        isComposite: false,
        isListingVariation: false,
        lastUpdate: "",
        legacyShipping: {expedited: "", expeditedAmazon: "", standard: "", standardEbay: ""},
        linkedSKUS: [],
        linnId: "",
        mappedExtendedProperties: {
            COMISO2: "",
            COMISO3: "",
            amazonDepartment: "",
            amazonLatency: 0,
            amazonSport: "",
            bulletPoint1: "",
            bulletPoint2: "",
            bulletPoint3: "",
            bulletPoint4: "",
            bulletPoint5: "",
            category1: "",
            category2: "",
            searchTerm1: "",
            searchTerm2: "",
            searchTerm3: "",
            searchTerm4: "",
            searchTerm5: "",
            shippingFormat: "",
            specialPrice: "",
            tariffCode: "",
            tillFilter: "",
            tradePack: ""
        },
        marginData: {
            amazon: {fees: 0, primePostage: 0, primeProfit: 0, profit: 0, profitLastYear: 0, salesVAT: 0},
            ebay: {fees: 0, profit: 0, profitLastYear: 0, salesVAT: 0},
            magento: {fees: 0, profit: 0, profitLastYear: 0, salesVAT: 0},
            packaging: 0,
            postage: 0,
            shop: {fees: 0, profit: 0, profitLastYear: 0, salesVAT: 0},
            totalProfitLastYear: 0
        },
        stockTake: {checked: false, date: null, quantity: 0},
        marginNote: "",
        onOrder: [],
        packaging: {editable: false, group: "", items: [], lock: false},
        postage: {id: "", modifier: "", price: 0},
        prices: {amazon: 0, ebay: 0, magento: 0, purchase: 0, retail: 0, shop: 0},
        shelfLocation: {letter: "", number: "", prefix: ""},
        shortDescription: "",
        stock: {checkedDate: "", default: 0, minimum: 0, total: 0, value: 0, warehouse: 0},
        stockHistory: [],
        supplier: "",
        suppliers: [],
        tags: [],
        title: "",
        webTitle: "",
        weight: 0
    }
}