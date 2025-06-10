import {jariloHtml} from "../../../../components/jarilo-template";
import {schema} from "../../../../types";
import {useSelector} from "react-redux";
import {selectItem} from "../../../../store/item-database/item-database-slice";

export default function JariloTemplatePopup() {

    const item = useSelector(selectItem)
    async function copyJariloTemplate(item:schema.Item){
        let template = jariloHtml(item.description, `${item.images.main.publicFilename}`, item.webTitle)
        let textInput = document.createElement('textarea')
        textInput.value = template
        document.body.appendChild(textInput)
        textInput.select()
        textInput.setSelectionRange(0, 99999)
        document.execCommand('copy')
        document.body.removeChild(textInput)
    }

    return (
        <div>
            <div>
                <iframe width={"1200"} height={"600"} sandbox={'allow-same-origin'}
                        srcDoc={jariloHtml(item.description, item.images.main.publicFilename || item.images.main.filename, item.webTitle)}/>
            </div>
            <button onClick={() => copyJariloTemplate(item)}>Copy Jarilo HTML</button>
        </div>
    )
}