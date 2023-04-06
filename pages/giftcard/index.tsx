import Menu from "../../components/menu/menu";
import OneColumn from "../../components/layouts/one-column";
import GiftCardLayOut from "./gift-card-layout";
import { appWrapper } from "../../store/store";
import { getGiftCards } from "../../server-modules/shop/shop";
import { setGiftCards } from "../../store/gift-card-slice";

export default function giftCard() {
  return (
    <OneColumn>
      <Menu>
        <span>
          <p>Giftcards</p>
        </span>
      </Menu>
      <GiftCardLayOut />
    </OneColumn>
  );
}
export const getServerSideProps = appWrapper.getServerSideProps(
  (store) => async () => {
    const giftcards = await getGiftCards();
    store.dispatch(setGiftCards(giftcards));
    return { props: {} };
  }
);
