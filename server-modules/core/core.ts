
export const guid = () => {
    function _p8(s:boolean) {
        let p = (Math.random().toString(16) + '000000000').substring(2, 10);
        return s ? '-' + p.substring(0, 4) + '-' + p.substring(4, 8) : p
    }
    return _p8(false) + _p8(true) + _p8(true) + _p8(false)
}

export const findKey = <T>(array: T[], key: keyof T, id:any): T | null =>{
    console.log("find key")
    let pos = array.map(v => {return v[key]}).indexOf(id)
    console.log(pos)
    return pos !== -1 ? array[pos] : null
}

export const binarySearch = function <T>(arr:T[], key:keyof T, x:T[keyof T], start = 0, end = arr.length):T | null {

    if (start > end || arr.length === 0) return null;

    let mid = Math.floor((start + end) / 2);
    if (arr[mid][key] === x) return arr[mid];

    return arr[mid][key] > x
        ? binarySearch(arr, key, x, start, mid - 1)
        : binarySearch(arr, key, x, mid + 1, end);
}