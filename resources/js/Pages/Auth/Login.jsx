import Icon from "@/Components/Icon";
import { useEffect } from 'react';
// 1. Added usePage to the imports
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function Login({ status, canResetPassword }) {
    // 2. Destructure flash from props
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="bg-background text-on-background font-body min-h-screen flex flex-col">
            <Head title="Log in" />

            {/* ... Navbar ... */}
            <nav className="fixed top-0 w-full z-50 bg-background flex justify-between items-center px-8 py-6 max-w-7xl mx-auto left-0 right-0">
                <Link href={route('home')} className="text-2xl md:text-3xl font-serif italic text-primary tracking-tight">
                    Bello <span className="text-secondary not-italic font-sans text-xs tracking-[0.3em] uppercase block">Ristorante</span>
                </Link>
                <div className="flex items-center gap-6">
                    <span className="font-sans font-medium tracking-tight text-gray-400 hover:text-primary transition-colors duration-300 cursor-pointer text-sm">Help</span>
                </div>
            </nav>

            <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
                {/* ... Background Orbs ... */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary opacity-5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary-container opacity-5 blur-[100px] rounded-full"></div>

                <div className="w-full max-w-md z-10">
                    <div className="glass-card rounded-xl p-8 md:p-12 border border-outline-variant/10 shadow-2xl bg-surface/20 backdrop-blur-md">

                        <div className="text-center mb-10">
                            <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-3 tracking-tight">Welcome Back</h1>
                            <p className="font-body text-on-surface-variant text-sm tracking-wide">Enter your credentials to access your table.</p>
                        </div>

                        {/* 3. FLASH ERROR ALERT (Accommodates your Catch block) */}
                        {flash?.error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <Icon name="error" className=" text-red-500 text-sm" />
                                <p className="text-red-500 text-[11px] font-bold uppercase tracking-widest">
                                    {flash.error}
                                </p>
                            </div>
                        )}

                        {status && <div className="mb-4 font-medium text-sm text-green-600 text-center">{status}</div>}

                        {/* Social Sign In */}
                        <a href={route('auth.google')} className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-surface-container-high hover:bg-surface-container-highest transition-all duration-300 rounded-full border border-outline-variant/20 group">
                            {/* SVG ... */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            <span className="font-label text-xs font-semibold tracking-widest uppercase text-on-surface">Sign in with Google</span>
                        </a>

                        {/* ... Rest of your form ... */}
                        <div className="relative my-8 flex items-center">
                            <div className="flex-grow border-t border-outline-variant/20"></div>
                            <span className="flex-shrink mx-4 font-headline italic text-on-surface-variant text-sm">or</span>
                            <div className="flex-grow border-t border-outline-variant/20"></div>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email input */}
                            <div className="space-y-2">
                                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                                <input
                                    className="w-full bg-transparent border-0 border-b-2 border-surface-variant focus:ring-0 focus:border-primary text-on-surface font-body py-3 transition-colors placeholder:text-surface-variant/30"
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="maitre-d@bello.com"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password input */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="password">Password</label>
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="text-[10px] uppercase tracking-widest text-primary hover:text-primary-container transition-colors">
                                            Forgot Password?
                                        </Link>
                                    )}
                                </div>
                                <input
                                    className="w-full bg-transparent border-0 border-b-2 border-surface-variant focus:ring-0 focus:border-primary text-on-surface font-body py-3 transition-colors placeholder:text-surface-variant/30"
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center ml-1">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-outline-variant/30 bg-transparent text-primary focus:ring-primary/20 w-4 h-4"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="ms-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Remember me</span>
                                </label>
                            </div>

                            <button
                                className="w-full mt-8 bg-gradient-to-r from-primary to-primary-container text-black font-label text-sm font-bold uppercase tracking-[0.15em] py-5 rounded-full shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Verifying...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="font-body text-sm text-on-surface-variant">
                                New guest?
                                <Link className="text-primary font-semibold hover:underline decoration-primary/30 underline-offset-4 ml-2" href={route('register')}>
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                    <p className="mt-8 text-center font-headline italic text-on-surface-variant/40 text-sm">Experience the art of nocturnal dining.</p>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-12 px-8 bg-[#1a1c1f] mt-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-7xl mx-auto">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-gray-500">© 2026 Bello Restaurant. An Editorial Dining Experience.</span>
                    <div className="flex gap-8">
                        <Link className="font-sans text-[10px] uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors" href={route('legal.privacy')}>Privacy Policy</Link>
                        <Link className="font-sans text-[10px] uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors" href={route('legal.terms')}>Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
