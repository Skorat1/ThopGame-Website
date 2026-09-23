import React, { useState, useMemo, useEffect } from 'react';
import { CONFIG } from '../config';
import {
  ArrowLeft, BookOpen, Flame, Sparkles, Trophy, Zap, Gamepad2,
  Clock, Tag, User, ChevronRight, Search, Star, TrendingUp,
  Monitor, Smartphone, Globe2, Shield, Calendar, Eye, MessageSquare,
  Share2, Heart, ArrowUpRight, Newspaper, Users
} from 'lucide-react';
import { sounds } from '../utils/audio';





// ─── Markdown-like renderer (simple) ─────────────────────────────────────────
function renderContent(md) {
  const lines = md.split('\n');
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '22px 0 8px' }}>{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '28px 0 10px', borderBottom: '2px solid #e2e8f0', paddingBottom: 8 }}>{line.slice(3)}</h2>);
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={i} style={{ fontWeight: 700, color: '#0f172a', margin: '8px 0 4px' }}>{line.replace(/\*\*/g, '')}</p>);
    } else if (/^\d+\. /.test(line)) {
      elements.push(<li key={i} style={{ color: '#334155', lineHeight: 1.7, marginBottom: 4, marginLeft: 18 }}>{line.replace(/^\d+\. /, '')}</li>);
    } else if (line.startsWith('- ')) {
      elements.push(<li key={i} style={{ color: '#334155', lineHeight: 1.7, marginBottom: 4, marginLeft: 18, listStyle: 'disc' }}>{line.slice(2)}</li>);
    } else if (line.startsWith('| ')) {
      // simple table row
      const cells = line.split('|').filter(c => c.trim() && !c.match(/^[-:| ]+$/));
      if (cells.length > 0) {
        elements.push(
          <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
            {cells.map((c, ci) => (
              <td key={ci} style={{ padding: '6px 14px', color: '#334155', fontSize: '0.88rem' }}>{c.trim()}</td>
            ))}
          </tr>
        );
      }
    } else if (line.trim()) {
      // Handle inline bold **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((p, pi) =>
        p.startsWith('**') ? <strong key={pi}>{p.replace(/\*\*/g, '')}</strong> : p
      );
      elements.push(<p key={i} style={{ color: '#475569', lineHeight: 1.75, margin: '8px 0' }}>{rendered}</p>);
    } else {
      elements.push(<div key={i} style={{ height: 6 }} />);
    }
    i++;
  }
  return elements;
}

