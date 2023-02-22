import {FormEvent, useState} from "react";
import {toCurrencyInput} from "../../../components/margin-calculator-utils/utils";

export default function TillTransactionCSVPopup() {

    const currentDate = new Date().toISOString().slice(0, 7)
    console.log()

    const [from, setFrom] = useState(currentDate)
    const [to, setTo] = useState(currentDate)

    function handler(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        event.stopPropagation()

        const formData = new FormData(event.currentTarget)
        const opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                start: formatDate(formData.get("from") as string | null, "start"),
                end: formatDate(formData.get("to") as string | null, "end")
            })
        }

        fetch("/api/reports/get-till-transaction-csv-data", opts)
            .then(res => res.json())
            .then(json => {

                let map:Map<string, { total: number, card: number, cash: number }> = new Map()

                const vatCalc = (total: number) => (((total / 100) / 120) * 20).toFixed(2)

                for (let v of json) {
                    const {date, amount, type} = v.transaction
                    if (!date) continue;

                    const id = new Date(Number(date)).toLocaleDateString("en-GB")
                    if(!map.has(id)) map.set(id, {total: 0, card: 0, cash: 0})

                    map.get(id)!.total += amount
                    type === "CASH"
                        ? map.get(id)!.cash += amount
                        : map.get(id)!.card += amount
                }

                let csvData = "Date, Total, Total VAT, Card, Card VAT, Cash, Cash VAT"
                for (let [k,v] of map) csvData += `\r\n${k}, ${toCurrencyInput(v.total)}, ${vatCalc(v.total)}, ${toCurrencyInput(v.card)}, ${vatCalc(v.card)}, ${toCurrencyInput(v.cash)}, ${vatCalc(v.cash)}`
                let blob = new Blob(['\uFEFF' + csvData], {type: 'text/csv;charset=utf-8;'});
                let url = URL.createObjectURL(blob);
                let link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `till-transactions-${formData.get("from")}-${formData.get("to")}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link); // Required for FF
                link.click();
                document.body.removeChild(link);
            })
    }

    function formatDate(date: string | null, type: "start" | "end") {
        if (!date) return 0
        const [year, month] = date.split("-")
        return type === "start"
            ? new Date(Number(year), Number(month) - 1, 1).getTime()
            : new Date(Number(year), Number(month), 0).getTime()
    }

    return <form onSubmit={handler}>
        <div>
            <label>From:</label>
            <input type={"month"}
                   name={"from"}
                   value={from}
                   required
                   pattern="[0-9]{4}-[0-9]{2}"
                   onChange={e => setFrom(e.target.value)}/>
        </div>
        <div>
            <label>To:</label>
            <input type={"month"}
                   name={"to"}
                   value={to}
                   required
                   pattern="[0-9]{4}-[0-9]{2}"
                   onChange={e => setTo(e.target.value)}/>
        </div>
        <div>
            <button type="submit">Download</button>
        </div>
    </form>
}