import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowDown,
  Phone,
  WhatsappLogo,
  Star,
  Quotes,
  CaretLeft,
  CaretRight,
  CheckCircle,
  ShieldCheck,
  Wrench,
  Car,
  Clock,
  Eye,
  Target,
  Trophy,
} from '@phosphor-icons/react';
import PageTransition from '../components/PageTransition';
import siteData from '../data/siteData';


/* ================================================================
   UTILITY -- Icon map
   ================================================================ */
const iconMap = { Wrench, Car, ShieldCheck, Eye, Target, Trophy, Star };


/* ================================================================
   ANIMATED COUNTER
   ================================================================ */
function AnimatedCounter({ target, suffix = '', duration = 2.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const numericTarget = parseInt(String(target).replace(/[^0-9]/g, ''), 10) || 0;

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = numericTarget / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) { setCount(numericTarget); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, numericTarget, duration]);

  return <span ref={ref}>{inView ? count.toLocaleString() : '0'}{suffix}</span>;
}


/* ================================================================
   NOISE TEXTURE
   ================================================================ */
function NoiseTexture({ opacity = 0.035 }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }}
    />
  );
}


/* ================================================================
   SPARK PARTICLES -- orange floating sparks
   ================================================================ */
function SparkParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            background: `radial-gradient(circle, rgba(249,115,22,${Math.random() * 0.7 + 0.2}) 0%, transparent 70%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `sparkle-float ${Math.random() * 6 + 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
}


/* ================================================================
   1. HERO -- Full Viewport, Dark Industrial, Orange Sparks
   ================================================================ */
function HeroSection() {
  const { business, hero } = siteData;
  const containerRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = hero?.backgroundImages?.map(img => img.url) || [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80',
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1400&q=80',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0571?w=1400&q=80',
  ];
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % heroImages.length), 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <section ref={containerRef} className="relative h-screen min-h-[700px] overflow-hidden bg-slate-950">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <AnimatePresence mode="sync">
          <motion.img
            key={currentSlide}
            src={heroImages[currentSlide]}
            alt="Zimraise Golden Panel Beaters workshop"
            className="absolute inset-0 w-full h-[130%] object-cover object-center"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            loading="eager"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/85 via-neutral-950/50 to-neutral-950/95 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/40 z-[1]" />
      </motion.div>

      <SparkParticles />
      <NoiseTexture opacity={0.04} />

      {/* Slide indicators */}
      <div className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
        {heroImages.map((_, i) => (
          <button key={i} onClick={() => setCurrentSlide(i)} className={`w-[3px] transition-all duration-700 ${i === currentSlide ? 'h-10 bg-slate-400' : 'h-4 bg-white/20 hover:bg-white/40'}`} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>

      {/* Vertical orange accent */}
      <div className="absolute top-[15%] left-0 w-[2px] h-32 sm:h-48 bg-gradient-to-b from-transparent via-slate-400 to-transparent z-20" />

      {/* Content */}
      <motion.div className="relative z-20 flex flex-col justify-center h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-36" style={{ y: textY, opacity }}>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.3 }} className="w-16 h-[2px] bg-gradient-to-r from-orange-500 to-orange-400/50 mb-6 origin-left" />

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="text-slate-300 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
          {hero?.badge || 'Golden Standard'}
        </motion.p>

        <div className="overflow-hidden">
          {['GOLDEN', 'STANDARD', 'REPAIR.'].map((line, i) => (
            <motion.div key={line} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}>
              <h1
                className={`font-heading leading-[0.88] tracking-tight ${line === 'STANDARD' ? 'bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent' : 'text-white'}`}
                style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)', fontWeight: line === 'STANDARD' ? 900 : 300 }}
              >
                {line}
              </h1>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.2 }} className="flex items-center gap-3 mt-8">
          <div className="w-8 h-[1px] bg-slate-400/40" />
          <p className="text-white/30 text-xs sm:text-sm uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-sans)' }}>
            1 Reviews &middot; 4.6 Stars &middot; Kuwadzana, Harare
          </p>
        </motion.div>

        {/* Warranty badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.3 }} className="flex items-center gap-3 mt-6">
          <div className="flex items-center gap-2 bg-slate-400/10 border border-slate-400/30 px-4 py-2">
            <ShieldCheck size={18} weight="fill" className="text-slate-400" />
            <span className="text-slate-300 text-xs uppercase tracking-[0.15em] font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>12-Month Warranty on All Work</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.5 }} className="flex flex-wrap gap-4 mt-8">
          <Link to="/contact" className="group relative inline-flex items-center gap-3 bg-slate-400 text-slate-950 px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold transition-all duration-500 hover:bg-slate-300 hover:shadow-xl hover:shadow-slate-400/20" style={{ fontFamily: 'var(--font-sans)' }}>
            {hero?.ctaPrimary || 'Get Free Quote'}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/projects" className="group inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold transition-all duration-500 hover:border-slate-400/50 hover:text-slate-300 hover:bg-white/5" style={{ fontFamily: 'var(--font-sans)' }}>
            {hero?.ctaSecondary || 'View Our Work'}
          </Link>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-white/20 text-[10px] uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-sans)' }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
          <ArrowDown size={14} className="text-slate-400/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}


/* ================================================================
   2. MARQUEE TICKER
   ================================================================ */
function MarqueeTicker() {
  const items = ['PANEL BEATING', 'SPRAY PAINTING', 'DENT REMOVAL', 'FRAME STRAIGHTENING', 'INSURANCE CLAIMS', 'COLOUR MATCHING'];
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <section className="bg-slate-950 border-y border-slate-400/10 py-5 sm:py-6 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-6 sm:gap-8 mx-6 sm:mx-8">
            <span className="text-slate-400/80 font-heading text-lg sm:text-2xl tracking-wider font-bold uppercase">{item}</span>
            <span className="text-slate-400/20 text-sm">&diams;</span>
          </span>
        ))}
      </div>
    </section>
  );
}


