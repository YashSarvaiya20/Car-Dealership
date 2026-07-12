import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-850 bg-[#0F172A] py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and About */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-black text-white tracking-tight">
              🚗 Incubyte Motors
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            Experience the future of premium car inventory management. Discover, buy, and manage elite vehicles with unmatched ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link>
            </li>
            <li>
              <a href="#about" className="hover:text-white transition-colors">About Us</a>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Contact Us</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>Email: <a href="mailto:info@incubytemotors.com" className="text-slate-400 hover:text-white">info@incubytemotors.com</a></li>
            <li>Phone: <span className="text-slate-400">+1 (555) 019-2834</span></li>
            <li>Address: <span className="text-slate-400">100 Premium Way, Silicon Valley, CA</span></li>
          </ul>
        </div>

        {/* Social connections */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Connect</h4>
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Link"
              className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 hover:text-white rounded-lg transition-all text-slate-400"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Link"
              className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 hover:text-white rounded-lg transition-all text-slate-400"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 mt-8 pt-6 border-t border-slate-850 text-center text-[10px] text-slate-500">
        &copy; {new Date().getFullYear()} Incubyte Motors. All rights reserved. Built with pride.
      </div>
    </footer>
  );
}
