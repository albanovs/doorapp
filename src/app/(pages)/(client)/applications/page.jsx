import Image from 'next/image'
import React from 'react'

export default function ApplPage() {
    return (
        <div>
            <section className="w-full mb-5 lg:mb-0  lg:p-6 p-2">
                <div className="rounded-[12px] h-[680px] bg-white px-6 py-5 flex flex-col">
                    <h3 className="mb-6 text-base font-semibold text-gray-900 shrink-0">
                        Активные заявки
                    </h3>

                    <div className="flex-1 overflow-y-auto custom-scroll space-y-5 pr-2">
                        {[
                            ["АД00521250", "Ожидает звонок", "#61DC81"],
                            ["АД00521251", "Ожидает услугу", "#61D0DC"],
                            ["АД00521252", "Завершен", "#9ADC61"],
                            ["АД00521253", "Ожидает звонок", "#61DC81"],
                            ["АД00521254", "Ожидает услугу", "#61D0DC"],
                            ["АД00521255", "Завершен", "#9ADC61"],
                        ].map(([id, status, color]) => (
                            <div key={id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Image src="/icon.png" alt="logo" width={40} height={40} />
                                    <div>
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
