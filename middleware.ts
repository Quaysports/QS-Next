import {getToken} from 'next-auth/jwt';
import {NextRequest, NextResponse} from 'next/server';
import {User} from "./server-modules/users/user";

export async function middleware(request: NextRequest) {

    function rootRedirect() {
        return NextResponse.redirect(new URL('/', request.url))
    }

    const user = await getToken({req: request, secret: process.env.JWT_SECRET}) as unknown as User

    if (!user) return NextResponse.redirect(new URL('/login?redirect=http://192.168.1.200:3000' + request.nextUrl.pathname + request.nextUrl.search, request.url))
    switch (request.nextUrl.pathname+ request.nextUrl.search) {
        case '/dashboard?tab=users':
            return user.permissions.users?.auth ? null : rootRedirect();
        case '/dashboard?tab=orders':
            return user.permissions.orderSearch?.auth ? null : rootRedirect();
        case '/dashboard?tab=price':
            return user.permissions.priceUpdates?.auth ? null : rootRedirect();
        case '/dashboard?tab=shop':
            return user.permissions.shop?.auth ? null : rootRedirect();
        case '/dashboard?tab=bait':
            return user.permissions.baitOrdering?.auth ? null : rootRedirect();
        case '/dashboard?tab=online':
            return user.permissions.online?.auth ? null : rootRedirect();
        case '/dashboard?tab=rotas':
            return user.permissions.rotas?.auth ? null : rootRedirect();
        case '/dashboard?tab=holidays':
            return user.permissions.holidays?.auth ? null : rootRedirect();
        case '/item-database':
            return user.permissions.itemDatabase?.auth ? null : rootRedirect();
        case '/shop-orders':
            return user.permissions.shopOrders?.auth ? null : rootRedirect();
        case '/shop-tills':
            return user.permissions.shopTills?.auth ? null : rootRedirect();
        case '/shop-tills?tab=quick-links':
            return user.permissions.shopTillsQuickLinks?.auth ? null : rootRedirect();
        case '/reports':
            return user.permissions.reports?.auth ? null : rootRedirect();
        case '/reports?tab=sales':
            return user.permissions.salesReport?.auth ? null : rootRedirect();
        case '/stock-forecast':
            return user.permissions.stockForecast?.auth ? null : rootRedirect();
        case '/shipments':
            return user.permissions.shipments?.auth ? null : rootRedirect();
        case '/margin-calculator':
            return user.permissions.marginCalculator?.auth ? null : rootRedirect();
        case '/stock-transfer':
            return user.permissions.stockTransfer?.auth ? null : rootRedirect();
        case '/stock-take-list':
            return user.permissions.stockTakeList?.auth ? null : rootRedirect();
        case '/webpages':
            return user.permissions.webpages?.auth ? null : rootRedirect();
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/",
        "/item-database",
        "/dashboard",
        "/shop-orders",
        "/shop-tills",
        "/reports",
        "/item-database",
        "/stock-forecast",
        "/shipments",
        "/margin-calculator",
        "/stock-transfer",
        "/stock-take-list",
        "/webpages"
    ],
};