import React, { useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/games';
import { sounds } from '../utils/audio';
import { renderCategorySvgIcon, getGameCountForCategory, getDimmedCategoryColor } from '../utils/categoryIcons';

export default function CategoryBar({
  activeCategory = 'all',
  onSelectCategory,
  gameCounts = {},
  categories = CATEGORIES,
  games = []
}) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    sounds.playClick();
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Only display categories that have active games (or 'all')
  const visibleCategories = useMemo(() => {
    return (categories || []).filter((cat) => {
      if (cat.id === 'all' || cat.id === '' || (cat.name || '').toLowerCase() === 'all games') {
        return true;
      }
      const count = (gameCounts && gameCounts[cat.id] !== undefined)
        ? gameCounts[cat.id]
        : getGameCountForCategory(cat, games);
      return count > 0;
    });
  }, [categories, gameCounts, games]);

  return (
    <div className="category-bar-wrapper">
      <button 
        className="cat-scroll-arrow left-arrow" 
        onClick={() => handleScroll('left')}
        aria-label="Scroll categories left"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="category-scroll-container" ref={scrollRef}>
        {visibleCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = (gameCounts && gameCounts[cat.id] !== undefined)
            ? gameCounts[cat.id]
            : getGameCountForCategory(cat, games);

          const rawColor = cat.color || '#2563eb';
          const catColor = getDimmedCategoryColor(rawColor);

          return (
            <button
              key={cat.id}
              className={`category-pill-btn ${isActive ? 'active' : ''}`}
              style={{
                '--pill-color': catColor,
                ...(isActive ? {
                  background: catColor,
                  borderColor: catColor,
                  boxShadow: `0 3px 12px ${catColor}35`,
                  color: '#ffffff'
                } : {
                  borderColor: `${catColor}25`
                })
              }}
              onClick={() => {
                sounds.playClick();
                onSelectCategory(cat.id);
              }}
            >
              <span className="pill-icon-box" style={{ color: isActive ? '#ffffff' : catColor }}>
                {renderCategorySvgIcon(cat, 16)}
              </span>
              <span className="pill-title">{cat.name}</span>
              {count > 0 && <span className="pill-count">{count}</span>}
            </button>
          );
        })}
      </div>

      <button 
        className="cat-scroll-arrow right-arrow" 
        onClick={() => handleScroll('right')}
        aria-label="Scroll categories right"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
