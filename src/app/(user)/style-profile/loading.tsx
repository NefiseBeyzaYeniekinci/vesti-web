import { Skeleton } from "@/components/ui/skeleton";

export default function StyleProfileLoading() {
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm space-y-8">
                <Skeleton className="h-6 w-64" />
                
                <div className="space-y-4">
                    <Skeleton className="h-4 w-48" />
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-10 w-24 rounded-full" />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <Skeleton className="h-10 w-24 rounded-md" />
                </div>
            </div>
        </div>
    );
}
