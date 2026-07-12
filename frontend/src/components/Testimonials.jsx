const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Connor',
    role: 'SUV Enthusiast',
    rating: 5,
    avatar: 'SC',
    review: 'The purchase flow was incredibly quick. Registered, logged in, and clicked purchase. The vehicle and paperwork were ready in record time. Professional support all the way.',
  },
  {
    id: 2,
    name: 'Marcus Wright',
    role: 'Sedan Buyer',
    rating: 5,
    avatar: 'MW',
    review: 'Beautiful selection of verified vehicles. I loved the transparency and clean UI. It makes buying cars a premium experience instead of a stressful negotiation.',
  },
  {
    id: 3,
    name: 'John Connor',
    role: 'Electric Car Fanatic',
    rating: 4,
    avatar: 'JC',
    review: 'Clean design and super responsive support. The details page has everything you need. Looking forward to getting my next sedan here!',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-transparent border-t border-slate-850">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Customer Testimonials</h2>
          <p className="text-xs text-slate-400">Hear directly from some of our premium club members</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-[#1A2332] border border-slate-800 rounded-xl p-6 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? 'text-amber-400 fill-current' : 'text-slate-700'}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-slate-305 italic leading-relaxed">
                  "{t.review}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xs tracking-wider">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{t.name}</h4>
                  <p className="text-[10px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
