import React, { useState } from 'react';
import {
  Gamepad2,
  Users,
  Globe2,
  ShieldCheck,
  Zap,
  Sparkles,
  Trophy,
  Heart,
  Flame,
  CheckCircle2,
  Layers,
  Cpu,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Code2,
  Smartphone,
  Monitor
} from 'lucide-react';
import { STATS } from '../data/games';
import { sounds } from '../utils/audio';

const FAQ_ITEMS = [
  {
    q: "Is ThopGames completely free to play?",
    a: "Yes. All games on ThopGames are entirely free to play directly in your web browser. There are no paywalls, no subscription fees, and no hidden in-app purchases required to access any title in our catalog."
  },
  {
    q: "Do I need to download or install anything?",
    a: "No downloads or installations are required. Every title runs instantly using modern HTML5, WebGL, and WebAssembly technologies within standard web browsers including Chrome, Edge, Safari, and Firefox."
  },
  {
    q: "Can independent developers submit their games?",
    a: "Yes. We actively support independent creators. You may submit your HTML5 or WebGL game via our Developer Portal. Our editorial team reviews and approves quality submissions for inclusion in our global game library."
  },
  {
    q: "How are high scores and game progress saved?",
    a: "Your game progress, high scores, favorites, and personal preferences are stored securely in your browser's LocalStorage. This data persists across sessions on the same device and browser."
  }
];

