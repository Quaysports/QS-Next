import styles from "./sales-report.module.css";
import { FormEvent, useEffect, useState } from "react";
import { toCurrencyInput } from "../../../components/utils/utils";

interface Props {
  isBait?: boolean;
}
export default function DayToDayTillTransactionCSVPopup({ isBait }: Props) {
  const currentDate = new Date().toISOString().slice(0, 7);

  const [from, setFrom] = useState(currentDate);
  const [to, setTo] = useState(currentDate);

  const defaultBaits = [
    "TROUT-X4",
    "FROZEN-CRAB",
    "RIO-CART05",
    "RIO-CART09",
    "RIO-CART01",
    "RIOT-DIRTY-SQUID",
    "RIOT-JOEY",
    "RIOT-ANCHOVIES",
    "RIOT-SARDINE",
    "RIO-SESHSQUID",
    "LARGE-MACKEREL",
    "MACKEREL",
    "JOEY/MINI MACKEREL",
    "MACKEREL-FILLET",
    "UNWASHED-LOLIGO",
    "CALAMARI-SQUID-1lb",
    "HERRING-BAIT",
    "AMMO-JOEYS",
    "AMMO-MAC7",
    "AMMO-LMACK2",
    "AMMO-SQDTL",
    "AMMO-MMACK3",
    "AMMO-CRSH01",
    "FROZEN-CRAB",
    "LIVE-CRAB-X5",
    "DVB-EELSECTIONS-2-3",
    "PEELER-CRAB",
    "PRAWNS",
    "BLACK-LUG",
    "BLUEYS",
    "RIOT-BLUEYS",
    "CUTTLEFISH",
    "CRSH01",
    "HALFBEAK",
    "HERM-CRABSX5",
    "QSP-A-SQUID",
    "RAZOR-FISH",
    "RIO-CART07",
    "RIO-CART04",
    "RIO-CART08",
    "SANDEEL-EXTRA-LARGE",
    "SANDEEL-LARGE",
    "SANDEEL-MEDIUM",
    "SANDEEL-SMALL",
  ];

  const defaultBaitsSorted = [...defaultBaits].sort();
  const [baits, setBaits] = useState(isBait ? defaultBaitsSorted : []);

  function handler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData(event.currentTarget);
    const start = formatDate(formData.get("from") as string | null, "start");
    const end = formatDate(formData.get("to") as string | null, "end");

    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start,
        end,
        isBait: isBait || false,
        baitList: baits ? baits : undefined,
      }),
    };

    const apiEndpoint = "/api/reports/get-till-transaction-csv-data";

    fetch(apiEndpoint, opts)
      .then((res) => res.json())
      .then((json) => {
        let map: Map<
          string,
          {
            grandTotal: number;
            transactionType: string;
            transactionAmount: number;
            transactionCash: number;
            transactionChange: number;
            transactionFlatDiscount: number;
            transactionGiftCard: number;
            transactionDate: string;
            itemTotals: any;
            sku: string;
          }
        > = new Map();

        for (let v of json) {
          const {
            date,
            amount,
            cash,
            type,
            change,
            flatDiscount,
            giftCard,
          } = v.transaction;
          const shopID = v.id;
          const grandTotal = v.grandTotal;

          const transactionDate = new Date(Number(date)).toLocaleDateString(
            "en-GB"
          );
          if (!map.has(shopID))
            map.set(shopID, {
              grandTotal: 0,
              transactionType: "",
              transactionAmount: 0,
              transactionCash: 0,
              transactionChange: 0,
              transactionFlatDiscount: 0,
              transactionGiftCard: 0,
              transactionDate: "",
              itemTotals: [],
              sku: "",
            });

          map.get(shopID)!.grandTotal += grandTotal;
          map.get(shopID)!.transactionType += type;
          map.get(shopID)!.transactionAmount += amount;
          map.get(shopID)!.transactionCash += cash;
          map.get(shopID)!.transactionChange += change;
          map.get(shopID)!.transactionFlatDiscount += flatDiscount;
          map.get(shopID)!.transactionGiftCard += giftCard;
          map.get(shopID)!.transactionDate += transactionDate;

          for (let item of v.items) {
            map.get(shopID)!.itemTotals.push(`${item.total}`);
            map.get(shopID)!.sku += `${item.SKU}, `;
          }

          let indices = [];
          for (let v of json) {
            for (let index = 0; index < v.items.length; index++) {
              indices.push(index);
            }
          }
          const maxIndex = indices.reduce((a, b) => Math.max(a, b));
          const firsIndex = map.get(shopID)!.itemTotals.length - 1;
          for (let index = firsIndex; index < maxIndex; index++) {
            map.get(shopID)!.itemTotals.push("-");
          }
        }

        let csvData =
          "id, grandTotal, transaction.type, transaction.amount, transaction.cash, transaction.change, transaction.flatDiscount, transaction.giftCard, transaction.date, ";

        let indices = [];
        for (let v of json) {
          for (let index = 0; index < v.items.length; index++) {
            indices.push(index);
          }
        }
        let maxIndex = 0;
        if (indices.length > 0)
          maxIndex = indices.reduce((a, b) => Math.max(a, b));
        for (let index = 0; index <= maxIndex; index++) {
          csvData += `items[${index}].total, `;
        }
        for (let index = 0; index <= maxIndex; index++) {
          csvData += `items[${index}].SKU, `;
        }

        for (let [k, v] of map) {
          csvData += `\r\n${k}, £${toCurrencyInput(v.grandTotal)}, ${
            v.transactionType
          }, £${toCurrencyInput(v.transactionAmount)}, £${toCurrencyInput(
            v.transactionCash
          )}, £${toCurrencyInput(v.transactionChange)}, £${toCurrencyInput(
            v.transactionFlatDiscount
          )}, £${toCurrencyInput(v.transactionGiftCard)}, ${
            v.transactionDate
          }, `;

          v.itemTotals.forEach((itemTotal: string) => {
            csvData += `£${toCurrencyInput(+itemTotal)}, `;
          });

          let skuArray = v.sku.split(" ");
          skuArray.forEach((sku) => (csvData += `${sku}`));
        }

        let blob = new Blob(["\uFEFF" + csvData], {
          type: "text/csv;charset=utf-8;",
        });
        let url = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.setAttribute("href", url);
        const dateFrom = formData.get("from")?.toString().split("-") ?? [
          "",
          "",
        ];
        const dateTo = formData.get("to")?.toString().split("-") ?? ["", ""];
        const fileName = `-till-transactions-from-${dateFrom[1]}-${dateFrom[0]}-to-${dateTo[1]}-${dateTo[0]}.csv`
        link.setAttribute(
          "download",
          isBait ? `baits${fileName}` : `all${fileName}`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
      });
  }

  function formatDate(date: string | null, type: "start" | "end") {
    if (!date) return 0;
    const [year, month] = date.split("-");
    return type === "start"
      ? new Date(Number(year), Number(month) - 1, 1).getTime()
      : new Date(Number(year), Number(month), 1).getTime();
  }

  return (
    <form className={styles["csv-popup-table"]} onSubmit={handler}>
      <div className={styles["csv-popup-row"]}>
        <label>From:</label>
        <input
          type={"month"}
          name={"from"}
          value={from}
          required
          pattern="[0-9]{4}-[0-9]{2}"
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>
      <div className={styles["csv-popup-row"]}>
        <label>To:</label>
        <input
          type={"month"}
          name={"to"}
          value={to}
          required
          pattern="[0-9]{4}-[0-9]{2}"
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      {isBait && (
        <div className={styles["csv-popup-row"]}>
          <label>Bait SKUs:</label>
          <textarea
            name={"baits"}
            value={baits.join("\n")}
            required
            rows={15}
            cols={30}
            onChange={(e) =>
              setBaits(
                e.target.value
                  .split("\n")
                  .map((item) => item.trim())
              )
            }
          />
        </div>
      )}
      <div>
        <button type="submit">Download</button>
      </div>
    </form>
  );
}
