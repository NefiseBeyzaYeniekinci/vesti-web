"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { wardrobeApi } from "@/lib/api/wardrobe.api";
import { Plus, UploadCloud, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Zod form validation schema
const addClothingSchema = z.object({
    category: z.string().min(2, "Kategori en az 2 karakter olmalıdır."),
    color: z.string().min(2, "Renk belirtmelisiniz."),
    brand: z.string().optional(),
    season: z.string().min(1, "Lütfen bir mevsim yazın (Örn: Yaz, Kış)."),
    image: z.any()
        .refine((files) => typeof window !== "undefined" && files instanceof FileList && files.length === 1, "Kıyafet fotoğrafı yüklemek zorunludur.")
        .refine((files) => typeof window !== "undefined" && files instanceof FileList && files[0]?.size <= 5000000, "Dosya boyutu 5MB'dan küçük olmalıdır.")
        .refine(
            (files) => typeof window !== "undefined" && files instanceof FileList && ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files[0]?.type),
            "Sadece .jpg, .jpeg, .png ve .webp formatları desteklenir."
        ),
});

type FormValues = z.infer<typeof addClothingSchema>;

export function AddClothingModal() {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<FormValues>({
        resolver: zodResolver(addClothingSchema),
        defaultValues: {
            category: "",
            color: "",
            brand: "",
            season: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: FormValues) => {
            const { image, ...restData } = data;
            const file = image[0] as File;
            const formattedData = {
                ...restData,
                season: restData.season.split(",").map((s) => s.trim()),
            };
            return await wardrobeApi.add(formattedData, file);
        },
        onSuccess: () => {
            toast.success("Kıyafet gardırobunuza başarıyla eklendi!");
            queryClient.invalidateQueries({ queryKey: ["wardrobe"] });
            setOpen(false);
            form.reset();
            setPreview(null);
        },
        onError: () => {
            toast.error("Kıyafet eklenirken bir hata oluştu.");
        },
    });

    function onSubmit(data: FormValues) {
        mutation.mutate(data);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-vesti-primary hover:bg-vesti-dark font-medium transition-colors">
                    <Plus className="w-5 h-5 mr-2" /> Kıyafet Ekle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Yeni Kıyafet Ekle</DialogTitle>
                    <DialogDescription>
                        Dolabınıza eklemek istediğiniz kıyafetin resmini ve bilgilerini girin.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field: { onChange, value, ...rest } }) => (
                                <FormItem>
                                    <FormLabel>Kıyafet Fotoğrafı</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="dropzone-file"
                                                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors relative overflow-hidden ${isDragging
                                                    ? "border-vesti-primary bg-vesti-primary/10"
                                                    : "border-vesti-primary bg-gray-50 hover:bg-gray-100"
                                                    }`}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(true);
                                                }}
                                                onDragLeave={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(false);
                                                }}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(false);
                                                    const files = e.dataTransfer.files;
                                                    if (files && files.length > 0) {
                                                        onChange(files);
                                                        setPreview(URL.createObjectURL(files[0]));
                                                    }
                                                }}
                                            >
                                                {preview ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={preview} alt="Önizleme" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <UploadCloud className={`w-8 h-8 mb-3 ${isDragging ? "text-vesti-dark scale-110" : "text-vesti-primary"} transition-all`} />
                                                        <p className="mb-2 text-sm text-gray-500 font-semibold">
                                                            {isDragging ? "Fotoğrafı buraya bırakın" : "Yüklemek için tıklayın veya sürükleyin"}
                                                        </p>
                                                        <p className="text-xs text-gray-400">PNG, JPG, WEBP (Maks. 5MB)</p>
                                                    </div>
                                                )}
                                                <input
                                                    id="dropzone-file"
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/webp"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const files = e.target.files;
                                                        if (files && files.length > 0) {
                                                            onChange(files);
                                                            setPreview(URL.createObjectURL(files[0]));
                                                        }
                                                    }}
                                                    {...rest}
                                                />
                                            </label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kategori</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Örn: T-Shirt" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Renk</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Örn: Mavi" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marka (Opsiyonel)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Örn: Zara" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="season"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mevsim</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Örn: Yaz, İlkbahar" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-vesti-primary hover:bg-vesti-dark transition-colors"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mutation.isPending ? "Ekleniyor..." : "Gardıroba Ekle"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
