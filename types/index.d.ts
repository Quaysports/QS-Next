declare namespace schema {
    export interface Image {
        id: string;
        url: string;
        filename: string;
        link: string;
        publicFilename?: string;
    }

    interface ChannelData {
        year: number;
        source: string;
        quantity: number;
    }

    interface CompositeItems {
        title: string;
        SKU: string;
        quantity: number;
        purchasePrice: number;
        weight: number;
    }

    interface LinnExtendedProperty {
        epName: string;
        epType: string;
        epValue: string;
        pkRowId: string;
    }

    interface OnOrder {
        confirmed: boolean;
        due: string;
        id: string;
        quantity: number;
    }

    interface MappedExtendedProperties {
        amazonLatency: number
        COMISO2: string
        COMISO3: string
        tariffCode: string
        category1: string
        category2: string
        bulletPoint1: string
        bulletPoint2: string
        bulletPoint3: string
        bulletPoint4: string
        bulletPoint5: string
        searchTerm1: string
        searchTerm2: string
        searchTerm3: string
        searchTerm4: string
        searchTerm5: string
        amazonSport: string
        amazonDepartment: string
        tradePack: string
        specialPrice: string
        //used to be SHIPFORMAT, move to extended properties?
        shippingFormat: string
        //used to be TILLFILTER
        tillFilter: string
        size: string
        color: string
        age: string
        gender: string
    }

    interface LegacyShipping {
        //used to be SHIPCOURIERSTD, remove?
        standard: string
        //used to be SHIPCOURIEREXP
        expedited: string
        //used to be SHIPEBAYSTD, remove?
        standardEbay: string
        //used to be SHIPAMAZONEXP, remove?
        expeditedAmazon: string
    }

    interface Prices {
        //used to be PURCHASEPRICE
        purchase: number
        //used to be RETAILPRICE
        retail: number
        //used to be AMZPRICEINCVAT
        amazon: number
        //used to be EBAYPRICEINCVAT
        ebay: number
        //used to be QSPRICEINCVAT
        magento: number
        //used to be SHOPPRICEINCVAT
        "onbuy v2": number
        shop: number
    }

    interface ShelfLocation {
        prefix: string
        letter: string
        number: string
    }

    interface Discounts {
        shop: number
        magento: number
    }

    interface ChannelPrices {
        amazon: LinnChannelPriceData
        ebay: LinnChannelPriceData
        magento: LinnChannelPriceData
        "onbuy v2": LinnChannelPriceData
        shop: BaseChannelPriceData
    }

    interface BaseChannelPriceData {
        status: number,
        price: number
    }

    interface LinnChannelPriceData extends BaseChannelPriceData {
        channelReference: string;
        channelSKU: string;
        subSource: string,
        updated: string,
        id: string,
        updateRequired: boolean
    }

    interface Stock {
        default: number,
        warehouse: number
        total: number
        minimum: number
        value: number
        tradePack: number | null
    }

    interface StockConsumption {
        historicConsumption: number[],
        historicOutOfStock: number,
        oneMonthOutOfStock: number,
        fourMonthOutOfStock: number,
    }

    export interface StockTake {
        checked?: boolean;
        date?: string | null;
        quantity?: number;
    }

    interface ChannelMarginData {
        fees: number;
        profit: number;
        profitLastYear: number;
        salesVAT: number;
    }

    interface AmazonMarginData extends ChannelMarginData {
        primeProfit: number
        primePostage: number
    }

    interface MarginData {
        amazon: AmazonMarginData
        ebay: ChannelMarginData
        magento: ChannelMarginData
        shop: ChannelMarginData
        "onbuy v2": ChannelMarginData
        packaging: number
        postage: number
        totalProfitLastYear: number
    }

    interface CheckboxStatus {
        stockForecast: StockForecastStatus
        done: DoneStatus
        ready: ReadyStatus
        notApplicable: NotApplicableStatus
        //map from AMZPRIME
        prime: boolean
        marginCalculator: MarginCalculatorStatus
    }

    interface StockForecastStatus {
        list: boolean
        hide: boolean
    }

    interface DoneStatus {
        goodsReceived: boolean
        addedToInventory: boolean
        EAN: boolean
        photos: boolean
        marginsCalculated: boolean
        jariloTemplate: boolean
        ebayDraft: boolean
        inventoryLinked: boolean
        ebay: boolean
        amazon: boolean
        magento: boolean
        zenTackle: boolean
        amazonStore: boolean
    }

    interface ReadyStatus {
        ebay: boolean
        amazon: boolean
        magento: boolean
        zenTackle: boolean
        amazonStore: boolean
    }

    interface NotApplicableStatus {
        ebay: boolean
        amazon: boolean
        magento: boolean
        zenTackle: boolean
        amazonStore: boolean
    }

    interface MarginCalculatorStatus {
        //map from MCOVERRIDES
        hide: boolean
        amazonOverride: boolean
        ebayOverride: boolean
        magentoOverride: boolean
        onbuyOverride: boolean
    }

    interface Postage {
        // used to be POSTID?
        id: string
        //used to be POSTALPRICEUK
        price: number
        //used to be POSTMODID
        modifier: string
    }

    interface Packaging {
        lock: boolean,
        items: string[]
        editable: boolean
        //used to be PACKGROUP
        group: string
    }

    interface Images {
        main: Image,
        image1: Image,
        image2: Image,
        image3: Image,
        image4: Image,
        image5: Image,
        image6: Image,
        image7: Image,
        image8: Image,
        image9: Image,
        image10: Image,
        image11: Image
    }

    interface BrandLabel {
        image: string,
        path: string,
        brand: string
        title1: string,
        title2: string,
        location: string
    }

    interface Item {
        _id?: string
        EAN: string
        isComposite: boolean
        isListingVariation: boolean
        linnId: string
        SKU: string
        title: string
        webTitle: string
        weight: number
        supplier: string
        suppliers: string[]
        brand: string
        description: string
        shortDescription: string
        lastUpdate: string
        marginNote: string
        legacyShipping: LegacyShipping
        prices: Prices
        discounts: Discounts
        shelfLocation: ShelfLocation
        channelPrices: ChannelPrices
        stock: Stock
        stockTake: StockTake
        onOrder: OnOrder[]
        //used to be MD
        marginData: MarginData
        //used to be CD is it dynamically generated and still used?
        channelData: ChannelData[]
        //used to be CHECK
        checkboxStatus: CheckboxStatus
        //used to be IDBEP
        mappedExtendedProperties: MappedExtendedProperties
        compositeItems: CompositeItems[]
        extendedProperties: LinnExtendedProperty[]
        postage: Postage
        packaging: Packaging
        images: Images
        stockHistory: number[][]
        stockConsumption: StockConsumption
        linkedSKUS: string[]
        //move items from IDBFILTER into tags
        tags: string[]
        till: { color: string }
        brandLabel: BrandLabel
    }

    interface HolidayUser {
        [key: string]: number
    }

    interface BookedUser {
        [key: string]: HolidayOrSickBooking
    }

    interface HolidayOrSickBooking {
        type: "holiday" | "sick",
        paid: boolean,
        duration: 100 | 75 | 50 | 25
    }

    interface HolidayDay {
        date: string,
        bankHol?: boolean,
        bankHolidayName?: string,
        booked?: BookedUser
    }

    interface HolidayMonth {
        text: string,
        days: HolidayDay[],
        offset: number
    }

    interface HolidayCalendar {
        _id?: ObjectId,
        location: string,
        year: number,
        booked: HolidayUser
        template: HolidayMonth[]
        maxDays: number
    }

    //shop order struct
    interface TillOrder {
        _id?: string,
        order: TillOrderItem[],
        transaction: {
            giftCard?: number;
            type?: string,
            bank?: string,
            mask?: string,
            amount?: string,
            cash?: number,
            change?: number,
            authCode?: string,
            date?: string
            flatDiscount?: number,
        },
        address?: {
            number?: string,
            postcode?: string,
            email?: string,
            phone?: string
        },
        id: string,
        total: string,
        grandTotal: string,
        giftCardDiscount: string,
        flatDiscount: string,
        perDiscount: string,
        perDiscountAmount: string,
        discountReason: string,
        paid: string,
        processedBy: string,
        till: string,
        linnid?: string,
        linnstatus?: {
            Error: string,
            Message: string,
            OrderId?: string,
            Processed?: string
        },
        rmas?: TillOrderRmas[],
        returns?: TillOrderReturns[],
    }

    type TillOrderItem = {
        _id: string,
        EAN: string,
        SKU: string,
        LINNID: string,
        TITLE: string,
        SHOPPRICEINCVAT: number,
        SHOPDISCOUNT: number,
        QTY: number,
        PRICE: number,
        TOTAL: number,
        isRmad: boolean,
        isReturned: boolean,
        returnQty: number,
        totalReturned: number,
        isTrade: boolean,
        setQty: boolean,
        PURCHASEPRICE: number,
        STOCKTOTAL: number
    }

    type TillOrderRmas = {
        id: string,
        reason: string,
        user: string,
        date: string,
        items: TillOrderItem[]
    }

    type TillOrderReturns = {
        id: string,
        reason: string,
        user: string,
        date: string,
        total: number,
        transaction: TillOrderReturnTransaction,
        items: TillOrderItem[]
    }

    type TillOrderReturnTransaction = {
        type: string,
        mask?: string,
        amount: string,
        date: string
    }


    interface OnlineOrder {
        _id?: { $oid: string };
        id: string;
        address1: string;
        address2: string;
        address3: string;
        composite: any[];
        date: string;
        email: string;
        extRef: string;
        items: { qty: number; weight: number; sku: string }[];
        name: string;
        packaging: { weight: number; type: string }[];
        phone: string;
        postalid: string;
        postcode: string;
        price: string;
        prices: { price: number; qty: number; sku: string }[];
        region: string;
        source: string;
        totalWeight: number;
        town: string;
        tracking: string;
        scanned?: { min: number; correct: boolean; max: number; scaleWeight: number; diff: number; time: Date; per: number };
    }
}

