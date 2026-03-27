import React, { useEffect, useState } from 'react';
import { collection, getDocsFromServer } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { Download, ExternalLink, Star, Shield, Briefcase } from 'lucide-react';
import { useLang, t, Lang } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';

interface AppData {
  id: string;
  title: string;
  packageName: string;
  logo?: string;
  icon?: string;
  primaryColor: string;
  description: Record<Lang, string>;
  features: Record<Lang, string[]>;
  privacyPolicyUrl?: string;
  websiteUrl?: string;
  appStoreUrl?: string;
  order?: number;
}

const AppCard: React.FC<{ app: AppData; index: number; lang: Lang }> = ({ app, index, lang }) => {
  const playStoreUrl = `https://play.google.com/store/apps/details?id=${app.packageName}`;
  const isWeb = !app.packageName.startsWith('com.');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      viewport={{ once: true }}
      className="group bg-white/70 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-gray-200/60 hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm overflow-hidden"
          style={{ backgroundColor: app.logo ? 'transparent' : `${app.primaryColor}18` }}
        >
          {app.logo ? (
            <img src={app.logo} alt={app.title} className="w-full h-full object-cover rounded-2xl" loading="lazy" />
          ) : (
            app.icon
          )}
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">{app.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{app.packageName}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
        {app.description[lang]}
      </p>

      {/* Features */}
      <ul className="space-y-1.5 mb-5">
        {app.features[lang].map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
            <Star className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: app.primaryColor }} fill="currentColor" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {isWeb && app.websiteUrl ? (
          <a
            href={app.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-md"
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
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-md"
            style={{ backgroundColor: app.primaryColor }}
          >
            <Download className="w-3.5 h-3.5" />
            Google Play
          </a>
        )}
        {app.appStoreUrl && (
          <a
            href={app.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-all"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            App Store
          </a>
        )}
        {app.privacyPolicyUrl && (
          <a
            href={app.privacyPolicyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            title={t(lang, 'privacyPolicy')}
          >
            <Shield className="w-4 h-4" />
          </a>
        )}
        {app.websiteUrl && !isWeb && (
          <a
            href={app.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            title={t(lang, 'website')}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

const SkeletonCard: React.FC = () => (
  <div className="bg-white/70 border border-gray-100 rounded-2xl p-6 animate-pulse">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-14 h-14 rounded-2xl bg-gray-200 flex-shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
    <div className="h-3 bg-gray-100 rounded w-full mb-2" />
    <div className="h-3 bg-gray-100 rounded w-4/5 mb-4" />
    <div className="space-y-2 mb-5">
      {[1, 2, 3].map(i => <div key={i} className="h-3 bg-gray-100 rounded w-3/4" />)}
    </div>
    <div className="h-9 bg-gray-200 rounded-xl" />
  </div>
);

const Portfolio: React.FC = () => {
  const { lang } = useLang();
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const snap = await getDocsFromServer(collection(db, 'portfolio'));
        const data = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() })) as AppData[];
        data.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setApps(data);
      } catch (e) {
        console.error('포트폴리오 불러오기 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const portfolioJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Portfolio | Mogee Development',
    description: 'Flutter 앱 및 웹 서비스 포트폴리오.',
    url: 'https://mogee.org/portfolio',
    author: {
      '@type': 'Person',
      name: 'Mogee Development',
      url: 'https://mogee.org',
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <SEOHead
        title="Portfolio"
        description="Flutter 앱 및 웹 서비스 포트폴리오. Mogee Development가 만든 프로젝트들을 확인하세요."
        canonicalPath="/portfolio"
        jsonLd={portfolioJsonLd}
      />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-indigo-500">{t(lang, 'portfolio')}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t(lang, 'portfolioTitle')}
          </h1>
          <p className="text-gray-500">
            {loading ? '...' : t(lang, 'portfolioSubtitle', apps.length)}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : apps.map((app, i) => (
                <AppCard key={app.id} app={app} index={i} lang={lang} />
              ))
          }
        </div>

        {/* Status badge */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 flex justify-center"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {t(lang, 'activelyDev')}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default Portfolio;
