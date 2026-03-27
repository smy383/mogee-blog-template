import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase/config';
import { useLang, t } from '../contexts/LanguageContext';
import { MessageCircle, Send } from 'lucide-react';

interface Comment {
  id: string;
  nickname: string;
  content: string;
  createdAt: any;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { lang } = useLang();
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const q = query(
          collection(db, 'posts', postId, 'comments'),
          orderBy('createdAt', 'asc')
        );
        const snap = await getDocs(q);
        setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment)));
      } catch {}
    };
    fetchComments();
  }, [postId]);

  const formatDate = (ts: any) => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const locale = lang === 'en' ? 'en-US' : lang === 'ja' ? 'ja-JP' : 'ko-KR';
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const docRef = await addDoc(collection(db, 'posts', postId, 'comments'), {
        nickname: nickname.trim(),
        content: content.trim(),
        createdAt: serverTimestamp(),
      });
      setComments((prev) => [
        ...prev,
        { id: docRef.id, nickname: nickname.trim(), content: content.trim(), createdAt: new Date() },
      ]);
      setContent('');
    } catch {
      setError(t(lang, 'commentError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      {/* Header */}
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-6">
        <MessageCircle className="w-4 h-4 text-indigo-400" />
        {t(lang, 'comments')}
        {comments.length > 0 && (
          <span className="text-xs font-medium text-white bg-indigo-400 rounded-full px-2 py-0.5">
            {comments.length}
          </span>
        )}
      </h3>

      {/* Comment list */}
      <div className="space-y-3 mb-8">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400">{t(lang, 'commentEmpty')}</p>
        ) : (
          <AnimatePresence>
            {comments.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-gray-800">{c.nickname}</span>
                  <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{c.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={t(lang, 'nicknamePlaceholder')}
          maxLength={20}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
        <div className="flex gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t(lang, 'commentPlaceholder')}
            rows={3}
            maxLength={500}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !nickname.trim() || !content.trim()}
            className="self-end px-4 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 active:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            {t(lang, 'commentSubmit')}
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default CommentSection;
