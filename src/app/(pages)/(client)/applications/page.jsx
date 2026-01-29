"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApplPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            const stored = localStorage.getItem("user");
            if (!stored) return;

            const user = JSON.parse(stored);
            if (!user?.apiKey) return;

            try {
                const res = await fetch(`/api/orders/get?apikey=${user.apiKey}`);
                if (!res.ok) throw new Error("Ошибка загрузки заявок");
                const data = await res.json();
                setOrders(data.orders || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <section className="w-full">
                <div className="rounded-[12px] h-[680px] bg-white px-6 py-5 flex flex-col">
                    <h3 className="mb-6 text-base font-semibold text-gray-900 shrink-0">
                        Активные заявки
                    </h3>

                    <div className="flex-1 overflow-y-auto custom-scroll space-y-5 pr-2">
                        {!loading && orders.length === 0 && (
                            <p className="text-gray-400 text-sm text-center mt-10">
                                Заявки не найдены
                            </p>
                        )}

                        {loading ? <p className="text-gray-400 text-sm text-center mt-10">Загрузка...</p> : orders.map(order => (
                            <div
                                key={order._id}
                                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                                onClick={() => router.push(`/applications/${order._id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    <Image src="/icon.png" alt="logo" width={40} height={40} />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{order.orderName}</p>
                                        <p className="text-xs text-[#1C1D21]">{order.orderType}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-[#1C1D21]">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </p>
                                    <p
                                        className="text-xs font-medium"
                                        style={{ color: order.status === 'Завершен' ? '#9ADC61' : order.status === 'Ожидает услугу' ? '#61D0DC' : '#61DC81' }}
                                    >
                                        {order.status}
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
