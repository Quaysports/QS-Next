import {useRouter} from "next/router";
import UserLandingPage from "./user";
import HomeLandingPage from "./home";
import Menu from "../../components/menu/menu";
import DashboardTabs from "./tabs";
import OneColumn from "../../components/layouts/one-column";

export default function Dashboard() {
    const router = useRouter()

    return (
        <OneColumn>
            <Menu tabs={<DashboardTabs/>}/>
            {router.query.tab === undefined || router.query.tab === "home" ? <HomeLandingPage/> : null}
            {router.query.tab === "user" ? <UserLandingPage/> : null}
        </OneColumn>
    );
}