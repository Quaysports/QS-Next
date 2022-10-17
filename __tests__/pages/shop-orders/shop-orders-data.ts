import {ShopOrdersState} from "../../../store/shop-orders-slice";

export const mockDeadStockState: ShopOrdersState = {
    deadStock: [],
    sideBarContent: [],
    sideBarTitle: "",
    loadedOrder: {
        _id: "Anything",
        arrived: [],
        complete: false,
        date: 12345,
        id: "Some ID",
        price: 5,
        order: [],
        supplier: "Some Supplier"
    },
    openOrders: null,
    newOrderArray: {
        _id: null,
        arrived: [],
        complete: false,
        date: null,
        id: null,
        price: null,
        order: [],
        supplier: null
    },
    totalPrice: 0,
    supplierItems: [],
    radioButtons: {
        lowStock: true,
        allItems: false
    },
    renderedArray: [],
    lowStockArray: [],
    threshold: 50,
    completedOrders: null,
    orderContents: null
}

export const mockOrdersState: ShopOrdersState = {
    deadStock: [],
    sideBarContent: [],
    sideBarTitle: "",
    loadedOrder: {
        _id: "Anything",
        arrived: [{
            IDBEP: {BRAND: "Brand"},
            MINSTOCK: 2,
            SKU: "SKU-1",
            STOCKTOTAL: "3",
            TITLE: "Some Title",
            SUPPLIER: "Some Supplier",
            _id: "sdg",
            qty: 2,
            tradePack: 1,
            PURCHASEPRICE: 2,
            newProduct: false,
            submitted: false,
            SOLDFLAG: 3,
            arrived: 0
        }],
        complete: false,
        date: 12345,
        id: "Some ID",
        price: 5,
        order: [{
            IDBEP: {BRAND: "Brand"},
            MINSTOCK: 2,
            SKU: "SKU-2",
            STOCKTOTAL: "3",
            TITLE: "Some Title",
            SUPPLIER: "Some Supplier",
            _id: "sdg",
            qty: 2,
            tradePack: 1,
            PURCHASEPRICE: 2,
            newProduct: false,
            submitted: false,
            SOLDFLAG: 3,
            arrived: 0
        }, {
            IDBEP: {BRAND: "Another Brand"},
            MINSTOCK: 4,
            SKU: "SKU-3",
            STOCKTOTAL: "7",
            TITLE: "Another Title",
            SUPPLIER: "Another Supplier",
            _id: "sdg",
            qty: 3,
            tradePack: 2,
            PURCHASEPRICE: 3,
            newProduct: true,
            submitted: false,
            SOLDFLAG: 6,
            arrived: 0
        }],
        supplier: "Some Supplier"
    },
    openOrders: null,
    newOrderArray: {
        _id: null,
        arrived: [],
        complete: false,
        date: null,
        id: null,
        price: null,
        order: [],
        supplier: null
    },
    totalPrice: 0,
    supplierItems: [],
    radioButtons: {
        lowStock: true,
        allItems: false
    },
    renderedArray: [],
    lowStockArray: [],
    threshold: 50,
    completedOrders: null,
    orderContents: null
}

export const mockDeadStockReport =
    [{
        SUPPLIER: "Drennan",
        SKU: "DRENNAN-SKU-1",
        TITLE: "Drennan Stuff",
        SOLDFLAG: 0
    }, {
        SUPPLIER: "Drennan",
        SKU: "DRENNAN-SKU-2",
        TITLE: "Drennan Things",
        SOLDFLAG: 10
    }, {
        SUPPLIER: "FOX",
        SKU: "FOX-SKU-1",
        TITLE: "Fox Stuff",
        SOLDFLAG: 3
    }, {
        SUPPLIER: "FOX",
        SKU: "FOX-SKU-2",
        TITLE: "Fox Things",
        SOLDFLAG: 6
    }, {
        SUPPLIER: "Drennan",
        SKU: "DRENNAN-SKU-3",
        TITLE: "Drennan Products",
        SOLDFLAG: 3
    }]


