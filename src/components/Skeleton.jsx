import React from 'react'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


export default function DetailSkeleton() {
    return (
        <div className="lg:p-5 min-h-screen space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton width={120} height={20} />
                <Skeleton width={130} height={36} borderRadius={8} />
            </div>

            <div className="grid gap-5 grid-cols-1 lg:grid-cols-3 min-h-screen">

                <div className="flex flex-col gap-5 lg:col-span-1">
                    <div className="bg-white rounded-xl p-5 space-y-4">
                        <Skeleton height={28} width={150} />
                        <Skeleton height={14} width={120} />
                        <Skeleton count={4} height={40} />
                    </div>

                    <div className="bg-white rounded-xl p-5 space-y-3">
                        <Skeleton height={20} width={200} />
                        <Skeleton count={3} height={20} />
                    </div>
                </div>

                <div className="flex flex-col gap-5 lg:col-span-2">
                    <div className="bg-white rounded-xl p-5 space-y-4">
                        <Skeleton height={20} width={200} />
                        <Skeleton height={80} />
                    </div>

                    <div className="bg-white rounded-xl p-5 space-y-4">
                        <Skeleton height={20} width={200} />
                        <Skeleton count={3} height={30} />
                    </div>

                    <div className="bg-white rounded-xl p-5">
                        <Skeleton height={120} />
                    </div>
                </div>
            </div>
        </div>
    )
}
