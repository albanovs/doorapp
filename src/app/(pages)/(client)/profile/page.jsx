"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../store/ordersSlice";

export default function ProfilePage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { list: orders, loading, loaded } = useSelector((state) => state.orders);

    const [user, setUser] = useState(null);
    const [editData, setEditData] = useState(null);
    const [editingField, setEditingField] = useState(null);

    const saveTimeout = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/auth/login");
            return;
        }
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setEditData(parsed);

        if (!loaded) dispatch(fetchOrders());
    }, [router, dispatch, loaded]);

    if (!user || !editData) return null;

    const recentOrders = orders
        ?.slice()
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 6);

    const syncWithDB = async (data) => {
        try {
            const res = await fetch("/api/user/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (res.ok) {
                localStorage.setItem("user", JSON.stringify(result.user));
                setUser(result.user);
                setEditData(result.user);
            }
        } catch (err) {
            console.error("Sync error:", err);
        }
    };

    const autoSave = (newData) => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
            syncWithDB(newData);
        }, 600);
    };

    const handleChange = (field, value) => {
        const newData = { ...editData, [field]: value };
        setEditData(newData);
        autoSave(newData);
    };

    const handleAddressChange = (field, value) => {
        const newData = { ...editData, adress: { ...editData.adress, [field]: value } };
        setEditData(newData);
        autoSave(newData);
    };

    const renderField = (label, field, value) => (
        <div className="flex items-center justify-between rounded-xl bg-[#F5F5FA66] px-4 py-3">
            <div className="w-full">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                {editingField === field ? (
                    <input
                        autoFocus
                        value={value || ""}
                        onChange={(e) => handleChange(field, e.target.value)}
                        onBlur={() => setEditingField(null)}
                        className="w-full bg-transparent border-b border-red-500 outline-none text-sm text-gray-700"
                    />
                ) : (
                    <p
                        onClick={() => setEditingField(field)}
                        className="text-sm text-[#8181A5] cursor-pointer"
                    >
                        {value || "-"}
                    </p>
                )}
            </div>
            <button
                onClick={() => setEditingField(field)}
                className="ml-3 text-gray-400 hover:text-gray-600 transition"
            >
                <Image src="/pen.svg" alt="edit" width={14} height={14} />
            </button>
        </div>
    );

    const renderAddressField = (label, field, value) => (
        <div className="flex items-center justify-between rounded-xl bg-[#F5F5FA66] px-4 py-3">
            <div className="w-full">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                {editingField === `adress.${field}` ? (
                    <input
                        autoFocus
                        value={value || ""}
                        onChange={(e) => handleAddressChange(field, e.target.value)}
                        onBlur={() => setEditingField(null)}
                        className="w-full bg-transparent border-b border-red-500 outline-none text-sm text-gray-700"
                    />
                ) : (
                    <p
                        onClick={() => setEditingField(`adress.${field}`)}
                        className="text-sm text-[#8181A5] cursor-pointer"
                    >
                        {value || "-"}
                    </p>
                )}
            </div>
            <button
                onClick={() => setEditingField(`adress.${field}`)}
                className="ml-3 text-gray-400 hover:text-gray-600 transition"
            >
                <Image src="/pen.svg" alt="edit" width={14} height={14} />
            </button>
        </div>
    );

    return (
        <div>
            <main>
                <div className="mx-auto flex lg:flex-row flex-col w-full">

                    <section className="min-h-screen rounded-[12px] lg:rounded-none p-4 lg:w-96 bg-white">
                        <div className="space-y-4">
                            <div className="mb-2 flex pt-10 py-5 items-center gap-3">
                                <div
                                    className="flex h-20 w-20 text-3xl items-center justify-center rounded-[30px] text-white font-bold"
                                    style={{ background: 'linear-gradient(135deg, #F10000, #C30000)' }}
                                >
                                    {user.shopName?.[0]?.toUpperCase() || "U"}
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">{user.shopName}</h2>
                            </div>

                            {renderField("Название магазина", "shopName", editData.shopName)}
                            {renderField("ФИО менеджера", "managerName", editData.managerName)}
                            {renderField("Контактный телефон", "phone", editData.phone)}
                            {renderField("Email", "email", editData.email)}
                        </div>

                        <div className="space-y-3">
                            <h3 className="mb-5 mt-10 text-[20px] font-semibold text-gray-900">Адрес магазина</h3>
                            {renderAddressField("Город", "city", editData.adress?.city)}
                            {renderAddressField("Улица", "street", editData.adress?.street)}
                            {renderAddressField("Дом", "house", editData.adress?.house)}
                        </div>

                    </section>

                    <section className="w-full lg:m-6 mt-6">
                        <div className="rounded-[12px] w-full bg-white px-6 py-5">
                            <h3 className="mb-6 text-base font-semibold text-gray-900">Активные заявки</h3>

                            <div className="space-y-5">
                                {loading ? (
                                    <p className="text-gray-400 text-sm text-center mt-10">Загрузка...</p>
                                ) : recentOrders.length === 0 ? (
                                    <p className="text-gray-400 text-sm text-center mt-10">Заявки не найдены</p>
                                ) : recentOrders.map(order => (
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
                                            <p className="text-xs text-[#1C1D21]">{new Date(order.orderDate).toLocaleDateString()}</p>
                                            <p className="text-xs font-medium" style={{ color: order.status === 'Завершен' ? '#9ADC61' : order.status === 'Ожидает услугу' ? '#61D0DC' : '#61DC81' }}>
                                                {order.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {recentOrders.length > 0 && (
                                <div className="mt-8 flex justify-center">
                                    <button onClick={() => router.push('/applications')} className="rounded-[8px] cursor-pointer bg-[#C30000] px-9 py-4 text-sm font-semibold text-white hover:bg-red-600 transition">
                                        Посмотреть все
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6 mt-6">
                            <Link href="/create" className="relative bg-white w-full h-[300px] rounded-xl overflow-hidden p-6">
                                <h3 className="text-lg font-semibold">Добавить новую заявку</h3>
                                <Image src="/worker.png" alt="workers" width={360} height={260} className="absolute bottom-0 right-0 object-contain" priority />
                            </Link>

                            <Link href="/orders" className="relative cursor-pointer bg-white w-full h-[300px] rounded-xl overflow-hidden p-6">
                                <h3 className="text-lg font-semibold">Скачать прайс-лист</h3>
                                <Image src="/blank.png" alt="documents" width={320} height={260} className="absolute bottom-0 right-0 object-contain" priority />
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
