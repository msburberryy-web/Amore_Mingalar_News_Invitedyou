import React, { useState, useEffect, useRef } from 'react';
import { WeddingData, INITIAL_DATA, Language } from './types';
import { Volume2, VolumeX, Settings, Heart, ChevronDown, Loader2, MapPin, Map as MapIcon, ExternalLink, Image as ImageIcon, Calendar, User, Utensils, Camera, HelpCircle } from 'lucide-react';
import EnvelopeOverlay, { KanoteOrnament } from './components/EnvelopeOverlay';
import WeddingCardTemplate from './components/WeddingCardTemplate';
import LanguageSwitch from './components/LanguageSwitch';
import AdminPanel from './components/AdminPanel';
import ProfileSection from './components/ProfileSection';
import RsvpForm from './components/RsvpForm';
import Countdown from './components/Countdown';

const deepMerge = (target: any, source: any) => {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};

const GoldHeart = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-wedding-gold`} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ElegantName: React.FC<{ name: string; lang: Language }> = ({ name, lang }) => {
  if (lang !== 'en') return <span className="break-words px-2 tracking-normal text-center max-w-full font-bold block" style={{ letterSpacing: '0' }}>{name}</span>;
  
  const firstChar = name.charAt(0);
  const rest = name.slice(1);
  
  return (
    <span className="inline-flex items-center justify-center flex-nowrap shrink-0 max-w-full overflow-visible">
      <span className="font-['Great_Vibes'] text-5xl xs:text-6xl md:text-8xl gold-text-shimmer leading-none py-4 px-2 inline-block transform-gpu overflow-visible">
        {firstChar}
      </span>
      <span className="text-gray-900 text-sm xs:text-base md:text-3xl tracking-tight font-serif italic -ml-3 md:-ml-6 mt-4 md:mt-10 whitespace-nowrap">
        {rest}
      </span>
    </span>
  );
};

const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.1 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div 
          ref={ref} 
          className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0 scroll-reveal-active' : 'opacity-0 translate-y-20'} ${className}`}
        >
            {children}
        </div>
    );
};

