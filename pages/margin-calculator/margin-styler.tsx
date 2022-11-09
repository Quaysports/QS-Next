export default function styler(type:string, value:number){
    if(type === "+-"){
        return value > 0 ? "lightgreen" : value < 0 ? "#ff7878" : "lightgray"
    }
}