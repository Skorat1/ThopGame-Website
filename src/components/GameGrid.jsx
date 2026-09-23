import React, { useState, useMemo, memo, useEffect, useRef, useCallback } from 'react';
import { Gamepad2, Loader2 } from 'lucide-react';
import GameCard from './GameCard';
import { sounds } from '../utils/audio';
import { renderCategorySvgIcon, getDimmedCategoryColor } from '../utils/categoryIcons';

const DEFAULT_QUICK_CATEGORIES = [
  { id: 'all', name: 'All Games', icon: 'gamepad' },
  { id: 'arcade', name: 'Arcade', icon: 'arcade' },
  { id: 'action', name: 'Action', icon: 'action' },
  { id: 'puzzle', name: 'Puzzle', icon: 'puzzle' },
  { id: 'classic', name: 'Classic', icon: 'classic' },
  { id: 'sports', name: 'Sports', icon: 'sports' },
  { id: 'cyber', name: 'Cyberpunk', icon: 'cyber' }
];

const BATCH_SIZE = 28;

const GameGrid = memo(function GameGrid({
  title,
  games = [],
  allGames = [],
  onPlayGame,
  favorites = [],
  onToggleFavorite,
  activeCategory = '',
  onSelectCategory,
  activePage = 'home',
  searchQuery = '',
  onOpenAuth,
  onFocusSearch,
  user,
  categories = [],
  activeGameCounts = {}
}) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  // Reset visible count when games list changes (category / search change)
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory, searchQuery]);

  const displayedGames = useMemo(() => {
    if (!games || games.length === 0) return [];
    return games.slice(0, visibleCount);
  }, [games, visibleCount]);

  const hasMore = visibleCount < games.length;

  // Load next batch
  const loadMore = useCallback(() => {
    if (isLoading || visibleCount >= games.length) return;
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + BATCH_SIZE, games.length));
      setIsLoading(false);
    }, 350);
  }, [isLoading, visibleCount, games.length]);

  // Setup IntersectionObserver on sentinel div
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '200px', threshold: 0 }
    );

    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);

    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [loadMore]);

  const quickCatList = useMemo(() => {
    if (categories && categories.length > 0) return categories;
    return DEFAULT_QUICK_CATEGORIES;
  }, [categories]);

  return (
    <section className="gamepix-category-grid-section">
      {/* Quick Category Chips Bar */}
      <div className="quick-cat-scroll-bar">
        {quickCatList.map(cat => {
          const catIdNorm = (cat.id || cat._id || '').toLowerCase().trim();
          const activeCatNorm = (activeCategory || '').toLowerCase().trim();
          const isAllCat = catIdNorm === 'all' || catIdNorm === '';
          const isActive = isAllCat
            ? (!activeCatNorm || activeCatNorm === 'all')
            : (activeCatNorm === catIdNorm || (cat.name && activeCatNorm === cat.name.toLowerCase().trim()));

          const rawColor = cat.color || (isAllCat ? '#2563eb' : '#3b82f6');
          const catColor = getDimmedCategoryColor(rawColor);

          return (
            <button
              key={cat.id || cat._id || 'all'}
              className={`category-quick-pill ${isActive ? 'active' : ''}`}
              style={{
                '--cat-color': catColor,
                ...(isActive ? {
                  background: catColor,
                  borderColor: catColor,
                  boxShadow: `0 3px 12px ${catColor}35`,
                  color: '#ffffff'
                } : {
                  borderColor: `${catColor}30`,
                  background: '#ffffff'
                })
              }}
              onClick={() => {
                sounds.playClick();
                if (onSelectCategory) onSelectCategory(isAllCat ? '' : (cat.id || cat._id));
              }}
            >
              <span
                className="pill-svg-icon"
                style={{ color: isActive ? '#ffffff' : catColor, opacity: isActive ? 1 : 0.92 }}
              >
                {renderCategorySvgIcon(cat, 17)}
              </span>
              <span
                className="pill-name-text"
                style={{ color: isActive ? '#ffffff' : '#334155' }}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid Header */}
      <div className="grid-header-row">
        <div className="grid-title-group">
          <h2 className="grid-main-title sky-brand-heading">
            {searchQuery ? (
              <>Search Results for: <span className="highlight-text">"{searchQuery}"</span></>
            ) : (
              title || (activeCategory ? `${activeCategory.toUpperCase()} GAMES` : 'All Games')
            )}
          </h2>
          {games.length > 0 && (
            <span style={{
              fontSize: '0.78rem', color: '#64748b', fontWeight: '600',
              marginLeft: '10px', background: '#f1f5f9',
              padding: '2px 10px', borderRadius: '20px', letterSpacing: '0.02em'
            }}>
              {displayedGames.length} / {games.length}
            </span>
          )}
        </div>
      </div>

      {/* Main Game Cards Grid */}
      <div className="game-cards-masonry-grid poki-masonry-grid">
        {displayedGames.map((game, index) => {
          let sizeVariant = '1x1';
          if (game.tileSize && game.tileSize !== 'auto') {
            sizeVariant = String(game.tileSize).toLowerCase().trim();
          } else if (game.featured) {
            sizeVariant = '2x2';
          } else {
            sizeVariant = '1x1';
          }

          const gameId = game.id || game._id;
          const liveCount = (activeGameCounts && (activeGameCounts[gameId] || activeGameCounts[game.id] || activeGameCounts[game._id])) || 0;

          return (
            <GameCard
              key={game.id || game._id || index}
              game={game}
              onPlay={onPlayGame}
              isFavorite={(favorites || []).includes(game.id || game._id)}
              onToggleFavorite={onToggleFavorite}
              sizeVariant={sizeVariant}
              priority={index < 12}
              livePlayersCount={liveCount}
            />
          );
        })}
      </div>

      {/* Infinite Scroll Sentinel — invisible trigger div */}
      {hasMore && <div ref={sentinelRef} style={{ height: '1px' }} />}

      {/* Loading Spinner */}
      {isLoading && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', padding: '28px 0 16px',
          color: '#4facfe', fontWeight: '700', fontSize: '0.95rem'
        }}>
          <Loader2 size={26} color="#4facfe" style={{ animation: 'spin 0.8s linear infinite' }} />
          Loading more games…
        </div>
      )}

      {/* All Loaded Footer */}
      {!hasMore && games.length > BATCH_SIZE && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', padding: '22px 0 10px',
          color: '#94a3b8', fontSize: '0.82rem', fontWeight: '600', letterSpacing: '0.04em'
        }}>
          <span style={{ display: 'inline-block', width: 40, height: 1, background: '#e2e8f0' }} />
          All {games.length} games loaded
          <span style={{ display: 'inline-block', width: 40, height: 1, background: '#e2e8f0' }} />
        </div>
      )}

      {/* Empty State */}
      {games.length === 0 && (
        <div className="empty-grid-state" style={{
          padding: '50px 24px', textAlign: 'center', background: '#ffffff',
          borderRadius: '24px', border: '1.5px dashed #cbd5e1',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)', margin: '10px 0 30px'
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px', border: '1px solid rgba(37,99,235,0.2)'
          }}>
            <Gamepad2 size={38} color="#2563eb" />
          </div>
          <h3 style={{ fontSize: '1.35rem', color: '#0f172a', marginBottom: '8px', fontWeight: '800' }}>
            {searchQuery
              ? `No games found for "${searchQuery}"`
              : activeCategory
              ? `No games in "${activeCategory.toUpperCase()}" yet`
              : 'No games available'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 20px', lineHeight: '1.5' }}>
            {searchQuery
              ? 'Try searching with another keyword or click any category pill above to explore more games.'
              : 'Games under this category will be available soon. Select another category above or view all games.'}
          </p>
          <button
            onClick={() => { sounds.playClick(); if (onSelectCategory) onSelectCategory(''); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
              border: 'none', borderRadius: '50px', color: '#0a1024',
              fontSize: '0.88rem', fontWeight: '800', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,242,254,0.3)', transition: 'all 0.2s ease'
            }}
          >
            <Gamepad2 size={16} />
            <span>View All Games</span>
          </button>
        </div>
      )}
    </section>
  );
});

export default GameGrid;
