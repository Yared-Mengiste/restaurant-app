import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function RestaurantHero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: "/images/belloHero1.jpg",
            tag: "The Bello Signature",
            title: "Authentic",
            subtitle: "Italian Soul",
            description: "Experience the perfect harmony of traditional Italian techniques and premium local ingredients in the heart of Addis."
        },
        {
            image: "/images/belloHero3.jpg",
            tag: "Artisanal Flavors",
            title: "Wood-Fired",
            subtitle: "Perfection",
            description: "From our signature pizzas to succulent grilled meats, every dish is kissed by the flame of our custom oak-fired oven."
        },
        {
            image: "/images/belloHero4.jpg",
            tag: "Elevated Evenings",
            title: "Cocktails &",
            subtitle: "Curation",
            description: "Unwind in our sophisticated lounge with masterfully crafted cocktails and an atmosphere designed for the city's finest."
        }
    ];
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    useEffect(() => {
        if (prefersReducedMotion) return undefined;
        const timer = setTimeout(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearTimeout(timer);
    }, [currentSlide, prefersReducedMotion]);

    return (
        <section className="py-8 pt-0 max-w-[1920px] mx-auto">
            <div className="relative w-full h-[58vh] min-h-[420px] max-h-[620px] md:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden group">

                {/* Slides Container */}
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                    >
                        <img
                            alt={slide.subtitle}
                            className={`w-full h-full object-cover brightness-[0.6] transition-transform duration-[10s] ease-linear ${
                                index === currentSlide ? 'scale-110' : 'scale-100'
                            }`}
                            src={slide.image}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 md:bg-gradient-to-r md:from-black/70 md:via-black/20 md:to-transparent flex flex-col justify-end md:justify-center px-6 py-10 md:px-24 md:py-0">
                            <div className={`max-w-xl transition-all duration-700 delay-300 transform ${
                                index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                            }`}>
                                <span className="inline-block bg-primary text-black px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-4">
                                    {slide.tag}
                                </span>
                                <h2 className="font-headline text-3xl sm:text-4xl md:text-6xl text-white mb-3 md:mb-4 leading-tight">
                                    {slide.title} <br/>
                                    <span className="italic font-light">{slide.subtitle}</span>
                                </h2>
                                <p className="text-white/85 mb-5 md:mb-8 text-base md:text-lg max-w-sm">
                                    {slide.description}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link href={route('home')} className="rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-on-primary">Order now</Link>
                                    <a href="#menu" className="rounded-full border border-white/50 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white">View menu</a>
                                    <a href="tel:+251911000000" className="hidden sm:inline-flex rounded-full border border-white/50 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white">Call us</a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Pagination Dots (Three Points) */}
                <div className="absolute bottom-8 right-12 flex gap-3 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`min-w-11 min-h-11 flex items-center justify-center relative transition-all duration-300 ${
                                index === currentSlide
                                    ? 'after:block after:w-8 after:h-2 after:rounded-full after:bg-primary'
                                    : 'after:block after:w-2 after:h-2 after:rounded-full after:bg-white/30 hover:after:bg-white/50'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
