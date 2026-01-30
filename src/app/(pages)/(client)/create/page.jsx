"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, User, Phone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../store/ordersSlice";

export default function CreatePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();
    const [editingField, setEditingField] = useState(null);
    const [period, setPeriod] = useState({ from: null, to: null });
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [form, setForm] = useState({
        orderName: "Новая заявка",
        clientName: "",
        clientPhone: "",
        orderType: "Монтаж",
        city: "",
        street: "",
        home: "",
        comment: "",
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) return;
        const parsed = JSON.parse(stored);
        setUser(parsed);
        if (parsed?.adress) {
            setForm(prev => ({
                ...prev,
                city: parsed.adress.city || "",
                street: parsed.adress.street || "",
                home: parsed.adress.house || "",
            }));
        }
    }, []);

    const createOrder = async () => {
        if (creating) return;
        if (!period.from || !period.to) {
            alert("Выберите период выполнения");
            return;
        }

        setCreating(true);

        const payload = {
            shopName: user.shopName,
            orderName: form.orderName,
            clientName: user.managerName || "Не указано",
            clientPhone: user.phone || "Не указано",
            orderType: form.orderType,
            city: form.city,
            street: form.street,
            home: form.home,
            comment: form.comment || "",
            orderDate: new Date(),
            workDate: null,
            status: "Ожидает звонок",
            periodDate: { from: period.from, to: period.to },
            clientFile: {},
            managerFile: {},
            apiKey: user?.apiKey,
        };

        try {
            const res = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                alert("Ошибка создания заявки");
                setCreating(false);
                return;
            }
            dispatch(fetchOrders())
            setModalOpen(true);
            setForm(prev => ({ ...prev, comment: "" }));
            setPeriod({ from: null, to: null });
        } catch (e) {
            alert("Ошибка сети");
        } finally {
            setCreating(false);
        }
    };

    const handleDayClick = (date) => {
        if (!period.from || (period.from && period.to)) {
            setPeriod({ from: date, to: null });
        } else {
            if (date < period.from) {
                setPeriod({ from: date, to: period.from });
            } else {
                setPeriod(prev => ({ ...prev, to: date }));
            }
        }
    };

    const isActive = (date) => {
        if (!period.from) return false;
        if (!period.to) return period.from.getTime() === date.getTime();
        return date >= period.from && date <= period.to;
    };

    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1;
    const daysInMonth = endOfMonth.getDate();
    const blanks = Array.from({ length: startDay });

    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

    return (
        <div className="lg:p-5 relative">
            <div className="mb-5">
                <button
                    onClick={() => router.push("/applications")}
                    className="flex cursor-pointer items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft size={16} /> К заявкам
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
                <div className="bg-white p-6 rounded-[10px]">
                    <div className="space-y-4">
                        <div className="mb-10">
                            <div className="flex justify-between">
                                <div>
                                    <div className="font-semibold text-sm">{user?.shopName || "Мой магазин"}</div>
                                    <div className="text-xs text-gray-400">Информация о заказе</div>
                                </div>
                                <div className="text-xs text-gray-400 space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <User size={12} className="text-gray-400" />
                                        <span>{user?.managerName || "Менеджер"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Phone size={12} className="text-gray-400" />
                                        <span>{user?.phone || "-"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {[["Тип заявки", "orderType"], ["Город", "city"], ["Улица", "street"], ["Дом", "home"]].map(([label, field]) => (
                            <div key={field} className="rounded-[12px] bg-[#F7F7F7] py-3 px-4 flex justify-between items-center">
                                <div className="w-full">
                                    <div className="text-xs text-gray-400">{label}</div>
                                    {editingField === field ? (
                                        <input
                                            autoFocus
                                            value={form[field]}
                                            onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                                            onBlur={() => setEditingField(null)}
                                            className="bg-transparent border-b w-full outline-none text-sm"
                                        />
                                    ) : (
                                        <div className="text-sm">{form[field]}</div>
                                    )}
                                </div>
                                <Image src="/pen.svg" alt="edit" width={12} height={12} className="cursor-pointer" onClick={() => setEditingField(field)} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white gap-4 p-5 rounded-[12px] flex flex-col lg:flex-row w-full justify-between">
                    <div className="rounded-2xl w-full p-4 bg-[#F7F7F7] flex flex-col">
                        <div className="mb-3 flex items-center justify-between text-sm font-medium">
                            Комментарий
                            <Image src="/pen.svg" alt="edit" width={14} height={14} className="text-gray-400" />
                        </div>
                        <textarea
                            placeholder="Комментарий"
                            className="flex-1 resize-none rounded-xl border-gray-200 text-sm outline-none focus:border-blue-500"
                            value={form.comment}
                            onChange={e => setForm(prev => ({ ...prev, comment: e.target.value }))}
                        />
                    </div>

                    <div className="rounded-2xl flex flex-col justify-between w-full bg-white">
                        <div className="mb-3 flex items-start justify-between p-3 bg-[#F7F7F7] rounded-[12px] text-sm font-medium cursor-pointer">
                            <div>
                                Дата выполнения
                                <div className="mt-1 text-xs text-gray-400">
                                    {period.from && period.to
                                        ? `${period.from.toLocaleDateString()} – ${period.to.toLocaleDateString()}`
                                        : "Выберите период"}
                                </div>
                            </div>
                        </div>

                        <div className="mb-2 flex items-center justify-between">
                            <div className="font-medium">{currentMonth.toLocaleString("ru-RU", { month: "long" })}</div>
                            <div className="flex gap-2 text-gray-500">
                                <button onClick={prevMonth}><ChevronLeft size={18} /></button>
                                <button onClick={nextMonth}><ChevronRight size={18} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                            {["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"].map(d => <div key={d} className="text-gray-400">{d}</div>)}
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                            {blanks.map((_, i) => <div key={"b" + i} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
                                const active = isActive(date);
                                const isFrom = period.from?.getTime() === date.getTime();
                                const isTo = period.to?.getTime() === date.getTime();
                                return (
                                    <div
                                        key={i}
                                        onClick={() => handleDayClick(date)}
                                        className={`h-9 flex items-center justify-center rounded-lg cursor-pointer
                                            ${active ? "bg-green-400 text-white" : "bg-gray-100 text-gray-700"}
                                            ${isFrom || isTo ? "border-2 border-red-600" : ""}`}
                                    >
                                        {i + 1}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 rounded-2xl border-2 border-dashed border-gray-200 bg-white py-12 text-center text-sm text-gray-400">
                Добавьте файл загрузив по клику или перетащив его в область
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={createOrder}
                    disabled={creating}
                    className="relative flex items-center justify-center rounded-[8px] bg-[#C30000] px-8 py-3 text-sm font-medium text-white hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {creating ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        "Создать заявку"
                    )}
                </button>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
                    <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center animate-fadeIn">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Заявка успешно создана!</h2>
                        <p className="text-sm text-gray-600 mb-6">Вы можете перейти к списку заявок или создать новую.</p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <button
                                onClick={() => { setModalOpen(false); router.push("/applications"); }}
                                className="bg-[#C30000] text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                К заявкам
                            </button>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                Продолжить создание
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