const UniversalDateDisplay: React.FC<{ dateStr: string; day: string; lang: Language }> = ({ dateStr, day, lang }) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const monthNames = {
    en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    ja: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    my: ['ဇန်နဝါရီ', 'ဖေဖော်ဝါရီ', 'မတ်', 'ဧပြီ', 'မေ', 'ဇွန်', 'ဇူလိုင်', 'သြဂုတ်', 'စက်တင်ဘာ', 'အောက်တိုဘာ', 'နိုဝင်ဘာ', 'ဒီဇင်ဘာ']
  };
  const month = monthNames[lang][date.getMonth()];
  const dayNum = date.getDate();

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 font-serif">
      <div className="text-right">
        <div className={`text-lg md:text-2xl text-wedding-gold border-b border-wedding-gold/30 pb-1 ${lang === 'my' ? 'font-myanmar' : 'font-bold'}`}>{day}</div>
        <div className="text-xs md:text-sm text-gray-400 mt-1 uppercase tracking-widest">{year}</div>
      </div>
      <div className="text-5xl md:text-8xl font-light text-wedding-text px-4 md:px-8 border-x border-wedding-gold/20 leading-none">
        {dayNum}
      </div>
      <div className="text-left">
        <div className={`text-lg md:text-2xl text-wedding-gold border-b border-wedding-gold/30 pb-1 ${lang === 'my' ? 'font-myanmar' : 'font-bold'}`}>{month}</div>
        <div className="text-xs md:text-sm text-gray-400 mt-1 uppercase tracking-widest">{lang === 'en' ? 'MONTH' : ''}</div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [data, setData] = useState<WeddingData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Language>('my');
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showRsvp, setShowRsvp] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('event') || 'template';
  const normalizedEventId = eventId.replace(/\./g, '_');

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isAdminAllowed = isLocal && params.get('mode') === 'admin';

  const fixAssetPath = (path: string): string => {
    if (!path || typeof path !== 'string') return path;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    let clean = path.trim();
    if (clean.startsWith('/')) clean = clean.substring(1);
    return clean.replace(/\[event-folder\]/g, normalizedEventId);
  };

  useEffect(() => {
    const loadData = async () => {
      console.group(`Wedding Invite Loader: ${normalizedEventId}`);
      let mergedData = { ...INITIAL_DATA };
      const cacheBuster = `?t=${Date.now()}`;

      const safeFetchJson = async (path: string) => {
        try {
          const finalPath = `./${path}${cacheBuster}`;
          const response = await fetch(finalPath);
          if (!response.ok) return null;
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) return null;
          return await response.json();
        } catch (e) {
          return null;
        }
      };

      try {
        const baseData = await safeFetchJson('wedding-data.json');
        if (baseData) mergedData = deepMerge(mergedData, baseData);
        const eventFileName = `wedding-data_${normalizedEventId}.json`;
        const eventData = await safeFetchJson(eventFileName);
        if (eventData) mergedData = deepMerge(mergedData, eventData);
        setData(mergedData);
      } catch (err) {
        console.error("Data loading error:", err);
      } finally {
        console.groupEnd();
        setIsLoading(false);
      }
    };
    loadData();
  }, [normalizedEventId]);

  useEffect(() => {
    if (data.musicUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(data.musicUrl);
        audioRef.current.loop = true;
      }
    }
    return () => audioRef.current?.pause();
  }, [data.musicUrl]);

  useEffect(() => {
    if (!isMuted && isEnvelopeOpen) {
      audioRef.current?.play().catch(() => setIsMuted(true));
    } else {
      audioRef.current?.pause();
    }
  }, [isMuted, isEnvelopeOpen]);

  const handleUpdate = (newData: WeddingData) => setData(newData);

  const labels = {
    en: { schedule: 'SCHEDULE', location: 'LOCATION', rsvp: 'RSVP', rsvpDeadline: 'RSVP by', countdown: 'COUNTDOWN', gallery: 'GALLERY', days: 'Days', hours: 'Hours', mins: 'Mins', secs: 'Secs' },
    ja: { schedule: '挙式・披露宴', location: 'アクセス', rsvp: 'ご出欠', rsvpDeadline: '出欠回答期限', countdown: 'カウントダウン', gallery: 'フォトギャラリー', days: '日', hours: '時間', mins: '分', secs: '秒' },
    my: { schedule: 'အစီအစဉ်', location: 'တည်နေရာ', rsvp: 'တက်ရောက်ရန်', rsvpDeadline: 'အကြောင်းပြန်ရန် နောက်ဆုံးရက်', countdown: 'ကျန်ရှိသောအချိန်', gallery: 'ဓါတ်ပုံများ', days: 'ရက်', hours: 'နာရီ', mins: 'မိနစ်', secs: 'စက္ကန့်' }
  }[lang];

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-wedding-sand/20">
        <Loader2 className="w-10 h-10 animate-spin text-wedding-gold" />
      </div>
    );
  }

  if (showRsvp) {
    return (
      <RsvpForm 
        language={lang} 
        googleScriptUrl={data.googleScriptUrl || ''} 
        faq={data.faq} 
        weddingData={data}
        onBack={() => setShowRsvp(false)} 
      />
    );
  }

  const getScheduleIcon = (icon: string) => {
    switch(icon) {
      case 'meal': return <Utensils size={16} />;
      case 'camera': return <Camera size={16} />;
      case 'ceremony': return <Heart size={16} />;
      case 'map': return <MapPin size={16} />;
      default: return <User size={16} />;
    }
  };

  return (
    <div className={`min-h-[100dvh] selection:bg-wedding-gold/20 ${lang === 'my' ? 'font-myanmar' : 'font-sans'}`} style={{ backgroundColor: data.theme.backgroundTint }}>
      {data.visuals.enableEnvelope && !isEnvelopeOpen && (
        <EnvelopeOverlay data={data} lang={lang} onOpen={() => setIsEnvelopeOpen(true)} />
      )}

      <LanguageSwitch current={lang} onChange={setLang} />

      {isAdminAllowed && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-wedding-text hover:text-wedding-gold transition-colors"
          >
            <Settings size={24} />
          </button>
        </div>
      )}

      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-4 left-4 z-50 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-wedding-text hover:text-wedding-gold transition-colors"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {isAdminAllowed && isAdminOpen && (
        <AdminPanel data={data} onUpdate={handleUpdate} onClose={() => setIsAdminOpen(false)} />
      )}

      <WeddingCardTemplate>
        <main className="flex flex-col items-center">
          {/* Hero Section */}
          <section className="min-h-[100dvh] flex flex-col items-center justify-center text-center py-10 md:py-20">
            <ScrollReveal className="w-full flex flex-col items-center">
              <KanoteOrnament className="w-24 md:w-48 opacity-40 mb-12" />
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12 w-full max-w-4xl px-4">
                <div className="flex-1 w-full text-center">
                  <ElegantName name={data.groomName[lang]} lang={lang} />
                </div>
                <div className="flex items-center justify-center shrink-0 h-12 w-12 md:h-20 md:w-20">
                  <GoldHeart className="w-10 h-10 md:w-16 md:h-16 animate-pulse" />
                </div>
                <div className="flex-1 w-full text-center">
                  <ElegantName name={data.brideName[lang]} lang={lang} />
                </div>
              </div>

              <p className="text-lg md:text-2xl text-wedding-gold tracking-[0.2em] mb-12 italic opacity-80 max-w-xl mx-auto px-4">
                {data.welcomeMessage[lang]}
              </p>
              
              <UniversalDateDisplay dateStr={data.date} day={data.day} lang={lang} />
              
              <ChevronDown className="mt-16 w-8 h-8 text-wedding-gold/40 animate-bounce" />
            </ScrollReveal>
          </section>

          {/* Profile Section */}
          <ProfileSection data={data} language={lang} fixPath={fixAssetPath} />

          {/* Schedule Section - Refined Proportions */}
          {data.showSchedule && data.schedule.length > 0 && (
            <section className="py-24 w-full max-w-3xl px-6 relative">
              <ScrollReveal>
                <h2 className="text-2xl md:text-4xl font-serif text-wedding-gold text-center mb-16 tracking-widest">{labels.schedule}</h2>
                <div className="relative space-y-4">
                  {/* Vertical connecting line - subtle */}
                  <div className="absolute left-[23px] md:left-[31px] top-8 bottom-8 w-[1px] bg-gradient-to-b from-transparent via-[#d68c8c]/20 to-transparent"></div>
                  
                  {data.schedule.map((item, idx) => (
                    <div key={idx} className="relative bg-white/60 backdrop-blur-md rounded-xl p-4 md:p-5 border border-gray-100 border-l-[4px] border-[#d68c8c] shadow-sm flex items-center gap-4 md:gap-8 hover:shadow-md transition-all duration-500 group">
                      {/* Icon Container - Scaled down */}
                      <div className="relative shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#fce4ec] flex items-center justify-center text-[#d68c8c] z-10">
                        {getScheduleIcon(item.icon)}
                      </div>
                      
                      {/* Time and Title Row - Balanced text sizes */}
                      <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8 flex-1">
                        <div className="shrink-0">
                          <div className="text-sm md:text-xl font-bold text-[#b57c7c] tracking-wider font-elegant">{item.time}</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-base md:text-2xl font-bold text-wedding-text leading-tight group-hover:text-wedding-gold transition-colors duration-300">
                            {item.title[lang]}
                          </div>
                          {item.note && (
                            <div className="text-[10px] md:text-sm text-gray-400 font-myanmar mt-1 opacity-90 italic">
                              {item.note[lang]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </section>
          )}

          {/* Location Section */}
          <section className="py-32 w-full max-w-4xl px-6 text-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-serif text-wedding-gold mb-12 tracking-widest">{labels.location}</h2>
              <MapPin className="w-12 h-12 text-wedding-gold mx-auto mb-6" />
              <h3 className="text-2xl md:text-4xl text-wedding-text mb-4">{data.location.name[lang]}</h3>
              <p className="text-lg text-gray-500 mb-12 leading-relaxed">{data.location.address[lang]}</p>
              
              {data.location.mapUrl && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-wedding-gold/20 mb-10">
                  <iframe 
                    src={data.location.mapUrl} 
                    className="w-full h-full border-0" 
                    allowFullScreen 
                    loading="lazy"
                  ></iframe>
                </div>
              )}
            </ScrollReveal>
          </section>

          {/* Gallery Section */}
          {data.showGallery && data.gallery && data.gallery.length > 0 && (
            <section className="py-32 w-full max-w-6xl px-6">
              <ScrollReveal>
                <h2 className="text-3xl md:text-5xl font-serif text-wedding-gold text-center mb-20 tracking-widest uppercase">{labels.gallery}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {data.gallery.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="aspect-[4/5] overflow-hidden rounded-3xl border-[6px] border-wedding-gold/10 hover:border-wedding-gold/40 transition-all duration-1000 shadow-xl bg-wedding-sand/5 group"
                    >
                      <img 
                        src={fixAssetPath(img)} 
                        alt={`Gallery ${idx + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </section>
          )}

          {/* Countdown Section */}
          {data.showCountdown && (
            <section className="py-32 w-full text-center">
              <ScrollReveal>
                <h2 className="text-2xl md:text-4xl font-serif text-wedding-gold mb-12 tracking-widest">{labels.countdown}</h2>
                <Countdown 
                  targetDate={data.date} 
                  labels={{ 
                    days: labels.days, 
                    hours: labels.hours, 
                    mins: labels.mins, 
                    secs: labels.secs 
                  }} 
                />
              </ScrollReveal>
            </section>
          )}

          {/* RSVP Button */}
          {data.showRsvp && (
            <section className="py-48 text-center">
              <ScrollReveal>
                <div className="flex items-center justify-center mb-12">
                  <GoldHeart className="w-20 h-20 opacity-40 animate-pulse" />
                </div>
                
                {data.rsvpDeadline && (
                  <div className="mb-6 flex items-center justify-center gap-2 text-wedding-gold font-serif italic text-lg opacity-80">
                    <Calendar size={18} />
                    <span>{labels.rsvpDeadline}: {data.rsvpDeadline}</span>
                  </div>
                )}

                <button 
                  onClick={() => setShowRsvp(true)}
                  className="bg-wedding-text text-white px-10 md:px-20 py-6 md:py-8 rounded-full font-serif text-xl md:text-4xl shadow-2xl hover:bg-wedding-gold transition-all transform hover:-translate-y-2 active:scale-95 uppercase tracking-[0.2em]"
                >
                  {labels.rsvp}
                </button>
              </ScrollReveal>
            </section>
          )}

          {/* Footer Provider */}
          {data.showProvider && (
            <footer className="py-24 text-center opacity-30 hover:opacity-100 transition-opacity">
               <p className="text-[10px] tracking-[0.4em] font-bold text-wedding-text">POWERED BY AMORÉ.WEDDING TOKYO</p>
            </footer>
          )}
        </main>
      </WeddingCardTemplate>
    </div>
  );
};

export default App;