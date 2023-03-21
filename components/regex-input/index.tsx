import {FocusEvent, ChangeEvent, useState, useEffect} from "react";

/**
 * @module Regex-Index
 */
/**
 * Array of object with {[key:string]: string} acting as regex dictionary.<br />
 * Regex Dictionary: {@link regexDictionary}
 * @property {Object<string,string>[]} DictionaryEntry - Key as id, property as regex
 */
interface RegexDictionary {
    [key: string]: string;
}

/**
 * @param {string} type - Key of {@link RegexDictionary}.
 * @param {string || number} value - Value to be tested.
 * @param {string} errorMessage - Custom error message.
 * @param {handler} handler - Handler function called on validation pass.
 */
interface Props {
    type: keyof RegexDictionary;
    value: string | number;
    errorMessage: string;
    handler: (result: string) => void
}

/**
 * @property {string} pin - PIN validation exactly four integers
 * @property {string} number - Numeric integers only
 */
const regexDictionary: RegexDictionary = {
    "pin": "^[0-9]{4}$",
    "number": "^\\d+$",
    "barcode": "^[0-9]{12,14}$",
    "money": "^[0-9]{1,}\\.[0-9]{2}$",
    "alphanumeric": "^[a-zA-Z0-9-]*$",
    "decimal": "^\\d+\\.?\\d*$"
}

/**
 * Regex input component to simplify regex validation. Add any new regex searches to the Dictionary and access via their key. <br />
 * Regex Dictionary: {@link regexDictionary}
 */
export default function RegexInput({type, value, errorMessage, handler}: Props) {

    let valid = false
    if(type === "money" && typeof value === "number") value = value.toFixed(2)

    const [regexValue, setRegexValue] = useState<string | number>(value)

    useEffect(()=>{
        setRegexValue(value)
    },[value])
    const validateInput = (e:FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>) => {
        if (e.target.validity.patternMismatch) {
            valid = false
            e.target.style.borderColor = "var(--secondary-color)"
            e.target.setCustomValidity(errorMessage)
            e.target.reportValidity()
        } else {
            e.target.style.borderColor = "";
            e.target.setCustomValidity("")
            valid = true;
        }
    }

    return (
        <>
            <input
                pattern={regexDictionary[type]}
                value={regexValue}
                onChange={(e)=>{
                    setRegexValue(e.target.value)
                }}
                onBlur={(e) => {
                    validateInput(e)
                    if (valid) handler(e.target.value)
                }}/>
        </>
    )
}
