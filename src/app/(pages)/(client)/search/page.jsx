import Image from 'next/image'
import React from 'react'
import { Search } from 'lucide-react'

export default function SearchPage() {
    return (
        <div>
            <section className="w-full mb-5 lg:mb-0 lg:p-6 p-2">
                <div className="rounded-[12px] h-[680px] bg-white py-5 flex flex-col">

                    <h3 className="mb-4 px-5 text-base font-semibold text-gray-900 shrink-0">
                        Поиск заявки
                    </h3>

                    <div className="relative mb-6 shrink-0">
                        <input
                            type="text"
                            placeholder="АД00521250"
                            className="
                                w-full h-[60px] 
                                bg-[#F5F5FA66]
                                pl-5
                                text-sm text-gray-900
                                placeholder:text-[#8181A5]
                                outline-none
                                focus:border-b focus:border-b-[#C30000]
                            "
                        />

                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8B8FA3]">
                            <Search size={20} />
                        </span>
                    </div>

                    {/* Список */}
                    <div className="flex-1 px-6 overflow-y-auto custom-scroll space-y-5 ">
                        {[
                            ["АД00521250", "Ожидает звонок", "#61DC81"],
                        ].map(([id, status, color]) => (
                            <div key={id} className="flex items-center justify-between">
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
                                        25.12.2025
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

                </div>
            </section >
        </div >
    )
}
