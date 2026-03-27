import React from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink, Star, Shield } from 'lucide-react';

interface AppCardProps {
  title: string;
  description: string;
  packageName: string;
  icon: string;
  primaryColor: string;
  features: string[];
  index: number;
  privacyPolicyUrl?: string;
  websiteUrl?: string;
  appStoreUrl?: string;
}

const AppCard: React.FC<AppCardProps> = ({
  title,
  description,
  packageName,
  icon,
  primaryColor,
  features,
  index,
  privacyPolicyUrl,
  websiteUrl,
  appStoreUrl
}) => {
  const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>

      <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${primaryColor}88, ${primaryColor}44)` }}
            >
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">{title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm truncate">{packageName}</p>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-2">{description}</p>

        <div className="mb-4 sm:mb-6">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2 sm:mb-3">주요 기능</h4>
          <ul className="space-y-1.5 sm:space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-300">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" />
                <span className="text-xs sm:text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {websiteUrl && !packageName.startsWith('com.') ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>웹사이트 방문</span>
            </a>
          ) : (
            <a
              href={playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Google Play</span>
            </a>
          )}
          {appStoreUrl && (
            <a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-gray-500/30 transition-all duration-300 hover:scale-105 border border-gray-600"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>App Store</span>
            </a>
          )}
          {privacyPolicyUrl && (
            <a
              href={privacyPolicyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 sm:p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
              title="개인정보처리방침"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-blue-400 transition-colors" />
            </a>
          )}
          {websiteUrl && packageName.startsWith('com.') && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 sm:p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
              title="웹사이트 방문"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-purple-400 transition-colors" />
            </a>
          )}
          {!websiteUrl && !appStoreUrl && (
            <button className="p-2.5 sm:p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AppCard;