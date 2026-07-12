import { Award, ShieldCheck, ThumbsUp, DollarSign } from 'lucide-react';

const FEATURES = [
  {
    id: 1,
    title: 'Premium Quality',
    description: 'Every vehicle undergoes strict multi-point structural and engine inspections before cataloging.',
    icon: Award,
  },
  {
    id: 2,
    title: 'Verified Dealers',
    description: 'We partner only with registered, highly rated, and reputable local dealership networks.',
    icon: ThumbsUp,
  },
  {
    id: 3,
    title: 'Secure Purchase',
    description: 'Enjoy automated, secure online bank deposits and encrypted customer authentication.',
    icon: ShieldCheck,
  },
  {
    id: 4,
    title: 'Affordable Pricing',
    description: 'We guarantee transparent, market-competitive pricing without hidden broker fees.',
    icon: DollarSign,
  },
];

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-24 bg-transparent border-t border-slate-850">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Why Choose Us</h2>
          <p className="text-xs text-slate-400">Discover what sets DriveSphere apart as the premier automotive marketplace</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-[#1A2332] border border-slate-800 rounded-xl p-6 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