export namespace till {
    export interface Order {
        _id?: string,
        address: {
            email: string,
            number: string,
            phone: string,
            postcode: string
        },
        discountReason: string,
        flatDiscount: number,
        giftCardDiscount: number,
        grandTotal: number,
        id: string,
        linnstatus: {
            Error: string,
            Message: string,
            OrderId: string,
            Processed: string
        },
        items: OrderItem[],
        paid: boolean,
        percentageDiscount: number,
        percentageDiscountAmount: number,
        processedBy: string,
        returns: OrderReturn[],
        till: string,
        total: number,
        profit: number,
        profitWithLoss: number,
        transaction: OrderTransaction
    }

    export interface OrderItem {
        _id: string,
        EAN: string,
        isReturned: boolean,
        isTrade: boolean,
        linnId: string,
        prices: {
            purchase: number
            retail: number
            amazon: number
            ebay: number
            magento: number
            shop: number
            onbuy: number
        },
        discounts: {
            shop: number
            magento: number
        }
        quantity: number,
        returnQuantity: number,
        totalReturned?: number,
        SKU: string,
        stock: {
            default: number,
            warehouse: number
            total: number
            minimum: number
            value: number
        },
        shelfLocation?: schema.ShelfLocation,
        title: string,
        total: number,
        profitCalculated: boolean
    }

