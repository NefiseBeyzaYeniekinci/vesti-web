"use client";

import { useState, type ReactNode } from "react";
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

// Predefined sub-categories based on selected category to match UX design
const CATEGORY_SUBTAGS: Record<string, string[]> = {
    'Tişört': ['Basic', 'Oversize', 'Polo', 'V Yaka', 'Baskılı'],
    'Gömlek': ['Classic', 'Oversize', 'Kareli', 'Keten', 'Oxford'],
    'Pantolon': ['Jean', 'Kumaş', 'Kargo', 'Slim Fit', 'Şort'],
    'Ceket': ['Deri Ceket', 'Trençkot', 'Blazer', 'Kışlık', 'Bomber'],
    'Ayakkabı': ['Sneaker', 'Spor', 'Bot', 'Klasik', 'Loafer'],
    'Takımlar': ['Blazer Takım', 'Takım Elbise', 'Eşofman Takımı', 'Casual', 'Erkek', 'Kadın'],
};

const SEASON_TAGS = ['İlkbahar', 'Yaz', 'Sonbahar', 'Kış'];

// Zod form validation schema
const addClothingSchema = z.object({
    category: z.string().min(2, "Kategori en az 2 karakter olmalıdır."),
    color: z.string().min(2, "Renk belirtmelisiniz."),
    brand: z.string().optional(),
    season: z.string().min(1, "Lütfen en az bir alt kategori veya mevsim seçin."),
    image: z.any()
        .refine((files) => typeof window !== "undefined" && files instanceof FileList && files.length === 1, "Kıyafet fotoğrafı yüklemek zorunludur.")
        .refine((files) => typeof window !== "undefined" && files instanceof FileList && files[0]?.size <= 5000000, "Dosya boyutu 5MB'dan küçük olmalıdır.")
        .refine(
            (files) => typeof window !== "undefined" && files instanceof FileList && ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files[0]?.type),
            "Sadece .jpg, .jpeg, .png ve .webp formatları desteklenir."
        ),
});

type FormValues = z.infer<typeof addClothingSchema>;

interface AddClothingModalProps {
    trigger?: ReactNode;
}

