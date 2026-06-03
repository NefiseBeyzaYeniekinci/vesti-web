import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-vesti-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-vesti-primary" />
        <p className="text-sm font-medium text-gray-500 mt-2 animate-pulse">
          Lütfen bekleyin...
        </p>
      </div>
    </div>
  );
}
