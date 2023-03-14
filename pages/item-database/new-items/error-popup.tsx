
type Props = {
    errors: string []
}
export default function ErrorPopup({errors}:Props){
    if(!errors) return <></>
    return (
        <div>
            The following errors occurred;
            <ul>
            {errors.map((error) => {
                return <li>{error}</li>
            })}
            </ul>
        </div>
    )
}