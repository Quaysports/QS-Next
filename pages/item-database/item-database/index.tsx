import styles from "../item-database.module.css";
import DatabaseSearchBar from "../../../components/database-search-bar/DatabaseSearch";

export default function ItemDatabaseLandingPage() {

    const item = "svc"

    function searchOptions(options) {

    }

    function buildSideMenu() {
        if (item) {
            return [
                    <div className={styles["side-bar"]}>
                        <span className={styles["side-bar-cell"]}>
                            <div>
                                <button>Barcode</button>
                            </div>
                            <div>
                                <button>Tag</button>
                            </div>
                            <div>
                                <button>Shelf Tag</button>
                            </div>
                            <div style={{margin: "20px 0"}}>
                                <button style={{height: "35px"}}>Upload to Linnworks</button>
                            </div>
                            <div>
                                <button>Jarilo Template</button>
                            </div>
                            <div>
                                <button>Import Details</button>
                            </div>
                            <div>
                                <button>Branded Labels</button>
                            </div>
                        </span>
                    </div>
            ]
        }
    }

    return (
        <>
            <div className={styles["search-bar-container"]}><DatabaseSearchBar handler={x => searchOptions(x)}/></div>
            {item ? buildSideMenu() : null}
            {item ? <div className={styles["table"]}></div> : null}
        </>
    )
}