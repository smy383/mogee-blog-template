// @ts-nocheck
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import * as path from 'path';

// ─── Firebase Init ──────────────────────────────────────────────
const SERVICE_ACCOUNT_PATH = process.env.SERVICE_ACCOUNT_PATH
  || path.join(__dirname, '..', 'serviceAccount.json');
const serviceAccount = require(SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();
const POSTS = 'posts';
const PORTFOLIO = 'portfolio';
const BLOG_URL = process.env.BLOG_URL || 'https://your-blog.web.app';

// ─── Utils ──────────────────────────────────────────────────────
function stripMarkdown(text) {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*|__|[*_]|~~|`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();
}

function formatDate(ts) {
  if (!ts) return 'No date';
  return ts.toDate().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatPost(id, data, includeContent = false) {
  const lines = [
    `📝 **${data.title}**`,
    `🆔 ID: ${id}`,
    `🔗 URL: ${BLOG_URL}/post/${id}`,
    `📅 Date: ${formatDate(data.createdAt)}`,
  ];
  if (data.tags?.length) lines.push(`🏷️ Tags: ${data.tags.map((t) => `#${t}`).join(' ')}`);
  if (data.summary) lines.push(`📌 Summary: ${data.summary}`);
  if (includeContent && data.content) {
    lines.push('', '─'.repeat(40), '', data.content);
  }
  return lines.join('\n');
}

function formatPortfolio(id, data) {
  const lines = [
    `📦 **${data.title}**`,
    `🆔 ID: ${id}`,
    `📌 packageName: ${data.packageName}`,
    `🎨 primaryColor: ${data.primaryColor}`,
    `🔢 order: ${data.order ?? 999}`,
  ];
  if (data.websiteUrl) lines.push(`🌐 website: ${data.websiteUrl}`);
  if (data.appStoreUrl) lines.push(`🍎 appStore: ${data.appStoreUrl}`);
  if (data.privacyPolicyUrl) lines.push(`🔒 privacy: ${data.privacyPolicyUrl}`);
  lines.push(`\n📝 Description (ko): ${data.description?.ko ?? ''}`);
  return lines.join('\n');
}

// ─── MCP Server ─────────────────────────────────────────────────
const server = new McpServer({
  name: 'blog-mcp',
  version: '1.0.0',
});

// ─── blog_write ─────────────────────────────────────────────────
server.registerTool(
  'blog_write',
  {
    title: 'Blog Write',
    description: `Write a new blog post.
- Supports markdown syntax (**bold**, *italic*, # heading, \`code\`, etc.)
- If summary is omitted, it will be auto-generated from content (first 120 chars)
- Returns post ID and URL after creation
- Supports multilingual content: Korean (ko), English (en), Japanese (ja)`,
    inputSchema: z.object({
      title: z.string().min(1).max(200).describe('Post title (required, Korean)'),
      content: z.string().min(1).describe('Post body. Supports markdown. (Korean)'),
      tags: z.array(z.string().max(30)).max(10).default([]).describe('Tag list'),
      summary: z.string().max(200).optional().describe('Summary (auto-generated if omitted)'),
      title_en: z.string().max(200).optional().describe('English title'),
      content_en: z.string().optional().describe('English body'),
      summary_en: z.string().max(200).optional().describe('English summary'),
      tags_en: z.array(z.string().max(30)).max(10).optional().describe('English tags'),
      title_ja: z.string().max(200).optional().describe('Japanese title'),
      content_ja: z.string().optional().describe('Japanese body'),
      summary_ja: z.string().max(200).optional().describe('Japanese summary'),
      tags_ja: z.array(z.string().max(30)).max(10).optional().describe('Japanese tags'),
    }),
    annotations: { readOnlyHint: false, destructiveHint: false },
  },
  async ({ title, content, tags, summary, title_en, content_en, summary_en, tags_en, title_ja, content_ja, summary_ja, tags_ja }) => {
    const autoSummary = summary || stripMarkdown(content).slice(0, 120);
    const now = admin.firestore.FieldValue.serverTimestamp();
    const postData: any = {
      title, content, tags,
      summary: autoSummary,
      createdAt: now, updatedAt: now,
    };
    if (title_en && content_en) {
      postData.title_en = title_en;
      postData.content_en = content_en;
      postData.summary_en = summary_en || stripMarkdown(content_en).slice(0, 120);
      if (tags_en) postData.tags_en = tags_en;
    }
    if (title_ja && content_ja) {
      postData.title_ja = title_ja;
      postData.content_ja = content_ja;
      postData.summary_ja = summary_ja || stripMarkdown(content_ja).slice(0, 120);
      if (tags_ja) postData.tags_ja = tags_ja;
    }
    const docRef = await db.collection(POSTS).add(postData);

    return {
      content: [{
        type: 'text',
        text: `✅ Post published!\n\n${[
          `📝 Title: ${title}`,
          `🆔 ID: ${docRef.id}`,
          `🔗 URL: ${BLOG_URL}/post/${docRef.id}`,
          `🏷️ Tags: ${tags.length ? tags.map(t => `#${t}`).join(' ') : 'none'}`,
          `📌 Summary: ${autoSummary}`,
        ].join('\n')}`,
      }],
    };
  },
);

// ─── blog_edit ──────────────────────────────────────────────────
server.registerTool(
  'blog_edit',
  {
    title: 'Blog Edit',
    description: `Edit an existing blog post.
- Only pass the fields you want to update (others remain unchanged)
- Use blog_list or blog_get to find the post ID`,
    inputSchema: z.object({
      id: z.string().min(1).describe('Post ID to edit (required)'),
      title: z.string().min(1).max(200).optional().describe('New title'),
      content: z.string().min(1).optional().describe('New body'),
      tags: z.array(z.string().max(30)).max(10).optional().describe('Tags'),
      summary: z.string().max(200).optional().describe('New summary'),
      title_en: z.string().max(200).optional().describe('English title'),
      content_en: z.string().optional().describe('English body'),
      summary_en: z.string().max(200).optional().describe('English summary'),
      tags_en: z.array(z.string().max(30)).max(10).optional().describe('English tags'),
      title_ja: z.string().max(200).optional().describe('Japanese title'),
      content_ja: z.string().optional().describe('Japanese body'),
      summary_ja: z.string().max(200).optional().describe('Japanese summary'),
      tags_ja: z.array(z.string().max(30)).max(10).optional().describe('Japanese tags'),
    }),
    annotations: { readOnlyHint: false, destructiveHint: false },
  },
  async ({ id, title, content, tags, summary, title_en, content_en, summary_en, tags_en, title_ja, content_ja, summary_ja, tags_ja }) => {
    const docRef = db.collection(POSTS).doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return { content: [{ type: 'text', text: `❌ Post not found: "${id}"\nUse blog_list to find the correct ID.` }] };
    }

    const updates: any = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (title !== undefined) updates.title = title;
    if (content !== undefined) {
      updates.content = content;
      if (!summary) updates.summary = stripMarkdown(content).slice(0, 120);
    }
    if (tags !== undefined) updates.tags = tags;
    if (summary !== undefined) updates.summary = summary;
    if (title_en !== undefined) updates.title_en = title_en;
    if (content_en !== undefined) {
      updates.content_en = content_en;
      if (!summary_en) updates.summary_en = stripMarkdown(content_en).slice(0, 120);
    }
    if (summary_en !== undefined) updates.summary_en = summary_en;
    if (tags_en !== undefined) updates.tags_en = tags_en;
    if (title_ja !== undefined) updates.title_ja = title_ja;
    if (content_ja !== undefined) {
      updates.content_ja = content_ja;
      if (!summary_ja) updates.summary_ja = stripMarkdown(content_ja).slice(0, 120);
    }
    if (summary_ja !== undefined) updates.summary_ja = summary_ja;
    if (tags_ja !== undefined) updates.tags_ja = tags_ja;

    await docRef.update(updates);
    const updated = await docRef.get();
    const data = updated.data();

    return {
      content: [{
        type: 'text',
        text: `✅ Post updated!\n\n${formatPost(id, data)}`,
      }],
    };
  },
);

// ─── blog_delete ────────────────────────────────────────────────
server.registerTool(
  'blog_delete',
  {
    title: 'Blog Delete',
    description: `Delete a blog post.
⚠️ Deleted posts cannot be recovered.
Use blog_list or blog_get to find the post ID.`,
    inputSchema: z.object({
      id: z.string().min(1).describe('Post ID to delete'),
    }),
    annotations: { readOnlyHint: false, destructiveHint: true },
  },
  async ({ id }) => {
    const docRef = db.collection(POSTS).doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return { content: [{ type: 'text', text: `❌ Post not found: "${id}"` }] };
    }

    const title = snap.data()?.title ?? '(no title)';
    await docRef.delete();

    return {
      content: [{
        type: 'text',
        text: `🗑️ Post deleted.\n\nTitle: ${title}\nID: ${id}`,
      }],
    };
  },
);

// ─── blog_list ──────────────────────────────────────────────────
server.registerTool(
  'blog_list',
  {
    title: 'Blog List',
    description: `List blog posts in reverse chronological order.
- Default 10, max 50
- Returns ID, title, summary, tags, date
- Use blog_get for full content`,
    inputSchema: z.object({
      limit: z.number().int().min(1).max(50).default(10).describe('Number of posts to list (default: 10, max: 50)'),
    }),
    annotations: { readOnlyHint: true },
  },
  async ({ limit }) => {
    const snap = await db.collection(POSTS)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    if (snap.empty) {
      return { content: [{ type: 'text', text: '📭 No posts yet.' }] };
    }

    const lines = [`📚 Recent posts (${snap.size})\n`];
    snap.docs.forEach((doc, i) => {
      const d = doc.data();
      lines.push(`${i + 1}. ${formatPost(doc.id, d)}\n`);
    });

    return { content: [{ type: 'text', text: lines.join('\n') }] };
  },
);

// ─── blog_get ───────────────────────────────────────────────────
server.registerTool(
  'blog_get',
  {
    title: 'Blog Get',
    description: `Get a specific blog post with full content.
- Returns title, tags, summary, date, and full body
- Use blog_list to find the post ID`,
    inputSchema: z.object({
      id: z.string().min(1).describe('Post ID to retrieve'),
    }),
    annotations: { readOnlyHint: true },
  },
  async ({ id }) => {
    const snap = await db.collection(POSTS).doc(id).get();
    if (!snap.exists) {
      return { content: [{ type: 'text', text: `❌ Post not found: "${id}"\nUse blog_list to find the correct ID.` }] };
    }

    return {
      content: [{
        type: 'text',
        text: formatPost(id, snap.data(), true),
      }],
    };
  },
);

// ─── portfolio_add ──────────────────────────────────────────────
server.registerTool(
  'portfolio_add',
  {
    title: 'Portfolio Add',
    description: `Add a new project to your portfolio.
- Immediately visible on the portfolio page
- Lower order value = displayed first (default: 999)
- Multilingual descriptions required: Korean (ko), English (en), Japanese (ja)`,
    inputSchema: z.object({
      title: z.string().min(1).describe('Project name'),
      packageName: z.string().min(1).describe('Package name or identifier'),
      primaryColor: z.string().describe('Primary color hex (e.g., #6366f1)'),
      description_ko: z.string().describe('Korean description'),
      description_en: z.string().describe('English description'),
      description_ja: z.string().describe('Japanese description'),
      features_ko: z.array(z.string()).describe('Korean feature list'),
      features_en: z.array(z.string()).describe('English feature list'),
      features_ja: z.array(z.string()).describe('Japanese feature list'),
      logo: z.string().optional().describe('Logo image path (e.g., /logos/myapp.png)'),
      icon: z.string().optional().describe('Emoji icon — used when no logo'),
      websiteUrl: z.string().optional().describe('Website or GitHub URL'),
      appStoreUrl: z.string().optional().describe('App Store URL'),
      privacyPolicyUrl: z.string().optional().describe('Privacy policy URL'),
      order: z.number().optional().describe('Sort order (default: 999)'),
    }),
    annotations: { readOnlyHint: false, destructiveHint: false },
  },
  async ({ title, packageName, primaryColor, description_ko, description_en, description_ja, features_ko, features_en, features_ja, logo, icon, websiteUrl, appStoreUrl, privacyPolicyUrl, order }) => {
    const data: any = {
      title, packageName, primaryColor,
      description: { ko: description_ko, en: description_en, ja: description_ja },
      features: { ko: features_ko, en: features_en, ja: features_ja },
      order: order ?? 999,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (logo) data.logo = logo;
    if (icon) data.icon = icon;
    if (websiteUrl) data.websiteUrl = websiteUrl;
    if (appStoreUrl) data.appStoreUrl = appStoreUrl;
    if (privacyPolicyUrl) data.privacyPolicyUrl = privacyPolicyUrl;

    const docRef = await db.collection(PORTFOLIO).add(data);
    return {
      content: [{
        type: 'text',
        text: `✅ Added "${title}" to portfolio!\n🆔 ID: ${docRef.id}\n🌐 Check your portfolio page.`,
      }],
    };
  },
);

// ─── portfolio_edit ─────────────────────────────────────────────
server.registerTool(
  'portfolio_edit',
  {
    title: 'Portfolio Edit',
    description: `Edit a portfolio item.
- Only pass the fields you want to update
- Use portfolio_list to find the item ID`,
    inputSchema: z.object({
      id: z.string().min(1).describe('Item ID to edit (required)'),
      title: z.string().optional().describe('Project name'),
      packageName: z.string().optional().describe('Package name or identifier'),
      primaryColor: z.string().optional().describe('Primary color hex'),
      description_ko: z.string().optional().describe('Korean description'),
      description_en: z.string().optional().describe('English description'),
      description_ja: z.string().optional().describe('Japanese description'),
      features_ko: z.array(z.string()).optional().describe('Korean feature list'),
      features_en: z.array(z.string()).optional().describe('English feature list'),
      features_ja: z.array(z.string()).optional().describe('Japanese feature list'),
      logo: z.string().optional().describe('Logo image path'),
      icon: z.string().optional().describe('Emoji icon'),
      websiteUrl: z.string().optional().describe('Website URL'),
      appStoreUrl: z.string().optional().describe('App Store URL'),
      privacyPolicyUrl: z.string().optional().describe('Privacy policy URL'),
      order: z.number().optional().describe('Sort order'),
    }),
    annotations: { readOnlyHint: false, destructiveHint: false },
  },
  async ({ id, title, packageName, primaryColor, description_ko, description_en, description_ja, features_ko, features_en, features_ja, logo, icon, websiteUrl, appStoreUrl, privacyPolicyUrl, order }) => {
    const docRef = db.collection(PORTFOLIO).doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return { content: [{ type: 'text', text: `❌ Portfolio item not found: "${id}"` }] };
    }

    const existing = snap.data() as any;
    const updates: any = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (title !== undefined) updates.title = title;
    if (packageName !== undefined) updates.packageName = packageName;
    if (primaryColor !== undefined) updates.primaryColor = primaryColor;
    if (logo !== undefined) updates.logo = logo;
    if (icon !== undefined) updates.icon = icon;
    if (websiteUrl !== undefined) updates.websiteUrl = websiteUrl;
    if (appStoreUrl !== undefined) updates.appStoreUrl = appStoreUrl;
    if (privacyPolicyUrl !== undefined) updates.privacyPolicyUrl = privacyPolicyUrl;
    if (order !== undefined) updates.order = order;

    if (description_ko !== undefined || description_en !== undefined || description_ja !== undefined) {
      updates.description = {
        ko: description_ko ?? existing.description?.ko ?? '',
        en: description_en ?? existing.description?.en ?? '',
        ja: description_ja ?? existing.description?.ja ?? '',
      };
    }
    if (features_ko !== undefined || features_en !== undefined || features_ja !== undefined) {
      updates.features = {
        ko: features_ko ?? existing.features?.ko ?? [],
        en: features_en ?? existing.features?.en ?? [],
        ja: features_ja ?? existing.features?.ja ?? [],
      };
    }

    await docRef.update(updates);
    const updated = (await docRef.get()).data();
    return {
      content: [{
        type: 'text',
        text: `✅ Portfolio item updated!\n\n${formatPortfolio(id, updated)}`,
      }],
    };
  },
);

// ─── portfolio_delete ───────────────────────────────────────────
server.registerTool(
  'portfolio_delete',
  {
    title: 'Portfolio Delete',
    description: `Delete a portfolio item.
⚠️ Deleted items cannot be recovered.`,
    inputSchema: z.object({
      id: z.string().min(1).describe('Item ID to delete'),
    }),
    annotations: { readOnlyHint: false, destructiveHint: true },
  },
  async ({ id }) => {
    const docRef = db.collection(PORTFOLIO).doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return { content: [{ type: 'text', text: `❌ Portfolio item not found: "${id}"` }] };
    }
    const title = snap.data()?.title ?? '(no title)';
    await docRef.delete();
    return {
      content: [{
        type: 'text',
        text: `🗑️ Removed "${title}" from portfolio.\nID: ${id}`,
      }],
    };
  },
);

// ─── portfolio_list ─────────────────────────────────────────────
server.registerTool(
  'portfolio_list',
  {
    title: 'Portfolio List',
    description: `List all portfolio items sorted by order.
- Returns ID, name, package name, description, order`,
    inputSchema: z.object({}),
    annotations: { readOnlyHint: true },
  },
  async () => {
    const snap = await db.collection(PORTFOLIO).orderBy('order', 'asc').get();
    if (snap.empty) {
      return { content: [{ type: 'text', text: '📭 No portfolio items.' }] };
    }
    const lines = [`📦 Portfolio (${snap.size} items)\n`];
    snap.docs.forEach((doc, i) => {
      lines.push(`${i + 1}. ${formatPortfolio(doc.id, doc.data())}\n`);
    });
    return { content: [{ type: 'text', text: lines.join('\n') }] };
  },
);

// ─── Start Server ───────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
