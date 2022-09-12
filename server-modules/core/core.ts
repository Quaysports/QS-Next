
export const guid = () => {
    function _p8(s:boolean) {
        let p = (Math.random().toString(16) + '000000000').substring(2, 10);
        return s ? '-' + p.substring(0, 4) + '-' + p.substring(4, 8) : p
    }
    return _p8(false) + _p8(true) + _p8(true) + _p8(false)
}

export const findKey = <T>(array, key, id): T | null =>{
    let pos = array.map(v => {return v[key]}).indexOf(id)
    return pos !== -1 ? array[pos] : null
}
