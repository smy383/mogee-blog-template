import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useLang, t } from '../contexts/LanguageContext';

export interface Post {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  createdAt: any;
  updatedAt?: any;
  views?: number;
  likes?: number;
  // 다국어
  title_en?: string;
  summary_en?: string;
  content_en?: string;
  tags_en?: string[];
  title_ja?: string;
  summary_ja?: string;
  content_ja?: string;
  tags_ja?: string[];
}

interface BlogCardProps {
  post: Post;
  index?: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, index = 0 }) => {
  const { lang } = useLang();

  const displayTitle =
    lang === 'en' && post.title_en ? post.title_en :
    lang === 'ja' && post.title_ja ? post.title_ja :
    post.title;

  const displaySummary =
    lang === 'en' && post.summary_en ? post.summary_en :
    lang === 'ja' && post.summary_ja ? post.summary_ja :
    post.summary;

  const displayContent =
    lang === 'en' && post.content_en ? post.content_en :
    lang === 'ja' && post.content_ja ? post.content_ja :
    post.content;

  const displayTags =
    lang === 'en' && post.tags_en?.length ? post.tags_en :
    lang === 'ja' && post.tags_ja?.length ? post.tags_ja :
    post.tags;

  const formatDate = (ts: any) => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const locale = lang === 'en' ? 'en-US' : lang === 'ja' ? 'ja-JP' : 'ko-KR';
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const readingTime = Math.max(1, Math.ceil(displayContent.length / 500));
  const readLabel = lang === 'en'
    ? `${readingTime} min read`
    : lang === 'ja'
    ? `${readingTime}${t(lang, 'minRead')}`
    : `${readingTime}${t(lang, 'minRead')}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link to={`/post/${post.id}`} className="group block">
        <div className="relative bg-white/70 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-gray-200/60 hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5">
          {/* Tags */}
          {displayTags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {displayTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {displayTitle}
          </h2>

          {/* Summary */}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
            {displaySummary}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {readLabel}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
