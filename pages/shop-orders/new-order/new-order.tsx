import React, {useState, useEffect, useCallback} from 'react';
import SideBar from "../sidebar/sidebar";
import {editOrderInterface, item} from "../landing-page/landing-page";
import StockList from "./stock-list";
import OrderList from "./order-list";
import "../shop-orders.css"
import {useNavigate} from "react-router-dom";

interface newOrderProps {
    editOrderHandler: (x: {order:[], date:string}) => void;
    currentOrderArray: editOrderInterface
    deadStockList: Map<string, {
        SKU: string,
        SUPPLIER: string,
        TITLE: string
    }>
}

interface supplierAndItemsState {
    supplierItems: Map<string, item[]>
    supplier: string
}

interface orderAndPriceState {
    orderArray: item[]
    totalPrice: number
}

export default function NewOrder(props: newOrderProps) {

    const [supplierAndItems, setSupplierAndItems] = useState<supplierAndItemsState>({
        supplierItems: new Map<string, []>(),
        supplier: null
    });
    const [loadList, setLoadList] = useState<string>(null);
    const [editOrder, setEditOrder] = useState<boolean>(true)
    const [sideBarContent, setSideBarContent] = useState<Map<string, object>>(new Map<string, {}>());
    const [orderAndPrice, setOrderAndPrice] = useState<orderAndPriceState>({
        orderArray: props.currentOrderArray.order,
        totalPrice: 0
    });

    const navigate = useNavigate()

    const newOrderHandler = useCallback((supplier, freshOrder?) => {
        if(supplier) {
            const opts = {
                method: "POST",
                body: JSON.stringify({supplier: supplier}),
                headers: {
                    'token': "9b9983e5-30ae-4581-bdc1-3050f8ae91cc",
                    'Content-Type': 'application/json'
                }
            }
            fetch("https://localhost/Shop/GetSupplierItems", opts)
                .then(res => res.json())
                .then(res => {
                    let itemsTempMap = new Map()
                    itemsTempMap.set(supplier, [])
                    for (let i = 0; i < res.length; i++) {
                        res[i].SUPPLIER = supplier
                        res[i].bookedIn = "false"
                        res[i].newProduct = false
                        res[i].lowStock = false
                        res[i].inOrder = false
                        res[i].tradePack = 1
                        res[i].qty = 1
                        if (res[i].STOCKTOTAL < res[i].MINSTOCK) res[i].lowStock = true;
                        props.deadStockList.has(res[i].SKU) ? res[i].deadStock = true : res[i].deadStock = false;
                        itemsTempMap.get(supplier).push(res[i]);
                    }
                    console.log(orderAndPrice)
                    if (freshOrder) {
                        setOrderAndPrice({
                            orderArray: [],
                            totalPrice: 0
                        })
                        props.editOrderHandler({order:[], date:null})
                    } else {
                        let totalPrice = 0
                        for (let i = 0; i < orderAndPrice.orderArray.length; i++) {
                            totalPrice += (orderAndPrice.orderArray[i].PURCHASEPRICE * orderAndPrice.orderArray[i].tradePack * orderAndPrice.orderArray[i].qty)
                            if(editOrder) {
                                let index = itemsTempMap.get(supplier).findIndex(item => item.SKU === orderAndPrice.orderArray[i].SKU)
                                itemsTempMap.get(supplier).splice(index, 1)
                            }
                        }
                        setOrderAndPrice({
                            orderArray: orderAndPrice.orderArray,
                            totalPrice: totalPrice
                        })
                    }
                    setSupplierAndItems({
                        supplierItems: new Map(itemsTempMap),
                        supplier: supplier
                    })
                })
        }
        setEditOrder(() => false)
        console.log(editOrder)
    }, [props.deadStockList, editOrder])

    useEffect(() => {
        if(editOrder) {
            const opts = {
                method: "POST",
                headers: {
                    'token': "9b9983e5-30ae-4581-bdc1-3050f8ae91cc",
                    'Content-Type': 'application/json'
                }
            }
            fetch("https://localhost/Shop/GetSuppliersAndLowStock", opts)
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    transformLowStockDataForSidebar(res)
                })

            newOrderHandler(props.currentOrderArray.order[0] ? props.currentOrderArray.order[0].SUPPLIER : null)
        }

        function transformLowStockDataForSidebar(data) {
            let sortedData = data.sort((a, b) => {
                if (!a.SUPPLIER) a.SUPPLIER = "Default"
                if (!b.SUPPLIER) b.SUPPLIER = "Default"
                return a.SUPPLIER.localeCompare(b.SUPPLIER)
            })
            let tempMap = new Map()
            for (let i = 0; i < sortedData.length; i++) {
                tempMap.set(sortedData[i].SUPPLIER, sortedData[i].LOWSTOCKCOUNT)
            }
            setSideBarContent(new Map(tempMap))
        }
    }, [newOrderHandler,props.currentOrderArray.order, editOrder])

    function saveOrder() {
        const confirmBox = window.confirm(`Create new ${supplierAndItems.supplier} order?`)
        if (confirmBox) {
            const date = new Date();

            let newOrder = {
                id: `${date.getDate().toString()}-${(date.getMonth() + 1).toString()}-${date.getFullYear().toString()}`,
                supplier: supplierAndItems.supplier,
                date: props.currentOrderArray.orderID ? props.currentOrderArray.orderID: date.getTime(),
                complete: false,
                arrived: [],
                order: orderAndPrice.orderArray,
            }
            console.log(newOrder.id)

            console.log(newOrder)

            let options = {
                method: 'POST',
                body: JSON.stringify(newOrder),
                headers: {
                    'token': "9b9983e5-30ae-4581-bdc1-3050f8ae91cc",
                    'Content-Type': 'application/json'
                }
            }

            fetch("https://localhost/Shop/ShopStockOrder", options)
                .then((res) => {
                    res.json()
                        .then((res) => {
                            if (res.acknowledged) {
                                alert("New order created")
                                props.editOrderHandler({order:[], date:null})
                                setOrderAndPrice({orderArray: [], totalPrice: 0})
                                navigate("/shop-orders/orders")
                            } else {
                                alert("Order failed, please try again")
                            }
                        })
                })
        } else {
            alert("order cancelled")
        }
    }

    function addToOrderArray(item: item, index?: number, qtyChange?: boolean) {
        console.log(item)
        let tempArray = orderAndPrice.orderArray
        if(qtyChange){
            tempArray.splice(index, 1, item)
        } else {
            tempArray.push(item)
            if (index >= 0) supplierAndItems.supplierItems.get(supplierAndItems.supplier).splice(index, 1)
        }
        let totalPrice = totalPriceHandler(item, "+")
        setOrderAndPrice({orderArray: tempArray, totalPrice: parseFloat(totalPrice)})
    }

    function removeFromOrderArray(item: item, index: number) {
        let tempArray = orderAndPrice.orderArray
        tempArray.splice(index, 1)
        let totalPrice = totalPriceHandler(item, "-")
        supplierAndItems.supplierItems.get(supplierAndItems.supplier).push(item)
        setOrderAndPrice({orderArray: tempArray, totalPrice: parseFloat(totalPrice)})
    }

    function totalPriceHandler(item, operator) {
        let quantity = parseFloat(item.qty ? item.qty : item.qty = 1) * parseFloat(item.tradePack ? item.tradePack : item.qty = 1)
        let price = quantity * item.PURCHASEPRICE
        if (operator === "+") return (orderAndPrice.totalPrice + price).toFixed(2)
        if (operator === "-") return (orderAndPrice.totalPrice - price).toFixed(2)
    }

    function loadListHandler(listFilter: string) {
        setLoadList(listFilter)
    }

    return (
        <div className="shop-orders-parent">
            <SideBar
                loadContent={sideBarContent}
                supplierFilter={(x: string) => {
                    newOrderHandler(x, true)
                }}
                title={"Suppliers"}
            />
            <div className="shop-orders-table-parent">
                <OrderList
                    removeFromOrderArray={(item, index) => removeFromOrderArray(item, index)}
                    addToOrderArray={(item,index?,qtyChange?) => addToOrderArray(item, index, qtyChange)}
                    supplier={supplierAndItems.supplier}
                    orderAndPrice={orderAndPrice}
                    loadListHandler={(x: string) => loadListHandler(x)}
                    saveOrder={saveOrder}
                />
                <StockList
                    addToOrderArray={(item, index) => addToOrderArray(item, index)}
                    supplier={supplierAndItems.supplier}
                    loadList={loadList}
                    supplierItems={supplierAndItems.supplierItems}
                />
            </div>
        </div>
    );

}