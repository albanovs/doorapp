import Sidebar from "../../../components/SidebarAdmin";
import { Toaster } from "react-hot-toast";

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <main className="lg:ml-21 bg-[#F2F2F2] p-2 py-20 min-h-screen lg:p-0 lg:my-0">
                {children}
                <Toaster position="top-right" />
            </main>
        </div>
    );
}
