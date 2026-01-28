import Image from 'next/image'
import React from 'react'

export default function NotifPage() {
    return (
        <div>
            <section className="w-full mb-5 lg:mb-0  lg:p-6 p-2">
                <div className="rounded-[12px] h-[680px] bg-white px-6 py-5 flex flex-col">
                    <h3 className="mb-6 text-base font-semibold text-gray-900 shrink-0">
                        Уведомления по заявкам
                    </h3>

                    <div className="flex-1 overflow-y-auto custom-scroll space-y-5 pr-2">
                        {[
                            ["АД00521250", "Ожидает услугу", "#61D0DC", 'Ваша заявка №АД00521250 взята в обработку'],
                            ["АД00521251", "Ожидает услугу", "#61D0DC", 'По вашей заявке №АД00521251 назначена дата монтажа: 30 мая'],
                            ["АД00521252", "Ожидает услугу", "#61D0DC", 'К заявке №АД00521252 добавлен новый файл: Акт выполненных работ'],
                            ["АД00521253", "Ожидает услугу", "#61D0DC", 'Статус заявки №АД00521253 изменен на "Выполнен"'],
                        ].map(([id, status, color, text]) => (
                            <div key={id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Image src="/icon.png" alt="logo" width={40} height={40} />
                                    <div>
                                        <p className="text-xs text-[#C30000] font-semibold">{text}</p>
                                        <p className="text-sm font-semibold text-gray-900">{id}</p>
                                        <p className="text-xs text-[#1C1D21]">Монтаж дверей</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-[#1C1D21]">15.01.2026</p>
                                    <p
                                        className={`text-xs`} style={{ color: color }}
                                    >
                                        {status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
