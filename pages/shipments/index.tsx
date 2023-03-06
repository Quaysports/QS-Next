import Menu from "../../components/menu/menu";
import {appWrapper} from "../../store/store";
import {get} from "../../server-modules/shipping/shipping";
import {setShipments} from "../../store/shipments-slice";
import ShipmentsTable from "./shipments-table";

export default function shipmentsLandingPage(){

    return (
        <div>
            <Menu><div></div></Menu>
            <ShipmentsTable/>
        </div>
    )
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async () => {
    const shipments = await get()
    if(shipments) {
        console.log(shipments)
        store.dispatch(setShipments(shipments))
    }

    return {props: {}}
})
