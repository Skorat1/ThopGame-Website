import React from 'react';
import {
  Gamepad2,
  Swords,
  Compass,
  Joystick,
  Ghost,
  Activity,
  Flame,
  Sparkles,
  Puzzle,
  Car,
  Crosshair,
  Target,
  Trophy,
  Users,
  Zap,
  Cpu,
  Layers,
  Crown,
  Heart,
  Music,
  Palette,
  Rocket,
  HelpCircle
} from 'lucide-react';

/**
 * Direct mapping of cartoon emojis to crisp vector SVG Lucide components
 */
export const EMOJI_TO_SVG = {
  '🎮': Gamepad2,
  '🕹️': Joystick,
  '🕹': Joystick,
  '⚔️': Swords,
  '⚔': Swords,
  '🗡️': Swords,
  '🎴': Compass,
  '🏎️': Car,
  '🏎': Car,
  '🚗': Car,
  '🚙': Car,
  '🧩': Puzzle,
  '👾': Ghost,
  '⚽': Trophy,
  '🏀': Trophy,
  '🏆': Trophy,
  '⚡': Zap,
  '✨': Sparkles,
  '🔥': Flame,
  '🎯': Target,
  '🚀': Rocket,
  '🔮': Sparkles,
  '🃏': Layers,
  '👑': Crown,
  '🎨': Palette,
  '🎵': Music,
  '❤️': Heart,
  '👥': Users
};

/**
 * Mapping of category ID or category Name to crisp vector SVG Lucide components
 */
export const CATEGORY_ID_TO_SVG = {
  all: Gamepad2,
  'all games': Gamepad2,
  gamepad: Gamepad2,
  action: Swords,
  swords: Swords,
  adventure: Compass,
  magic: Sparkles,
  racing: Car,
  car: Car,
  cars: Car,
  driving: Car,
  multiplayer: Users,
  '2-player': Users,
  '2player': Users,
  two: Users,
  user: Users,
  users: Users,
  shooting: Crosshair,
  shooter: Crosshair,
  target: Target,
  fps: Crosshair,
  puzzle: Puzzle,
  sports: Trophy,
  sport: Trophy,
  arcade: Joystick,
  joystick: Joystick,
  classic: Ghost,
  ghost: Ghost,
  idel: Activity,
  idle: Activity,
  casual: Zap,
  zap: Zap,
  trending: Flame,
  flame: Flame,
  cyber: Cpu,
  cyberpunk: Cpu,
  cards: Layers,
  strategy: Crown,
  crown: Crown,
  girls: Heart,
  heart: Heart,
  music: Music,
  retro: Joystick,
  space: Rocket,
  rocket: Rocket
};

/**
 * Render a clean Lucide SVG icon for a category — NEVER an emoji
 */
export function renderCategorySvgIcon(cat, size = 18) {
  if (!cat) return <Gamepad2 size={size} />;

  // 1. If cat.icon is already a React Component
  if (typeof cat.icon === 'function') {
    const IconComp = cat.icon;
    return <IconComp size={size} />;
  }

  // 2. Direct emoji string mapping
  if (typeof cat.icon === 'string' && cat.icon.trim().length > 0) {
    const trimmed = cat.icon.trim();
    if (EMOJI_TO_SVG[trimmed]) {
      const SvgComp = EMOJI_TO_SVG[trimmed];
      return <SvgComp size={size} />;
    }
  }

  // 3. Category icon string lookup (e.g. 'swords', 'gamepad', 'target')
  const iconStr = (typeof cat.icon === 'string' ? cat.icon.trim().toLowerCase() : '');
  if (iconStr && CATEGORY_ID_TO_SVG[iconStr]) {
    const SvgComp = CATEGORY_ID_TO_SVG[iconStr];
    return <SvgComp size={size} />;
  }

  // 4. Category ID or Name lookup
  const normId = (cat.id || cat._id || '').toLowerCase().trim();
  const normName = (cat.name || '').toLowerCase().trim();

  if (normId && CATEGORY_ID_TO_SVG[normId]) {
    const SvgComp = CATEGORY_ID_TO_SVG[normId];
    return <SvgComp size={size} />;
  }

  if (normName && CATEGORY_ID_TO_SVG[normName]) {
    const SvgComp = CATEGORY_ID_TO_SVG[normName];
    return <SvgComp size={size} />;
  }

  // 5. Fuzzy / partial match
  for (const [key, SvgComp] of Object.entries(CATEGORY_ID_TO_SVG)) {
    if (key.length > 2 && ((normId && normId.includes(key)) || (normName && normName.includes(key)))) {
      return <SvgComp size={size} />;
    }
  }

  // 6. Default fallback vector icon
  return <Gamepad2 size={size} />;
}