    export interface OrderTransaction {
        amount: number,
        authCode: string,
        bank: string,
        cash: number,
        change: number,
        date: string,
        flatDiscount: number,
        giftCard: number,
        mask: string,
        type: string
    }

    export interface OrderReturn {
        date: string,
        id: string,
        reason: string,
        total: number,
        items: OrderItem[]
        transaction: Pick<OrderTransaction, "amount" | "date" | "mask" | "type">
        user: string
    }

}

declare namespace linn {

    interface InventoryItemImage {
        "ItemNumber": string,
        "StockItemId": string,
        "IsMain": boolean,
        "ImageUrl": string
    }

    interface Query<T> {
        IsError: boolean;
        ErrorMessage: string;
        TotalResults: number;
        Columns: { Type: string; Index: number; Name: string }[];
        Results: T[];
    }

    interface BulkGetImagesResult {
        "Images": [
            BulkGetImagesImage
        ]
    }

    export interface BulkGetImagesImage {
        "SKU": string,
        "IsMain": boolean,
        "pkRowId": string,
        "ChecksumValue": string,
        "RawChecksum": string,
        "SortOrder": number,
        "StockItemId": string,
        "FullSource": string,
        "FullSourceThumbnail": string
    }

    interface Transfer {
        PkTransferId: string;
        FromLocationId: string;
        ToLocationId: string;
        FromLocation: string;
        ToLocation: string;
        Status: number;
        nStatus: number;
        ReferenceNumber: string;
        OrderDate: string;
        NumberOfItems: number;
        NumberOfNotes: number;
        fkOriginalTransferId: string;
        OriginalTransferReference: string;
        IsDiscrepancyTransfer: boolean;
        BLogicalDelete: boolean;
        Bins: { BinReference: string; BinBarcode: string; BinItems: { ItemNoteCount: number; SentQuantity: number; InToLocationQuantity: number; BinRackNumber: string; ItemNotes: { FkBinId: string; NoteUser: string; PkTransferItemId: string; Note: string; NoteDateTime: string; PkTransferItemNoteId: string; NoteRead: boolean }[]; ReceivedQuantity: number; PkTransferItemId: string; InFromLocationQuantity: number; Barcode: string; ItemTitle: string; PkBinId: string; SKU: string; DueFromLocationQuantity: number; RequestedQuantity: number; FkStockItemId: string }[]; BinName: string; BinNotes: { NoteUser: string; Note: string; PkTransferBinNoteId: string; NoteDateTime: string; PkBinId: string; NoteRead: boolean }[]; PkBinId: string }[];
        Notes: { NoteUser: string; Note: string; PkTransferNoteId: string; NoteDateTime: string; NoteRead: boolean }[];
        AuditTrail: { AuditNote: string; AuditDate: string; AuditType: number; nAuditType: number; PkTransferAuditId: string }[];
        TransferProperties: { TransferPropertyName: string; TransferPropertyValue: string; PkTransferPropertyId: string }[];
        UpdateStatus: { Status: boolean; Items: boolean; Properties: boolean; Information: boolean; Notes: boolean };
    }

