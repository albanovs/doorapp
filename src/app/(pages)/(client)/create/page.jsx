"use client";

import {
    ArrowLeft,
    Pencil,
    ChevronLeft,
    ChevronRight,
    User,
    Phone,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreatePage() {

    const router = useRouter();

    return (
        <div className="lg:p-5">
            <div className="mb-5">
                <button onClick={() => router.push("/applications")} className="flex cursor-pointer items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeft size={16} />
                    К заявкам
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
                <div className="bg-white p-6 rounded-[10px]">
                    <div className="space-y-4">
                        <div className="mb-10">
                            <div className="flex justify-between">
                                <div>
                                    <div className="font-semibold text-sm">АД00521250</div>
                                    <div className="text-xs text-gray-400">
                                        Информация о заказе
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <User size={12} className="text-gray-400" />
                                        <span>Иванов Иван Иванов</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Phone size={12} className="text-gray-400" />
                                        <span>+7 (999) 999-99-99</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {[
                            ["Тип заявки", "Монтаж"],
                            ["Город", "г. Москва"],
                            ["Улица", "ул. Спиридоновка"],
                            ["Дом", "25/20с1"],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-[12px] bg-[#F7F7F7] py-3 px-4 flex justify-between items-center"
                            >
                                <div>
                                    <div className="text-xs text-gray-400">{label}</div>
                                    <div className="text-sm">{value}</div>
                                </div>
                                <Image
                                    src="/pen.svg"
                                    alt="edit"
                                    width={12}
                                    height={12}
                                    className="cursor-pointer"
                                />
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
                            placeholder="Монтаж"
                            className="flex-1 resize-none rounded-xl  border-gray-200 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* RIGHT */}
                    <div className="rounded-2xl flex flex-col justify-between w-full bg-white">
                        <div className="mb-3 flex items-start justify-between p-3 bg-[#F7F7F7] rounded-[12px] text-sm font-medium">
                            <div>
                                Дата выполнения
                                <div className="mt-1 text-xs text-gray-400">
                                    15.01.2026 – 22.01.2026
                                </div>
                            </div>
                            <Image src="/pen.svg" alt="edit" width={14} height={14} className="text-gray-400" />
                        </div>



                        <div className="mb-2 flex items-center justify-between">
                            <div className="font-medium">Январь</div>
                            <div className="flex gap-2 text-gray-500">
                                <ChevronLeft size={18} />
                                <ChevronRight size={18} />
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                            {["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"].map(d => (
                                <div key={d} className="text-gray-400">{d}</div>
                            ))}

                            {[
                                29, 30, 31, 1, 2, 3, 4,
                                5, 6, 7, 8, 9, 10, 11,
                                12, 13, 14, 15, 16, 17, 18,
                                19, 20, 21, 22, 23, 24, 25,
                                26, 27, 28, 29, 30, 31, 1
                            ].map((day, i) => {
                                const active = day >= 15 && day <= 22;
                                const weekend = i % 7 === 5 || i % 7 === 6;

                                return (
                                    <div
                                        key={i}
                                        className={`h-9 flex items-center justify-center rounded-lg
                    ${active ? "bg-green-400 text-white" : "bg-gray-100"}
                    ${!active && weekend ? "text-red-400" : "text-gray-700"}
                  `}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* FILE UPLOAD */}
            <div className="mt-6 rounded-2xl border-2 border-dashed border-gray-200 bg-white py-12 text-center text-sm text-gray-400">
                Добавьте файл загрузив по клику или перетащив его в область
            </div>

            {/* ACTION */}
            <div className="mt-6 flex justify-center">
                <button className="rounded-[8px] bg-[#C30000] px-8 py-3 text-sm font-medium cursor-pointer text-white hover:bg-red-600">
                    Создать заявку
                </button>
            </div>
        </div>
    );
}
