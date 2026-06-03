import { CreateListingForm } from '@/components/marketplace/CreateListingForm';

export const metadata = {
    title: 'İlan Ver | Vesti',
    description: 'Vesti Marketplace üzerinde yeni bir ilan oluştur.',
};

export default function CreateListingPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Kıyafetini Değerlendir</h1>
                <p className="mt-2 text-gray-500 text-sm">
                    Satmak veya takaslamak istediğin kıyafetin detaylarını girerek hemen listele.
                </p>
            </div>

            <CreateListingForm />
        </div>
    );
}
