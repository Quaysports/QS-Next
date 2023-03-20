import ShelfTag from "./item-database/shelf-tag";
import {useRouter} from "next/router";
import Tag from "./item-database/tag";
import CreateBarcode from "./item-database/barcode";
import BrandedLabel from "./item-database/branded-label";
import PrintRotaRows from "./rotas/print-rows";
import PrintRotaGrid from "./rotas/print-grid";
import PrintShopPickList from "./shop-picklist";
import RodTag from "./item-database/rod-tag";
import PrintStockTransfer from "./stock-transfer";

export default function PrintWindow(){

    const router = useRouter()

    function getComponent() {
        switch (router.query.app) {
            case("item-database"): {
                switch (router.query.print) {
                    case "barcode": return <CreateBarcode/>
                    case "branded-label": return <BrandedLabel/>
                    case "shelf-tag": return <ShelfTag/>
                    case "rod-tag": return <RodTag/>
                    case "tag": return <Tag/>
                }
                break;
            }
            case("rotas"): {
                switch (router.query.print) {
                    case "rows": return <PrintRotaRows/>
                    case "grid": return <PrintRotaGrid/>
                }
                break;
            }
            case("shop-picklist"): {
                return <PrintShopPickList/>
            }
            case("stock-transfer"): {
                return <PrintStockTransfer/>
            }
        }

        return null
    }

    return <>{getComponent()}</>
}