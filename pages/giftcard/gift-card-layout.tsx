import styles from "./giftcard.module.css";
import ColumnLayout from "../../components/layouts/column-layout";
import {
  selectActive,
  selectSearchedGiftCard,
  setSearchGiftcards,
} from "../../store/gift-card-slice";
import { useDispatch, useSelector } from "react-redux";
import { SetStateAction, useState } from "react";
import { GiftCardType } from "../../server-modules/shop/shop";

export default function GiftCardLayOut() {
  const [userInput, setUserInput] = useState<string>("");

  const giftCard = useSelector(selectActive);
  const searchGiftCards = useSelector(selectSearchedGiftCard);

  const dispatch = useDispatch();

  let total: number = 0;

  for (let i of giftCard) {
    total += i.amount;
  }

  const handleBackButton: () => void = () => {
    setUserInput("");
  };

  const handleUserInput = (searchValue: string) => {
    setUserInput(searchValue);
    if (searchValue.length > 2) {
      dispatch(setSearchGiftcards(searchValue));
    }
  };
  console.log(giftCard);
  return (
    <ColumnLayout scroll={true}>
      <div className={styles["totalGiftCards"]}>
        <input
          minLength={13}
          placeholder="Search for a giftcard.."
          onChange={(e) => handleUserInput(e.target.value)}
        ></input>

        <button
          onClick={() => {
            handleBackButton();
          }}
        >
          Back
        </button>
        <div className={styles["searchGiftCardContainer"]}></div>
        <h1>Total money on gift cards</h1>
        <h2>£ {(total / 100).toFixed(2)}</h2>

        {userInput ? (
          <div className={styles["giftCardContainer"]}>
            {searchGiftCards.map((data, i) => {
              return (
                <div className={styles["singleGiftCard"]} key={i}>
                  £{data.amount / 100}
                  <div>{data.id}</div>
                </div>
              );
            })}
          </div>
        ) : null}
        {!userInput ? (
          <div className={styles["giftCardContainer"]}>
            {giftCard.map((single: GiftCardType, i: number) => {
              return (
                <div className={styles["singleGiftCard"]} key={i}>
                  £{single.amount / 100}
                  <div>{single.id}</div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </ColumnLayout>
  );
}
