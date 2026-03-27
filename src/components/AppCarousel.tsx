import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, ExternalLink, Briefcase } from 'lucide-react';
import { collection, getDocsFromServer } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useLang, t, Lang } from '../contexts/LanguageContext';

interface AppData {
  id: string;
  title: string;
  packageName: string;
  logo?: string;
  icon?: string;
  primaryColor: string;
  description: Record<Lang, string>;
  features: Record<Lang, string[]>;
  websiteUrl?: string;
  appStoreUrl?: string;
  order?: number;
}

const INTERVAL = 3500;

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, scale: 0.97 }),
};

const AppCarousel: React.FC = () => {
  const { lang } = useLang();
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const snap = await getDocsFromServer(collection(db, 'portfolio'));
        const data = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() })) as AppData[];
        data.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setApps(data);
      } catch (e) {
        console.error('carousel 불러오기 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const go = useCallback((next: number, d: number) => {
    setDir(d);
    setIndex((next + apps.length) % apps.length);
  }, [apps.length]);

  useEffect(() => {
    if (paused || apps.length === 0) return;
    const timer = setInterval(() => go(index + 1, 1), INTERVAL);
    return () => clearInterval(timer);
  }, [index, paused, go, apps.length]);

  if (loading) {
    return (
      <section className="mt-20 mb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-500 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">{t(lang, 'portfolio')}</span>
          </div>
        </div>
        <div className="rounded-2xl bg-gray-100 animate-pulse h-44" />
      </section>
    );
  }

  if (apps.length === 0) return null;

  const app = apps[index];
  const isWeb = !app.packageName.startsWith('com.');
  const playStoreUrl = `https://play.google.com/store/apps/details?id=${app.packageName}`;
  const desc = app.description?.[lang] ?? app.description?.ko ?? '';

  return (
    <section className="mt-20 mb-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-indigo-500 flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-700">{t(lang, 'portfolio')}</span>
          <span className="text-xs text-gray-400 ml-1">{t(lang, 'portfolioSubtitle', apps.length)}</span>
        </div>
        <Link
          to="/portfolio"
          className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
        >
          {t(lang, 'viewAll')} →
        </Link>
      </div>

      {/* Carousel */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="overflow-hidden rounded-2xl">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="border border-white/80 rounded-2xl p-6"
              style={{
                background: `linear-gradient(135deg, ${app.primaryColor}18, ${app.primaryColor}08)`,
              }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm overflow-hidden"
                  style={{ backgroundColor: app.logo ? 'transparent' : `${app.primaryColor}22` }}
                >
                  {app.logo ? (
                    <img src={app.logo} alt={app.title} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    app.icon
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{app.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{app.packageName}</p>
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-2">{desc}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-5 flex-wrap">
                {isWeb && app.websiteUrl ? (
                  <a
                    href={app.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 shadow-sm"
                    style={{ backgroundColor: app.primaryColor }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t(lang, 'website')}
                  </a>
                ) : (
                  <a
                    href={playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 shadow-sm"
                    style={{ backgroundColor: app.primaryColor }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Google Play
                  </a>
                )}
                {app.websiteUrl && !isWeb && (
                  <a
                    href={app.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-white/80 text-gray-700 border border-gray-200 hover:bg-white transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t(lang, 'website')}
                  </a>
                )}
                {app.appStoreUrl && (
                  <a
                    href={app.appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    App Store
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Prev / Next buttons */}
        <button
          onClick={() => go(index - 1, -1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => go(index + 1, 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {apps.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i, i > index ? 1 : -1)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === index ? '20px' : '6px',
              height: '6px',
              backgroundColor: i === index ? app.primaryColor : '#d1d5db',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <div className="mt-3 h-0.5 bg-gray-100 rounded-full overflow-hidden mx-1">
          <motion.div
            key={index}
            className="h-full rounded-full"
            style={{ backgroundColor: app.primaryColor }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
          />
        </div>
      )}
    </section>
  );
};

export default AppCarousel;
