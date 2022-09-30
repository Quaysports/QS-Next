export default function CSVButton({fileName = (new Date()).toString(), objectArray}){

    function createCSV(){
        let str = ""
        if(!objectArray || objectArray.length === 0) return str

        for(const title of Object.keys(objectArray[0])) str += `${title},`
        str += "\n"

        for(const object of objectArray){
            for(const value of Object.values(object)) str += `${value},`
            str += "\n"
        }

        console.log(str)
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
        <button onClick={createCSV}>Download CSV</button>
    )
}