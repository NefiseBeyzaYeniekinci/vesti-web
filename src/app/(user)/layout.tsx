import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import dynamic from "next/dynamic";

const VesvesChatbot = dynamic(() => import("@/components/chatbot/VesvesChatbot"), { ssr: false });

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col pt-16" style={{ backgroundColor: '#F8F9FA', color: '#37474F' }}>
            <Navbar />
            <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
                <Sidebar />
                <main className="flex-1 w-full p-4 md:p-8">
                    {children}
                </main>
            </div>
            <Footer />
            <VesvesChatbot />
        </div>
    );
}
