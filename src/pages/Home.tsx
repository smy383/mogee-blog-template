import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, getDocsFromServer } from 'firebase/firestore';
import { db } from '../firebase/config';
import BlogCard, { Post } from '../components/BlogCard';
import AppCarousel from '../components/AppCarousel';
import SEOHead from '../components/SEOHead';
import { useLang, t } from '../contexts/LanguageContext';
import { Rss } from 'lucide-react';

const Home: React.FC = () => {
  const { lang } = useLang();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const TAG_LIMIT = 20;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const snap = await getDocsFromServer(q);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
        setPosts(data);
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 현재 언어에 맞는 태그 목록
  const getPostTags = (p: Post) =>
    lang === 'en' && p.tags_en?.length ? p.tags_en :
    lang === 'ja' && p.tags_ja?.length ? p.tags_ja :
    p.tags || [];

  const allTags = Array.from(new Set(posts.flatMap(getPostTags)));
  const visibleTags = showAllTags ? allTags : allTags.slice(0, TAG_LIMIT);
  const hasMoreTags = allTags.length > TAG_LIMIT;
  const filtered = selectedTag
    ? posts.filter((p) => getPostTags(p).includes(selectedTag))
    : posts;

  const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://your-blog.web.app';
  const SITE_NAME = process.env.REACT_APP_SITE_NAME || 'My Blog';
  const SITE_DESC = process.env.REACT_APP_SITE_DESCRIPTION || 'My personal developer blog';

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESC,
    author: {
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <SEOHead
        canonicalPath="/"
        jsonLd={homeJsonLd}
      />
      {/* Decorative blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center justify-between gap-6"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center">
                <Rss className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-indigo-500">{t(lang, 'blog')}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t(lang, 'homeTitle')}
            </h1>
            <p className="text-gray-500">
              {t(lang, 'homeSubtitle')}
            </p>
          </div>

          {/* 캐릭터 마스코트 */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="flex-shrink-0 hidden sm:block"
          >
            {/* Add your own character/mascot image to public/character.png */}
            <div className="w-32 md:w-40 h-32 md:h-40 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-5xl">
              ✍️
            </div>
          </motion.div>
        </motion.div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                !selectedTag
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {t(lang, 'all')}
            </button>
            {visibleTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white border border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                #{tag}
              </button>
            ))}
            {hasMoreTags && (
              <button
                onClick={() => setShowAllTags((v) => !v)}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all"
              >
                {showAllTags ? t(lang, 'collapseTags') : `+${allTags.length - TAG_LIMIT} ${t(lang, 'moreTags')}`}
              </button>
            )}
          </motion.div>
        )}

        {/* Posts */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/70 border border-gray-100 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/4 mb-3" />
                <div className="h-6 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : fetchError ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-gray-400 font-medium">{t(lang, 'loadError')}</p>
            <p className="text-gray-300 text-sm mt-1">{t(lang, 'loadErrorHint')}</p>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Rss className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">{t(lang, 'noPosts')}</p>
            <p className="text-gray-300 text-sm mt-1">{t(lang, 'noPostsHint')}</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filtered.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}

        {/* App Carousel */}
        <AppCarousel />
      </div>
    </main>
  );
};

export default Home;