    export interface AddToTransfer {
        PkTransferItemId: string;
        FkStockItemId: string;
        SKU: string;
        Barcode: string;
        ItemTitle: string;
        RequestedQuantity: number;
        SentQuantity: number;
        ReceivedQuantity: number;
        InFromLocationQuantity: number;
        DueFromLocationQuantity: number;
        InToLocationQuantity: number;
        ItemNoteCount: number;
        BinRackNumber: string;
        PkBinId: string;
        ItemNotes: {
            FkBinId: string;
            NoteUser: string;
            PkTransferItemId: string;
            Note: string;
            NoteDateTime: string;
            PkTransferItemNoteId: string;
            NoteRead: boolean
        }[];
    }

    interface ItemStock {
        Location: {
            LocationTag: string;
            StockLocationId: string;
            BinRack: string;
            IsWarehouseManaged: boolean;
            StockLocationIntId: number;
            LocationName: string;
            IsFulfillmentCenter: boolean
        };
        StockLevel: number;
        StockValue: number;
        MinimumLevel: number;
        InOrderBook: number;
        Due: number;
        JIT: boolean;
        InOrders: number;
        Available: number;
        UnitCost: number;
        SKU: string;
        AutoAdjust: boolean;
        LastUpdateDate: string;
        LastUpdateOperation: string;
        rowid: string;
        PendingUpdate: boolean;
        StockItemPurchasePrice: number;
        StockItemId: string;
        StockItemIntId: number;
    }

    interface PostalService {
        id: string;
        hasMappedShippingService: boolean;
        Channels: { PostalServiceName: string; SubSource: string; pkPostalServiceId: string; Source: string }[];
        ShippingServices: { accountid: string; vendorFriendlyName: string; PostalServiceName: string; vendor: string; pkPostalServiceId: string }[];
        PostalServiceName: string;
        PostalServiceTag: string;
        ServiceCountry: string;
        PostalServiceCode: string;
        Vendor: string;
        PrintModule: string;
        PrintModuleTitle: string;
        pkPostalServiceId: string;
        TrackingNumberRequired: boolean;
        WeightRequired: boolean;
        IgnorePackagingGroup: boolean;
        fkShippingAPIConfigId: number;
        IntegratedServiceId: string;
    }
}