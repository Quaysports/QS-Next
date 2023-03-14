import TopMenu from "./top-menu";
import ProductContent from "./product-content";
import BannerSlider from "./banner-slider";
import MobileBannerSlider from "./mobile-banner-slider";
import CategoryImages from "./category-images";
import AboutUs from "./about-us";
import ShippingInfo from "./shipping-info";
import ContactUs from "./contact-us";
import FeedbackInfo from "./feedback-info";
import BottomBanner from "./bottom-banner";
import MobileBottomBanner from "./mobile-bottom-banner";
import UniqueSellingPoints from "./unique-selling-points";
import Footer from "./footer";
import {renderToStaticMarkup} from "react-dom/server";
import React from "react";

export function jariloHtml(DESC:string, IMAGE:string, TITLE:string) {

    return header + renderToStaticMarkup(<JariloTemplate DESC={DESC} IMAGE={IMAGE} TITLE={TITLE}/>) + footer
}

const header = `<!DOCTYPE html>
    <html lang="en">

        <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- jarilo -->
        <!-- link rel="stylesheet" href="https://jarilo.co.uk/ebaystores21/TemplateV4-NEW/main.css" / -->
        <link rel="stylesheet" href="https://jarilo.co.uk/ebaystores21/quaysports/listing/main.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" />
        <!-- fonts -->
        <!-- link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" type="text/css" -->
        <link href="https://fonts.googleapis.com/css?family=Poppins:400,600&display=swap" rel="stylesheet">
        <title></title>
    <title></title>
</head>
    <style>
        #description-box .shortdesc .panel-body * {
        font-weight: revert;
    }
</style>
<body>`

const footer = `</body></html>`


