import {Editor} from "@tinymce/tinymce-react";
import styles from "../../item-database.module.css"
import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItemLongDescription} from "../../../../store/item-database/item-database-slice";

export default function LongDescription() {

    const item = useSelector(selectItem)
    const dispatch = useDispatch()

    return (
        <div className={styles["descriptions-containers"]}>
            <div className={styles["description-titles"]}>Long Description:</div>
            <Editor id={"long-description"} tinymceScriptSrc={"/tinymce/js/tinymce/tinymce.min.js"} initialValue={item.description} init={
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
                    height: "400px",
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
                            dispatch(setItemLongDescription(description))
                        })
                    }
                }
            } />
        </div>
    )
}