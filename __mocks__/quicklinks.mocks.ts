import {QuickLinkItem, QuickLinks} from "../server-modules/shop/shop";

export const mockItem:QuickLinkItem = {
    SKU: "HVSB",
    prices: {amazon: 0, ebay: 0, magento: 0, purchase: 0, retail: 0, shop: 1999},
    till: {color: ""},
    title: "Test HVSB"
}
export const mockGetQuickLinks = jest.fn(() => quickLinks)
const quickLinks:QuickLinks[] = [
    {
        _id: '633d87d50d9d1a14a0aad5c9',
        id: 'test 2',
        links: [
            'ESP-CFEFHG002','','','','','','', '',
            'SHM-SN2500FG','','','NET11MHP40RWHSBSRRCAT',
            'SB','','','','','','',''
        ],
        data:[
            {
                SKU: 'ESP-CFEFHG002',
                prices:{
                    amazon: 0, ebay: 0, magento: 0, purchase: 0, retail: 0,
                    shop: 5499
                },
                title: 'ESP Fleece Hoody Olive Green - Large',
                till: {color: "#ffffff"},
            },
            {
                SKU: 'SHM-SN2500FG',
                prices:{
                    amazon: 0, ebay: 0, magento: 0, purchase: 0, retail: 0,
                    shop: 2999
                },
                title: 'SHIMANO Sienna 2500 FG Spinning Reel',
                till: {color: "#d41616"}
            },
            {
                SKU: 'NET11MHP40RWHSBSRRCAT',
                prices:{
                    amazon: 0, ebay: 0, magento: 0, purchase: 0, retail: 0,
                    shop: 4099
                },
                title: "11' Rod, HP40R Reel, R201 Net, Wagglers, Shot, Hooks, Bank stick, RRH, Catapult",
                till: {color: ""}
            },
            {
                SKU: 'SB',
                prices:{
                    amazon: 0, ebay: 0, magento: 0, purchase: 0, retail: 0,
                    shop: 1999
                },
                title: 'Tackle Box, Seat Box, Strap, Pad #',
                till: {color: ""}
            },
        ]
    }
]