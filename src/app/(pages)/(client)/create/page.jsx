"use client";

import { useEffect, useState, useRef } from "react";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    User,
    Phone,
    X
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { fetchOrders } from "../../../store/ordersSlice";

export default function CreatePage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const saveTimeout = useRef(null);

    const [user, setUser] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [period, setPeriod] = useState({ from: null, to: null });
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [files, setFiles] = useState([]);

    const [form, setForm] = useState({
        orderName: "Ожидает звонок",
        orderType: "Монтаж",
        city: "",
        street: "",
        home: "",
        comment: ""
    });

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
                home: parsed.adress.house || ""
            }));
        }
    }, []);


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
            }
        } catch (err) {
            console.error(err);
        }
    };

    const autoSave = (newUser) => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
            syncWithDB(newUser);
        }, 600);
    };


    const handleFormChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleAddressChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));

        const newUser = {
            ...user,
            adress: {
                ...user.adress,
                [field === "home" ? "house" : field]: value
            }
        };

        setUser(newUser);
        autoSave(newUser);
    };


    const handleFiles = (newFiles) => {
        const arr = Array.from(newFiles).map(f => ({
            id: Date.now() + Math.random(),
            name: f.name,
            raw: f
        }));
        setFiles(prev => [...prev, ...arr]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const removeFile = (id) =>
        setFiles(prev => prev.filter(f => f.id !== id));


    const createOrder = async () => {
        if (creating) return;

        if (!user) {
            alert("Пользователь не загружен");
            return;
        }

        if (!period.from || !period.to) {
            alert("Выберите период выполнения");
            return;
        }

        if (!form.orderType || !form.city || !form.street || !form.home) {
            alert("Заполните все обязательные поля");
            return;
        }

        setCreating(true);

        const formData = new FormData();

        formData.append("shopName", user?.shopName || "");
        formData.append("clientName", user?.managerName || "");
        formData.append("clientPhone", user?.phone || "");
        formData.append("orderType", form.orderType || "");
        formData.append("city", form.city || "");
        formData.append("street", form.street || "");
        formData.append("home", form.home || "");
        formData.append("comment", form.comment || "");
        formData.append("periodFrom", period.from.toISOString());
        formData.append("periodTo", period.to.toISOString());
        formData.append("apiKey", user?.apiKey || "");
        formData.append("orderDate", new Date().toISOString());

        files.forEach(f => formData.append("clientFile", f.raw));

        try {
            const res = await fetch("/api/orders/create", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.message || "Ошибка создания заявки");
                return;
            }

            dispatch(fetchOrders());
            setModalOpen(true);
            setForm(prev => ({ ...prev, comment: "" }));
            setPeriod({ from: null, to: null });
            setFiles([]);
        } catch {
            alert("Ошибка сети");
        } finally {
            setCreating(false);
        }
    };


    const startOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    );
    const endOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    );

    const startDay =
        startOfMonth.getDay() === 0
            ? 6
            : startOfMonth.getDay() - 1;

    const daysInMonth = endOfMonth.getDate();
    const blanks = Array.from({ length: startDay });

    const handleDayClick = (date) => {
        if (!period.from || period.to) {
            setPeriod({ from: date, to: null });
        } else {
            setPeriod(
                date < period.from
                    ? { from: date, to: period.from }
                    : { ...period, to: date }
            );
        }
    };

    const isActive = (date) => {
        if (!period.from) return false;
        if (!period.to)
            return period.from.getTime() === date.getTime();
        return date >= period.from && date <= period.to;
    };

    const prevMonth = () =>
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1
            )
        );

    const nextMonth = () =>
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1
            )
        );


    return (
        <div className="lg:p-5 relative">
            <button
                onClick={() => router.push("/applications")}
                className="mb-5 flex items-center gap-2 text-sm text-gray-500"
            >
                <ArrowLeft size={16} /> К заявкам
            </button>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
                <div className="bg-white p-6 rounded-xl">
                    <div className="mb-10 flex justify-between">
                        <div>
                            <div className="font-semibold text-sm">
                                {user?.shopName}
                            </div>
                            <div className="text-xs text-gray-400">
                                Информация о заказе
                            </div>
                        </div>
                        <div className="text-xs text-gray-400 space-y-1">
                            <div className="flex items-center gap-1.5">
                                <User size={12} />
                                {user?.managerName}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Phone size={12} />
                                {user?.phone}
                            </div>
                        </div>
                    </div>

                    {[
                        ["Тип заявки", "orderType"],
                        ["Город", "city"],
                        ["Улица", "street"],
                        ["Дом", "home"]
                    ].map(([label, field]) => (
                        <div
                            key={field}
                            className="rounded-xl bg-[#F7F7F7] py-3 px-4 flex justify-between items-center mb-3"
                        >
                            <div className="w-full">
                                <div className="text-xs text-gray-400">
                                    {label}
                                </div>
                                {editingField === field ? (
                                    <input
                                        autoFocus
                                        value={form[field]}
                                        onChange={(e) =>
                                            field === "orderType"
                                                ? handleFormChange(
                                                    field,
                                                    e.target.value
                                                )
                                                : handleAddressChange(
                                                    field,
                                                    e.target.value
                                                )
                                        }
                                        onBlur={() =>
                                            setEditingField(null)
                                        }
                                        className="bg-transparent border-b w-full outline-none text-sm"
                                    />
                                ) : (
                                    <div className="text-sm">
                                        {form[field]}
                                    </div>
                                )}
                            </div>
                            <Image
                                src="/pen.svg"
                                alt="edit"
                                width={12}
                                height={12}
                                className="cursor-pointer"
                                onClick={() =>
                                    setEditingField(field)
                                }
                            />
                        </div>
                    ))}
                </div>

                <div className="bg-white gap-4 p-5 rounded-xl flex flex-col lg:flex-row">
                    <div className="rounded-2xl w-full p-4 bg-[#F7F7F7] flex flex-col">
                        <div className="mb-3 text-sm font-medium">
                            Комментарий
                        </div>
                        <textarea
                            className="flex-1 resize-none bg-transparent text-sm outline-none"
                            value={form.comment}
                            onChange={(e) =>
                                handleFormChange(
                                    "comment",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="rounded-2xl w-full bg-white p-3">
                        <div className="mb-3 p-2 bg-[#F7F7F7] rounded-xl text-sm font-medium">
                            <div>Дата выполнения</div>
                            <div className="text-xs text-gray-400 mt-1">
                                {period.from && period.to
                                    ? `${period.from.toLocaleDateString()} – ${period.to.toLocaleDateString()}`
                                    : "Выберите период"}
                            </div>
                        </div>

                        <div className="mb-2 flex justify-between">
                            <div className="font-medium">
                                {currentMonth.toLocaleString("ru-RU", {
                                    month: "long"
                                })}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={prevMonth}>
                                    <ChevronLeft size={18} />
                                </button>
                                <button onClick={nextMonth}>
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 text-xs text-center mb-2">
                            {["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"].map(d => (
                                <div key={d} className="text-gray-400">{d}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-xs">
                            {blanks.map((_, i) => <div key={i} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const date = new Date(
                                    currentMonth.getFullYear(),
                                    currentMonth.getMonth(),
                                    i + 1
                                );
                                return (
                                    <div
                                        key={i}
                                        onClick={() => handleDayClick(date)}
                                        className={`h-9 flex items-center justify-center rounded-lg cursor-pointer
                                            ${isActive(date)
                                                ? "bg-green-400 text-white"
                                                : "bg-gray-100"}`}
                                    >
                                        {i + 1}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="mt-6 rounded-2xl border-2 border-dashed border-gray-200 bg-white py-6 text-center text-sm text-gray-400 cursor-pointer"
                onClick={() => fileInputRef.current.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
            >
                Добавьте файл кликом или перетащите сюда
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={e => handleFiles(e.target.files)}
                />
            </div>

            {files.map(f => (
                <div
                    key={f.id}
                    className="mt-2 flex justify-between bg-gray-100 px-3 py-1 rounded text-sm"
                >
                    {f.name}
                    <X
                        size={14}
                        className="cursor-pointer text-red-500"
                        onClick={() => removeFile(f.id)}
                    />
                </div>
            ))}

            <div className="mt-6 flex justify-center">
                <button
                    onClick={createOrder}
                    disabled={creating}
                    className="bg-[#C30000] px-8 py-3 text-white rounded-lg disabled:opacity-50"
                >
                    {creating ? "Создание..." : "Создать заявку"}
                </button>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 text-center">
                        <h2 className="text-lg font-semibold mb-4">
                            Заявка создана 🎉
                        </h2>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() =>
                                    router.push("/applications")
                                }
                                className="bg-red-600 text-white px-4 py-2 rounded"
                            >
                                К заявкам
                            </button>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="border px-4 py-2 rounded"
                            >
                                Продолжить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
