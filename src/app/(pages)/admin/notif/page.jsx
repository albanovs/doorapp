"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function NotifPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();

            if (res.ok) {
                setNotifications(data.notifications.filter((n) => !n.isReadAdmin));
            }
        } catch (error) {
            toast.error("Ошибка загрузки уведомлений");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleClick = async (notif) => {
        try {
            await fetch("/api/notifications/readadmin", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: notif._id }),
            });

            setNotifications((prev) =>
                prev.filter((n) => n._id !== notif._id)
            );

            router.push(`/admin/applications/${notif.orderId}`);
        } catch (error) {
            toast.error("Ошибка перехода");
        }
    };

    return (
        <div>
            <section className="w-full mb-5 lg:mb-0 lg:p-6 p-2">
                <div className="rounded-[12px] h-[680px] bg-white px-6 py-5 flex flex-col">
                    <h3 className="mb-6 text-base font-semibold text-gray-900 shrink-0">
                        Уведомления по заявкам
                    </h3>

                    <div className="flex-1 overflow-y-auto custom-scroll space-y-5 pr-2">
                        {loading &&
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3">
                                    <div className="flex items-center gap-4">
                                        <Skeleton circle width={40} height={40} />
                                        <div>
                                            <Skeleton width={200} height={12} />
                                            <Skeleton width={120} height={14} />
                                            <Skeleton width={150} height={12} />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Skeleton width={70} height={12} />
                                        <Skeleton width={90} height={12} />
                                    </div>
                                </div>
                            ))
                        }

                        {!loading && notifications.length === 0 && (
                            <p className="text-sm text-gray-400 text-center pt-10">
                                Нет новых уведомлений
                            </p>
                        )}

                        {!loading &&
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    onClick={() => handleClick(notif)}
                                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src="/icon.png"
                                            alt="logo"
                                            width={40}
                                            height={40}
                                        />
                                        <div>
                                            <p className="text-xs text-[#C30000] font-semibold">
                                                {notif.message}
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-[#1C1D21]">
                                                {notif.type === "create"
                                                    ? "Новая заявка"
                                                    : "Обновление заявки"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-[#1C1D21]">
                                            {new Date(notif.createdAt).toLocaleDateString("ru-RU")}
                                        </p>
                                        <p className="text-xs text-[#61D0DC]">
                                            Нажмите для перехода
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
