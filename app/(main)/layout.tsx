import LeftSideBar from "@/components/sideBar/LeftSideBar"

export default function MainLayout({
    children
}: {
    children: React.ReactNode
}){
    
  return <div className="flex w-screen h-screen overflow-hidden">
    <div className="flex-1 border border-border p-[1rem]">
      <LeftSideBar />
    </div>
      <div className="flex-[1.6] border-border overflow-y-auto p-[1rem]">
        {children}
      </div>
      
      <div className="flex-1 p-[1rem]"></div>
    </div>
}