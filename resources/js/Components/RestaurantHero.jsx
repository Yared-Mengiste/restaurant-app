export default function RestaurantHero(){
    return <section className="px-6 md:px-12 py-8 max-w-[1920px] mx-auto">
        <div
            className="relative w-full h-[400px] rounded-3xl overflow-hidden group"
        >
            <img
                alt="Chef's Special Banner"
                className="w-full h-full object-cover brightness-[0.7] group-hover:scale-105 transition-transform duration-[2s]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAo9LZFCgU8Cd9uzHiclQszPq-ffGP2qLeEbsD5EQAM47lyJ6zIxYIR3b9ePN9Psw4yF5ORoX2YBT-C_i0ItRBjHzUxwrPnJBhhsgwK5Rx-HthDFvlMuOOipZKLqE4qeUpUlvoNS6mIjenTrWvouv2Pi_oHmUGFg7kWiE7VOuiHf8F62i-HuyBk6BgboSBBOiM99mNHlh3nFrEwMX7bzf5leBCOQ5WMg2lPRULIkKYiPbviFfljhRMzBvP38UhYBe5DK3apIU3iLDR0"
            />
            <div
                className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent flex flex-col justify-center px-12 md:px-24"
            >
                <div className="max-w-xl">
              <span
                  className="inline-block bg-primary text-on-primary px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-4"
              >Limited Time Experience</span
              >
                    <h2
                        className="font-headline text-4xl md:text-6xl text-white mb-4 leading-tight"
                    >
                        The Chef's <br/><span className="italic font-light"
                    >Tasting Journey</span
                    >
                    </h2>
                    <p className="text-on-surface-variant mb-8 text-lg max-w-sm">
                        Enjoy a complimentary vintage pairing with our signature
                        7-course seasonal menu.
                    </p>
                </div>
            </div>
            <div className="absolute bottom-8 right-12 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
            </div>
        </div>
    </section>

}
