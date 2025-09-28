import { Header } from "./header";
import { Sidebar } from "./sidebar";


export default function MainLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex">
            <Sidebar />
           
            <main className="flex-1">
                <Header />
                    {children}
                </main>
        </div>
    );
}
