"use client";

import { useQuery } from "@tanstack/react-query";
import { wardrobeApi, ClothingItem } from "@/lib/api/wardrobe.api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { AddClothingModal } from "@/components/wardrobe/AddClothingModal";

export default function WardrobePage() {
    const { data: clothes, isLoading, isError } = useQuery({
        queryKey: ["wardrobe"],
        queryFn: wardrobeApi.getAll,
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-vesti-dark">Gardırobum</h1>
                    <p className="text-vesti-text text-sm mt-1">Kıyafetlerini görüntüle ve yönet.</p>
                </div>

                {/* Adım 3: Ekleme Modal'ı eklenecek, şimdilik placeholder buton */}
                <AddClothingModal />
            </div>

            {isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[250px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isError && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg">Kıyafetler yüklenirken bir hata oluştu.</div>
            )}

            {!isLoading && !isError && clothes?.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-vesti-text mb-4">Henüz hiç kıyafet eklemediniz.</p>
                    <Button variant="outline" className="border-vesti-primary text-vesti-primary">
                        İlk Kıyafetini Ekle
                    </Button>
                </div>
            )}

            {!isLoading && clothes && clothes.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {clothes.map((item: ClothingItem) => (
                        <Link key={item.id} href={`/wardrobe/${item.id}`}>
                            <div className="group border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <div className="relative h-[250px] w-full bg-gray-100">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.category}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-vesti-dark">{item.brand || item.category}</h3>
                                    <p className="text-vesti-text text-sm">{item.color} - {item.season.join(", ")}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
