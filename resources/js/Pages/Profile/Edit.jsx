import AppLayout from '@/Layouts/AppLayout.jsx';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppLayout>
            <Head title="Profile Settings" />

            <main className="pt-32 pb-40 px-6 md:px-12 max-w-[1920px] mx-auto min-h-screen">
                <header className="mb-12">
                    <h1 className="font-headline text-5xl md:text-6xl text-on-surface font-light tracking-tight mb-4">
                        Account Settings
                    </h1>
                    <p className="font-body text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm">settings</span>
                        Manage your profile, security, and account preferences.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">
                        {/* Profile Info Section */}
                        <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-2xl"
                            />
                        </div>

                        {/* Password Section */}
                        <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
                            <UpdatePasswordForm className="max-w-2xl" />
                        </div>

                        {/* Danger Zone Section */}
                        <div className="bg-surface-container-low p-8 rounded-2xl border border-error/10 shadow-sm border-dashed">
                            <DeleteUserForm className="max-w-2xl" />
                        </div>
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}
