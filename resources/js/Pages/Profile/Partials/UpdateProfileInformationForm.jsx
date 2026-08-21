import Icon from "@/Components/Icon";
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

// ... logic imports remain same ...

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => { e.preventDefault(); patch(route('profile.update')); };

    return (
        <section className={className}>
            <header className="mb-8">
                <h2 className="font-headline text-2xl text-on-surface">Profile Information</h2>
                <p className="mt-1 text-sm text-on-surface-variant">Update your account's public name and email address.</p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" className="uppercase text-xs font-bold tracking-widest text-primary mb-2" />
                    <TextInput id="name" className="mt-1 block w-full bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary" value={data.name} onChange={(e) => setData('name', e.target.value)} required isFocused />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="uppercase text-xs font-bold tracking-widest text-primary mb-2" />
                    <TextInput id="email" type="email" className="mt-1 block w-full bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Email Verification Logic remains same, just styling the Link */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-error-container/20 p-4 rounded-lg">
                        <p className="text-sm text-on-surface-variant">Your email address is unverified.
                            <Link href={route('verification.send')} method="post" as="button" className="ml-2 underline text-primary hover:text-primary-container">Click here to re-send.</Link></p>
                    </div>
                )}

                <div className="flex items-center gap-6">
                    <PrimaryButton disabled={processing} className="rounded-full px-8 py-3 bg-primary text-on-primary font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all">
                        Save Changes
                    </PrimaryButton>
                    <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                        <p className="text-sm text-primary font-bold flex items-center gap-1">
                            <Icon name="check_circle" className=" text-sm" /> Saved
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
