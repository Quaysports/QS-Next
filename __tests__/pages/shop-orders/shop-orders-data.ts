import {ShopOrdersState} from "../../../store/shop-orders-slice";

export const mockDeadStockState: ShopOrdersState = {
    deadStock: [],
    sideBarContent: [],
    sideBarTitle: "",
    openOrders: [{
        _id: "Anything",
        arrived: [],
        complete: false,
        date: 12345,
        id: "Some ID",
        price: 5,
        order: [],
        supplier: "Some Supplier"
    }],
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
    openOrders: [{
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
    }],
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

export const mockCompletedOrders = [{
    _id: "Anything-2",
    arrived: [{
        IDBEP: {BRAND: "Fox Rage"},
        MINSTOCK: 2,
        SKU: "SKU-5",
        STOCKTOTAL: "3",
        TITLE: "Fox Rage Stuff",
        SUPPLIER: "Fox",
        _id: "sdg2",
        qty: 2,
        tradePack: 1,
        PURCHASEPRICE: 2,
        newProduct: false,
        submitted: true,
        SOLDFLAG: 3,
        arrived: 0
    }, {
        IDBEP: {BRAND: "Matrix"},
        MINSTOCK: 2,
        SKU: "SKU-6",
        STOCKTOTAL: "3",
        TITLE: "Matrix Stuff",
        SUPPLIER: "Fox",
        _id: "sdg1",
        qty: 5,
        tradePack: 1,
        PURCHASEPRICE: 2,
        newProduct: false,
        submitted: true,
        SOLDFLAG: 3,
        arrived: 0
    }, {
        IDBEP: {BRAND: "Fox"},
        MINSTOCK: 4,
        SKU: "SKU-7",
        STOCKTOTAL: "7",
        TITLE: "Fox Stuff",
        SUPPLIER: "Fox",
        _id: "sdg",
        qty: 3,
        tradePack: 2,
        PURCHASEPRICE: 3,
        newProduct: true,
        submitted: true,
        SOLDFLAG: 6,
        arrived: 0
    }],
    complete: true,
    date: 12345,
    id: "Some ID",
    price: 5,
    order: [],
    supplier: "Fox"
}, {
    _id: "Anything-1",
    arrived: [{
        IDBEP: {BRAND: "Wychwood"},
        MINSTOCK: 2,
        SKU: "SKU-1",
        STOCKTOTAL: "3",
        TITLE: "Wychwood Stuff",
        SUPPLIER: "Leeda",
        _id: "Leeda order 1",
        qty: 2,
        tradePack: 1,
        PURCHASEPRICE: 2,
        newProduct: false,
        submitted: true,
        SOLDFLAG: 3,
        arrived: 0
    }, {
        IDBEP: {BRAND: "Leeda"},
        MINSTOCK: 2,
        SKU: "SKU-2",
        STOCKTOTAL: "3",
        TITLE: "Leeda Stuff",
        SUPPLIER: "Leeda",
        _id: "Leeda order 2",
        qty: 2,
        tradePack: 1,
        PURCHASEPRICE: 2,
        newProduct: false,
        submitted: true,
        SOLDFLAG: 3,
        arrived: 0
    }, {
        IDBEP: {BRAND: "HTO"},
        MINSTOCK: 4,
        SKU: "SKU-3",
        STOCKTOTAL: "7",
        TITLE: "HTO Stuff",
        SUPPLIER: "Leeda",
        _id: "Leeda order 3",
        qty: 3,
        tradePack: 2,
        PURCHASEPRICE: 3,
        newProduct: true,
        submitted: true,
        SOLDFLAG: 6,
        arrived: 0
    }],
    complete: true,
    date: 12345,
    id: "Some ID-123",
    price: 5,
    order: [],
    supplier: "Leeda"
}, ]


