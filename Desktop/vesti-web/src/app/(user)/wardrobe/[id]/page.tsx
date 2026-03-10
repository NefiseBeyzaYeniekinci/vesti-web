"use client";

import { useQuery } from "@tanstack/react-query";
import { wardrobeApi } from "@/lib/api/wardrobe.api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export default function WardrobeItemPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: item, isLoading, isError } = useQuery({
        queryKey: ["wardrobeItem", id],
        queryFn: () => wardrobeApi.getById(id),
    });

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto">
                <Button variant="ghost" className="pl-0 hover:bg-transparent" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Skeleton className="h-[500px] w-full rounded-2xl" />
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-3/4" />
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-6 w-2/3" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !item) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto text-center">
                <Button variant="ghost" className="mb-8" onClick={() => router.push("/wardrobe")}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Gardıroba Dön
                </Button>
                <div className="bg-red-50 text-red-500 p-8 rounded-2xl flex flex-col items-center">
                    <p className="text-xl font-medium mb-4">Kıyafet bulunamadı veya yüklenirken bir hata oluştu.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Button variant="ghost" className="pl-0 hover:bg-transparent text-vesti-text hover:text-vesti-dark transition-colors" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
            </Button>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 lg:gap-12">
                {/* Image Section */}
                <div className="w-full md:w-1/2 relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image
                        src={item.imageUrl}
                        alt={item.category}
                        fill
                        className="object-contain p-4"
                        priority
                    />
                </div>

                {/* Info Section */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-vesti-dark mb-2">{item.brand || item.category}</h1>
                            {item.brand && <p className="text-lg text-vesti-text font-medium">{item.category}</p>}
                        </div>

                        <div className="flex space-x-2">
                            <Button variant="outline" size="icon" className="h-10 w-10 text-vesti-primary border-vesti-primary hover:bg-vesti-primary hover:text-white transition-colors" title="Düzenle">
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-10 w-10 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-500 transition-colors" title="Sil">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6 flex-grow border-t border-gray-100 pt-6">
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Renk</h3>
                                <p className="text-lg text-vesti-dark font-medium flex items-center gap-2">
                                    <span
                                        className="w-4 h-4 rounded-full border border-gray-200 inline-block"
                                        style={{ backgroundColor: item.color === 'Siyah' ? '#000' : item.color === 'Beyaz' ? '#fff' : item.color === 'Mavi' ? '#3b82f6' : 'transparent' }}
                                    ></span>
                                    {item.color}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Mevsim</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {item.season.map((s) => (
                                        <span key={s} className="px-3 py-1 bg-gray-100 text-vesti-dark text-sm rounded-full font-medium">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {item.size && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Beden</h3>
                                    <p className="text-lg text-vesti-dark font-medium">{item.size}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Eklenme Tarihi</h3>
                                <p className="text-base text-vesti-dark font-medium">
                                    {new Date(item.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
