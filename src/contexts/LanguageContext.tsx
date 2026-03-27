import React, { createContext, useContext, useState } from 'react';

export type Lang = 'ko' | 'en' | 'ja';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({ lang: 'ko', setLang: () => {} });

function detectLang(): Lang {
  try {
    const saved = localStorage.getItem('site-lang') as Lang;
    if (saved && ['ko', 'en', 'ja'].includes(saved)) return saved;
  } catch {}
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith('ja')) return 'ja';
  if (nav.startsWith('ko')) return 'ko';
  return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    try { localStorage.setItem('site-lang', newLang); } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);

// ─── UI 문자열 번역 ────────────────────────────────────────────────
type UIValue = string | ((n: number) => string);
const UI: Record<string, Record<Lang, UIValue>> = {
  blog:                { ko: '블로그',                        en: 'Blog',                             ja: 'ブログ' },
  portfolio:           { ko: '포트폴리오',                    en: 'Portfolio',                        ja: 'ポートフォリオ' },
  write:               { ko: '글쓰기',                        en: 'Write',                            ja: '投稿' },
  adminLogin:          { ko: '관리자 로그인',                  en: 'Admin Login',                      ja: '管理者ログイン' },
  logout:              { ko: '로그아웃',                      en: 'Logout',                           ja: 'ログアウト' },
  homeTitle:           { ko: '생각과 기록',                    en: 'Thoughts & Notes',                 ja: '思考と記録' },
  homeSubtitle:        { ko: 'Flutter 개발, 앱 출시 경험, 그리고 일상의 이야기를 씁니다.',
                         en: 'Writing about Flutter development, app launches, and everyday stories.',
                         ja: 'Flutter開発、アプリリリース体験、日常のお話を綴ります。' },
  all:                 { ko: '전체',                          en: 'All',                              ja: 'すべて' },
  noPosts:             { ko: '아직 작성된 글이 없어요',         en: 'No posts yet',                     ja: 'まだ投稿がありません' },
  noPostsHint:         { ko: '첫 번째 글을 작성해보세요!',      en: 'Write your first post!',           ja: '最初の記事を書いてみましょう！' },
  loadError:           { ko: '글을 불러오지 못했어요',          en: 'Failed to load posts',             ja: '記事を読み込めませんでした' },
  loadErrorHint:       { ko: '네트워크 연결을 확인하고 새로고침해주세요.',
                         en: 'Check your network and refresh.',
                         ja: 'ネットワーク接続を確認して更新してください。' },
  minRead:             { ko: '분 읽기',                       en: 'min read',                         ja: '分で読める' },
  backToBlog:          { ko: '블로그로 돌아가기',              en: 'Back to blog',                     ja: 'ブログに戻る' },
  postNotFound:        { ko: '글을 찾을 수 없어요',            en: 'Post not found',                   ja: '記事が見つかりません' },
  goHome:              { ko: '홈으로 돌아가기',                en: 'Go home',                          ja: 'ホームに戻る' },
  portfolioTitle:      { ko: '출시된 앱 & 서비스',             en: 'Apps & Services',                  ja: 'アプリ & サービス' },
  portfolioSubtitle:   { ko: (n: number) => `Flutter로 만든 ${n}개의 앱과 서비스입니다.`,
                         en: (n: number) => `${n} apps & services built with Flutter.`,
                         ja: (n: number) => `Flutterで作った${n}のアプリとサービスです。` },
  activelyDev:         { ko: '현재 활발히 개발 중 · 더 많은 앱 준비 중',
                         en: 'Actively developing · More apps coming soon',
                         ja: '積極的に開発中 · さらに多くのアプリを準備中' },
  website:             { ko: '웹사이트',                      en: 'Website',                          ja: 'ウェブサイト' },
  privacyPolicy:       { ko: '개인정보처리방침',               en: 'Privacy Policy',                   ja: 'プライバシーポリシー' },
  viewAll:             { ko: '전체 보기',                     en: 'View all',                         ja: 'すべて見る' },
  edit:                { ko: '수정',                          en: 'Edit',                             ja: '編集' },
  delete:              { ko: '삭제',                          en: 'Delete',                           ja: '削除' },
  deleteConfirm:       { ko: '이 글을 삭제할까요?',            en: 'Delete this post?',                ja: 'この記事を削除しますか？' },
  deleteError:         { ko: '삭제 중 오류가 발생했어요. 다시 시도해주세요.',
                         en: 'Error while deleting. Please try again.',
                         ja: '削除中にエラーが発生しました。もう一度お試しください。' },
  views:               { ko: '조회',                          en: 'views',                            ja: '閲覧' },
  likes:               { ko: '좋아요',                        en: 'likes',                            ja: 'いいね' },
  commentCount:        { ko: '댓글',                          en: 'comments',                         ja: 'コメント' },
  comments:            { ko: '댓글',                          en: 'Comments',                         ja: 'コメント' },
  commentEmpty:        { ko: '아직 댓글이 없어요. 첫 댓글을 남겨보세요!',
                         en: 'No comments yet. Be the first!',
                         ja: 'まだコメントがありません。最初のコメントを！' },
  commentPlaceholder:  { ko: '댓글을 남겨보세요...',           en: 'Leave a comment...',               ja: 'コメントを入力...' },
  nicknamePlaceholder: { ko: '닉네임',                        en: 'Nickname',                         ja: 'ニックネーム' },
  commentSubmit:       { ko: '등록',                          en: 'Post',                             ja: '投稿' },
  commentError:        { ko: '댓글 등록 중 오류가 발생했어요.',
                         en: 'Error posting comment.',
                         ja: 'コメントの投稿中にエラーが発生しました。' },
  sharePost:           { ko: '이 글 공유하기',                 en: 'Share this post',                  ja: 'この記事をシェア' },
  copyLink:            { ko: '링크 복사',                      en: 'Copy link',                        ja: 'リンクをコピー' },
  copied:              { ko: '복사됨!',                        en: 'Copied!',                          ja: 'コピーしました！' },
  shareVia:            { ko: '공유',                           en: 'Share',                            ja: 'シェア' },
  shareTwitter:        { ko: 'X에 공유',                       en: 'Share on X',                       ja: 'Xでシェア' },
};

export function t(lang: Lang, key: string, arg?: number): string {
  const val = UI[key]?.[lang] ?? UI[key]?.ko ?? key;
  if (typeof val === 'function') return arg !== undefined ? val(arg) : '';
  return val;
}
