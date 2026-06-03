import { Skeleton } from "@/components/ui/skeleton";

export default function MarketplaceItemLoading() {
    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-4 w-32 mb-6" />
            
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Sol Kısım */}
                    <div className="bg-gray-50 p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100 min-h-[400px]">
                        <Skeleton className="w-full max-w-md aspect-[4/5] rounded-2xl" />
                    </div>

                    {/* Sağ Kısım */}
                    <div className="p-8 lg:p-10 flex flex-col h-full space-y-6">
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-20 rounded-md" />
                            <Skeleton className="h-6 w-16 rounded-md" />
                        </div>

                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-10 w-1/3" />

                        <div className="space-y-2 mt-4">
                            <Skeleton className="h-20 w-full rounded-xl" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-16 w-full rounded-xl" />
                            <Skeleton className="h-16 w-full rounded-xl" />
                        </div>

                        <div className="mt-auto pt-8 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-24 rounded-lg" />
                        </div>

                        <div className="flex gap-3">
                            <Skeleton className="h-12 w-full rounded-xl" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
