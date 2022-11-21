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
        AMZPRICEINCVAT?: string,
        AMZPRIME?: boolean,
        BRAND?: string,
        BRANDLABEL?: brandLabel,
        CD?: channelData,
        CHECK?: statusChecks,
        COMPDATA?: composite[],
        CP?: channelPrice,
        DESCRIPTION?: string,
        EAN?: string,
        EBAYPRICEINCVAT?: string,
        EXTENDEDPROPERTY?: linnExtendedProperty[],
        HIDE?: boolean,
        IDBEP?: itemDatabaseExtendedProperties,
        IDBFILTER?: string,
        IMAGES?: itemImages,
        INVCHECK?: { DONE: boolean, DATE: string },
        INVCHECKDATE?: string,
        ISCOMPOSITE?: boolean,
        LASTUPDATE?: string,
        LINKEDSKUS?: string[],
        LINNID?: string,
        LISTINGVARIATION?: boolean,
        MARGINNOTE?: string,
        MCOVERRIDES?: { [key: string]: boolean }
        MD?: marginData,
        MINSTOCK?: number,
        MONTHSTOCKHIST?: MonthStockHistory,
        ONORDER?: onOrder[],
        PACKAGING?: { EDITABLE: boolean, ITEMS: string[] | string, LOCK: boolean },
        PACKGROUP?: string,
        PICKLIST?: pickListItem[],
        POSTID?: string,
        POSTMODID?: string | number,
        PURCHASEPRICE?: number,
        QSPRICEINCVAT?: string,
        RETAILPRICE?: number,
        SHELFLOCATION?: {PREFIX:string, LETTER:string, NUMBER: string},
        SHIPAMAZONEXP?: string,
        SHIPCOURIEREXP?: string,
        SHIPCOURIERSTD?: string,
        SHIPEBAYSTD?: string,
        SHIPFORMAT?: string,
        SHOP?: { PRICE: string, STATUS: number }
        SHOPPRICEINCVAT?: string,
        SHORTDESC?: string,
        SKU: string,
        STOCKINFO?: { WAREHOUSE: number, YELLAND: number }
        STOCKTOTAL?: number,
        STOCKVAL?: number,
        SUPPLIER?: string,
        TILLFILTER?: string,
        TITLE?: string,
        TITLEWEBSITE?: string,
        WEIGHT?: number
    }

    /* ToDo remove from database
    *   POSTALPRICEUK
    *   POSTCOSTEXVAT
    *   QSPIVF
    *   SHIPCOURIEREU
    *   StockItem?
    * */

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
        ID?: string,
        PRICE: string,
        STATUS?: number,
        SUBSOURCE: string,
        UPDATED: string,
        updateReq?: boolean
    }

    type linnExtendedProperty = {
        epName: string,
        epType: string,
        epValue: string,
        pkRowId: string,
    }

    type itemDatabaseExtendedProperties = {
        AMAZSPORT?: string,
        AMZDEPARTMENT?: string,
        AMZLATENCY?: number,
        BRAND?: string,
        BULLETPOINT1?: string,
        BULLETPOINT2?: string,
        BULLETPOINT3?: string,
        BULLETPOINT4?: string,
        BULLETPOINT5?: string,
        CATEGORIE1?: string,
        CATEGORIE2?: string,
        COMISO2?: string,
        COMISO3?: string,
        QSCAT1?: string,
        QSCAT2?: string,
        SEARCHTERM1?: string,
        SEARCHTERM2?: string,
        SEARCHTERM3?: string,
        SEARCHTERM4?: string,
        SEARCHTERM5?: string
        TARIFFCODE?: string,
        TRADEPACK?: string
    }

    type itemImages = {
        [key: string]: {
            link?: string
            filename: string
            id?: string
        }
    }

    type marginData = {
        AMAZONFEES?: number,
        AMAZPAVC?: number,
        AMAZPROFITLY?: number,
        AMAZSALESVAT?: number,
        EBAYFEES?: number,
        EBAYPROFITLY?: number,
        EBAYUKPAVC?: number,
        EBAYUKSALESVAT?: number,
        PACKAGING?: number,
        POSTALPRICEUK?: number,
        PRIMEPAVC?: number,
        PRIMEPOSTAGEUK?: number,
        QSFEES?: number,
        QSPAVC?: number,
        QSPROFITLY?: number,
        QSUKSALESVAT?: number,
        SHOPFEES?: number,
        SHOPPAVC?: number,
        SHOPUKSALESVAT?: number,
        TOTALPROFITLY?: number
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
        [key: string]: boolean | "half"
    }

    interface holidayDay {
        date: string,
        bankHol?: boolean,
        bankHolidayName?: string,
        booked?: bookedUser
    }

    interface holidayMonths {
        text: string,
        days: holidayDay[],
        offset: number
    }

    interface holidayCalendar {
        _id?: ObjectId,
        location: string,
        year: number,
        booked: holidayUser
        template: holidayMonths[]
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

declare namespace server {
    export interface sessionObject {

    }

}