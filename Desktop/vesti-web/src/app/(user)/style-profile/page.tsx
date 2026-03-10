import StyleProfileForm from '@/components/style-profile/StyleProfileForm';

export const metadata = {
    title: 'Tarz Profili | Vesti',
    description: 'Giyim tarzınızı ve tercihlerinizi belirleyin.',
};

export default function StyleProfilePage() {
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Tarz Profili</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Size en uygun kombinleri önerebilmemiz için tarz tercihlerinizi ve beden bilgilerinizi güncelleyin.
                </p>
            </div>

            <StyleProfileForm />
        </div>
    );
}
