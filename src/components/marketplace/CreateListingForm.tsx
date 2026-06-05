'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createListingSchema, CreateListingInput } from '@/lib/validations/marketplace';
import { Tag, ArrowRightLeft, UploadCloud, X, Sparkles } from 'lucide-react';
import { ClothingItem } from '@/lib/api/wardrobe.api';

const STEPS = ['Temel Bilgiler', 'Detaylar & Fotoğraf', 'Fiyat & Takas'];

export function CreateListingForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);
    const [isWardrobeModalOpen, setIsWardrobeModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        watch,
        formState: { errors },
    } = useForm<CreateListingInput>({
        resolver: zodResolver(createListingSchema),
        defaultValues: {
            images: [],
            isSwapOpen: false,
        },
        mode: 'onChange'
    });

    useEffect(() => {
        fetch("/api/wardrobe")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setWardrobeItems(data);
                }
            })
            .catch(err => console.error("Error fetching wardrobe items:", err));
    }, []);

    const selectFromWardrobe = (item: ClothingItem) => {
        setValue('title', item.brand ? `${item.brand} ${item.name || ""}` : item.name || "", { shouldValidate: true });
        
        let mappedCategory = "";
        const c = item.category.trim().toUpperCase();
        if (c === "TİŞÖRT" || c === "TSHIRT") mappedCategory = "TİŞÖRT";
        else if (c === "PANTOLON") mappedCategory = "PANTOLON";
        else if (c === "CEKET" || c === "DIŞ GİYİM" || c === "DIŞ_GİYİM") mappedCategory = "DIŞ_GİYİM";
        else if (c === "AYAKKABI") mappedCategory = "AYAKKABI";
        else mappedCategory = "DİĞER";
        
        setValue('category', mappedCategory, { shouldValidate: true });
        setValue('brand', item.brand || "Diğer", { shouldValidate: true });
        setValue('size', item.size || "M", { shouldValidate: true });
        setValue('description', `${item.brand || "Vesti"} marka ${item.name || ""} modeli. Dijital gardırobumdan çıkardığım temiz üründür.`, { shouldValidate: true });
        
        if (item.imageUrl) {
            setUploadedImages([item.imageUrl]);
            setValue('images', [item.imageUrl], { shouldValidate: true });
        }
        
        setIsWardrobeModalOpen(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const watchIsSwapOpen = watch('isSwapOpen');

    // Adım geçişi (İleri)
    const nextStep = async () => {
        let fieldsToValidate: (keyof CreateListingInput)[] = [];

        if (currentStep === 0) fieldsToValidate = ['title', 'category', 'brand', 'size'];
        else if (currentStep === 1) fieldsToValidate = ['description', 'condition', 'images'];

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) {
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
        }
    };

    // Adım geçişi (Geri)
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    // Form Gönderimi
    const onSubmit = async (data: CreateListingInput) => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/marketplace/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    images: data.images,
                    category: data.category,
                    size: data.size,
                    condition: data.condition,
                    brand: data.brand,
                    isSwapOpen: data.isSwapOpen
                })
            });

            if (res.ok) {
                alert('İlanınız başarıyla oluşturuldu!');
                window.location.href = '/marketplace';
            } else {
                const err = await res.json().catch(() => ({}));
                alert(err.message || 'İlan oluşturulurken bir hata oluştu.');
            }
        } catch (error) {
            console.error(error);
            alert('Bağlantı hatası oluştu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Basit Mock Dosya Yükleme Event'i
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            // Gerçek senaryoda bu dosyalar sunucuya/S3'e yüklenir ve URL alınır.
            // Şimdilik mock amaçlı Unsplash görseli ekliyoruz:
            const newImages = [...uploadedImages, 'https://images.unsplash.com/photo-1434389678069-37142cb442ac?w=400&q=80'];
            setUploadedImages(newImages);
            setValue('images', newImages, { shouldValidate: true });
        }
    };

    const removeImage = (index: number) => {
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
        setValue('images', newImages, { shouldValidate: true });
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl mx-auto">
            {/* Progress Header */}
            <div className="bg-gray-50/80 px-8 py-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Yeni İlan Oluştur</h2>

                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0">
                        <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                        />
                    </div>

                    {STEPS.map((step, idx) => (
                        <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-gray-50 px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${currentStep >= idx ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                {idx + 1}
                            </div>
                            <span className={`text-xs font-medium hidden sm:block ${currentStep >= idx ? 'text-indigo-900' : 'text-gray-400'}`}>
                                {step}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit as never)} className="px-8 py-8">

                {/* Gardıroptan Seçim Banner'ı */}
                {currentStep === 0 && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                                Dijital Gardırobunu Kullan
                            </h4>
                            <p className="text-xs text-indigo-700/80 leading-relaxed">
                                Dolabındaki bir kıyafeti seçerek ilan detaylarını saniyeler içinde otomatik doldurabilirsin!
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsWardrobeModalOpen(true)}
                            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-sm active:scale-95 transition-all shrink-0"
                        >
                            Gardırobumdan Seç
                        </button>
                    </div>
                )}

                {/* ADIM 1: Temel Bilgiler */}
                <div className={currentStep === 0 ? 'block space-y-5' : 'hidden'}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            İlan Başlığı <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('title')}
                            className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5"
                            placeholder="Örn: Siyah Zara Basic Tişört"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kategori <span className="text-red-500">*</span>
                            </label>
                            <select {...register('category')} className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5">
                                <option value="">Seçiniz...</option>
                                <option value="TİŞÖRT">Tişört</option>
                                <option value="PANTOLON">Pantolon</option>
                                <option value="DIŞ_GİYİM">Dış Giyim (Ceket/Kaban)</option>
                                <option value="AYAKKABI">Ayakkabı</option>
                                <option value="DİĞER">Diğer</option>
                            </select>
                            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Marka (Yoksa &apos;Diğer&apos;) <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('brand')}
                                className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5"
                                placeholder="Marka giriniz"
                            />
                            {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand.message}</p>}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Beden <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('size')}
                                className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5"
                                placeholder="Örn: M, L, 32, 42..."
                            />
                            {errors.size && <p className="mt-1 text-sm text-red-500">{errors.size.message}</p>}
                        </div>
                    </div>
                </div>

                {/* ADIM 2: Detaylar ve Fotoğraflar */}
                <div className={currentStep === 1 ? 'block space-y-5' : 'hidden'}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ürün Durumu <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { val: 'NEW', label: 'Sıfır Etiketli' },
                                { val: 'LIKE_NEW', label: 'Yeni Gibi' },
                                { val: 'USED', label: 'Kullanılmış' },
                                { val: 'DEFECTIVE', label: 'Kusurlu' },
                            ].map((cond) => (
                                <label key={cond.val} className={`border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500`}>
                                    <input type="radio" value={cond.val} {...register('condition')} className="sr-only" />
                                    <span className="text-sm font-medium text-gray-700">{cond.label}</span>
                                </label>
                            ))}
                        </div>
                        {errors.condition && <p className="mt-1 text-sm text-red-500">{errors.condition.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fotoğraflar (En az 1) <span className="text-red-500">*</span></label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileUpload}
                            />
                            <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 font-medium">Fotoğraf Yüklemek İçin Tıkla</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG to 5MB</p>
                        </div>
                        {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images.message}</p>}

                        {uploadedImages.length > 0 && (
                            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                                {uploadedImages.map((src, i) => (
                                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shrink-0 group">
                                        <img src={src} alt="Uploaded" className="object-cover w-full h-full" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Açıklama <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            {...register('description')}
                            rows={4}
                            className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-3"
                            placeholder="Ürünün özelliklerini, varsa kusurlarını, kumaşını detaylıca anlat..."
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
                    </div>
                </div>

                {/* ADIM 3: Fiyat ve Takas */}
                <div className={currentStep === 2 ? 'block space-y-6' : 'hidden'}>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-6">
                        <h3 className="flex items-center gap-2 font-semibold text-indigo-900 mb-2">
                            <Tag className="w-5 h-5" /> Fiyatlandırma
                        </h3>
                        <p className="text-sm text-indigo-700">Ürününüzün fiyatını belirleyin. Platform komisyonu uygulanmayacaktır.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Satış Fiyatı (₺) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                type="number"
                                step="any"
                                {...register('price', { valueAsNumber: true })}
                                className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-3 text-lg font-bold text-gray-900"
                                placeholder="0.00"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₺</span>
                        </div>
                        {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
                    </div>

                    <div className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors bg-white">
                        <label className="flex items-start gap-4 cursor-pointer">
                            <div className="flex items-center h-5 mt-1">
                                <input
                                    type="checkbox"
                                    {...register('isSwapOpen')}
                                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 font-semibold text-gray-900">
                                    <ArrowRightLeft className="w-5 h-5 text-purple-600" />
                                    Takasa Uygun
                                </div>
                                <p className="text-sm text-gray-500 mt-1">İlanınızı satın almak yerine eşdeğer ürünlerle takas teklifi gönderilmesine izin verin.</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Butonlar */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 0 || isSubmitting}
                        className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${currentStep === 0 ? 'opacity-0 cursor-default' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Geri
                    </button>

                    {currentStep < STEPS.length - 1 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            İleri Adım
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? 'Oluşturuluyor...' : 'İlanı Yayınla'}
                        </button>
                    )}
                </div>
            </form>

            {isWardrobeModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-xl w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 text-lg">Gardırobumdan Kıyafet Seç</h3>
                            <button 
                                type="button" 
                                onClick={() => setIsWardrobeModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            {wardrobeItems.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <p className="font-semibold text-sm">Gardırobunuzda kıyafet bulunamadı.</p>
                                    <p className="text-xs text-gray-400 mt-1">Önce dolap sayfasına gidip kıyafet eklemelisiniz.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {wardrobeItems.map((item) => (
                                        <div 
                                            key={item.id} 
                                            onClick={() => selectFromWardrobe(item)}
                                            className="group border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all bg-gray-50"
                                        >
                                            <div className="relative aspect-square w-full bg-gray-100">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img 
                                                    src={item.imageUrl} 
                                                    alt={item.name || "Kıyafet"} 
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-3">
                                                <h4 className="font-bold text-gray-900 text-xs truncate">{item.name || "İsimsiz Kıyafet"}</h4>
                                                <p className="text-[10px] text-gray-500 mt-0.5">{item.brand || "Markasız"} · {item.size || "Bedensiz"}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
