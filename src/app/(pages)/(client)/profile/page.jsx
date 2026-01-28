'use client';

import Image from 'next/image'
import React from 'react'
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function ProfilePage() {


    const router = useRouter();

    return (
        <div>
            <main className="">
                <div className="mx-auto flex lg:flex-row flex-col w-full">

                    <section className=" min-h-screen rounded-[12px] lg:rounded-none p-4 lg:w-96 bg-white">
                        <div className="space-y-4">

                            <div className="mb-2 flex pt-10 py-5 items-center gap-3">
                                <div
                                    className="flex h-20 w-20 text-3xl items-center justify-center rounded-[30px] text-white font-bold"
                                    style={{ background: 'linear-gradient(135deg, #F10000, #C30000)' }}
                                >
                                    A
                                </div>
                                <h2 className="text-lg text-[20px] font-semibold text-gray-900">
                                    Академия дверей
                                </h2>
                            </div>

                            {[
                                ["Название магазина", "Академия дверей"],
                                ["ФИО менеджера", "Иванов Иван Иванович"],
                                ["Контактный телефон", "+7 (999) 999-99-99"],
                                ["Email", "ivan@gmail.com"],
                                ["Пароль", "qwerty123"],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-between rounded-xl bg-[#F5F5FA66] px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {label}
                                        </p>
                                        <p className="text-sm text-[#8181A5]">
                                            {value}
                                        </p>
                                    </div>

                                    <button className="text-gray-400 hover:text-gray-600 transition">
                                        <Image src="/pen.svg" alt="edit" width={14} height={14} />
                                    </button>
                                </div>
                            ))}

                        </div>

                        <div className="space-y-3">
                            <h3 className="mb-5 mt-10 text-[20px] font-semibold text-gray-900">
                                Адрес магазина
                            </h3>

                            {[
                                ["Город", "г. Москва"],
                                ["Улица", "ул. Складочная"],
                                ["Дом", "25/20с1"],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-between rounded-xl bg-[#F5F5FA66] px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {label}
                                        </p>
                                        <p className="text-sm text-[#8181A5]">
                                            {value}
                                        </p>
                                    </div>

                                    <button className="text-[#8181A5] hover:text-gray-600 transition">
                                        <Image src="/pen.svg" alt="edit" width={14} height={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="w-full lg:m-6 mt-6">
                        <div className="rounded-[12px] w-full bg-white px-6 py-5">
                            <h3 className="mb-6 text-base font-semibold text-gray-900">
                                Активные заявки
                            </h3>

                            <div className="space-y-5">

                                {[
                                    ["АД00521250", "Ожидает звонок", "#61DC81"],
                                    ["АД00521251", "Ожидает услугу", "#61D0DC"],
                                    ["АД00521252", "Завершен", "#9ADC61"],
                                    ["АД00521253", "Ожидает звонок", "#61DC81"],
                                    ["АД00521254", "Ожидает услугу", "#61D0DC"],
                                    ["АД00521255", "Завершен", "#9ADC61"],
                                ].map(([id, status, color]) => (
                                    <div
                                        key={id}
                                        className="flex items-center justify-between"
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
                                                    {id}
                                                </p>
                                                <p className="text-xs text-[#1C1D21]">
                                                    Монтаж дверей
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-[#1C1D21]">
                                                15.01.2026
                                            </p>
                                            <p
                                                className={`text-xs`} style={{ color: color }}
                                            >
                                                {status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-center">
                                <button onClick={() => router.push('/applications')} className="rounded-[8px] cursor-pointer bg-[#C30000] px-9 py-4 text-sm font-semibold text-white hover:bg-red-600 transition">
                                    Посмотреть все
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-6 mt-6">

                            <div className="relative bg-white w-full h-[300px] rounded-xl overflow-hidden p-6">
                                <h3 className="text-lg font-semibold">
                                    Добавить новую заявку
                                </h3>

                                <Image
                                    src="/worker.png"
                                    alt="workers"
                                    width={360}
                                    height={260}
                                    className="absolute bottom-0 right-0 object-contain"
                                    priority
                                />
                            </div>

                            <Link href="/orders" className="relative cursor-pointer bg-white w-full h-[300px] rounded-xl overflow-hidden p-6">
                                <h3 className="text-lg font-semibold">
                                    Скачать прайс-лист
                                </h3>

                                <Image
                                    src="/blank.png"
                                    alt="documents"
                                    width={320}
                                    height={260}
                                    className="absolute bottom-0 right-0 object-contain"
                                    priority
                                />
                            </Link>

                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
