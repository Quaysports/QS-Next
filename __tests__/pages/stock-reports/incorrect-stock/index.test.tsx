import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import IncorrectStock from "../../../../pages/stock-reports/incorrect-stock";
import {Provider} from "react-redux";
import {myStore} from "../../../../store/store";

test('loads and displays greeting', async () => {
    // ARRANGE
    const store = myStore()
    const wrapper = render(<Provider store={store}><IncorrectStock/></Provider>)
    // ASSERT
    expect(await wrapper.getByTestId("stock")).toHaveTextContent('Stock')
})
