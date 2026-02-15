"use client";

import React, { useRef, useState } from 'react'
import toast from "react-hot-toast";

export default function OrderPage() {

    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const toastId = toast.loading("Загрузка прайс-листа...");

            const res = await fetch("/api/price/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            toast.dismiss(toastId);

            if (res.ok) {
                toast.success("Прайс успешно загружен ✅");
            } else {
                toast.error(data.message || "Ошибка загрузки");
            }
        } catch (error) {
            toast.error("Ошибка сервера");
        } finally {
            setLoading(false);
            e.target.value = "";
        }
    };

    const handleDownload = async () => {
        try {
            const toastId = toast.loading("Поиск прайса...");

            const res = await fetch("/api/price/current");
            const data = await res.json();

            toast.dismiss(toastId);

            if (res.ok && data.url) {
                toast.success("Прайс найден ✅");
                window.open(data.url, "_blank");
            } else {
                toast.error("Прайс не найден");
            }
        } catch (error) {
            toast.error("Ошибка загрузки");
        }
    };

    return (
        <div className='w-full mb-5 lg:mb-0  lg:p-6 p-2'>
            <div className="flex lg:flex-row flex-col gap-2">
                <button
                    onClick={handleDownload}
                    className="rounded-[8px] cursor-pointer border-2 text-[#C30000] border-[#C30000] px-6 py-3 text-sm font-semibold hover:bg-[#C30000] hover:text-white transition"
                >
                    Скачать прайс лист
                </button>

                <button
                    onClick={handleUploadClick}
                    className="rounded-[8px] cursor-pointer border-2 text-white bg-[#C30000] border-[#C30000] px-6 py-3 text-sm font-semibold hover:text-[#C30000] hover:bg-white transition"
                >
                    Загрузить новый прайс лист
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
            <div className="w-full overflow-hidden mt-5 rounded-md border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <tbody>
                        {[
                            ["Установка дверей стоимостью эконом класса до 2000р", "2000,00р."],
                            ["Установка двери МДФ", "1800,00р."],
                            ["Установка деревянных дверей", "1800,00р."],
                            ["Двери эмаль, телескоп и стоимость от 8000р", "2500,00р."],
                            ["Установка двери (от 2-х шт) телескоп стоимостью от 2000руб.", "2200,00р."],
                            ["Установка одной двери на объекте (минимальный выезд)", "3600,00р."],
                            ["Установка распашной двустворчатой двери", "4000,00р."],
                            ["Установка распашной двустворчатой двери телескоп, эмаль и стоимость от 8000руб.", "4500,00р."],
                            ['Установка двери "книжка"', "4000,00р."],
                            ['Установка двустворчатой двери "книжка"', "8000,00р."],
                            ["Установка шпонированной двери", "2200,00р."],
                            ['Установка двери с Компланарной коробкой (от 2-х шт) "Silvia" на клей', "3500,00р."],
                            ["Установка дверей экошпон", "2200,00р."],
                            ["Установка дверей книжка", "3000,00р."],
                            ["Установка стеклянных дверей", "2500,00р."],
                            ["Установка двери из массива ценных пород дерева (бук, дуб и т. д.)", "3500,00р."],
                            ["Установка откатных дверей", "2500,00р."],
                            ["Установка дверей гармошка", "1800,0р."],
                        ].map(([title, price], i) => (
                            <tr
                                key={i}
                                className={i % 2 === 0 ? "bg-[#F2F7F8]" : "bg-white"}
                            >
                                <td className="px-4 py-3 text-gray-700">
                                    {title}
                                </td>
                                <td className="px-4 py-3 text-right font-medium text-gray-700 whitespace-nowrap">
                                    {price}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}
