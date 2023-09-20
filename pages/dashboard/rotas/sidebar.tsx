import SidebarLayout from "../../../components/layouts/sidebar-layout";
import {createTemplate, selectTemplatesNames} from "../../../store/dashboard/rotas-slice";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import CreateRota from "./create";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import SidebarButton from "../../../components/layouts/sidebar-button";
import SidebarSelect from "../../../components/layouts/sidebar-select";
import SplitSidebarButton from "./split-sidebar-button";
import SidebarBreak from "../../../components/layouts/sidebar-break";
import PublishRota from "./publish";

export default function Sidebar() {

    const dispatch = useDispatch()
    const router = useRouter()
    console.log(router.query)
    const templates = useSelector(selectTemplatesNames)

    function createNewRota() {
        dispatch(createTemplate())
        dispatchNotification({type: "popup", title: "New Template", content: <CreateRota/>})
    }

    function publishBlankRota() {
        dispatch(createTemplate())
        dispatchNotification({type: "popup", title: "Publish Rota", content: <PublishRota/>})
    }

    let templateButtons = []
    for (let template of templates) {
        templateButtons.push(
            <SplitSidebarButton key={template} text={template}/>)
    }

    return (
        <SidebarLayout>
            <SidebarSelect onChange={e => router.push(
                {pathname: router.pathname, query: {...router.query, location: e.target.value}}
            )} value={router.query.location as string | undefined}>
                <option value={"online"}>Online</option>
                <option value={"shop"}>Shop</option>
                <option value={"shared"}>Shared</option>
            </SidebarSelect>
            <SidebarButton onClick={createNewRota}>Create Template</SidebarButton>
            <SidebarBreak>Templates</SidebarBreak>
            <SidebarButton onClick={publishBlankRota}>Blank</SidebarButton>
            {templateButtons}
        </SidebarLayout>
    )
}