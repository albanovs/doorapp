"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../../store/ordersSlice";
import { Pen, Phone, PhoneCall, Trash2, User2 } from "lucide-react";
import DetailSkeleton from "../../../../../components/Skeleton";

export default function DetailPage({ params }) {
    const [id, setId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showWorkDateModal, setShowWorkDateModal] = useState(false);
    const [selectedWorkDate, setSelectedWorkDate] = useState(null);
    const router = useRouter();
    const dispatch = useDispatch();

    const { list: orders, loading, loaded } = useSelector(
        (state) => state.orders
    );

    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState(null);
    const [newFiles, setNewFiles] = useState([]);
    const [filesToDelete, setFilesToDelete] = useState([]);

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

    useEffect(() => {
        if (order) setForm({ ...order });
    }, [order]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileAdd = (e) => {
        const filesArray = Array.from(e.target.files);

        const filteredFiles = filesArray.filter(
            (file) => !newFiles.some((f) => f.name === file.name)
        );

        setNewFiles([...newFiles, ...filteredFiles]);
    };

    const handleCancel = () => {
        setForm({ ...order });
        setNewFiles([]);
        setFilesToDelete([]);
        setIsEdit(false);
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("_id", form._id);
        formData.append("commentManager", form.commentManager || "");
        formData.append("status", form.status || "");
        formData.append("price", form.price || "");
        formData.append("workDate", form.workDate || "");
        formData.append("managerName", form.managerName || "");
        formData.append("managerPhone", form.managerPhone || "");
        formData.append("specialistName", form.specialistName || "");
        formData.append("specialistPhone", form.specialistPhone || "");

        newFiles.forEach((file) => {
            formData.append("managerFile", file);
        });

        await fetch("/api/orders/update", {
            method: "PUT",
            body: formData,
        });

        setIsEdit(false);
        setNewFiles([]);
        setFilesToDelete([]);
        dispatch(fetchOrders());
    };

    const statusColors = {
        "Ожидает звонок": "#61DC81",
        "Ожидает услугу": "#61D0DC",
        "Приостановлен": "#61A9DC",
        "Завершен": "#9ADC61",
        "Отменен": "#DC6161",
    };

    const handleToggleComplaint = async () => {
        const newValue = !form.complaint;

        setForm(prev => ({
            ...prev,
            complaint: newValue
        }));

        const formData = new FormData();
        formData.append("_id", form._id);
        formData.append("complaint", newValue);

        await fetch("/api/orders/update", {
            method: "PUT",
            body: formData,
        });

        dispatch(fetchOrders());
    };

    const handleDelete = async () => {
        await fetch(`/api/orders/${form._id}`, {
            method: "DELETE",
        });

        setShowDeleteModal(false);

        router.push("/admin/applications");
    };

    const openWorkDateModal = () => {
        if (form?.periodDate?.from && form?.periodDate?.to) {
            setSelectedWorkDate(form.workDate ? new Date(form.workDate) : null);
            setShowWorkDateModal(true);
        }
    };

    const saveWorkDate = () => {
        if (selectedWorkDate) {
            setForm({ ...form, workDate: selectedWorkDate.toISOString() });
        }
        setShowWorkDateModal(false);
    };

    const renderCalendarDays = () => {
        const from = new Date(form.periodDate.from);
        const to = new Date(form.periodDate.to);
        const days = [];
        const current = new Date(from);

        while (current <= to) {
            const dayCopy = new Date(current);
            days.push(
                <div
                    key={dayCopy.toISOString()}
                    onClick={() => setSelectedWorkDate(new Date(dayCopy.setHours(selectedWorkDate?.getHours() || 9, selectedWorkDate?.getMinutes() || 0)))}
                    className={`cursor-pointer p-2 rounded ${selectedWorkDate &&
                        selectedWorkDate.toDateString() === dayCopy.toDateString()
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-black"
                        }`}
                >
                    {dayCopy.getDate()}/{dayCopy.getMonth() + 1}
                </div>
            );
            current.setDate(current.getDate() + 1);
        }
        return days;
    };



    if (loading || !form) return <DetailSkeleton />;
    if (!order || !form)
        return <p className="text-center pt-10">Заявка не найдена</p>;

    return (
        <div className="lg:p-5 full min-h-screen space-y-6">

            <div className="flex justify-between items-center">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-gray-500 cursor-pointer hover:text-gray-700"
                >
                    ← К заявкам
                </button>

                {!isEdit ? (
                    <button
                        onClick={() => setIsEdit(true)}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                    >
                        Редактировать
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Сохранить
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Отмена
                        </button>
                    </div>
                )}
            </div>

            <div className="grid gap-5 grid-cols-1 lg:grid-cols-3 min-h-screen">
                <div className="flex flex-col gap-5 lg:col-span-1 h-full">
                    <div className="bg-white rounded-xl w-full flex-[0.6] p-5 space-y-4">
                        <div className="flex lg:flex-row flex-col gap-5 justify-between items-start">
                            <div>
                                <h2 className="font-semibold text-lg">
                                    {form.orderName}
                                </h2>
                                <p className="text-xs text-gray-400">
                                    Информация о заказе
                                </p>
                            </div>

                            <div className="text-xs text-gray-400 space-y-1">
                                <div className="flex gap-2 items-center">
                                    <User2 size={14} />
                                    {form.clientName}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Phone size={14} />
                                    {form.clientPhone}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Block label="Тип заявки" value={form.orderType} />
                            <Block label="Город" value={form.city} />
                            <Block label="Улица" value={form.street} />
                            <Block label="Дом" value={form.home} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl w-full flex-[0.4] p-5 space-y-5">
                        <div>
                            <p className=" text-[#1C1D21] font-semibold text-[20px] mb-2">
                                Файлы, прикрепленные магазином
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {form.clientFile?.length ? (
                                    form.clientFile.map((f, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-100 px-3 py-1 rounded-md text-xs flex items-center gap-2"
                                        >
                                            <a href={f.url} download={true} target="_blank">
                                                {f.name}
                                            </a>
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
                            <p className=" text-[#1C1D21] font-semibold text-[20px] mb-2">
                                Файлы, прикрепленные менеджером
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {form.managerFile?.length ? (
                                    form.managerFile.map((f, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-100 px-3 py-1 rounded-md text-xs flex items-center gap-2"
                                        >
                                            <a href={f.url} download={true} target="_blank">
                                                {f.name}
                                            </a>
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
                        <div className="w-full flex  lg:flex-row flex-col gap-5 min-h-30">
                            <div className="bg-white p-5 rounded-2xl lg:flex-[5]">
                                <p className="text-sm text-[#1C1D21] font-semibold">
                                    Комментарий к заказу
                                </p>
                                {isEdit ? (
                                    <textarea
                                        name="commentManager"
                                        value={form.commentManager || ""}
                                        onChange={handleChange}
                                        className="w-full border-b border-red-500 outline-none mt-2 p-2 text-sm"
                                    />
                                ) : (
                                    <p className="text-sm mt-2">
                                        {form.commentManager || "-"}
                                    </p>
                                )}
                            </div>

                            <div className="bg-white p-5 rounded-2xl lg:flex-2">
                                <p className="text-sm text-[#1C1D21] font-semibold">
                                    Статус заявки
                                </p>
                                {isEdit ? (
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="mt-2 border-b border-red-500 outline-none text-xs w-full"
                                    >
                                        {Object.keys(statusColors).map((s) => (
                                            <option key={s}>{s}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p
                                        className="text-xs font-medium mt-2"
                                        style={{ color: statusColors[form.status] }}
                                    >
                                        {form.status}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">

                                <div
                                    onClick={handleToggleComplaint}
                                    className={`w-12 h-12 flex items-center justify-center rounded-[8px] text-[40px] cursor-pointer transition-all duration-200
        ${form.complaint
                                            ? "bg-[#C30000] text-white border border-[#C30000]"
                                            : "bg-white text-[#C30000] border border-[#C30000]"
                                        }`}
                                >
                                    !
                                </div>

                                <div
                                    onClick={() => setShowDeleteModal(true)}
                                    className="bg-white w-12 h-12 border border-[#C30000] rounded-[8px] flex items-center justify-center cursor-pointer"
                                >
                                    <Trash2 size={30} color="#C30000" />
                                </div>

                            </div>
                            {showDeleteModal && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-[12px] w-[400px]">
                                        <h2 className="text-lg font-semibold mb-4">
                                            Вы действительно хотите удалить заявку?
                                        </h2>

                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => setShowDeleteModal(false)}
                                                className="px-4 py-2 border rounded-[6px]"
                                            >
                                                Отмена
                                            </button>

                                            <button
                                                onClick={handleDelete}
                                                className="px-4 py-2 bg-[#C30000] text-white rounded-[6px]"
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="w-full flex lg:flex-row flex-col gap-5 flex-1">
                            <div className="bg-white flex-1 rounded-xl p-5 space-y-6">
                                {isEdit ? (
                                    <>
                                        <EditablePerson
                                            title="Менеджер"
                                            name={form.managerName}
                                            phone={form.managerPhone}
                                            onChange={(field, value) =>
                                                setForm({ ...form, [field]: value })
                                            }
                                        />
                                        <EditablePerson
                                            title="Специалист по монтажу"
                                            name={form.specialistName}
                                            phone={form.specialistPhone}
                                            onChange={(field, value) =>
                                                setForm({ ...form, [field]: value })
                                            }
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Person
                                            title="Менеджер"
                                            name={form.managerName}
                                            phone={form.managerPhone}
                                        />
                                        <Person
                                            title="Специалист по монтажу"
                                            name={form.specialistName}
                                            phone={form.specialistPhone}
                                        />
                                    </>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col space-y-3">
                                <div className="bg-white flex items-center justify-between flex-1 rounded-xl p-5">
                                    <p className="text-sm text-[#1C1D21] font-semibold">
                                        Стоимость
                                    </p>
                                    {isEdit ? (
                                        <input
                                            type="number"
                                            name="price"
                                            value={form.price}
                                            onChange={handleChange}
                                            className="border-b border-red-500 outline-none text-xs"
                                        />
                                    ) : (
                                        <p className="text-md flex items-center gap-3 text-[#8181A5] font-semibold">
                                            {form.price || "_________________________"} ₽ <Pen color="#8181A5" size={18} />
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-5">
                                    <div className="bg-white flex flex-col gap-4 flex-1 rounded-xl p-5">
                                        <p className="text-sm text-[#1C1D21] font-semibold">
                                            Дата заявки
                                        </p>
                                        <p className="text-xs text-gray-400 font-medium">
                                            {new Date(
                                                form.orderDate
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="bg-white flex flex-col gap-4 flex-1 rounded-xl p-5">
                                        <p className="text-sm  text-[#1C1D21] font-semibold cursor-pointer" onClick={isEdit ? openWorkDateModal : null}>
                                            Дата назначения работ
                                        </p>
                                        {isEdit ? (
                                            <p className="text-xs text-gray-500 cursor-pointer" onClick={openWorkDateModal}>
                                                {form.workDate
                                                    ? new Date(form.workDate).toLocaleString()
                                                    : "Выберите дату и время"}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-[#8181A5]">
                                                {form.workDate
                                                    ? new Date(form.workDate).toLocaleString()
                                                    : "Дата ещё не назначена"}
                                            </p>
                                        )}
                                    </div>
                                    {showWorkDateModal && (
                                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                            <div className="bg-white p-6 rounded-[12px] w-[400px]">
                                                <h2 className="text-lg font-semibold mb-4">Выберите дату и время</h2>
                                                <p className="text-xs text-gray-400 mb-2">
                                                    Период клиента:{" "}
                                                    {new Date(form.periodDate.from).toLocaleString()} —{" "}
                                                    {new Date(form.periodDate.to).toLocaleString()}
                                                </p>

                                                <div className="grid grid-cols-7 gap-2 mb-4">
                                                    {renderCalendarDays()} {/* Твоя функция генерации календаря */}
                                                </div>

                                                {selectedWorkDate && (
                                                    <div className="flex flex-col gap-2 mb-4">
                                                        <label className="text-xs font-semibold">Выберите время работы</label>
                                                        <input
                                                            type="time"
                                                            value={selectedWorkDate.toTimeString().slice(0, 5)}
                                                            onChange={(e) => {
                                                                const [hours, minutes] = e.target.value.split(":").map(Number);
                                                                if (!isNaN(hours) && !isNaN(minutes)) {
                                                                    const newDate = new Date(selectedWorkDate);
                                                                    newDate.setHours(hours);
                                                                    newDate.setMinutes(minutes);
                                                                    setSelectedWorkDate(newDate);
                                                                }
                                                            }}
                                                            className="border-b border-gray-400 text-xs w-28"
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => setShowWorkDateModal(false)}
                                                        className="px-4 py-2 border rounded-[6px]"
                                                    >
                                                        Отмена
                                                    </button>
                                                    <button
                                                        onClick={saveWorkDate}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-[6px]"
                                                    >
                                                        Сохранить
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl w-full flex-1 p-5">
                            <p className="text-xs text-gray-400 mb-2">
                                Комментарий менеджера магазина
                            </p>
                            <p className="text-sm text-gray-600">
                                {form.comment ||
                                    "Изначальный комментарий, который оставил магазин при создании заявки"}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-10 lg:p-0 text-center rounded-xl w-full flex-[0.4] flex items-center justify-center text-sm text-gray-400">
                        {isEdit ? (
                            <input
                                type="file"
                                multiple
                                onChange={handleFileAdd}
                            />
                        ) : (
                            "Добавьте файл загрузив по клику или перетащив его в область"
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Block({ label, value }) {
    return (
        <div className="bg-[#F5F5FA66] p-3 rounded-xl">
            <p className="text-sm">{label}</p>
            <p className="text-xs font-medium text-gray-400">
                {value || "-"}
            </p>
        </div>
    );
}

function Person({ title, name, phone }) {
    return (
        <div className="flex items-center justify-between">
            <p className="text-md flex-1 text-[#1C1D21] font-semibold">{title}</p>
            <div className="flex flex-1 flex-col gap-3">
                <p className="text-xs font-medium text-gray-400 flex justify-between"><User2 color="#8181A5" size={18} /> {name ? name : "______________________________"}</p>
                <p className="text-xs text-gray-400 flex justify-between"><Phone color="#8181A5" size={18} /> {phone ? phone : "______________________________"}</p>
            </div>
        </div>
    );
}

function EditablePerson({ title, name, phone, onChange }) {
    return (
        <div className="space-y-1">
            <p className="text-xs text-gray-400">{title}</p>
            <input
                type="text"
                value={name || ""}
                onChange={(e) => onChange(title === "Менеджер" ? "managerName" : "specialistName", e.target.value)}
                className="w-full border-b border-red-500 outline-none text-sm"
                placeholder="Имя"
            />
            <input
                type="text"
                value={phone || ""}
                onChange={(e) => onChange(title === "Менеджер" ? "managerPhone" : "specialistPhone", e.target.value)}
                className="w-full border-b border-red-500 outline-none text-sm"
                placeholder="Телефон"
            />
        </div>
    );
}