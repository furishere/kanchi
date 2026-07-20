
interface ButtonProps {
    children : React.ReactNode
    variant? : "primary" | "secondry" | "tertiary"
    onClick? : () => void
    disabled? : boolean
}

const variants = {
        primary : 
        "bg-button text-button-text border border-border hover:bg-button-text hover:text-button cursor-pointer py-2 px-3 uppercase",
        secondry :
        "bg-button-text text-button border uppercase border-border hover:bg-button hover:text-button-text cursor-pointer py-2 px-3",
        tertiary : 
        "border border-border py-2 px-3 uppercase cursor-pointer"
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