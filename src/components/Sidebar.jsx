"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    User,
    Grid,
    Plus,
    FileText,
    Search,
    Bell,
    LogOut,
} from "lucide-react";
import Image from "next/image";

const nav = [
    { href: "/profile", icon: User },
    { href: "/applications", icon: Grid },
    { href: "/create", icon: Plus },
    { href: "/orders", icon: FileText },
    { href: "/search", icon: Search },
    { href: "/notif", icon: Bell },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const itemClass = (active) =>
        `
    flex items-center justify-center
    w-12 h-12 rounded-[8px]
    transition-colors transition-transform duration-200 ease-out
    ${active
            ? "text-[#C30000] ring-2 ring-[#C30000]"
            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
        }
    hover:scale-[1.04] active:scale-[0.97]
  `;

    return (
        <>
            <aside className="hidden fixed top-0 left-0 md:flex w-[84px] h-screen bg-white border-r border-r-[#ccc] flex-col items-center py-4 gap-4">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="mb-6"
                    priority
                />

                {nav.map(({ href, icon: Icon }) => {
                    const active = pathname === href;

                    return (
                        <Link key={href} href={href} className={itemClass(active)}>
                            <Icon size={20} />
                        </Link>
                    );
                })}

                <div className="flex-1" />

                <button className="w-12 h-12 flex items-center justify-center bg-[#C30000] rounded-[8px]  cursor-pointer transition-opacity duration-200 hover:opacity-70">
                    <LogOut size={20} color="white" />
                </button>
            </aside>

            <header className="fixed top-0 left-0 right-0 z-50 h-[64px] bg-white border-b border-b-[#ccc] flex md:hidden items-center px-4">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={36}
                    height={36}
                    priority
                />

                <div className="ml-auto flex items-center gap-4">
                    <button onClick={() => router.push("/notif")} className="text-gray-400 transition-colors duration-200 hover:text-red-500">
                        <Bell size={22} />
                    </button>

                    <button className="text-red-500 cursor-pointer transition-opacity duration-200 hover:opacity-70">
                        <LogOut size={22} />
                    </button>
                </div>
            </header>

            <nav className="fixed bottom-0 left-0 right-0 z-50 h-[72px] bg-white border-t border-t-[#ccc] flex md:hidden justify-around items-center">
                {nav
                    .filter(({ href, icon }) => icon !== Bell)
                    .map(({ href, icon: Icon }) => {
                        const active = pathname === href;

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`
            flex flex-col items-center justify-center
            transition-colors transition-transform duration-200 ease-out
            ${active ? "text-red-500 scale-105" : "text-gray-400 hover:text-red-500"}
            active:scale-95
          `}
                            >
                                <Icon size={22} />
                            </Link>
                        );
                    })}
            </nav>

        </>
    );
}
