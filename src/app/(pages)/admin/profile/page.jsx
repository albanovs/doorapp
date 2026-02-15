"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchOrders } from "../../../store/ordersSlice";

const STATUS_COLUMNS = [
    { key: "Ожидает звонок", title: "Ожидает звонок", color: "bg-[#61DC81]" },
    { key: "В работе", title: "Ожидает услугу", color: "bg-[#61D0DC]" },
    { key: "Приостановлена", title: "Приостановлен", color: "bg-[#61A9DC]" },
];

export default function ProfilePage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { list: orders, loading: ordersLoading, loaded } = useSelector((state) => state.orders);

    const [user, setUser] = useState(null);
    const [editData, setEditData] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotif, setLoadingNotif] = useState(true);

    const saveTimeout = useRef(null);

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("ru-RU");
    };

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();

            if (res.ok) {
                setNotifications(data.notifications.filter((n) => !n.isReadAdmin).slice(0, 3));
            }
        } catch (error) {
            console.error("Ошибка загрузки уведомлений", error);
        } finally {
            setLoadingNotif(false);
        }
    };

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
        fetchNotifications();
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
            console.error(err);
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

    const handleNotifClick = async (notif) => {
        try {
            await fetch("/api/notifications/readadmin", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: notif._id }),
            });
            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
            router.push(`/admin/applications/${notif.orderId}`);
        } catch (err) {
            console.error("Ошибка перехода по уведомлению", err);
        }
    };

    return (
        <div>
            <main>
                <div className="mx-auto flex lg:flex-row flex-col w-full">
                    <section className="min-h-screen rounded-[12px] lg:rounded-none p-4 lg:w-96 bg-white">
                        <div className="space-y-4">
                            <div className="mb-2 flex pt-10 py-5 items-center gap-3">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Менеджер
                                </h2>
                            </div>

                            {renderField("ФИО менеджера", "managerName", editData.managerName)}
                            {renderField("Контактный телефон", "phone", editData.phone)}
                            {renderField("Email", "email", editData.email)}
                            {renderField("Пароль", "password", editData.password)}
                        </div>
                    </section>

                    <section className="w-full lg:m-6 mt-6">
                        <div className="rounded-[12px] min-h-96 w-full bg-white px-6 py-5 flex flex-col">
                            <h3 className="mb-6 text-base font-semibold text-gray-900 shrink-0">
                                Уведомления по заявкам
                            </h3>

                            <div className="flex-1 overflow-y-auto custom-scroll space-y-5 pr-2">
                                {loadingNotif &&
                                    Array.from({ length: 3 }).map((_, i) => (
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

                                {!loadingNotif && notifications.length === 0 && (
                                    <p className="text-sm text-gray-400 text-center pt-10">
                                        Нет новых уведомлений
                                    </p>
                                )}

                                {!loadingNotif && notifications.map((notif) => (
                                    <div
                                        key={notif._id}
                                        onClick={() => handleNotifClick(notif)}
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
                                                    {notif.type === "create" ? "Новая заявка" : "Обновление заявки"}
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

                            {notifications.length > 0 && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={() => router.push("/admin/notif")}
                                        className="rounded-[8px] cursor-pointer bg-[#C30000] px-9 py-4 text-sm font-semibold text-white hover:bg-red-600 transition"
                                    >
                                        Посмотреть все
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6 mt-6">
                            <div className="relative bg-white w-full rounded-xl overflow-hidden p-10">
                                <h3 className="text-lg mb-5 font-semibold">
                                    Активные заявки
                                </h3>
                                <div className="grid lg:grid-cols-3 gap-2 min-w-max">
                                    {STATUS_COLUMNS.map((column) => {
                                        const columnOrders = orders?.filter(
                                            (order) => order.status === column.key
                                        );

                                        return (
                                            <div key={column.key} className="w-full flex-shrink-0">
                                                <div
                                                    className={`${column.color} text-white text-sm rounded-lg py-4 text-center mb-3`}
                                                >
                                                    {column.title}
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    {columnOrders?.map((order, i) => (
                                                        i < 1 && <div
                                                            key={order._id}
                                                            className="relative bg-white rounded-r-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                                                            onClick={() => router.push(`/admin/applications/${order._id}`)}
                                                        >
                                                            <div className={`absolute left-0 top-0 h-full w-0.5 rounded-l-3xl ${column.color}`} />
                                                            {order.complaint && (
                                                                <div className="absolute top-0 right-0 bg-red-600 text-white w-10 h-10 rounded-tr-2xl rounded-bl-2xl  flex items-center justify-center font-bold">
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
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0" />
                                                                </svg>
                                                                <span>{order.clientName}</span>
                                                            </div>
                                                            <div className="flex items-center text-[12px] gap-3 text-[#8181A5] mb-6">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 7.318 5.932 13.25 13.25 13.25h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293a11.042 11.042 0 01-5.292-5.292l1.293-.97c.379-.284.54-.78.417-1.173L6.963 3.6A1.125 1.125 0 005.872 2.75H4.5A2.25 2.25 0 002.25 5v1.75z" />
                                                                </svg>
                                                                <span>{order.clientPhone}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center font-semibold text-[14px] text-[#8181A5] font-medium">
                                                                <span>Стоимость</span>
                                                                <span>{`${order.price} ₽`}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={() => router.push("/admin/applications")}
                                        className="rounded-[8px] cursor-pointer bg-[#C30000] px-9 py-4 text-sm font-semibold text-white hover:bg-red-600 transition"
                                    >
                                        Посмотреть все
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
