import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import DashboardTabs from "../../../pages/dashboard/tabs";
import {describe} from "node:test";

describe("Dashboard", ()=>{
    it('redirects to home tab', ()=>{
        render(DashboardTabs())
        const url = window.location
        console.log(url)
    })
})