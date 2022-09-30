interface RegexDictionary {
    [key: string]: string;
}

interface props {
    type: keyof RegexDictionary;
    value: string | number;
    errorMessage: string;
    handler: (x: string) => void
}

const regexDictionary: RegexDictionary = {
    "pin": "^[0-9]{4}$",
    "number": "^\\d+$"
}

export default function RegexInput({type, value, errorMessage, handler}: props) {

    let valid = false

    const validateInput = (e) => {
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
                defaultValue={value}
                onChange={(e) => validateInput(e)}
                onBlur={(e) => {
                    if (valid) handler(e.target.value)
                }}/>
        </>
    )
}