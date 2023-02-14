import {shopOrder} from "../server-modules/shop/shop-order-tool";

export const mockOrdersState: shopOrder[] =
     [{
        _id: "Anything",
        arrived: [{
            brand: "Brand",
            stock: {
                minimum: 2,
                total: 3
            },
            SKU: "SWIFT-SKU-1",
            title: "Some Title",
            supplier: "Some Supplier",
            _id: "sdg",
            quantity: 2,
            tradePack: 1,
            prices: {
                purchase: 2
            },
            newProduct: false,
            submitted: false,
            soldFlag: 3,
            arrived: 0
        }],
        complete: false,
        date: 12345,
        id: "99-33-44",
        price: 5,
        order: [{
            brand:"Brand",
            stock: {
                minimum: 2,
                total: 3
            },
            SKU: "SWIFT-SKU-2",
            title: "Some Title",
            supplier: "Some Supplier",
            _id: "sdg",
            quantity: 2,
            tradePack: 1,
            prices: {
                purchase: 2
            },
            newProduct: false,
            submitted: false,
            soldFlag: 3,
            arrived: 0
        }, {
            brand: "Another Brand",
            stock:{
                minimum: 4,
                total: 7
            },
            SKU: "SWIFT-SKU-3",
            title: "Another Title",
            supplier: "Another Supplier",
            _id: "sdg",
            quantity: 3,
            tradePack: 2,
            prices: {
                purchase: 3
            },
            newProduct: true,
            submitted: false,
            soldFlag: 6,
            arrived: 0
        }],
        supplier: "Swift"
    },{
        _id: "Anything",
        arrived: [{
            brand:"Brand",
            stock: {
                minimum: 2,
                total: 3
            },
            SKU: "WYCHWOOD-SKU-1",
            title: "Some Title",
            supplier: "Some Supplier",
            _id: "sdg",
            quantity: 2,
            tradePack: 1,
            prices: {
                purchase: 2
            },
            newProduct: false,
            submitted: false,
            soldFlag: 3,
            arrived: 0
        }],
        complete: false,
        date: 12345,
        id: "22-43-45",
        price: 5,
        order: [{
            brand: "Brand",
            stock: {
                minimum: 2,
                total: 3
            },
            SKU: "WYCHWOOD-SKU-2",
            title: "Some Title",
            supplier: "Some Supplier",
            _id: "sdg",
            quantity: 2,
            tradePack: 1,
            prices: {
                purchase: 2
            },
            newProduct: false,
            submitted: false,
            soldFlag: 3,
            arrived: 0
        }, {
            brand: "Another Brand",
            stock: {
                minimum: 4,
                total: 7
            },
            SKU: "WYCHWOOD-SKU-3",
            title: "Another Title",
            supplier: "Another Supplier",
            _id: "sdg",
            quantity: 3,
            tradePack: 2,
            prices: {
                purchase: 3
            },
            newProduct: true,
            submitted: false,
            soldFlag: 6,
            arrived: 0
        }],
        supplier: "Wychwood"
    }]

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

export const mockCompletedOrders:shopOrder[] = [{
    _id: "Anything-2",
    arrived: [{
        brand: "Fox Rage",
        stock: {
            minimum: 2,
            total: 3
        },
        SKU: "SKU-5",
        title: "Fox Rage Stuff",
        supplier: "Fox",
        _id: "sdg2",
        quantity: 2,
        tradePack: 1,
        prices: {
            purchase: 2
        },
        newProduct: false,
        submitted: true,
        soldFlag: 3,
        arrived: 0
    }, {
        brand:"Matrix",
        stock: {
            minimum: 2,
            total: 3
        },
        SKU: "SKU-6",
        title: "Matrix Stuff",
        supplier: "Fox",
        _id: "sdg1",
        quantity: 5,
        tradePack: 1,
        prices: {
            purchase: 2
        },
        newProduct: false,
        submitted: true,
        soldFlag: 3,
        arrived: 0
    }, {
        brand: "Fox",
        stock: {
            minimum: 4,
            total: 7
        },
        SKU: "SKU-7",
        title: "Fox Stuff",
        supplier: "Fox",
        _id: "sdg",
        quantity: 3,
        tradePack: 2,
        prices: {
            purchase: 3
        },
        newProduct: true,
        submitted: true,
        soldFlag: 6,
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
        brand: "Wychwood",
        stock: {
            minimum: 2,
            total: 3
        },
        SKU: "SKU-1",
        title: "Wychwood Stuff",
        supplier: "Leeda",
        _id: "Leeda order 1",
        quantity: 2,
        tradePack: 1,
        prices: {
            purchase: 2
        },
        newProduct: false,
        submitted: true,
        soldFlag: 3,
        arrived: 0
    }, {
        brand: "Leeda",
        stock:{
            minimum: 2,
            total: 3
        },
        SKU: "SKU-2",
        title: "Leeda Stuff",
        supplier: "Leeda",
        _id: "Leeda order 2",
        quantity: 2,
        tradePack: 1,
        prices: {
            purchase: 2
        },
        newProduct: false,
        submitted: true,
        soldFlag: 3,
        arrived: 0
    }, {
        brand: "HTO",
        stock: {
            minimum: 4,
            total: 7
        },
        SKU: "SKU-3",
        title: "HTO Stuff",
        supplier: "Leeda",
        _id: "Leeda order 3",
        quantity: 3,
        tradePack: 2,
        prices: {
            purchase: 3
        },
        newProduct: true,
        submitted: true,
        soldFlag: 6,
        arrived: 0
    }],
    complete: true,
    date: 12345,
    id: "Some ID-123",
    price: 5,
    order: [],
    supplier: "Leeda"
}, ]