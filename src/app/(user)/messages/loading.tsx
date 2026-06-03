import { Skeleton } from "@/components/ui/skeleton";

export default function MessagesLoading() {
  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-10rem)] flex rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white">
      <div className="w-80 border-r border-gray-100 hidden md:flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-[65vh] w-full rounded-xl" />
      </div>
    </div>
  );
}