// ─── Article Detail View ──────────────────────────────────────────────────────
function ArticleDetail({ post, onBack }) {
  const catInfo = BLOG_CATEGORIES.find(c => c.id === post.category) || BLOG_CATEGORIES[0];
  const CatIcon = catInfo.icon;

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 0 60px' }}>
      {/* Back Button */}
      <button
        onClick={() => { sounds.playClick(); onBack(); }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#f1f5f9', border: '1.5px solid #e2e8f0',
          borderRadius: 50, padding: '8px 20px', cursor: 'pointer',
          color: '#475569', fontWeight: 700, fontSize: '0.85rem',
          marginBottom: 28, transition: 'all 0.2s'
        }}
      >
        <ArrowLeft size={16} /> Back to Blog
      </button>

      {/* Hero Card */}
      <div style={{
        background: post.gradient, borderRadius: 24, padding: '48px 40px',
        marginBottom: 32, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>{post.emoji}</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.2)', borderRadius: 50,
          padding: '4px 14px', marginBottom: 14, backdropFilter: 'blur(8px)'
        }}>
          <CatIcon size={13} color="#fff" />
          <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {catInfo.label}
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1.25, margin: '0 0 16px', maxWidth: 700 }}>
          {post.title}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
          {[
            { icon: <User size={13} />, text: post.author },
            { icon: <Calendar size={13} />, text: post.date },
            { icon: <Clock size={13} />, text: post.readTime },
            { icon: <Eye size={13} />, text: `${post.views} views` },
          ].map((m, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.9)', fontSize: '0.82rem', fontWeight: 600 }}>
              {m.icon} {m.text}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{
        background: '#fff', borderRadius: 20, padding: '36px 40px',
        border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        fontSize: '0.97rem', lineHeight: 1.75
      }}>
        {renderContent(post.content)}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
        {post.tags.map(tag => (
          <span key={tag} style={{
            background: '#f1f5f9', border: '1px solid #e2e8f0',
            borderRadius: 50, padding: '4px 14px',
            fontSize: '0.78rem', fontWeight: 700, color: '#64748b',
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            <Tag size={11} /> {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Blog Card ────────────────────────────────────────────────────────────────
function BlogCard({ post, onClick, featured = false }) {
  const catInfo = BLOG_CATEGORIES.find(c => c.id === post.category) || BLOG_CATEGORIES[0];
  const CatIcon = catInfo.icon;

  if (featured) {
    return (
      <div
        onClick={() => { sounds.playClick(); onClick(post); }}
        style={{
          background: post.gradient, borderRadius: 24, padding: '48px 44px',
          cursor: 'pointer', gridColumn: '1 / -1', position: 'relative', overflow: 'hidden',
          transition: 'transform 0.25s, box-shadow 0.25s',
          boxShadow: '0 8px 40px rgba(99,102,241,0.2)'
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 60px rgba(99,102,241,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(99,102,241,0.2)'; }}
      >
        <div style={{ position: 'absolute', top: 20, right: 28, fontSize: '5rem', opacity: 0.15 }}>{post.emoji}</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.22)', borderRadius: 50, padding: '4px 14px',
          backdropFilter: 'blur(8px)', marginBottom: 14
        }}>
          <Star size={12} color="#fff" fill="#fff" />
          <span style={{ color: '#fff', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Featured Post</span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 14, maxWidth: 680 }}>
          {post.title}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.65, maxWidth: 620, marginBottom: 24, fontSize: '0.97rem' }}>
          {post.excerpt}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', marginBottom: 20 }}>
          {[
            { icon: <User size={13} />, text: post.author },
            { icon: <Calendar size={13} />, text: post.date },
            { icon: <Clock size={13} />, text: post.readTime },
            { icon: <Eye size={13} />, text: `${post.views} views` },
          ].map((m, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.88)', fontSize: '0.8rem', fontWeight: 600 }}>
              {m.icon} {m.text}
            </span>
          ))}
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: 'rgba(255,255,255,0.95)', borderRadius: 50, padding: '9px 22px',
          color: '#0f172a', fontWeight: 800, fontSize: '0.88rem'
        }}>
          Read Full Article <ArrowUpRight size={15} />
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={() => { sounds.playClick(); onClick(post); }}
      style={{
        background: '#fff', borderRadius: 18, overflow: 'hidden',
        border: '1.5px solid #e2e8f0', cursor: 'pointer',
        transition: 'all 0.22s ease', boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
    >
      {/* Gradient Header */}
      <div style={{ background: post.gradient, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.6rem', position: 'relative' }}>
        {post.emoji}
        <div style={{
          position: 'absolute', top: 10, right: 12,
          background: 'rgba(255,255,255,0.22)', borderRadius: 50, padding: '3px 10px',
          backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', gap: 4
        }}>
          <CatIcon size={11} color="#fff" />
          <span style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{catInfo.label}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px 20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: 8 }}>
          {post.title}
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.excerpt}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8', fontSize: '0.74rem', fontWeight: 600 }}>
              <Clock size={11} /> {post.readTime}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8', fontSize: '0.74rem', fontWeight: 600 }}>
              <Eye size={11} /> {post.views}
            </span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6366f1', fontSize: '0.78rem', fontWeight: 800 }}>
            Read <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main BlogPage ────────────────────────────────────────────────────────────
export default function BlogPage({ onBackToHome }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState(BLOG_POSTS);   // static fallback until API responds
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  // Fetch published posts from backend on mount
  useEffect(() => {
    let cancelled = false;
    const API_BASE = (CONFIG?.API_BASE || 'http://localhost:5000/api').replace(/\/+$/, '');
    fetch(`${API_BASE}/blog`)
      .then(r => { if (!r.ok) throw new Error('API error'); return r.json(); })
      .then(data => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setPosts(data);
          setApiError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setApiError(true); // keep static fallback silently
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const featuredPost = posts.find(p => p.featured);

  const filteredPosts = useMemo(() => {
    let list = posts.filter(p => !p.featured);
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        (Array.isArray(p.tags) ? p.tags.some(t => t.toLowerCase().includes(q)) : false)
      );
    }
    return list;
  }, [activeCategory, searchQuery, posts]);

  if (selectedPost) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px 16px' }}>
        <ArticleDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: 60 }}>

      {/* ── Page Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        padding: '52px 24px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: -60, left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: '8%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,172,254,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: 50, padding: '6px 18px', marginBottom: 18
        }}>
          <Newspaper size={14} color="#fff" />
          <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ThopGames Blog
          </span>
        </div>

        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', marginBottom: 14, lineHeight: 1.15 }}>
          Gaming News &amp; Tips
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Expert guides, industry news, game reviews, and tips to level up your gaming experience.
        </p>

        {/* Search Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.15)',
          borderRadius: 50, padding: '10px 20px', maxWidth: 440, margin: '0 auto',
          backdropFilter: 'blur(12px)'
        }}>
          <Search size={16} color="rgba(255,255,255,0.5)" />
          <input
            type="text"
            placeholder="Search articles…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontSize: '0.9rem', fontWeight: 600
            }}
          />
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 20px 0' }}>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32, justifyContent: 'center' }}>
          {BLOG_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { sounds.playClick(); setActiveCategory(cat.id); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 18px', borderRadius: 50, border: `1.5px solid`,
                  cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                  transition: 'all 0.18s',
                  background: isActive ? cat.color : '#fff',
                  borderColor: isActive ? cat.color : '#e2e8f0',
                  color: isActive ? '#fff' : '#475569',
                  boxShadow: isActive ? `0 4px 14px ${cat.color}40` : 'none'
                }}
              >
                <Icon size={13} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Loading spinner */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Loading articles...</div>
          </div>
        )}

        {/* Featured Post */}
        {!loading && activeCategory === 'all' && !searchQuery && featuredPost && (
          <div style={{ marginBottom: 32, display: 'grid', gridTemplateColumns: '1fr' }}>
            <BlogCard post={featuredPost} onClick={setSelectedPost} featured />
          </div>
        )}

        {/* Article Grid */}
        {!loading && (filteredPosts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20
          }}>
            {filteredPosts.map(post => (
              <BlogCard key={post.id} post={post} onClick={setSelectedPost} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: '60px 24px',
            background: '#fff', borderRadius: 20,
            border: '1.5px dashed #cbd5e1'
          }}>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
              No articles found
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Try a different category or search keyword.
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              style={{
                marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', border: 'none', borderRadius: 50, padding: '10px 24px',
                fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer'
              }}
            >
               View All Posts
            </button>
          </div>
        ))}

        {/* Stats Bar */}
        <div style={{
          marginTop: 48, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center'
        }}>
          {[
            { label: 'Articles Published', value: String(posts.length) + '+', icon: <BookOpen size={18} />, color: '#6366f1' },
            { label: 'Monthly Readers', value: '120K+', icon: <Users size={18} />, color: '#ef4444' },
            { label: 'Topics Covered', value: String(BLOG_CATEGORIES.length - 1), icon: <Tag size={18} />, color: '#f59e0b' },
            { label: 'New Posts Weekly', value: '5+', icon: <Sparkles size={18} />, color: '#10b981' },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16,
              padding: '18px 26px', display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)', minWidth: 200
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.color
              }}>
                {s.icon}  
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
