import {Editor} from "@tinymce/tinymce-react";
import {useDispatch, useSelector} from "react-redux";
import styles from "../../item-database.module.css"
import {selectItem, setItemShortDescription} from "../../../../store/item-database/item-database-slice";

export default function ShortDescription() {

    const dispatch = useDispatch()
    const item = useSelector(selectItem)

    return (
        <div className={styles["descriptions-containers"]}>
            <div className={styles["description-titles"]}>Short Description:</div>
            <Editor id={"short-description"} tinymceScriptSrc={"/tinymce/js/tinymce/tinymce.min.js"} initialValue={item.shortDescription} init={
                {
                    inline: false,
                    plugins: ['advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview'],
                    browser_spellcheck: true,
                    menubar: false,
                    toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | charmap | bullist numlist outdent indent | bull',
                    statusbar: false,
                    branding: false,
                    invalid_elements: 'span',
                    width: "auto",
                    height: "200px",
                    skin: "quaysports",
                    content_css: "quaysports",
                    content_style: "body {font-size:10pt}",
                    setup: (editor) => {
                        editor.ui.registry.addButton('bull', {
                            text: 'Add Bullet',
                            onAction: function(){
                                editor.insertContent('• ')
                            }
                        })
                        editor.on("blur", () => {
                            let description = editor.getContent()
                            dispatch(setItemShortDescription(description))
                        })
                    }
                }
            }/>
        </div>
    )
}