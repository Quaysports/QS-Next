import {bulkUpdateAny, bulkUpdateItems, find, setData} from "../mongo-interface/mongo-interface";
import {sbt, schema, till} from "../../types";
import {Postage} from "../postage/postage";
import {Packaging} from "../packaging/packaging";
import {Fees} from "../fees/fees";

export async function getCalendars(){
    return await find("Holiday-Calendar", {})
}

export async function convertShopToTillTransactions(){

    let tillOrders = await find<sbt.TillOrder>("Shop", {})
    if(!tillOrders) return

    function convertToIntCurrency(value: string):number {
        return Math.round(parseFloat(value) * 100)
    }

    let newOrders: till.Order[] = []
    for (let order of tillOrders) {

        let orderConversion: till.Order = {
            address: {
                email: order.address?.email || "",
                number: order.address?.number || "",
                phone: order.address?.phone || "",
                postcode: order.address?.postcode || ""
            },
            _id: order._id || "",
            discountReason: order.discountReason || "",
            flatDiscount: order.flatDiscount ? convertToIntCurrency(order.flatDiscount) : 0,
            giftCardDiscount: order.giftCardDiscount ? convertToIntCurrency(order.giftCardDiscount) : 0,
            grandTotal: order.grandTotal ? convertToIntCurrency(order.grandTotal) : 0,
            id: order.id || "",
            linnstatus: {
                Error: order.linnstatus?.Error || "",
                Message: order.linnstatus?.Message || "",
                OrderId: order.linnstatus?.OrderId || "",
                Processed: order.linnstatus?.Processed || ""
            },
            items: [],
            paid: order.paid === "true" || false,
            percentageDiscount: order.perDiscount ? Math.round(parseFloat(order.perDiscount)) : 0,
            percentageDiscountAmount: order.perDiscountAmount ? convertToIntCurrency(order.perDiscountAmount) : 0,
            processedBy: order.processedBy || "",
            returns: [],
            rmas: [],
            till: order.till || "",
            total: order.total ? convertToIntCurrency(order.total) : 0,
            transaction: {
                amount: order.transaction?.amount ? convertToIntCurrency(order.transaction?.amount) : 0,
                authCode: order.transaction?.authCode || "",
                bank: order.transaction?.bank || "",
                cash: order.transaction?.cash ? convertToIntCurrency(String(order.transaction.cash)) : 0,
                change: order.transaction?.change ? convertToIntCurrency(String(order.transaction.change)) : 0,
                date: order.transaction?.date || "",
                flatDiscount: order.transaction?.flatDiscount ? convertToIntCurrency(String(order.transaction.flatDiscount)) : 0,
                giftCard: order.transaction?.giftCard ? convertToIntCurrency(String(order.transaction.giftCard)) : 0,
                mask: order.transaction?.mask || "",
                type: order.transaction?.type || ""
            }
        }

        for (let item of order.order) {
            orderConversion.items.push(convertOrderItem(item))
        }

        if (order.returns) {
            for (let orderReturn of order.returns) {
                orderConversion.returns.push(convertOrderReturn(orderReturn))
            }
        }

        if (order.rmas) {
            for (let rma of order.rmas) {
                orderConversion.rmas.push(convertOrderRma(rma))
            }
        }

        newOrders.push(orderConversion)
    }

    function convertOrderItem(item: sbt.TillOrderItem): till.OrderItem {
        return {
            EAN: item.EAN || "",
            SKU: item.SKU || "",
            _id: item._id || "",
            discounts: {
                magento: 0,
                shop: item.SHOPDISCOUNT ? item.SHOPDISCOUNT : 0,
            },
            isReturned: item.isReturned || false,
            isTrade: item.isTrade || false,
            linnId: item.LINNID || "",
            prices: {
                amazon: 0,
                ebay: 0,
                magento: 0,
                purchase: item.PURCHASEPRICE ? convertToIntCurrency(String(item.PURCHASEPRICE)) : 0,
                retail: 0,
                shop: item.SHOPPRICEINCVAT ? convertToIntCurrency(String(item.SHOPPRICEINCVAT)) : 0,
            },
            quantity: item.QTY || 0,
            returnQuantity: item.returnQty || 0,
            stock: {
                default: 0,
                minimum: 0,
                total: item.STOCKTOTAL || 0,
                value: 0,
                warehouse: 0
            },
            title: item.TITLE || "",
            total: item.TOTAL ? convertToIntCurrency(String(item.TOTAL)) : 0,
        }
    }

    function convertOrderReturn(item: sbt.TillOrderReturns): till.OrderReturn {
        console.log(item)
        let convertedOrder: till.OrderReturn = {
            id: "",
            user: "",
            date: item.date || "",
            items: [],
            reason: item.reason || "",
            total: item.total ? convertToIntCurrency(String(item.total)) : 0,
            transaction: {
                amount: item.transaction?.amount ? convertToIntCurrency(String(item.transaction?.amount)) : 0,
                date: item.transaction?.date || "",
                mask: item.transaction?.mask || "",
                type: item.transaction?.type || ""
            }
        }

        if (!item.items) return convertedOrder
        for (let returnItem of item.items) {
            convertedOrder.items.push(convertOrderItem(returnItem))
        }

        return convertedOrder
    }

    function convertOrderRma(item: sbt.TillOrderRmas): till.OrderRma {
        let convertedOrder: till.OrderRma = {
            id: item.id || "",
            user: item.user || "",
            date: item.date || "",
            items: [],
            reason: item.reason || ""
        }

        if (!item.items) return convertedOrder
        for (let rmaItem of item.items) {
            convertedOrder.items.push(convertOrderItem(rmaItem))
        }

        return convertedOrder
    }

    console.log(newOrders)

    let result = await bulkUpdateAny("Till-Transactions", newOrders, "id")
    console.log(result)
}