export function AddClothingModal({ trigger }: AddClothingModalProps) {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    
    // Custom states for interactive Category & Tags selection
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [customTagInput, setCustomTagInput] = useState<string>("");

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
                season: restData.season.split(",").map((s) => s.trim()).filter(Boolean),
            };
            return await wardrobeApi.add(formattedData, file);
        },
        onSuccess: () => {
            toast.success("Kıyafet gardırobunuza başarıyla eklendi!");
            queryClient.invalidateQueries({ queryKey: ["wardrobe"] });
            setOpen(false);
            form.reset();
            setPreview(null);
            
            // Reset our visual interactive form states
            setSelectedCategory("");
            setIsCustomCategory(false);
            setSelectedTags([]);
            setCustomTagInput("");
        },
        onError: () => {
            toast.error("Kıyafet eklenirken bir hata oluştu.");
        },
    });

    function onSubmit(data: FormValues) {
        mutation.mutate(data);
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) {
                form.reset();
                setPreview(null);
                setSelectedCategory("");
                setIsCustomCategory(false);
                setSelectedTags([]);
                setCustomTagInput("");
            }
        }}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button className="bg-[#7986CB] hover:bg-[#6875b8] font-medium transition-colors">
                        <Plus className="w-5 h-5 mr-2" /> Kıyafet Ekle
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Yeni Kıyafet Ekle</DialogTitle>
                    <DialogDescription>
                        Dolabınıza eklemek istediğiniz kıyafetin resmini ve bilgilerini girin.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Drag and Drop Image Dropzone */}
                        <FormField
                            control={form.control}
                            name="image"
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            render={({ field: { onChange, value: _ignoredValue, ...rest } }) => (
                                <FormItem>
                                    <FormLabel>Kıyafet Fotoğrafı</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="dropzone-file"
                                                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors relative overflow-hidden ${isDragging
                                                    ? "border-[#7986CB] bg-[#7986CB]/10"
                                                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
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
                                                    <img src={preview} alt="Önizleme" className="w-full h-full object-cover animate-fadeIn" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <UploadCloud className={`w-8 h-8 mb-3 ${isDragging ? "text-[#6875b8] scale-110" : "text-[#7986CB]"} transition-all`} />
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

                        {/* Interactive Category Chips */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Kategori Seçin</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(CATEGORY_SUBTAGS).map((cat) => (
                                    <button
                                        type="button"
                                        key={cat}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setIsCustomCategory(false);
                                            form.setValue("category", cat, { shouldValidate: true });
                                            // Reset tags when category changes
                                            setSelectedTags([]);
                                            form.setValue("season", "", { shouldValidate: true });
                                        }}
                                        className="px-4 py-2 text-sm rounded-full font-medium transition-all border"
                                        style={{
                                            backgroundColor: selectedCategory === cat && !isCustomCategory ? '#7986CB' : '#F3F4FD',
                                            color: selectedCategory === cat && !isCustomCategory ? '#ffffff' : '#607080',
                                            borderColor: selectedCategory === cat && !isCustomCategory ? '#7986CB' : '#E0E3E8',
                                        }}
                                    >
                                        {cat === "Tişört" ? "👕 Tişört" :
                                         cat === "Gömlek" ? "👔 Gömlek" :
                                         cat === "Pantolon" ? "👖 Pantolon" :
                                         cat === "Ceket" ? "🧥 Ceket" :
                                         cat === "Ayakkabı" ? "👟 Ayakkabı" :
                                         cat === "Takımlar" ? "💼 Takımlar" : cat}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory("");
                                        setIsCustomCategory(true);
                                        form.setValue("category", "", { shouldValidate: true });
                                        setSelectedTags([]);
                                        form.setValue("season", "", { shouldValidate: true });
                                    }}
                                    className="px-4 py-2 text-sm rounded-full font-medium transition-all border"
                                    style={{
                                        backgroundColor: isCustomCategory ? '#7986CB' : '#F3F4FD',
                                        color: isCustomCategory ? '#ffffff' : '#607080',
                                        borderColor: isCustomCategory ? '#7986CB' : '#E0E3E8',
                                    }}
                                >
                                    ➕ Diğer (Özel)
                                </button>
                            </div>
                        </div>

                        {/* Custom Category Input (if Diğer is selected) */}
                        {isCustomCategory && (
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="animate-fadeIn">
                                        <FormLabel>Kategori Adı</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Örn: Elbise, Aksesuar, vb." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Category Specific Sub-category Chips */}
                        {(selectedCategory || isCustomCategory) && (
                            <div className="space-y-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 animate-fadeIn">
                                <label className="text-sm font-semibold text-gray-700">Alt Kategori & Tarz Seçin</label>
                                
                                {/* 1. Predefined Subtags for the selected category */}
                                {selectedCategory && CATEGORY_SUBTAGS[selectedCategory] && (
                                    <div className="space-y-1.5">
                                        <span className="text-xs font-semibold text-gray-400">Tarz / Model</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {CATEGORY_SUBTAGS[selectedCategory].map((subtag) => {
                                                const isActive = selectedTags.includes(subtag);
                                                return (
                                                    <button
                                                        type="button"
                                                        key={subtag}
                                                        onClick={() => {
                                                            let newTags = [...selectedTags];
                                                            if (isActive) {
                                                                newTags = newTags.filter(t => t !== subtag);
                                                            } else {
                                                                newTags.push(subtag);
                                                            }
                                                            setSelectedTags(newTags);
                                                            form.setValue("season", newTags.join(", "), { shouldValidate: true });
                                                        }}
                                                        className="px-3.5 py-1.5 text-xs font-medium rounded-full transition-all"
                                                        style={{
                                                            backgroundColor: isActive ? '#7986CB' : '#ffffff',
                                                            color: isActive ? '#ffffff' : '#607080',
                                                            border: '1px solid',
                                                            borderColor: isActive ? '#7986CB' : '#E0E3E8',
                                                        }}
                                                    >
                                                        {subtag}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* 2. Season tags */}
                                <div className="space-y-1.5">
                                    <span className="text-xs font-semibold text-gray-400">Mevsim</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {SEASON_TAGS.map((seasonTag) => {
                                            const isActive = selectedTags.includes(seasonTag);
                                            return (
                                                <button
                                                    type="button"
                                                    key={seasonTag}
                                                    onClick={() => {
                                                        let newTags = [...selectedTags];
                                                        if (isActive) {
                                                            newTags = newTags.filter(t => t !== seasonTag);
                                                        } else {
                                                            newTags.push(seasonTag);
                                                        }
                                                        setSelectedTags(newTags);
                                                        form.setValue("season", newTags.join(", "), { shouldValidate: true });
                                                    }}
                                                    className="px-3.5 py-1.5 text-xs font-medium rounded-full transition-all"
                                                    style={{
                                                        backgroundColor: isActive ? '#7986CB' : '#ffffff',
                                                        color: isActive ? '#ffffff' : '#607080',
                                                        border: '1px solid',
                                                        borderColor: isActive ? '#7986CB' : '#E0E3E8',
                                                    }}
                                                >
                                                    {seasonTag}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 3. Custom tags input */}
                                <div className="space-y-1.5">
                                    <span className="text-xs font-semibold text-gray-400">Özel Alt Kategori / Etiket Ekle</span>
                                    <div className="flex gap-2">
                                        <Input
                                            value={customTagInput}
                                            onChange={(e) => setCustomTagInput(e.target.value)}
                                            placeholder="Örn: Polo, Basic, Oversize"
                                            className="h-8 text-xs bg-white"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const trimmed = customTagInput.trim();
                                                    if (trimmed && !selectedTags.includes(trimmed)) {
                                                        const newTags = [...selectedTags, trimmed];
                                                        setSelectedTags(newTags);
                                                        form.setValue("season", newTags.join(", "), { shouldValidate: true });
                                                        setCustomTagInput("");
                                                    }
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const trimmed = customTagInput.trim();
                                                if (trimmed && !selectedTags.includes(trimmed)) {
                                                    const newTags = [...selectedTags, trimmed];
                                                    setSelectedTags(newTags);
                                                    form.setValue("season", newTags.join(", "), { shouldValidate: true });
                                                    setCustomTagInput("");
                                                }
                                            }}
                                            className="h-8 px-3 text-xs bg-[#7986CB] hover:bg-[#6875b8]"
                                        >
                                            Ekle
                                        </Button>
                                    </div>
                                </div>

                                {/* Hidden season field connected to schema */}
                                <FormField
                                    control={form.control}
                                    name="season"
                                    render={() => (
                                        <FormItem className="hidden">
                                            <FormControl>
                                                <Input type="hidden" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {form.formState.errors.season && (
                                    <p className="text-xs text-red-500 font-medium">
                                        {form.formState.errors.season.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Pre-styling Brand & Color Inputs */}
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#7986CB] hover:bg-[#6875b8] transition-colors py-6 text-base font-semibold rounded-xl mt-4"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mutation.isPending ? "Gardıroba Ekleniyor..." : "Gardıroba Ekle"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
