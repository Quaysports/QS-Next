import {schema} from "../types";

export const itemTemplate = ():schema.Item => ({
    EAN: "",
    SKU: "",
    _id: "",
    brand: "",
    brandLabel: {brand: "", image: "", location: "", path: "", title1: "", title2: ""},
    channelData: [],
    channelPrices: {
        amazon: {id: "",
            channelReference: "",
            channelSKU: "",
            price: 0, status: 0, subSource: "", updateRequired: false, updated: ""},
        ebay: {id: "",
            channelReference: "",
            channelSKU: "", price: 0, status: 0, subSource: "", updateRequired: false, updated: ""},
        magento: {id: "",
            channelReference: "",
            channelSKU: "", price: 0, status: 0, subSource: "", updateRequired: false, updated: ""},
        "onbuy v2": {id: "",
            channelReference: "",
            channelSKU: "", price: 0, status: 0, subSource: "", updateRequired: false, updated: ""},
        shop: {price: 0, status: 0}},
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
        marginCalculator: {amazonOverride: false, ebayOverride: false, hide: false, magentoOverride: false, onbuyOverride: false},
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
        image1: {filename: "", id: "", link: "", url: ""},
        image10: {filename: "", id: "", link: "", url: ""},
        image11: {filename: "", id: "", link: "", url: ""},
        image2: {filename: "", id: "", link: "", url: ""},
        image3: {filename: "", id: "", link: "", url: ""},
        image4: {filename: "", id: "", link: "", url: ""},
        image5: {filename: "", id: "", link: "", url: ""},
        image6: {filename: "", id: "", link: "", url: ""},
        image7: {filename: "", id: "", link: "", url: ""},
        image8: {filename: "", id: "", link: "", url: ""},
        image9: {filename: "", id: "", link: "", url: ""},
        main: {filename: "", id: "", link: "", url: ""}
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
        age: "adult",
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
        color: "",
        gender: "unisex",
        searchTerm1: "",
        searchTerm2: "",
        searchTerm3: "",
        searchTerm4: "",
        searchTerm5: "",
        shippingFormat: "",
        size: "",
        specialPrice: "",
        tariffCode: "",
        tillFilter: "",
        tradePack: ""
    },
    marginData: {
        amazon: {fees: 0, primePostage: 0, primeProfit: 0, profit: 0, profitLastYear: 0, salesVAT: 0},
        ebay: {fees: 0, profit: 0, profitLastYear: 0, salesVAT: 0},
        magento: {fees: 0, profit: 0, profitLastYear: 0, salesVAT: 0},
        "onbuy v2": {fees: 0, profit: 0, profitLastYear: 0, salesVAT: 0},
        packaging: 0,
        postage: 0,
        shop: {fees: 0, profit: 0, profitLastYear: 0, salesVAT: 0},
        totalProfitLastYear: 0
    },
    marginNote: "",
    onOrder: [],
    packaging: {editable: false, group: "", items: [], lock: false},
    postage: {id: "", modifier: "", price: 0},
    prices: {amazon: 0, ebay: 0, magento: 0, purchase: 0, retail: 0, shop: 0, "onbuy v2": 0},
    shelfLocation: {letter: "", number: "", prefix: ""},
    shortDescription: "",
    stock: {default: 0, minimum: 0, total: 0, value: 0, warehouse: 0, tradePack: null},
    stockHistory: [],
    stockConsumption: {historicConsumption: [], historicOutOfStock: 0, oneMonthOutOfStock: 0, fourMonthOutOfStock: 0},
    stockTake: {checked: false, date: null, quantity: 0},
    supplier: "",
    suppliers: [],
    tags: [],
    till: {color: ""},
    title: "",
    webTitle: "",
    weight: 0
})