export async function convertPricesToThousands() {
    let items = await find<schema.Item>("New-Items", {})
    if (!items) return

    for (let item of items) {
        item.prices = {
            amazon: Math.round(item.prices.amazon * 100),
            ebay: Math.round(item.prices.amazon * 100),
            magento: Math.round(item.prices.amazon * 100),
            purchase: item.prices.purchase,
            retail: item.prices.retail,
            shop: item.prices.shop
        }
    }

    let result = await bulkUpdateItems(items)
    console.log(result)
    return
}

export interface PostageData {
    _id?: { $oid: string };
    format: string;
    id: string;
    vendor: string;
    cost: number;
    tag: string;
}


export async function convertPostageToNewFormat() {
    let postage = await find<Postage>("Postage", {})
    if (!postage) return
    for(let item of postage as any){
        let newPostage:PostageData = {
            cost: item.POSTCOSTEXVAT ? Math.round(item.POSTCOSTEXVAT * 100) : 0,
            format: item.POSTALFORMAT || "",
            id: item.POSTID || "",
            tag: item.SFORMAT || "",
            vendor: item.VENDOR || ""
        }
        await setData("New-Postage", {format: newPostage.format}, newPostage)
    }
    return
}

export interface PackagingData {
    _id?: { $oid: string };
    id: string;
    linkedSkus: string[];
    name: string;
    type: string;
    price: number;
}
export async function convertPackagingToNewFormat() {
    let packaging = await find<Packaging>("Packaging", {})
    if (!packaging) return
    for(let item of packaging as any){
        let newPackaging:PackagingData = {
            id: item.ID || "",
            linkedSkus: item.LINKEDSKU ? item.LINKEDSKU : [],
            name: item.NAME || "",
            price: item.PRICE ? Math.round(item.PRICE * 100) : 0,
            type: item.TYPE || ""
        }
        await setData("New-Packaging", {id: newPackaging.id}, newPackaging)
    }
    return
}

export interface OldFees {
    _id?: { $oid: string };
    listing: Channels;
    flat: Channels
    vatApplicable: VatApplicable
    VAT: number;
    lastUpdate: string;
    subscription: Channels
}

export interface Channels {
    shop: string;
    magento: string;
    ebay: string;
    amazon: string
}

export interface VatApplicable {
    shop: boolean;
    magento: boolean;
    ebay: boolean;
    amazon: boolean
}
export async function convertFees(){
    let fees = await find<OldFees>("New-Fees", {})
    if (!fees) return
    for(let fee of fees){
        let newFees:Fees = {
            VAT: fee.VAT,
            flat: {
                amazon: fee.flat.amazon ? Math.round(parseFloat(fee.flat.amazon) * 100) : 0,
                ebay: fee.flat.ebay ? Math.round(parseFloat(fee.flat.ebay) * 100) : 0,
                magento: fee.flat.magento ? Math.round(parseFloat(fee.flat.magento) * 100) : 0,
                shop: fee.flat.shop ? Math.round(parseFloat(fee.flat.shop) * 100) : 0
            },
            lastUpdate: fee.lastUpdate,
            listing: {
                amazon: fee.listing.amazon ? Math.round(parseFloat(fee.listing.amazon) * 100) : 0,
                ebay: fee.listing.ebay ? Math.round(parseFloat(fee.listing.ebay) * 100) : 0,
                magento: fee.listing.magento ? Math.round(parseFloat(fee.listing.magento) * 100) : 0,
                shop: fee.listing.shop ? Math.round(parseFloat(fee.listing.shop) * 100) : 0
            },
            subscription: {
                amazon: fee.subscription.amazon ? Math.round(parseFloat(fee.subscription.amazon) * 100) : 0,
                ebay: fee.subscription.ebay ? Math.round(parseFloat(fee.subscription.ebay) * 100) : 0,
                magento: fee.subscription.magento ? Math.round(parseFloat(fee.subscription.magento) * 100) : 0,
                shop: fee.subscription.shop ? Math.round(parseFloat(fee.subscription.shop) * 100) : 0
            },
            vatApplicable: {
                amazon: fee.vatApplicable.amazon,
                ebay: fee.vatApplicable.ebay,
                magento: fee.vatApplicable.magento,
                shop: fee.vatApplicable.shop
            }
        }
        await setData("New-Fees", {lastUpdate:newFees.lastUpdate}, newFees)
    }
    return
}