import SearchBar from "../../../components/search-bar";

export default function SubMenu(){

    function searchOptions(options){

    }
    return(
        <div>
            <span><button>Jarilo Template</button></span>
            <span><button>Import Details</button></span>
            <span><SearchBar itemIndex={x => searchOptions(x)} searchableArray={[]} EAN={false}/></span>
            <span><button>Barcode</button></span>
            <span><button>Tag</button></span>
            <span><button>Shelf Tag</button></span>
            <span><button>Upload Button</button></span>
        </div>
    )
}