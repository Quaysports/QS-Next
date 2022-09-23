import styles from "../item-database.module.css";
import SearchBar from "../../../components/search-bar";

export default function ItemDatabaseLandingPage(){

    const item = "svc"

    function searchOptions(options) {

    }

    function buildSideMenu(){
        if(item){
            return [
                <div className={styles["sideBar"]}>
                    <div>
                        <div><button>Barcode</button></div>
                        <div><button>Tag</button></div>
                        <div><button>Shelf Tag</button></div>
                        <div style={{margin: "20px 0"}}><button>Upload to Linnworks</button></div>
                        <div><button>Jarilo Template</button></div>
                        <div><button>Import Details</button></div>
                        <div><button>Branded Labels</button></div>
                    </div>
                </div>
            ]
        }
    }

    return (
        <>
            <div className={styles["search-bar-container"]}><SearchBar itemIndex={x => searchOptions(x)}
                                                                        searchableArray={[]} EAN={false}/></div>
                {buildSideMenu()}
                <div className={styles["table"]}></div>
        </>
    )
}