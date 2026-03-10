'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createListingSchema, CreateListingInput } from '@/lib/validations/marketplace';
import { ImagePlus, Info, Tag, ArrowRightLeft, UploadCloud, X } from 'lucide-react';

const STEPS = ['Temel Bilgiler', 'Detaylar & Fotoğraf', 'Fiyat & Takas'];

export function CreateListingForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        watch,
        formState: { errors },
    } = useForm<CreateListingInput>({
        resolver: zodResolver(createListingSchema) as any,
        defaultValues: {
            images: [],
            isSwapOpen: false,
        },
        mode: 'onChange'
    });

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
            // Mock API Calı
            await new Promise(res => setTimeout(res, 1500));
            console.log('Form verisi:', data);
            alert('İlan başarıyla oluşturuldu! (Mock)');
            window.location.href = '/marketplace';
        } catch (error) {
            console.error(error);
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

            <form onSubmit={handleSubmit(onSubmit as any)} className="px-8 py-8">

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
                                Marka (Yoksa 'Diğer') <span className="text-red-500">*</span>
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
                                {...register('price')}
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
        </div>
    );
}
