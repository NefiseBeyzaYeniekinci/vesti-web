import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-4 w-32 mb-6" />
            <Skeleton className="h-8 w-64 mb-8" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sol Kısım - Ürün Özeti */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 sticky top-24">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-48 w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex justify-between">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>
                </div>

                {/* Sağ Kısım - Ödeme Formu */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <Skeleton className="h-6 w-48 mb-4" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <Skeleton className="h-6 w-48 mb-4" />
                        <div className="space-y-4">
                            <Skeleton className="h-16 w-full rounded-xl" />
                            <Skeleton className="h-16 w-full rounded-xl" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