/* ================================================================
   3. BEFORE / AFTER SHOWCASE
   ================================================================ */
function BeforeAfterShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const cases = [
    { before: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80', after: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80', label: 'Full Body Restoration' },
    { before: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&q=80', after: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0571?w=600&q=80', label: 'Collision Repair' },
    { before: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&q=80', after: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80', label: 'Frame & Paint' },
  ];

  return (
    <section ref={ref} className="bg-slate-900 py-24 sm:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="mb-14 sm:mb-20">
          <div className="w-12 h-[2px] bg-slate-400 mb-6" />
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-slate-400/60 text-xs uppercase tracking-[0.3em] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>Transformations</p>
              <h2 className="font-heading text-white leading-[0.92] font-bold uppercase" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
                Before <span className="text-slate-400">&</span> After
              </h2>
            </div>
            <Link to="/projects" className="group text-white/30 text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:text-slate-400 transition-colors" style={{ fontFamily: 'var(--font-sans)' }}>
              All Projects <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 * i }} className="group">
              <div className="relative overflow-hidden">
                <div className="grid grid-cols-2 gap-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={item.before} alt={`Before - ${item.label}`} className="w-full h-full object-cover object-center" loading="lazy" />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] uppercase tracking-widest px-2 py-1 font-bold">Before</div>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={item.after} alt={`After - ${item.label}`} className="w-full h-full object-cover object-center" loading="lazy" />
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-[9px] uppercase tracking-widest px-2 py-1 font-bold">After</div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-orange-400" />
              </div>
              <div className="bg-slate-950 p-5">
                <h3 className="font-heading text-white text-base font-bold uppercase tracking-wide">{item.label}</h3>
                <p className="text-white/40 text-sm mt-1" style={{ fontFamily: 'var(--font-sans)' }}>Factory-grade finish restored</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================
   4. SERVICES GRID
   ================================================================ */
function ServicesGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { servicesPreview, services } = siteData;

  const serviceImages = [
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0571?w=800&q=80',
    'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
  ];

  return (
    <section ref={ref} className="bg-slate-950 py-24 sm:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="mb-14 sm:mb-20">
          <div className="w-12 h-[2px] bg-slate-400 mb-6" />
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-slate-400/60 text-xs uppercase tracking-[0.3em] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>Our Expertise</p>
              <h2 className="font-heading text-white leading-[0.92] font-bold uppercase" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
                What We <span className="text-slate-400">Repair</span>
              </h2>
            </div>
            <Link to="/services" className="group text-white/30 text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:text-slate-400 transition-colors" style={{ fontFamily: 'var(--font-sans)' }}>
              All Services <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {servicesPreview?.slice(0, 6).map((service, i) => {
            const IconComp = iconMap[service.icon] || Wrench;
            return (
              <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.08 * i }} className={i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}>
                <Link to={`/services#${services?.items?.[i]?.slug || ''}`} className={`group relative block overflow-hidden ${i === 0 ? 'aspect-[16/9] sm:aspect-[2/1]' : 'aspect-[3/4]'}`}>
                  <img src={serviceImages[i]} alt={service.title} className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20 opacity-90" />
                  <div className="absolute top-4 right-5 z-10">
                    <span className="text-slate-400/15 font-heading text-6xl sm:text-7xl font-bold leading-none">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="absolute top-5 left-5 z-10 w-10 h-10 bg-green-600 flex items-center justify-center">
                    <IconComp size={18} weight="fill" className="text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
                    <h3 className="font-heading text-white text-xl sm:text-2xl font-bold uppercase tracking-wide mb-2">{service.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>{service.desc}</p>
                    <div className="flex items-center gap-2 mt-3 text-slate-400 group-hover:translate-x-1 transition-transform duration-300">
                      <span className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-sans)' }}>Details</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-orange-400 z-10" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ================================================================
   5. STATS BAND
   ================================================================ */
function StatsBand() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const { stats } = siteData;

  return (
    <section ref={ref} className="relative bg-slate-950 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-slate-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-slate-400/5 rounded-full blur-3xl" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-400/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-400/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16">
          {stats?.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: i * 0.12 }} className="text-center relative">
              <div className="font-heading text-slate-400 leading-none font-bold" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', textShadow: '0 0 40px rgba(249,115,22,0.15)' }}>
                <AnimatedCounter target={String(stat.number).replace(/[^0-9]/g, '')} suffix={String(stat.number).replace(/[0-9]/g, '')} duration={2.5} />
              </div>
              <div className="text-white/30 text-xs sm:text-sm uppercase tracking-[0.25em] mt-3" style={{ fontFamily: 'var(--font-sans)' }}>{stat.label}</div>
              {i < (stats?.length || 0) - 1 && <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-[1px] bg-gradient-to-b from-transparent via-slate-400/15 to-transparent" />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================
   6. ABOUT SECTION
   ================================================================ */
function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-slate-950 py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9 }}>
            <div className="w-12 h-[2px] bg-slate-400 mb-6" />
            <p className="text-slate-400/60 text-xs uppercase tracking-[0.3em] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>Our Legacy</p>
            <h2 className="font-heading text-white leading-[0.95] font-bold uppercase mb-8" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Zimraise <span className="text-slate-400">Panel Beaters</span>
            </h2>
            <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-6 max-w-lg" style={{ fontFamily: 'var(--font-sans)' }}>
              Founded on a commitment to factory-grade vehicle restoration, Zimraise Golden Panel Beaters has earned the trust of Harare's motorists through relentless attention to detail and uncompromising quality standards.
            </p>
            <p className="text-white/35 text-sm leading-relaxed max-w-lg" style={{ fontFamily: 'var(--font-sans)' }}>
              From minor dent removal to full collision repair, every vehicle that leaves our Kelvin Road workshop is restored to manufacturer specifications. Our skilled technicians combine traditional craftsmanship with modern equipment.
            </p>
            <div className="w-full h-px bg-white/5 my-8" />
            <div className="flex gap-10 sm:gap-16">
              <div>
                <div className="text-slate-400 font-heading text-3xl sm:text-4xl font-bold leading-none">5.0</div>
                <div className="text-white/30 text-[10px] uppercase tracking-[0.2em] mt-2" style={{ fontFamily: 'var(--font-sans)' }}>Star Rating</div>
              </div>
              <div>
                <div className="text-slate-400 font-heading text-3xl sm:text-4xl font-bold leading-none">1</div>
                <div className="text-white/30 text-[10px] uppercase tracking-[0.2em] mt-2" style={{ fontFamily: 'var(--font-sans)' }}>Reviews</div>
              </div>
              <div>
                <div className="text-slate-400 font-heading text-3xl sm:text-4xl font-bold leading-none">12mo</div>
                <div className="text-white/30 text-[10px] uppercase tracking-[0.2em] mt-2" style={{ fontFamily: 'var(--font-sans)' }}>Warranty</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.2 }} className="relative">
            <div className="relative">
              <div className="overflow-hidden"><img src="https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80" alt="Workshop" className="w-full aspect-[4/5] object-cover object-center" loading="lazy" /></div>
              <div className="absolute -bottom-8 -left-6 sm:-left-10 w-[45%] overflow-hidden border-4 border-neutral-950 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80" alt="Quality repair" className="w-full aspect-square object-cover object-center" loading="lazy" />
              </div>
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-slate-400 text-slate-950 p-5 sm:p-7 shadow-2xl">
                <div className="text-center">
                  <ShieldCheck size={28} weight="fill" className="mx-auto mb-1" />
                  <div className="font-heading text-xs uppercase tracking-[0.15em] font-bold">Warranty</div>
                </div>
              </div>
              <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-slate-400/30" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================
   7. WHY CHOOSE US
   ================================================================ */
