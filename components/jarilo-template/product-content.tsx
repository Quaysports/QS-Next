interface Props{
    DESC:string;
    TITLE:string;
    IMAGE:string;
}
export default function ProductContent({IMAGE,DESC, TITLE}: Props){
    return (
        <div id="maininfo" className="section">
            <div className="container">
                <div className="columns is-desktop">
                    <div className="column">
                        <div id="big-image">
                            <div id="slideable-wrapper">
                                <div id="slideable-gallery">
                                    <div className="slideable-grip">
                                        <div className="slideable-item">
                                            <input type="radio" name="slideable" id="slide1"/>
                                            {/*<img src={'https://92.207.0.213/images/' + IMAGE} alt="item-image"/>*/}
                                            <img src={'https://www.bargainsworld.co.uk/jarilo-images/' + IMAGE} alt="item-image"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div id="description-box">
                            <div className="details-big section">
                                <h3 className="title">{TITLE}</h3>
                                <div className="feedback">
                                    <ul>
                                        <li><i className="fa fa-star"></i></li>
                                        <li><i className="fa fa-star"></i></li>
                                        <li><i className="fa fa-star"></i></li>
                                        <li><i className="fa fa-star"></i></li>
                                        <li><i className="fa fa-star"></i></li>
                                        <li className="feedback-link"><a
                                            href="https://feedback.ebay.co.uk/ws/eBayISAPI.dll?ViewFeedback2&userid=quaysports&ftab=AllFeedback&myworld=true&rt=nc&_trksid=p2545226.m2531.l4585">Check
                                            Out Our Feedback</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="shortdesc">
                                <div className="panel-body" dangerouslySetInnerHTML={{__html:DESC}}>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}