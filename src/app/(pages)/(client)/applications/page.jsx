"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchOrders } from "../../../store/ordersSlice";

export default function ApplPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { list: orders, loading, loaded } = useSelector((state) => state.orders);

    useEffect(() => {
        if (!loaded) {
            dispatch(fetchOrders());
        }
    }, [loaded, dispatch]);

    return (
        <section className="w-full lg:p-5">
            <div className="rounded-[12px] h-[680px] bg-white px-6 py-5 flex flex-col">
                <h3 className="mb-6 text-base font-semibold text-gray-900 shrink-0">
                    Активные заявки
                </h3>

                <div className="flex-1 overflow-y-auto custom-scroll space-y-5 pr-2">
                    {loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-2 rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <Skeleton circle width={40} height={40} />
                                        <div>
                                            <Skeleton width={160} height={14} />
                                            <Skeleton
                                                width={120}
                                                height={12}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Skeleton width={90} height={12} />
                                        <Skeleton
                                            width={100}
                                            height={12}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : !loading && orders.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center mt-10">
                            Заявки не найдены
                        </p>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order._id}
                                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                                onClick={() =>
                                    router.push(`/applications/${order._id}`)
                                }
                            >
                                <div className="flex items-center gap-4">
                                    <Image
                                        src="/icon.png"
                                        alt="logo"
                                        width={40}
                                        height={40}
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {order.orderName}
                                        </p>
                                        <p className="text-xs text-[#1C1D21]">
                                            {order.orderType}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-[#1C1D21]">
                                        {new Date(
                                            order.orderDate
                                        ).toLocaleDateString()}
                                    </p>
                                    <p
                                        className="text-xs font-medium"
                                        style={{
                                            color:
                                                order.status === "Завершен"
                                                    ? "#9ADC61"
                                                    : order.status ===
                                                        "Ожидает услугу"
                                                        ? "#61D0DC"
                                                        : "#61DC81",
                                        }}
                                    >
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
