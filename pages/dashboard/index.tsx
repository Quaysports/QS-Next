import {useRouter} from "next/router";
import UserLandingPage from "./user";
import HomeLandingPage from "./home";
import Menu from "../../components/menu/menu";
import DashboardTabs from "./tabs";

export default function Dashboard() {
    const router = useRouter()

    return (
        <>
            <Menu tabs={<DashboardTabs/>}/>
            {router.query.tab === undefined || router.query.tab === "home" ? <HomeLandingPage/> : null}
            {router.query.tab === "user" ? <UserLandingPage/> : null}
        </>
    );
}