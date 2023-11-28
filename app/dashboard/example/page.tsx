import '@heroicons/react/24/outline'

export default function ReactIcons() {
    let obj = {
        1:'auto',
        2:'moto',
        3:'bus'
    }
    const iconsVector = Object.values(obj);
    return (
        <>
            <div>React Icons</div>
            <div>
                {iconsVector.map((i) => <div key={i}>{i}</div>)}
            </div>
        </>
    )
}