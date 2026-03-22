import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="bg-background text-on-background font-body min-h-screen flex flex-col antialiased selection:bg-primary selection:text-black">
            <Head title="Create Account" />

            {/* Top Navigation */}
            <header className="fixed top-0 w-full z-50 bg-[#111316]">
                <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                    <Link href="/" className="font-serif italic text-2xl text-primary">
                        Bello Restaurant
                    </Link>
                    <div className="flex items-center gap-6">
                        <span className="font-sans font-medium tracking-tight text-gray-400 hover:text-primary transition-colors duration-300 cursor-pointer text-sm">Help</span>
                    </div>
                </nav>
            </header>

            <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 overflow-hidden relative">
                {/* Background Artistic Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
                </div>

                <div className="w-full max-w-xl relative z-10">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="font-headline text-5xl md:text-6xl mb-4 text-on-surface tracking-tight">Create Account</h1>
                        <p className="font-body text-on-surface-variant tracking-wide uppercase text-[10px] opacity-70">Begin your bespoke culinary journey</p>
                    </div>

                    {/* Card Wrapper */}
                    <div className="bg-surface-container-low/40 backdrop-blur-xl rounded-xl p-8 md:p-12 shadow-2xl border border-outline-variant/10 glass-card">

                        {/* Social Sign Up */}
                        <a href={route('auth.google')} className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-surface-container-highest hover:bg-surface-bright transition-all duration-300 rounded-full group border border-outline-variant/10">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            <span className="font-label text-xs font-semibold tracking-widest uppercase text-on-surface group-hover:text-primary transition-colors">Sign up with Google</span>
                        </a>

                        {/* Divider */}
                        <div className="flex items-center my-10">
                            <div className="flex-grow h-[1px] bg-outline-variant/20"></div>
                            <span className="px-6 font-headline italic text-on-surface-variant text-sm">or</span>
                            <div className="flex-grow h-[1px] bg-outline-variant/20"></div>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={submit} className="space-y-8">
                            <div className="grid grid-cols-1 gap-8">
                                {/* Full Name */}
                                <div className="relative group">
                                    <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 ml-1 opacity-60">Full Name</label>
                                    <input
                                        className="w-full bg-transparent border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 py-3 transition-all outline-none"
                                        placeholder="Julianne Vianchi"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Email */}
                                <div className="relative group">
                                    <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 ml-1 opacity-60">Email Address</label>
                                    <input
                                        className="w-full bg-transparent border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 py-3 transition-all outline-none"
                                        placeholder="julianne@reserve.com"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Password Cluster */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="relative group">
                                        <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 ml-1 opacity-60">Password</label>
                                        <input
                                            className="w-full bg-transparent border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 py-3 transition-all outline-none"
                                            placeholder="••••••••"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.password} />
                                    </div>
                                    <div className="relative group">
                                        <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 ml-1 opacity-60">Confirm Password</label>
                                        <input
                                            className="w-full bg-transparent border-b-2 border-surface-variant focus:border-primary focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 py-3 transition-all outline-none"
                                            placeholder="••••••••"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>
                            </div>

                            {/* Terms */}
                            <p className="text-[11px] text-on-surface-variant/60 font-body leading-relaxed text-center px-4">
                                By creating an account, you agree to our <Link className="underline hover:text-primary transition-colors" href="#">Privacy Policy</Link> and <Link className="underline hover:text-primary transition-colors" href="#">Terms of Service</Link>.
                            </p>

                            {/* Submit Action */}
                            <button
                                className="w-full py-5 bg-gradient-to-r from-primary to-primary-container rounded-full text-black font-label text-sm font-bold uppercase tracking-[0.15em] shadow-lg shadow-primary/10 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        {/* Redirect to Sign In */}
                        <div className="mt-10 text-center">
                            <p className="font-body text-sm text-on-surface-variant">
                                Already have an account?
                                <Link className="ml-2 font-semibold text-primary hover:text-primary-fixed-dim transition-colors border-b border-primary/30 pb-0.5" href={route('login')}>
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                    <p className="mt-8 text-center font-headline italic text-on-surface-variant/40 text-sm">Experience the art of nocturnal dining.</p>
                </div>
            </main>

            {/* Footer - Matched to Login Page Style */}
            <footer className="w-full py-12 px-8 bg-[#1a1c1f] mt-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-7xl mx-auto">
                    <div className="font-sans text-[10px] uppercase tracking-widest text-gray-500">
                        © 2026 Bello Restaurant. An Editorial Dining Experience.
                    </div>
                    <div className="flex gap-8">
                        <Link className="font-sans text-[10px] uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors" href="#">Privacy Policy</Link>
                        <Link className="font-sans text-[10px] uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors" href="#">Terms of Service</Link>
                        <Link className="font-sans text-[10px] uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors" href="#">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
