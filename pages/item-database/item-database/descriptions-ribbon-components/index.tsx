import {Editor} from "@tinymce/tinymce-react";

export default function DescriptionsRibbon(){
    return (
        <>
            <Editor tinymceScriptSrc={"../../../tinymce/js/tinymce/tinymce.min.js"} init={
                {

                    inline: false,
                    fixed_toolbar_container: "this" + '-container',
                    plugins: ['advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'print', 'preview', 'paste'],
                    paste_word_valid_elements: 'b',
                    browser_spellcheck: true,
                    menubar: false,
                    toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | charmap | bullist numlist outdent indent',
                    //forced_root_block: false,
                    statusbar: false,
                    branding: false,
                    invalid_elements: 'span',
                    width: "auto",
                    height: "400px",
                }
            }/>
        </>
    )
}