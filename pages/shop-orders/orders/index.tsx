import SideBar from "../sidebar/sidebar";
import DisplayOnOrder from "./display-on-order";
import DisplayArrived from "./display-arrived";
import OrderInformation from "./order-information";
import ColumnLayout from "../../../components/layouts/column-layout";

/**
 * Orders Tab
 */
export default function Orders() {

    return (
        <>
            <SideBar/>
                <ColumnLayout scroll={true} background={false}>
                <OrderInformation/>
                <DisplayOnOrder/>
                <DisplayArrived/></ColumnLayout>

        </>
    );
}