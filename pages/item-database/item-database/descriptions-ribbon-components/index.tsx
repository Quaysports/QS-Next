import {Editor} from "@tinymce/tinymce-react";
import ShortDescription from "./short-description";
import LongDescription from "./long-description";

export default function DescriptionsRibbon(){
    return (
        <>
            <ShortDescription/>
            <LongDescription/>
        </>
    )
}