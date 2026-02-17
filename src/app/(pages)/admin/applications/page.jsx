'use client';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchOrders,
    updateOrderStatus,
    updateOrderStatusOnServer
} from "../../../store/ordersSlice";

import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Phone, User } from "lucide-react";

const STATUS_COLUMNS = [
    { key: "Ожидает звонок", title: "Ожидает звонок", color: "bg-[#61DC81]" },
    { key: "Ожидает услугу", title: "Ожидает услугу", color: "bg-[#61D0DC]" },
    { key: "Приостановлен", title: "Приостановлен", color: "bg-[#61A9DC]" },
    { key: "Завершен", title: "Завершен", color: "bg-[#9ADC61]" },
    { key: "Отменен", title: "Отменен", color: "bg-[#DC6161]" },
];

export default function ApplicationAll() {
    const dispatch = useDispatch();
    const { list: orders, loading, loaded } = useSelector(
        (state) => state.orders
    );

    const [draggedId, setDraggedId] = useState(null);

    useEffect(() => {
        if (!loaded) {
            dispatch(fetchOrders());
        }
    }, [loaded, dispatch]);

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("ru-RU");
    };

    // 🔥 НАЧАЛО ПЕРЕТАСКИВАНИЯ
    const handleDragStart = (e, id) => {
        setDraggedId(id);

        const node = e.currentTarget;

        node.style.opacity = "1";
        node.style.transform = "scale(1.05)";
        node.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";

        // убираем стандартный ghost
        e.dataTransfer.setDragImage(node, 20, 20);
    };

    // 🔥 КОНЕЦ ПЕРЕТАСКИВАНИЯ
    const handleDragEnd = (e) => {
        const node = e.currentTarget;
        node.style.opacity = "1";
        node.style.transform = "scale(1)";
        node.style.boxShadow = "";
        setDraggedId(null);
    };

    // 🔥 РАЗРЕШАЕМ DROP
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // 🔥 БРОСИЛИ В КОЛОНКУ
    const handleDrop = (newStatus) => {
        if (!draggedId) return;

        const draggedOrder = orders.find(o => o._id === draggedId);
        if (!draggedOrder) return;

        if (draggedOrder.status === newStatus) return;

        dispatch(updateOrderStatus({
            id: draggedId,
            status: newStatus
        }));

        dispatch(updateOrderStatusOnServer({
            id: draggedId,
            status: newStatus
        }));

        setDraggedId(null);
    };

    const SkeletonCard = () => (
        <div className="bg-white rounded-r-2xl p-5 shadow-sm">
            <Skeleton height={28} width={120} className="mb-2" />
        </div>
    );

    return (
        <div className="w-full h-screen overflow-x-auto p-4 bg-gray-100">
            <div className="grid grid-cols-5 gap-2 min-w-max">

                {STATUS_COLUMNS.map((column) => {
                    const columnOrders = orders?.filter(
                        (order) => order.status === column.key
                    );

                    return (
                        <div
                            key={column.key}
                            className="w-full flex-shrink-0"
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(column.key)}
                        >
                            <div
                                className={`${column.color} text-white text-sm rounded-lg py-4 text-center mb-3`}
                            >
                                {column.title}
                            </div>

                            <div className="flex flex-col gap-3 min-h-[120px]">

                                {loading &&
                                    Array.from({ length: 1 }).map((_, i) => (
                                        <SkeletonCard key={i} />
                                    ))
                                }

                                {!loading &&
                                    columnOrders?.map((order) => (
                                        <div
                                            key={order._id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, order._id)}
                                            onDragEnd={handleDragEnd}
                                            className="relative bg-white rounded-r-2xl p-5 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing"
                                        >
                                            <Link
                                                href={`/admin/applications/${order._id}`}
                                                onClick={(e) => {
                                                    if (draggedId) e.preventDefault();
                                                }}
                                            >
                                                <div className={`absolute left-0 top-0 h-full w-0.5 rounded-l-3xl ${column.color}`} />

                                                {order.complaint && (
                                                    <div className="absolute top-0 right-0 bg-red-600 text-white w-10 h-10 rounded-tr-2xl rounded-bl-2xl flex items-center justify-center font-bold">
                                                        !
                                                    </div>
                                                )}

                                                <div className="text-2xl font-bold text-gray-800 mb-1">
                                                    {order.orderName}
                                                </div>

                                                <div className="text-[14px] text-[#8181A5] mb-2">
                                                    {order.orderType}
                                                </div>

                                                <div className="text-red-600 text-[12px] mb-4">
                                                    {formatDate(order.orderDate)}
                                                </div>

                                                <div className="flex items-center text-[12px] gap-3 text-[#8181A5] mb-2">
                                                    <User size={14} />
                                                    <span>{order.clientName}</span>
                                                </div>

                                                <div className="flex items-center text-[12px] gap-3 text-[#8181A5] mb-6">
                                                    <Phone size={14} />
                                                    <span>{order.clientPhone}</span>
                                                </div>

                                                <div className="flex justify-between items-center text-[14px] text-[#8181A5] font-medium">
                                                    <span>Стоимость</span>
                                                    <span>
                                                        {order.price
                                                            ? `${order.price} ₽`
                                                            : "Не указана"}
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}