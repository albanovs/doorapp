"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../../../store/ordersSlice';
import { useRouter } from 'next/navigation';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SearchPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { list: orders, loading, loaded } = useSelector((state) => state.orders);

    const [query, setQuery] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        if (!loaded) dispatch(fetchOrders());
    }, [dispatch, loaded]);

    useEffect(() => {
        if (!orders) return;
        const q = query.trim().toLowerCase();
        if (!q) {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(
                orders.filter(o => o.orderName?.toLowerCase().includes(q) || o.orderType?.toLowerCase().includes(q))
            );
        }
    }, [query, orders]);

    return (
        <div>
            <section className="w-full mb-5 lg:mb-0 lg:p-6 p-2">
                <div className="rounded-[12px] h-[680px] bg-white py-5 flex flex-col">

                    <h3 className="mb-4 px-5 text-base font-semibold text-gray-900 shrink-0">
                        Поиск заявки
                    </h3>

                    <div className="relative mb-6 shrink-0">
                        <input
                            type="text"
                            placeholder="Введите наименование заявки или тип"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="
                                w-full h-[60px] 
                                bg-[#F5F5FA66]
                                pl-5
                                text-sm text-gray-900
                                placeholder:text-[#8181A5]
                                outline-none
                                focus:border-b focus:border-b-[#C30000]
                            "
                        />

                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8B8FA3]">
                            <Search size={20} />
                        </span>
                    </div>

                    <div className="flex-1 px-6 overflow-y-auto custom-scroll space-y-5">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-4">
                                        <Skeleton circle width={40} height={40} />
                                        <div>
                                            <Skeleton width={180} height={12} />
                                            <Skeleton width={120} height={12} />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Skeleton width={70} height={12} />
                                        <Skeleton width={50} height={12} />
                                    </div>
                                </div>
                            ))
                        ) : filteredOrders.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center mt-10">Заявки не найдены</p>
                        ) : (
                            filteredOrders.map(order => (
                                <div
                                    key={order._id}
                                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                                    onClick={() => router.push(`/admin/applications/${order._id}`)}
                                >
                                    <div className="flex items-center gap-4">
                                        <Image src="/icon.png" alt="logo" width={40} height={40} />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{order.orderName}</p>
                                            <p className="text-xs text-[#1C1D21]">{order.orderType}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-[#1C1D21]">{new Date(order.orderDate).toLocaleDateString("ru-RU")}</p>
                                        <p className="text-xs font-medium" style={{ color: order.status === 'Завершен' ? '#9ADC61' : order.status === 'Ожидает услугу' ? '#61D0DC' : '#61DC81' }}>
                                            {order.status}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </section>
        </div>
    );
}
