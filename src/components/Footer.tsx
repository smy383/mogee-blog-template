import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail } from 'lucide-react';

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL || 'https://github.com/your-username';
const CONTACT_EMAIL = process.env.REACT_APP_CONTACT_EMAIL || 'your-email@example.com';
const SITE_NAME = process.env.REACT_APP_SITE_NAME || 'My Blog';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-100 bg-white/60 backdrop-blur-sm mt-24">
      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <span className="font-bold text-gray-900 text-lg">{SITE_NAME}<span className="text-indigo-500">.</span></span>
          <p className="text-sm text-gray-400 mt-1">My personal developer blog</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <Link to="/" className="hover:text-gray-700 transition-colors">Blog</Link>
          <Link to="/portfolio" className="hover:text-gray-700 transition-colors">Portfolio</Link>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
      <div className="border-t border-gray-50 py-4 text-center">
        <p className="text-xs text-gray-300">&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
