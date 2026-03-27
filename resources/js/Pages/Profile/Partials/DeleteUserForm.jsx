import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="font-headline text-2xl text-error">Danger Zone</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                    Deleting your account is permanent and cannot be undone.
                </p>
            </header>

            <button
                onClick={confirmUserDeletion}
                className="px-6 py-3 rounded-full border border-error text-error text-xs font-bold uppercase tracking-widest hover:bg-error hover:text-white transition-all"
            >
                Delete Account
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8 bg-surface-container-low rounded-2xl">
                    <h2 className="font-headline text-2xl text-on-surface mb-4">Confirm Deletion</h2>
                    <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                        Please enter your password to confirm you would like to permanently delete your account and all associated data.
                    </p>

                    <div className="mb-8">
                        <TextInput id="password" type="password" name="password" ref={passwordInput} value={data.password}
                                   onChange={(e) => setData('password', e.target.value)}
                                   className="block w-full bg-surface-container-high border-none rounded-xl"
                                   isFocused placeholder="Your Password" />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={closeModal} className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                            Cancel
                        </button>
                        <button disabled={processing} className="px-8 py-3 bg-error text-white rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110 disabled:opacity-50">
                            Delete Permanently
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
