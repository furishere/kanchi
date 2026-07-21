import { AuthPageNavBar } from "@/components/auth/AuthPageNavBar"

export default function authLayout({children} : {
    children : React.ReactNode
}){
    return <main>
        <AuthPageNavBar />
        {children}
    </main>
}