

export default function ShippingInfo(){
    return(
        <aside className="panel panel-information">
            <input id="tab2" type="checkbox"/>
            <label className="panel-heading" htmlFor="tab2">
                <h3>Shipping</h3> <i className="fa fa-plus"></i>
            </label>
            <div className="panel-body">
                <p>All items bought &amp; paid for before 4.00pm will be dispatched the same day.</p>
                <p>All items are stocked &amp; shipped from our UK store twice daily at
                    14:30 &amp; 16:30.
                    Your order will be dispatch at the soonest available collection.</p>
                <p>Delivery time on most items is between 1 - 4 days depending on the postal service
                    stated
                    in the description and the shipping service selected.</p>
                <p>All items use tracking which will automatically be uploaded to your order details
                    once
                    dispatched.</p>
                <p><strong></strong></p>
                <p>Free postage &amp; packaging applies to UK only.</p>
            </div>
        </aside>
    )
}