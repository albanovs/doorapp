"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../../store/ordersSlice";
import { Phone, User2 } from "lucide-react";

export default function DetailPage({ params }) {
    const [id, setId] = useState(null);
    const router = useRouter();
    const dispatch = useDispatch();

    const { list: orders, loading, loaded } = useSelector(
        (state) => state.orders
    );
    const order = orders.find((o) => o._id === id);

    useEffect(() => {
        (async () => {
            const resolvedParams = await params;
            setId(resolvedParams.id);
        })();
    }, [params]);

    useEffect(() => {
        if (!loaded) dispatch(fetchOrders());
    }, [dispatch, loaded]);

    if (loading) return <p className="text-center mt-10">Загрузка...</p>;
    if (!order) return <p className="text-center mt-10">Заявка не найдена</p>;

    return (
        <div className="lg:p-5 full min-h-screen space-y-6">
            <button
                onClick={() => router.back()}
                className="text-sm text-gray-500 cursor-pointer hover:text-gray-700"
            >
                ← К заявкам
            </button>

            <div className="grid gap-5 grid-cols-1 lg:grid-cols-3 min-h-screen">
                <div className="flex flex-col gap-5 lg:col-span-1 h-full">
                    <div className="bg-white rounded-xl w-full flex-[0.6] p-5 space-y-4">
                        <div className="flex lg:flex-row flex-col gap-5 justify-between items-start">
                            <div>
                                <h2 className="font-semibold text-lg">
                                    {order.orderName}
                                </h2>
                                <p className="text-xs text-gray-400">
                                    Информация о заказе
                                </p>
                            </div>

                            <div className="text-xs text-gray-400 space-y-1">
                                <div className="flex gap-2 items-center"><User2 size={14} />{order.clientName}</div>
                                <div className="flex gap-2 items-center"><Phone size={14} />{order.clientPhone}</div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Block label="Тип заявки" value={order.orderType} />
                            <Block
                                label="Город"
                                value={order?.city}
                            />
                            <Block
                                label="Улица"
                                value={order?.street}
                            />
                            <Block
                                label="Дом"
                                value={order?.home}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl w-full flex-[0.4] p-5 space-y-5">
                        <div>
                            <p className="font-medium text-sm mb-2">
                                Файлы, прикрепленные менеджером
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {order.managerFiles?.length ? (
                                    order.managerFiles.map((f, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-100 px-3 py-1 rounded-md text-xs"
                                        >
                                            {f}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-400">
                                        Файлы отсутствуют
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="font-medium text-sm mb-2">
                                Файлы, прикрепленные магазином
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {order.shopFiles?.length ? (
                                    order.shopFiles.map((f, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-100 px-3 py-1 rounded-md text-xs"
                                        >
                                            {f}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-400">
                                        Файлы отсутствуют
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5 lg:col-span-2 h-full">
                    <div className="flex flex-col gap-5 flex-[0.6]">
                        <div className="w-full flex lg:flex-row flex-col gap-5 flex-1">
                            <div className="bg-white flex-1 rounded-xl p-5 space-y-6">
                                <Person
                                    title="Менеджер"
                                    name={order.managerName}
                                    phone={order.managerPhone}
                                />
                                <Person
                                    title="Специалист по монтажу"
                                    name={order.specialistName}
                                    phone={order.specialistPhone}
                                />
                            </div>

                            <div className="flex-1 flex flex-col space-y-3">
                                <div className="bg-white flex items-center justify-between flex-1 rounded-xl p-5">
                                    <p className="text-sm">
                                        Статус заявки
                                    </p>
                                    <p
                                        className="text-xs font-medium"
                                        style={{ color: order.status === 'Завершен' ? '#9ADC61' : order.status === 'Ожидает услугу' ? '#61D0DC' : '#61DC81' }}
                                    >
                                        {order.status}
                                    </p>
                                </div>

                                <div className="bg-white flex items-center justify-between flex-1 rounded-xl p-5">
                                    <p className="text-sm">
                                        Дата заявки
                                    </p>
                                    <p className="text-xs text-gray-400 font-medium">
                                        {new Date(
                                            order.orderDate
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="bg-white flex items-center justify-between flex-1 rounded-xl p-5">
                                    <p className="text-sm ">
                                        Дата назначения работ
                                    </p>
                                    <p
                                        className={`text-xs ${order?.assignDate ? 'font-medium' : 'text-gray-400'
                                            }`}
                                    >
                                        {order?.assignDate
                                            ? new Date(order.assignDate).toLocaleDateString()
                                            : 'Дата ещё не назначена'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl w-full flex-1 p-5">
                            <p className="text-xs text-gray-400 mb-2">
                                Комментарий
                            </p>
                            <p className="text-sm text-gray-600">
                                {order.comment ||
                                    "Изначальный комментарий, который оставил магазин при создании заявки"}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-10 lg:p-0 text-center rounded-xl w-full flex-[0.4] flex items-center justify-center text-sm text-gray-400">
                        Добавьте файл загрузив по клику или перетащив его в область
                    </div>
                </div>
            </div>
        </div >
    );
}

function Block({ label, value }) {
    return (
        <div className="bg-[#F5F5FA66] p-3 rounded-xl">
            <p className="text-sm">{label}</p>
            <p className="text-xs font-medium text-gray-400" >{value || "-"}</p>
        </div>
    );
}

function Person({ title, _tabs, name, phone }) {
    return (
        <div>
            <p className="text-xs text-gray-400">{title}</p>
            <p className="text-sm font-medium ">{name}</p>
            <p className="text-xs text-gray-400">{phone}</p>
        </div>
    );
}