function JariloTemplate({IMAGE, DESC, TITLE}:{IMAGE:string, DESC:string, TITLE:string}) {

    return (<>
        <input id="mobile-menu-activator" type="checkbox"/>
        <div id="mobile-menu">
            <div className="box has-background-dark is-radiusless">
                <aside className="menu">
                    <p className="menu-label">Pages</p>
                    <ul className="menu-list">
                        <li><a href="https://www.ebaystores.co.uk/Quay-Sports">Visit Store</a></li>
                        <li><a
                            href="https://feedback.ebay.co.uk/ws/eBayISAPI.dll?ViewFeedback2&userid=quaysports&ftab=AllFeedback&myworld=true&rt=nc&_trksid=p2545226.m2531.l4585">View
                            Feedback</a></li>
                        <li><a
                            href="https://contact.ebay.co.uk/ws/eBayISAPI.dll?FindAnswers&requested=quaysports&_trksid=p2545226.m2531.l4583&rt=nc">Get
                            In touch</a></li>
                        <br/>
                            <li><a
                                href="https://www.ebaystores.co.uk/str/Quay-Sports/PIKE-PREDATOR-/_i.html?_fsub=18531202017&_sid=1053374777&_trksid=p4634.c0.m322">Pike
                                &amp; Predator</a></li>
                            <li><a
                                href="https://www.ebaystores.co.uk/str/Quay-Sports/JUNIOR-FISHING-/_i.html?_fsub=18451502017&_sid=1053374777&_trksid=p4634.c0.m322">Junior
                                Fishing</a></li>
                            <li><a
                                href="https://www.ebaystores.co.uk/str/Quay-Sports/TACKLE-SETS-/_i.html?_fsub=18449332017&_sid=1053374777&_trksid=p4634.c0.m322">Tackle
                                Sets</a></li>
                            <li><a
                                href="https://www.ebaystores.co.uk/str/Quay-Sports/TACKLE-BOXES-/_i.html?_fsub=18531354017&_sid=1053374777&_trksid=p4634.c0.m322">Tackle
                                Boxes</a></li>
                            <li><a
                                href="https://www.ebaystores.co.uk/str/Quay-Sports/NETS-/_i.html?_fsub=18449334017&_sid=1053374777&_trksid=p4634.c0.m322">Nets</a>
                            </li>
                            <li><a
                                href="https://www.ebaystores.co.uk/str/Quay-Sports/LUGGAGE-/_i.html?_fsub=18449335017&_sid=1053374777&_trksid=p4634.c0.m322">Luggage</a>
                            </li>
                            <li><a
                                href="https://www.ebaystores.co.uk/str/Quay-Sports/CAMPING-OUTDOORS-/_i.html?_fsub=3913628017&_sid=1053374777&_trksid=p4634.c0.m322">Camping
                                &amp; Outdoors</a></li>
                            <li><a
                                href="https://www.ebaystores.co.uk/str/Quay-Sports/OTHER-SPORTS-/_i.html?_fsub=18448233017&_sid=1053374777&_trksid=p4634.c0.m322">Other
                                Sports</a></li>
                            <li><a
                                href="https://www.ebaystores.co.uk/str/Quay-Sports/SHOOTING-HUNTING-/_i.html?_fsub=18449562017&_sid=1053374777&_trksid=p4634.c0.m322">Shooting
                                &amp; Hunting</a></li>
                            <li><a
                                href="https://www.ebaystores.co.uk/str/Quay-Sports/OTHER-ITEMS-/_i.html?_fsub=18523044017&_sid=1053374777&_trksid=p4634.c0.m322">Other
                                Items</a></li>
                            <li><a
                                href="https://www.ebaystores.co.uk/str/Quay-Sports/ROD-RESTS-BANK-STICKS-/_i.html?_fsub=23987530017&_sid=1053374777&_trksid=p4634.c0.m322">Rod
                                Rests &amp; Bank Sticks</a></li>
                    </ul>
                </aside>
            </div>
        </div>
        <div id="topbar-mobile" className="section tight is-primary">
            <div className="container">
                <div className="columns is-mobile">
                    <div className="column">
                        <label htmlFor="mobile-menu-activator">
                            <div className="mobilebttn">
                                <i className="fa fa-bars fa-mobile-bttn"></i>
                            </div>
                        </label>
                    </div>
                    <div className="column mob-bttn-alt">
                        <a href="https://www.ebaystores.co.uk/Quay-Sports">
                            <div className="mobilebttn">
                                <i className="fa fa-home fa-mobile-bttn"></i>
                            </div>
                        </a>
                    </div>
                    <div className="column">
                        <a
                            href="https://contact.ebay.co.uk/ws/eBayISAPI.dll?FindAnswers&requested=quaysports&_trksid=p2545226.m2531.l4583&rt=nc">
                            <div className="mobilebttn">
                                <i className="fa fa-envelope fa-mobile-bttn"></i>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div id="listing">
            <div id="header" className="section">
                <div className="container">
                    <div className="columns is-desktop">
                        <div className="column">
                            <div className="logowrap">
                                <img className="logoimg"
                                     src="https://jarilo.co.uk/ebaystores21/quaysports/listing/images/logo.png"
                                     alt="quaysports-logo"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="bodywrapper">
                <div id="navbar">
                    <div className="container">
                        <nav className="navbar" role="navigation" aria-label="main navigation">
                            <div className="navbar-brand">
                                <a role="button" className="navbar-burger burger" aria-label="menu"
                                   aria-expanded="false"
                                   data-target="navbarBasicExample">
                                    <span aria-hidden="true"></span>
                                    <span aria-hidden="true"></span>
                                    <span aria-hidden="true"></span>
                                </a>
                            </div>
                            <TopMenu/>
                        </nav>
                    </div>
                </div>
                <ProductContent IMAGE={IMAGE} DESC={DESC} TITLE={TITLE}/>
                <BannerSlider/>
                <MobileBannerSlider/>
                <CategoryImages/>
                <div id="extra-information" className="section">
                    <div className="container">
                        <AboutUs/>
                        <ShippingInfo/>
                        <ContactUs/>
                        <FeedbackInfo/>
                    </div>
                </div>
                <BottomBanner/>
                <MobileBottomBanner/>
                <UniqueSellingPoints/>
            </div>
            <Footer/>
        </div>
    </>
)
}