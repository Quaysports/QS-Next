import {Permissions} from "../users/user";

export const getHtml = (permissions:Permissions)=>{
    return htmlStart + htmlScriptContent(permissions) + htmlEnd
}

const htmlScriptContent = (permissions:Permissions)=>{
    let modules = ""
    for(let permission in permissions){
        if(!permissions[permission as keyof Permissions].auth) continue;
        if(permission === "users"){
            modules += `\nimport { createUsers } from './src/js/ui/dashboard/dashboard-users.js' \ntab.createTab('Users', createUsers)\n`
        }
        if(permission === "orderSearch"){
            modules += `\nimport { createOrderSearch } from './src/js/ui/dashboard/dashboard-orders-search.js' \ntab.createTab('Order Search', createOrderSearch)\n`
        }
        if(permission === "priceUpdates"){
            modules += `\nimport { createPriceUpdate } from "./src/js/ui/dashboard/dashboard-price-update.js" \ntab.createTab('Price Updates', createPriceUpdate)\n`
        }
        if(permission === "shop"){
            modules += `\nimport { createShop } from './src/js/ui/dashboard/dashboard-shop.js' \ntab.createTab('Shop', createShop)\n`
        }
        if(permission === "online"){
            modules += `\nimport { createOnline } from './src/js/ui/dashboard/dashboard-online.js' \ntab.createTab('Online', createOnline)\n`
        }
        if(permission === "rotas"){
            modules += `\nimport { createPublishedRotas } from './src/js/ui/dashboard/dashboard-published-rotas.js' \ntab.createTab('Rotas', createPublishedRotas)\n`
        }
        if(permission === "holidays"){
            modules += `\nimport { createHolidays } from "./src/js/ui/dashboard/dashboard-holidays.js" \ntab.createTab('Holidays', createHolidays)\n`
        }
    }

    return modules
}

const htmlStart = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Item DB Dashboard</title>
    <link rel="stylesheet" type="text/css" href="src/css/Core.css">
    <link rel="stylesheet" type="text/css" href="src/css/Dashboard.css">
    <link rel="stylesheet" type="text/css" href="src/css/ui/tab.css">
</head>

<body>
    <div id='grid'>
        <div id="grid-header">
        </div>
        <div id="grid-main">
            <div id="main" class="main">
            </div>
        </div>
    </div>
    <div id="tooltip"></div>
</body>
<script type="module">

import { tab } from './src/js/ui/tab.js'
import { dashboardTab } from "./src/js/ui/menus/home-menu.js";
dashboardTab()
    
import { createHome } from './src/js/ui/dashboard/dashboard-home.js'
tab.createTab('Home', createHome, true)`

const htmlEnd = `
</script>
</html>`