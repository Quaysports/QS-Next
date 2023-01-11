import ShelfTag from "./item-database/shelf-tag";
import {useRouter} from "next/router";
import Tag from "./item-database/tag";
import CreateBarcode from "./item-database/barcode";
import BrandedLabel from "./item-database/branded-label";
import PrintRotaRows from "./rotas/print-rows";
import PrintRotaGrid from "./rotas/print-grid";

export default function PrintWindow(){

    const router = useRouter()

    function getComponent() {
        switch (router.query.app) {
            case("item-database"): {
                switch (router.query.print) {
                    case "barcode": return <CreateBarcode/>
                    case "branded-label": return <BrandedLabel/>
                    case "shelf-tag": return <ShelfTag/>
                    case "tag": return <Tag/>
                }
                break;
            }
            case("rotas"): {
                switch (router.query.print) {
                    case "rows": return <PrintRotaRows/>
                    case "grid": return <PrintRotaGrid/>
                }
            }
        }

        return null
    }

    return <>{getComponent()}</>
}