function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const points = [
    { title: 'Factory-Grade Finish', desc: 'Every repair meets manufacturer specifications using precision colour-matching technology.' },
    { title: '12-Month Warranty', desc: 'Full warranty on all panel beating, spray painting, and structural repair work.' },
    { title: 'Insurance Approved', desc: 'Direct billing with all major insurance companies for hassle-free claims processing.' },
    { title: 'Quick Turnaround', desc: 'Most repairs completed within 3-5 working days without compromising quality.' },
  ];

  return (
    <section ref={ref} className="bg-slate-900 py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9 }} className="relative">
            <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0571?w=800&q=80" alt="Equipment" className="w-full aspect-[4/5] object-cover object-center" loading="lazy" />
            <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-slate-400/40" />
            <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-slate-400/40" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.15 }}>
            <div className="w-12 h-[2px] bg-slate-400 mb-6" />
            <p className="text-slate-400/60 text-xs uppercase tracking-[0.3em] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>The Difference</p>
            <h2 className="font-heading text-white leading-[0.95] font-bold uppercase mb-12" style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
              Why Choose <span className="text-slate-400">Zimraise</span>
            </h2>
            <div className="space-y-8">
              {points.map((point, i) => (
                <motion.div key={point.title} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }} className="flex gap-5">
                  <div className="shrink-0 mt-1"><div className="w-8 h-8 bg-green-600 flex items-center justify-center"><CheckCircle size={16} weight="fill" className="text-white" /></div></div>
                  <div>
                    <h4 className="font-heading text-white text-base sm:text-lg font-bold uppercase tracking-wide mb-1">{point.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>{point.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================
   8. TESTIMONIALS
   ================================================================ */
function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const { homeTestimonials } = siteData;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const testimonials = homeTestimonials || [];

  const next = useCallback(() => setActive(p => (p + 1) % testimonials.length), [testimonials.length]);
  const prev = useCallback(() => setActive(p => (p - 1 + testimonials.length) % testimonials.length), [testimonials.length]);

  useEffect(() => { const timer = setInterval(next, 7000); return () => clearInterval(timer); }, [next]);

  if (!testimonials.length) return null;
  const t = testimonials[active];

  return (
    <section ref={ref} className="relative bg-slate-950 py-24 sm:py-32 lg:py-40 overflow-hidden">
      <NoiseTexture opacity={0.02} />
      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center">
          <Quotes size={48} weight="fill" className="text-slate-400/15 mx-auto mb-8" />
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
              <blockquote className="text-white text-lg sm:text-xl lg:text-2xl leading-relaxed font-heading mb-10">&ldquo;{t.text}&rdquo;</blockquote>
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-[2px] bg-slate-400" />
                <div className="text-white text-sm uppercase tracking-[0.15em] font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>{t.name}</div>
                <div className="text-white/40 text-xs uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-sans)' }}>{t.role}</div>
                <div className="flex items-center gap-0.5 mt-1">{[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={12} weight="fill" className="text-slate-400" />)}</div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-center gap-6 mt-12">
            <button onClick={prev} className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/30 hover:text-slate-400 hover:border-slate-400/30 transition-colors" aria-label="Previous"><CaretLeft size={16} /></button>
            <div className="flex gap-2">{testimonials.map((_, i) => <button key={i} onClick={() => setActive(i)} className={`h-[2px] transition-all duration-500 ${i === active ? 'w-10 bg-slate-400' : 'w-3 bg-white/10'}`} aria-label={`Testimonial ${i + 1}`} />)}</div>
            <button onClick={next} className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/30 hover:text-slate-400 hover:border-slate-400/30 transition-colors" aria-label="Next"><CaretRight size={16} /></button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


/* ================================================================
   9. CTA SECTION
   ================================================================ */
function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80" alt="CTA background" className="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" />
      <div className="absolute inset-0 bg-slate-950/70" />
      <NoiseTexture opacity={0.03} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <div className="w-12 h-[2px] bg-slate-400 mx-auto mb-6" />
        <h2 className="font-heading text-white leading-[0.92] font-bold uppercase mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
          Your Vehicle Deserves <span className="text-slate-400">Precision</span>
        </h2>
        <p className="text-white/50 text-sm sm:text-base max-w-xl mx-auto mb-10" style={{ fontFamily: 'var(--font-sans)' }}>
          From minor scratches to major collision damage, get a free assessment and quote today. Insurance claims processed directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="group inline-flex items-center justify-center gap-3 bg-slate-400 text-slate-950 px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold hover:bg-slate-300 transition-all duration-500" style={{ fontFamily: 'var(--font-sans)' }}>
            Get Free Quote <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="https://wa.me/263776632373" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center gap-3 border border-green-500/40 text-green-400 px-8 py-4 text-sm uppercase tracking-[0.15em] font-semibold hover:bg-green-500/10 transition-all duration-500" style={{ fontFamily: 'var(--font-sans)' }}>
            <WhatsappLogo size={18} weight="fill" /> WhatsApp Us
          </a>
        </div>
      </motion.div>
    </section>
  );
}


/* ================================================================
   MAIN HOME
   ================================================================ */
export default function Home() {
  return (
    <PageTransition>
      <HeroSection />
      <MarqueeTicker />
      <BeforeAfterShowcase />
      <ServicesGrid />
      <StatsBand />
      <AboutSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <CTASection />
    </PageTransition>
  );
}
