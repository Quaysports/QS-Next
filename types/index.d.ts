declare namespace sbt {
    type ObjectId = import("mongodb").ObjectId;

    //struct for server config data
    interface config {
        dbAddress: string,
        dbName: string,
        dbPort: string,
        tokens: tokens
    }

    interface tokens {
        [key: string]: string
    }

    // struct for node worker request

    interface workerReq {
        type: string,
        data: {
            socket?: string,
            skus?: string,
            save?: boolean
        },
        id: string
    }

    // struct for node worker return

    interface workerData {
        id: string,
        reqId?: string,
        msg?: string,
        data?: any,
        socket?: string,
        type?: string
    }

    //master struct for item data
    interface Item {
        _id?: string,
        AMZPRICEINCVAT: string,
        AMZPRIME: boolean,
        BRAND: string,
        BRANDLABEL: brandLabel,
        CD: channelData,
        CHECK: statusChecks,
        COMPDATA: composite[],
        CP: channelPrice,
        DESCRIPTION: string,
        EAN: string,
        EBAYPRICEINCVAT: string,
        EXTENDEDPROPERTY: linnExtendedProperty[],
        HIDE: boolean,
        IDBEP: itemDatabaseExtendedProperties,
        IDBFILTER: string,
        IMAGES: itemImages,
        INVCHECK: { DONE: boolean, DATE: string },
        INVCHECKDATE: string,
        ISCOMPOSITE: boolean,
        LASTUPDATE: string,
        LINKEDSKUS: string[],
        LINNID: string,
        LISTINGVARIATION: boolean,
        MARGINNOTE: string,
        MCOVERRIDES: { [key: string]: boolean }
        MD: marginData,
        MINSTOCK: number,
        MONTHSTOCKHIST: MonthStockHistory,
        ONORDER: onOrder[],
        PACKAGING: { EDITABLE: boolean, ITEMS: string[] | string, LOCK: boolean },
        PACKGROUP: string,
        PICKLIST: pickListItem[],
        POSTID: string,
        POSTMODID: string | number,
        PURCHASEPRICE: number,
        QSPRICEINCVAT: string,
        QSDISCOUNT: number,
        RETAILPRICE: number,
        SHELFLOCATION: shelfLocation,
        SHIPAMAZONEXP: string,
        SHIPCOURIEREXP: string,
        SHIPCOURIERSTD: string,
        SHIPEBAYSTD: string,
        SHIPFORMAT: string,
        SHOP: { PRICE: string, STATUS: number }
        SHOPDISCOUNT: number,
        SHOPPRICEINCVAT: string,
        SHORTDESC: string,
        SKU: string,
        STOCKINFO: { WAREHOUSE: number, YELLAND: number }
        STOCKTOTAL: number,
        STOCKVAL: number,
        SUPPLIER: string,
        TAGS: string[],
        TILLFILTER: string,
        TITLE: string,
        TITLEWEBSITE: string,
        WEIGHT: number
    }

    export interface shelfLocation {
        PREFIX: string,
        LETTER: string,
        NUMBER: string
    }

    /* ToDo remove from database
    *   POSTALPRICEUK
    *   POSTCOSTEXVAT
    *   QSPIVF
    *   SHIPCOURIEREU
    *   StockItem?
    * */

    /**
     * @property {string} brand Depreciated, pull info from item.IDBEP.BRAND
     * @property {string} image Depreciated, do not use
     * @property {string} loc Depreciated, pull info from item.SHELFLOCATION
     * @property {string} price Depreciated, pull info from item.SHOPPRICEINCVAT
     *
     **/
    type brandLabel = {
        brand: string,
        image: string,
        loc: string,
        path: string,
        price: string,
        title1: string,
        title2: string
    }

    type channelData = {
        [key: number]: channelDataSource[]
    }

    type channelDataSource = {
        QTY: string,
        SOURCE: string
    }

    type statusChecks = {
        DONE: {
            ADDINV: boolean,
            AMAZON: boolean,
            AMAZONSTORE: boolean,
            EAN: boolean,
            EBAY: boolean,
            EBAYDRAFT: boolean,
            FBA: boolean,
            GOODRCVD: boolean,
            INVLINK: boolean,
            JARILO: boolean,
            MARGIN: boolean,
            PHOTO: boolean,
            PHOTOS: boolean,
            QS: boolean,
            ZEN: boolean
        },
        NA: {
            AMAZON: boolean,
            AMAZONSTORE: boolean,
            EBAY: boolean,
            FBA: boolean,
            QS: boolean,
            ZEN: boolean
        },
        READY: {
            AMAZON: boolean,
            AMAZONSTORE: boolean,
            EBAY: boolean,
            FBA: boolean,
            QS: boolean,
            ZEN: boolean
        },
        SF: {
            HIDE: boolean,
            LIST: boolean
        }
    }

    type composite = {
        ItemTitle: string,
        PurchasePrice: number,
        Quantity: number,
        SKU: string,
        Weight: number
    }

    type channelPrice = {
        [key: string]: channelPriceData
    }

    type channelPriceData = {
        ID: string,
        PRICE: string,
        STATUS: number | undefined,
        SUBSOURCE: string,
        UPDATED: string,
        updateReq: boolean
    }

    type linnExtendedProperty = {
        epName: string,
        epType: string,
        epValue: string,
        pkRowId: string,
    }

    type itemDatabaseExtendedProperties = {
        AMAZSPORT: string,
        AMZDEPARTMENT: string,
        AMZLATENCY: number,
        BRAND: string,
        BULLETPOINT1: string,
        BULLETPOINT2: string,
        BULLETPOINT3: string,
        BULLETPOINT4: string,
        BULLETPOINT5: string,
        CATEGORIE1: string,
        CATEGORIE2: string,
        COMISO2: string,
        COMISO3: string,
        QSCAT1: string,
        QSCAT2: string,
        SEARCHTERM1: string,
        SEARCHTERM2: string,
        SEARCHTERM3: string,
        SEARCHTERM4: string,
        SEARCHTERM5: string,
        TAGS: string,
        TARIFFCODE: string,
        TRADEPACK: string
    }

    type itemImages = {
        [key: string]: {
            link?: string
            filename: string
            id?: string
        }
    }

    type marginData = {
        AMAZONFEES: number | undefined,
        AMAZPAVC: number | undefined,
        AMAZPROFITLY: number | undefined,
        AMAZSALESVAT: number | undefined,
        EBAYFEES: number | undefined,
        EBAYPROFITLY: number | undefined,
        EBAYUKPAVC: number | undefined,
        EBAYUKSALESVAT: number | undefined,
        PACKAGING: number | undefined,
        POSTALPRICEUK: number | undefined,
        PRIMEPAVC: number | undefined,
        PRIMEPOSTAGEUK: number | undefined,
        QSFEES: number | undefined,
        QSPAVC: number | undefined,
        QSPROFITLY: number | undefined,
        QSUKSALESVAT: number | undefined,
        SHOPFEES: number | undefined,
        SHOPPAVC: number | undefined,
        SHOPUKSALESVAT: number | undefined,
        TOTALPROFITLY: number | undefined
    }

    type MonthStockHistory = {
        [key: string]: MonthStockHistoryMonth
    }

    type MonthStockHistoryMonth = {
        1: string,
        2: string,
        3: string,
        4: string,
        5: string,
        6: string,
        7: string,
        8: string,
        9: string,
        10: string,
        11: string,
        12: string
    }

    type onOrder = {
        CONF: boolean,
        DUE: string,
        ID: string,
        QTY: string
    }

    type pickListItem = {
        DimDepth: number,
        DimHeight: number,
        DimWidth: number,
        InventoryTrackingType: number,
        ItemTitle: string,
        LinkedStockItemId: string,
        PurchasePrice: number,
        Quantity: number,
        SKU: string,
        StockItemId: string,
        StockItemIntId?: number,
        WEIGHT: number
    }

    // common merge object used for mass updating items
    interface merge {
        [key: string]: Item
    }

    //holiday calendar
    interface holidayUser {
        [key: string]: number
    }

    interface bookedUser {
        [key: string]: HolidayOrSickBooking
    }

    interface HolidayOrSickBooking {
        type:"holiday" | "sick", paid:boolean, duration:100 | 75 | 50 | 25
    }

    interface holidayDay {
        date: string,
        bankHol?: boolean,
        bankHolidayName?: string,
        booked?: bookedUser
    }

    interface holidayMonth {
        text: string,
        days: holidayDay[],
        offset: number
    }

    interface holidayCalendar {
        _id?: ObjectId,
        location: string,
        year: number,
        booked: holidayUser
        template: holidayMonth[]
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
            OrderId?: string,
            Processed?: boolean
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

declare namespace schema {
    interface Image {
        id: string;
        filename: string;
        link: string;
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
        tillFilter:string
    }
    interface LegacyShipping {
        //used to be SHIPCOURIERSTD, remove?
        standard:string
        //used to be SHIPCOURIEREXP
        expedited: string
        //used to be SHIPEBAYSTD, remove?
        standardEbay:string
        //used to be SHIPAMAZONEXP, remove?
        expeditedAmazon: string
    }
    interface Prices {
        //used to be PURCHASEPRICE
        purchase:number
        //used to be RETAILPRICE
        retail:number
        //used to be AMZPRICEINCVAT
        amazon:number
        //used to be EBAYPRICEINCVAT
        ebay:number
        //used to be QSPRICEINCVAT
        magento:number
        //used to be SHOPPRICEINCVAT
        shop:number
    }
    interface ShelfLocation {
        prefix:string
        letter:string
        number:string
    }
    interface Discounts {
        shop:number
        magento:number
    }
    interface ChannelPrices {
        amazon: LinnChannelPriceData
        ebay: LinnChannelPriceData
        magento: LinnChannelPriceData
        shop: BaseChannelPriceData
    }
    interface BaseChannelPriceData {
        status: number,
        price: string
    }
    interface LinnChannelPriceData extends BaseChannelPriceData{
        subSource: string,
        updated: string,
        id: string,
        updateRequired: boolean
    }
    interface Stock  {
        //renamed from yelland?
        default: number,
        warehouse: number
        //map from STOCKTOTAL
        total: number
        //map from MINSTOCK
        minimum: number
        //map from STOCKVAL
        value: number
        //map from INVCHECKDATE
        checkedDate: string
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
        amazon:AmazonMarginData
        ebay:ChannelMarginData
        magento:ChannelMarginData
        shop:ChannelMarginData
        packaging: number
        postage: number
        totalProfitLastYear: number
    }
    interface CheckboxStatus {
        stockForecast: StockForecastStatus
        done: DoneStatus
        ready: ReadyStatus
        notApplicable:NotApplicableStatus
        //map from AMZPRIME
        prime:boolean
        marginCalculator:MarginCalculatorStatus
    }
    interface StockForecastStatus{
        list:boolean
        hide:boolean
    }
    interface DoneStatus{
        goodsReceived:boolean
        addedToInventory:boolean
        EAN:boolean
        photos:boolean
        marginsCalculated:boolean
        jariloTemplate:boolean
        ebayDraft:boolean
        inventoryLinked:boolean
        ebay:boolean
        amazon:boolean
        magento:boolean
        zenTackle:boolean
        amazonStore:boolean
    }
    interface ReadyStatus{
        ebay:boolean
        amazon:boolean
        magento:boolean
        zenTackle:boolean
        amazonStore:boolean
    }
    interface NotApplicableStatus{
        ebay:boolean
        amazon:boolean
        magento:boolean
        zenTackle:boolean
        amazonStore:boolean
    }
    interface MarginCalculatorStatus{
        //map from MCOVERRIDES
        hide:boolean
        amazonOverride:boolean
        ebayOverride:boolean
        magentoOverride:boolean
    }
    interface Postage{
        // used to be POSTID?
        id: string
        //used to be POSTALPRICEUK
        price:number
        //used to be POSTMODID
        modifier:string
    }
    interface Packaging{
        lock: boolean,
        items: string[]
        editable: boolean
        //used to be PACKGROUP
        group: string
    }
    interface Images{
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
    interface BrandLabel{
        image: string,
        path: string,
        brand: string
        title1: string,
        title2: string,
        location:string
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
        supplier:string
        suppliers:string[]
        brand:string
        description: string
        shortDescription: string
        lastUpdate: string
        marginNote:string
        legacyShipping: LegacyShipping
        prices: Prices
        discounts: Discounts
        shelfLocation: ShelfLocation
        channelPrices: ChannelPrices
        stock: Stock
        stockTake: StockTake
        onOrder:OnOrder[]
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
        postage:Postage
        packaging: Packaging
        images:Images
        stockHistory: number[][]
        linkedSKUS: string[]
        //move items from IDBFILTER into tags
        tags: string[]
        brandLabel:BrandLabel
    }
}