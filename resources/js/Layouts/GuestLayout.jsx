import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">

            <div className="w-full max-w-md">

                {/* Logo + Branding */}
                <div className="text-center mb-6">
                    <Link href="/" className="flex flex-col items-center gap-2">
                        <ApplicationLogo className="h-12 w-12" />
                        <span className="text-xl font-bold dark:text-white">
                            Foodie
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                    {children}
                </div>

            </div>
        </div>
    );
}