export default function AboutPage({ onBackToHome }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    sounds.playClick();
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="custom-static-page-container">
      {/* Hero Showcase Card */}
      <div className="static-hero-card">
        <div className="static-hero-glow"></div>
        <div className="static-hero-content">
          <div className="static-badge">
            <Sparkles size={15} className="text-cyan" />
            <span>ABOUT PLATFORM</span>
          </div>

          <div className="static-hero-icon-box">
            <Gamepad2 size={38} className="text-cyan" />
          </div>
          <h1>Premium <span className="neon-text-gradient">Browser Gaming</span></h1>
          <p className="static-hero-lead">
            <strong>ThopGames</strong> is a high-performance, curated browser gaming platform delivering hundreds of handpicked HTML5 and WebGL titles — playable instantly at 60 FPS with no downloads, no installations, and no fees.
          </p>

          <div className="hero-chips-row">
            <span className="hero-chip"><Zap size={14} className="text-amber" style={{ marginRight: '4px' }} /> Zero Installation Time</span>
            <span className="hero-chip"><ShieldCheck size={14} className="text-emerald" style={{ marginRight: '4px' }} /> Sandbox Secured</span>
            <span className="hero-chip"><Globe2 size={14} className="text-blue" style={{ marginRight: '4px' }} /> Global CDN Delivery</span>
            <span className="hero-chip"><Smartphone size={14} className="text-purple" style={{ marginRight: '4px' }} /> All Devices Supported</span>
          </div>
        </div>
      </div>

      {/* Live Platform Stats Grid */}
      <div className="page-stats-grid">
        <div className="stat-glow-card">
          <div className="stat-icon-wrapper cyan-glow">
            <Users size={24} className="text-cyan" />
          </div>
          <h3>{STATS.activePlayers}</h3>
          <p>Daily Active Gamers</p>
        </div>
        <div className="stat-glow-card">
          <div className="stat-icon-wrapper purple-glow">
            <Gamepad2 size={24} className="text-purple" />
          </div>
          <h3>{STATS.totalGames}</h3>
          <p>Hand-Curated Games</p>
        </div>
        <div className="stat-glow-card">
          <div className="stat-icon-wrapper emerald-glow">
            <Globe2 size={24} className="text-emerald" />
          </div>
          <h3>{STATS.countries}</h3>
          <p>Countries Connected</p>
        </div>
        <div className="stat-glow-card">
          <div className="stat-icon-wrapper gold-glow">
            <Trophy size={24} className="text-gold" />
          </div>
          <h3>{STATS.satisfaction}</h3>
          <p>Player Rating Score</p>
        </div>
      </div>

      {/* Core Platform Pillars */}
      <div className="static-section-heading">
        <h2>Why Professionals Choose <span className="text-cyan">ThopGames</span></h2>
        <p>Built from the ground up to deliver seamless, high-fidelity browser gaming at scale.</p>
      </div>

      <div className="static-content-grid">
        <div className="static-feature-card">
          <div className="feature-icon-row">
            <div className="feature-icon-circle bg-cyan-glass">
              <Zap size={22} className="text-cyan" />
            </div>
            <div>
              <h3>Ultra-Fast Instant Play</h3>
              <span className="feature-subtitle">Sub-second load times</span>
            </div>
          </div>
          <p>
            Powered by globally distributed edge networks and optimized WebAssembly delivery pipelines. Select any title and begin playing within seconds — without consuming local device storage or bandwidth.
          </p>
        </div>

        <div className="static-feature-card">
          <div className="feature-icon-row">
            <div className="feature-icon-circle bg-purple-glass">
              <Cpu size={22} className="text-purple" />
            </div>
            <div>
              <h3>Fluid 60 FPS WebGL Engine</h3>
              <span className="feature-subtitle">High-fidelity 3D graphics</span>
            </div>
          </div>
          <p>
            Hardware-accelerated GPU rendering delivers consistent high framerates, precision particle effects, dynamic lighting environments, and immersive spatial audio on any compatible device.
          </p>
        </div>

        <div className="static-feature-card">
          <div className="feature-icon-row">
            <div className="feature-icon-circle bg-emerald-glass">
              <ShieldCheck size={22} className="text-emerald" />
            </div>
            <div>
              <h3>Sandbox Isolation & Safety</h3>
              <span className="feature-subtitle">Family-safe verified titles</span>
            </div>
          </div>
          <p>
            Every title undergoes rigorous security and content auditing prior to publication. Sandbox isolation enforces strict permissions, ensuring safe and age-appropriate gameplay across all platforms.
          </p>
        </div>

        <div className="static-feature-card">
          <div className="feature-icon-row">
            <div className="feature-icon-circle bg-crimson-glass">
              <Heart size={22} className="text-crimson" />
            </div>
            <div>
              <h3>Indie Creator Launchpad</h3>
              <span className="feature-subtitle">Empowering worldwide game devs</span>
            </div>
          </div>
          <p>
            We support independent studios and solo developers with a streamlined submission process, real-time performance analytics, and direct access to a global audience of engaged players.
          </p>
        </div>
      </div>

      {/* Interactive FAQ Section */}
      <div className="static-section-heading" style={{ marginTop: '10px' }}>
        <h2>Frequently Asked <span className="text-purple">Questions</span></h2>
        <p>Common queries about accessing, playing, and publishing games on ThopGames.</p>
      </div>

      <div className="static-faq-container">
        {FAQ_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className={`faq-accordion-card ${openFaq === idx ? 'expanded' : ''}`}
            onClick={() => toggleFaq(idx)}
          >
            <div className="faq-question-row">
              <div className="faq-q-left">
                <HelpCircle size={20} className="text-cyan" />
                <h3>{item.q}</h3>
              </div>
              <div className="faq-toggle-icon">
                {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>
            {openFaq === idx && (
              <div className="faq-answer-row">
                <p>{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tech Stack Banner */}
      <div className="static-tech-banner">
        <div className="tech-badge-title">
          <Code2 size={18} className="text-cyan" />
          <span>SUPPORTED GAME ENGINES & TECH</span>
        </div>
        <div className="tech-chips-group">
          <span className="tech-chip">WebGL 2.0</span>
          <span className="tech-chip">HTML5 Canvas</span>
          <span className="tech-chip">Unity WebGL</span>
          <span className="tech-chip">Godot Engine</span>
          <span className="tech-chip">Phaser JS</span>
          <span className="tech-chip">WebAudio API</span>
          <span className="tech-chip">Gamepad API</span>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="static-bottom-cta">
        <div className="cta-text">
          <h3>Ready to Start Playing?</h3>
          <p>Explore our full library of 500+ curated arcade, multiplayer, racing, and puzzle titles.</p>
        </div>
        <button
          className="static-cta-btn"
          onClick={() => {
            sounds.playPowerup();
            onBackToHome();
          }}
        >
          <Flame size={18} />
          <span>Explore All Games</span>
        </button>
      </div>
    </div>
  );
}
