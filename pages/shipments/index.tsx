import Menu from "../../components/menu/menu";
import {appWrapper} from "../../store/store";
import {getShipment, getItemKeys, getShippingCompanies, getSKUKeys} from "../../server-modules/shipping/shipping";
import {
    setShipments,
    setShipment,
    selectShipment,
    setShippingCompanies,
    setItemKeys,
    setSkuKeys
} from "../../store/shipments-slice";
import ShipmentsTable from "./shipments-table";
import {Shipment} from "../../server-modules/shipping/shipping";
import {useSelector} from "react-redux";
import ShipmentPage from "./shipment";
import OneColumn from "../../components/layouts/one-column";
import ColumnLayout from "../../components/layouts/column-layout";
import ShipmentMenu from "./shipment/shipment-menu";
import ShipmentsMenu from "./shipments-table/shipments-menu";

export default function shipmentsLandingPage(){
    const shipment = useSelector(selectShipment);
    return (
        <OneColumn>
            <Menu>{shipment
                ?<ShipmentMenu/>
                :<ShipmentsMenu/>
            }</Menu>
            <ColumnLayout scroll={true} maxWidth={"100vw"} background={false}>
            {shipment 
              ?<ShipmentPage/>
              :<ShipmentsTable/>
            }
            </ColumnLayout>
        </OneColumn>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async (context) => {
    const id = context.query.id
    const shipments = await getShipment() as Shipment[] | undefined;
    if(shipments) {
        store.dispatch(setShipments(shipments))
    }

    const shippingCompanies = await getShippingCompanies()
    if(shippingCompanies) {
      store.dispatch(setShippingCompanies(shippingCompanies))
    }

    const itemKeys = await getItemKeys()
    if(itemKeys) {
        store.dispatch(setItemKeys(itemKeys))
    }

    const skuKeys = await getSKUKeys()
    if(skuKeys && skuKeys.length > 0) {
        store.dispatch(setSkuKeys(skuKeys))
    }

    if(id){
      const shipment = await getShipment({id:Number(id)}) as Shipment[] | undefined
      if(shipment && shipment.length === 1) store.dispatch(setShipment(shipment[0]))
    }
    

    return {props: {}}
})