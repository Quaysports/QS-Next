/**
 * @property {string} fileName - Text used as filename
 * @property {JSON[]} objectArray - Json object array
 */
interface Props {
    fileName?:string,
    objectArray: { [key:string]:string | number }[]
    label?:string
}

/**
 * Button component that takes an array of json objects, converts to csv and downloads.
 */
export default function CSVButton({fileName = (new Date()).toString(), objectArray = [], label = "Download CSV"}:Props){

    function createCSV(){
        let str = ""
        if(!objectArray || objectArray.length === 0) return str

        for(const title of Object.keys(objectArray[0])) str += `${title},`
        str += "\n"

        for(const object of objectArray){
            for(const value of Object.values(object)) str += `${value},`
            str += "\n"
        }

        let blob = new Blob([str], {
            type: 'application/html;charset=utf-8;'
        });
        let downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);
        downloadLink.setAttribute('download', `${fileName}.csv`);
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.click();
    }

    return(
        <button onClick={createCSV}>{label}</button>
    )
}