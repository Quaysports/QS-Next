
export function toDateInputValue(date: Date): string {
    const local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
}

export function getTinyDate(date:Date) {
    const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"]
    function dateSuffix(num:number) {
        if (num === 11 || num === 12 || num === 13) {
            return "th"
        } else {
            switch (num % 10) {
                case (1): return "st"
                case (2): return "nd"
                case (3): return "rd"
                default: return "th"
            }
        }
    }
    const dayOfWeek = days[new Date(date.valueOf()).getDay()]
    const dateDay = (new Date(date.valueOf())).getDate()
    return `${dayOfWeek} ${dateDay}${dateSuffix(dateDay)}`
}

export function getMonday(date:Date) {
    const localDate = new Date(date);
    const day = localDate.getDay() || 7;
    console.log(day)
    if(day !== 1) {
        localDate.setHours(-22 * (day - 1));
        console.log(localDate)
    }
    return localDate.toISOString()
}

export function getWeek(date:Date) {
    const target = new Date(date);
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.getTime();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    const week = 1 + Math.ceil((firstThursday - target.getTime()) / 604800000);

    const monday = getMonday(new Date(date))

    function getDayArray(date:Date) {
        let arr = []
        for (let i = 0; i < 7; i++) {
            arr.push( (new Date(date.getTime())).toISOString() )
            date.setDate(date.getDate() + 1)
        }
        return arr
    }
    const dayArr = getDayArray(new Date(monday))

    return { monday: monday, days: dayArr, week: week }
}