/**
 * Counts how many active games belong to a given category
 */
export function getGameCountForCategory(cat, games = []) {
  if (!cat || !Array.isArray(games) || games.length === 0) return 0;
  const catId = (cat.id || cat._id || '').toLowerCase().trim();
  const catName = (cat.name || '').toLowerCase().trim();

  if (catId === 'all' || catId === '' || catName === 'all games') {
    return games.filter(g => g && (!g.status || g.status === 'active')).length;
  }

  const is2p = catId === 'multiplayer' || catId === '2-player' || catId === '2player';

  return games.filter(g => {
    if (!g || (g.status && g.status !== 'active')) return false;
    const gCat = (g.category || '').toLowerCase().trim();
    const gTags = Array.isArray(g.tags)
      ? g.tags.map(t => (typeof t === 'string' ? t.toLowerCase().trim() : ''))
      : (typeof g.tags === 'string' ? g.tags.toLowerCase().split(',').map(t => t.trim()) : []);

    if (is2p) {
      if (
        gCat.includes('2') ||
        gCat.includes('multiplayer') ||
        gCat.includes('two') ||
        gTags.some(t => t.includes('2') || t.includes('multiplayer') || t.includes('two'))
      ) {
        return true;
      }
    }

    const matchesCat = (
      (catId && gCat === catId) ||
      (catName && gCat === catName) ||
      (catId && gCat.includes(catId)) ||
      (catName && gCat.includes(catName)) ||
      (catId.length > 3 && catId.includes(gCat))
    );

    const matchesTag = gTags.some(t => 
      (catId && t === catId) || 
      (catName && t === catName) || 
      (catId && t.includes(catId)) ||
      (catId.length > 3 && catId.includes(t))
    );

    return matchesCat || matchesTag;
  }).length;
}

/**
 * Filters a category list to only include:
 * 1. 'All Games' (id === 'all' or '')
 * 2. Categories controlled by Admin that have games in the catalog
 * Does NOT wipe out categories if the games catalog is still loading or empty.
 */
export function filterCategoriesWithGames(categories = [], games = []) {
  if (!Array.isArray(categories)) return [];

  // Find or create 'All Games' item
  const existingAll = categories.find(c => {
    const id = (c.id || c._id || '').toLowerCase().trim();
    const name = (c.name || '').toLowerCase().trim();
    return id === 'all' || id === '' || name === 'all games';
  });
  const allItem = existingAll || { id: 'all', name: 'All Games', icon: 'gamepad', color: '#2563eb' };

  // Remaining categories excluding All Games
  const nonAll = categories.filter(c => {
    const id = (c.id || c._id || '').toLowerCase().trim();
    const name = (c.name || '').toLowerCase().trim();
    return id !== 'all' && id !== '' && name !== 'all games';
  });

  // If games have not loaded yet (empty array), do not wipe out all categories!
  if (!Array.isArray(games) || games.length === 0) {
    return [allItem, ...nonAll];
  }

  // Filter categories that have active games
  const withGames = nonAll.filter(cat => getGameCountForCategory(cat, games) > 0);

  // If some categories have games, display those; if none match, preserve categories so UI never collapses
  const rest = withGames.length > 0 ? withGames : nonAll;

  return [allItem, ...rest];
}

/**
 * Dims and softens category colors so they look sophisticated, elegant, and easy on the eyes
 */
export function getDimmedCategoryColor(hex = '#3b82f6') {
  if (!hex || typeof hex !== 'string') return '#2563eb';
  let c = hex.trim();
  if (c.startsWith('#') && c.length === 4) {
    c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
  }
  if (/^#[0-9a-fA-F]{6}$/.test(c)) {
    let r = parseInt(c.slice(1, 3), 16);
    let g = parseInt(c.slice(3, 5), 16);
    let b = parseInt(c.slice(5, 7), 16);

    // Calculate perceived brightness / luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    // Dim high-luminance / ultra-bright neon colors by 22%, medium by 14%
    const factor = lum > 160 ? 0.78 : lum > 110 ? 0.86 : 0.92;

    r = Math.min(255, Math.max(0, Math.round(r * factor)));
    g = Math.min(255, Math.max(0, Math.round(g * factor)));
    b = Math.min(255, Math.max(0, Math.round(b * factor)));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  return c;
}

