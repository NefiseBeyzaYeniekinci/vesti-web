import { Sparkles, Store } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
    return (
        <div className="space-y-10 pb-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Skeleton className="h-14 w-32 rounded-2xl" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            {/* Section 1: Kombin Önerileri */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-indigo-300" />
                    <Skeleton className="h-6 w-64" />
                </div>
                <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="min-w-[200px] shrink-0 border border-gray-100 rounded-2xl p-4 space-y-3">
                            <Skeleton className="h-40 w-full rounded-xl" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-5/6" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 2: Marketplace Önerileri */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Store className="w-6 h-6 text-rose-300" />
                        <Skeleton className="h-6 w-64" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="min-w-[200px] shrink-0 border border-gray-100 rounded-2xl p-4 space-y-3">
                            <Skeleton className="h-32 w-full rounded-xl" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-8 w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
