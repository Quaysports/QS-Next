export default function AboutUs() {

    let openingDate = (new Date()).getFullYear() - 2011

    return (
        <aside className="panel panel-information">
            <input id="tab1" type="checkbox" checked={true}/>
            <label className="panel-heading" htmlFor="tab1">
                <h3>About Us</h3> <i className="fa fa-plus"></i>
            </label>
            <div className="panel-body">
                <p>Quay Sports are a genuine UK based registered company.</p>
                <p>We sell a wide variety of brand-new fishing tackle items at very competitive prices.
                    You
                    can find great value fishing rods, reels and seat boxes along with many more fishing
                    tackle items.</p>
                <p>Our website has a wider selection should you wish to visit it.</p>
                <p>Customer satisfaction is very important to us, and we strive to ensure you receive
                    your
                    items quickly and trouble free.</p>
                <p>We have been trading on eBay for over ${openingDate} years and have a 100% feedback
                    record due to our
                    exceptional customer care.</p>
                <p>You can be confident in your purchase from Quay Sports.</p>
            </div>
        </aside>
    )
}