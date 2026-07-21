
interface ButtonProps {
    children : React.ReactNode
    variant? : "primary" | "secondry" | "tertiary"
    onClick? : () => void
    disabled? : boolean
}

const variants = {
        primary : 
        "bg-button text-button-text border border-border hover:bg-button-text hover:text-button cursor-pointer py-2 px-3 uppercase w-full max-w-md lg:max-w-xl",
        secondry :
        "bg-button-text text-button border cursor-pointer uppercase border-border hover:bg-button hover:text-button-text cursor-pointer py-2 px-3",
        tertiary : 
        "border border-border py-2 px-3 uppercase cursor-pointer font-ibm text-gray-4 text-[10.5px]"
}

export function Buttons({
    children,
    variant = "primary",
    onClick,
    disabled
}:
    ButtonProps
){
    return <button
    className={`font-ibm text-center ${variants[variant]}`}
    onClick={onClick}
    disabled={disabled}>
        {children}
    </button>
}