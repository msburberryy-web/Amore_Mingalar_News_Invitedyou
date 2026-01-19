import React, { useState, useEffect, useRef } from 'react';
import { WeddingData, INITIAL_DATA, Language } from './types';
import { Volume2, VolumeX, Share2, Settings, Heart, ChevronDown } from 'lucide-react';
import EnvelopeOverlay, { KanoteOrnament } from './components/EnvelopeOverlay';
import WeddingCardTemplate from './components/WeddingCardTemplate';
import LanguageSwitch from './components/LanguageSwitch';
import AdminPanel from './components/AdminPanel';
import ProfileSection from './components/ProfileSection';
import RsvpForm from './components/RsvpForm';
import Countdown from './components/Countdown';

const GoldHeart = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-wedding-gold`} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ElegantName: React.FC<{ name: string; lang: Language }> = ({ name, lang }) => {
  if (lang !== 'en') return <span className="break-words px-2">{name}</span>;
  
  const firstChar = name.charAt(0);
  const rest = name.slice(1);
  
  return (
    <span className="inline-flex items-center break-words max-w-full overflow-visible px-2 md:px-6">
      <span className="font-['Great_Vibes'] text-5xl xs:text-6xl md:text-7xl lg:text-8xl gold-text-shimmer leading-[1.5] py-4 px-3 inline-block">
        {firstChar}
      </span>
      <span className="text-gray-900 text-sm xs:text-lg md:text-2xl lg:text-3xl tracking-tight font-serif italic -ml-2">
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

const App: React.FC = () => {
  const [data, setData] = useState<WeddingData>(() => {
    const embedded = (window as any).EMBEDDED_WEDDING_DATA;
    return embedded || INITIAL_DATA;
  });
  
  const [lang, setLang] = useState<Language>('my');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpened, setIsOpened] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has('embedded') || params.has('print');
  });
  const [showAdmin, setShowAdmin] = useState(false);
  const [view, setView] = useState<'invite' | 'rsvp'>('invite');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('invitation_data');
    if (saved && !(window as any).EMBEDDED_WEDDING_DATA) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data");
      }
    }
  }, []);

  useEffect(() => {
    if (data.musicUrl && isOpened) {
      if (!audioRef.current) {
        audioRef.current = new Audio(data.musicUrl);
        audioRef.current.loop = true;
      }
      if (isPlaying) {
        audioRef.current.play().catch(err => console.debug("Autoplay blocked:", err));
      } else {
        audioRef.current.pause();
      }
    }
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [data.musicUrl, isOpened, isPlaying]);

  const toggleMusic = () => {
    if (!audioRef.current && data.musicUrl) {
      audioRef.current = new Audio(data.musicUrl);
      audioRef.current.loop = true;
    }
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.debug("Manual play blocked:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data.title[lang],
        text: `${data.groomName[lang]} & ${data.brideName[lang]} Invitation`,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  const handleUpdateData = (newData: WeddingData) => {
      setData(newData);
      localStorage.setItem('invitation_data', JSON.stringify(newData));
  };

  const getDayTranslation = (day: string, targetLang: Language) => {
    const days: Record<string, Record<Language, string>> = {
      'Sunday': { en: 'Sunday', ja: '日曜日', my: 'တနင်္ဂနွေနေ့' },
      'Monday': { en: 'Monday', ja: '月曜日', my: 'တနင်္လာနေ့' },
      'Tuesday': { en: 'Tuesday', ja: 'အင်္ဂါနေ့', my: 'အင်္ဂါနေ့' },
      'Wednesday': { en: 'Wednesday', ja: '水曜日', my: 'ဗုဒ္ဓဟူးနေ့' },
      'Thursday': { en: 'Thursday', ja: '木曜日', my: 'ကြာသပတေးနေ့' },
      'Friday': { en: 'Friday', ja: '金曜日', my: 'သောကြာနေ့' },
      'Saturday': { en: 'Saturday', ja: '土曜日', my: 'စနေနေ့' }
    };
    return days[day]?.[targetLang] || day;
  };

  if (view === 'rsvp') {
    return (
      <RsvpForm 
        language={lang} 
        googleScriptUrl={data.googleScriptUrl || ''} 
        faq={data.faq} 
        weddingData={data} 
        onBack={() => setView('invite')} 
      />
    );
  }

  const elegantDate = new Date(data.date).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'ja' ? 'ja-JP' : 'my-MM', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className={`relative min-h-screen bg-[#fdfbf7] ${!isOpened ? 'overflow-hidden h-screen' : ''}`}>
      
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] z-0"></div>

      {isOpened && <LanguageSwitch current={lang} onChange={setLang} />}

      {!isOpened && (
        <EnvelopeOverlay data={data} lang={lang} onOpen={() => {
            setIsOpened(true);
            setIsPlaying(true);
        }} />
      )}

      <div className={`relative z-10 transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0'}`}>
        
        <section className="min-h-screen flex flex-col items-center justify-center p-2 xs:p-4 md:p-12 relative card-container overflow-hidden">
            <div className="relative w-full max-w-[1000px] h-[90vh] md:h-[750px] animate-reveal">
                <WeddingCardTemplate className="w-full h-full">
                    <div className="w-full h-full flex flex-col justify-around items-center py-4 md:py-12 gap-y-6 md:gap-y-0 md:justify-between overflow-visible">
                        
                        {/* 1. Header Names - Increased vertical gap and allowed overflow */}
                        <div className="w-full text-center overflow-visible">
                          <div className={`flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 text-wedding-gold mb-2 md:mb-6 overflow-visible ${lang === 'my' ? 'font-myanmar font-bold' : 'font-serif'}`}>
                              <ElegantName name={data.groomName[lang]} lang={lang} />
                              <div className="my-1 md:my-0">
                                <GoldHeart className="w-4 h-4 xs:w-6 xs:h-6 md:w-8 lg:w-10 animate-pulse no-print opacity-70" />
                              </div>
                              <ElegantName name={data.brideName[lang]} lang={lang} />
                          </div>
                          <div className="w-10 md:w-16 h-px bg-wedding-gold/20 mx-auto mt-2"></div>
                        </div>

                        {/* 2. Main Title */}
                        <div className="flex flex-col items-center justify-center w-full px-4 md:px-20">
                          <h1 className={`text-wedding-gold text-lg xs:text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-center ${lang === 'my' ? 'font-myanmar font-extrabold' : 'font-serif italic'}`}>
                              {data.title[lang]}
                          </h1>
                          <KanoteOrnament className="w-12 xs:w-16 md:w-32 lg:w-36 h-3 xs:h-6 md:h-12 lg:h-14 shrink-0 opacity-50 mt-1 md:mt-3" />
                        </div>

                        {/* 3. Message */}
                        <div className="max-w-[280px] xs:max-w-[340px] md:max-w-4xl mx-auto px-4 md:px-24">
                            <p className={`text-[13px] xs:text-sm md:text-lg lg:text-xl leading-relaxed text-gray-500 italic font-medium opacity-95 text-center ${lang === 'my' ? 'font-myanmar leading-[1.8]' : 'font-serif'}`}>
                            {data.welcomeMessage[lang]}
                            </p>
                        </div>

                        {/* 4. Details */}
                        <div className="border-t border-wedding-gold/10 pt-4 md:pt-8 w-full max-w-2xl lg:max-w-3xl px-2 md:px-12">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 xs:gap-8 md:gap-10 text-center">
                                <div className="flex flex-col items-center md:border-r border-gray-100 md:pr-10 w-full md:w-auto">
                                    <span className="text-wedding-gold font-bold mb-0.5 md:mb-1 uppercase text-[10px] xs:text-[11px] md:text-[12px] tracking-widest opacity-80">📅 {lang === 'my' ? 'နေ့ရက်' : lang === 'ja' ? '開催日' : 'Date'}</span>
                                    <p className={`leading-tight text-[#7c6231] font-semibold ${lang === 'my' ? 'font-myanmar text-sm xs:text-base md:text-2xl' : 'font-elegant italic text-lg xs:text-xl md:text-3xl'}`}>
                                      {elegantDate}
                                    </p>
                                    <p className={`opacity-60 text-[9px] xs:text-[11px] md:text-xs font-bold tracking-widest mt-0.5 uppercase ${lang === 'my' ? 'font-myanmar text-wedding-gold' : ''}`}>
                                      {getDayTranslation(data.day, lang)}
                                    </p>
                                </div>
                                <div className="flex flex-col items-center md:border-r border-gray-100 md:px-10 w-full md:w-auto">
                                    <span className="text-wedding-gold font-bold mb-0.5 md:mb-1 uppercase text-[10px] xs:text-[11px] md:text-[12px] tracking-widest opacity-80">⏰ {lang === 'my' ? 'အချိန်' : lang === 'ja' ? '時間' : 'Time'}</span>
                                    <p className={`leading-tight text-[#7c6231] font-semibold ${lang === 'my' ? 'font-myanmar text-sm xs:text-base md:text-2xl' : 'font-elegant italic text-lg xs:text-xl md:text-3xl'}`}>{data.time[lang]}</p>
                                </div>
                                <div className="flex flex-col items-center md:pl-10 w-full md:w-auto">
                                    <span className="text-wedding-gold font-bold mb-0.5 md:mb-1 uppercase text-[10px] xs:text-[11px] md:text-[12px] tracking-widest opacity-80">📍 {lang === 'my' ? 'နေရာ' : lang === 'ja' ? '場所' : 'Location'}</span>
                                    <p className={`leading-tight text-[#7c6231] font-semibold max-w-[160px] xs:max-w-[200px] md:max-w-none ${lang === 'my' ? 'font-myanmar text-sm xs:text-base md:text-xl' : 'font-elegant italic text-lg xs:text-xl md:text-3xl'}`}>{data.location.name[lang]}</p>
                                </div>
                            </div>
                        </div>

                        {/* 5. RSVP Button */}
                        {data.showRsvp && (data.googleScriptUrl || data.googleFormUrl) && (
                            <div className="pt-2 md:pt-6">
                                <button 
                                    onClick={() => setView('rsvp')}
                                    className="px-6 md:px-12 py-3 md:py-4 bg-wedding-gold text-white rounded-full text-[10px] xs:text-xs md:text-sm lg:text-base font-bold shadow-xl hover:bg-black transition-all flex items-center gap-2 md:gap-3 pointer-events-auto no-print group"
                                >
                                    <Heart size={14} className="fill-white group-hover:scale-125 transition-transform" /> {lang === 'my' ? 'တက်ရောက်ရန်စာရင်းပေးရန်' : lang === 'ja' ? 'ご欠席の確認' : 'RSVP Now'}
                                </button>
                            </div>
                        )}
                    </div>
                </WeddingCardTemplate>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-wedding-gold opacity-30 scroll-indicator">
                <ChevronDown size={28} />
            </div>
        </section>

        {data.showRsvp && (
            <ScrollReveal>
                <section className="py-24 px-6 bg-wedding-sand/20 border-b border-wedding-gold/10 flex flex-col items-center text-center no-print">
                    <div className="max-w-3xl bg-white p-10 md:p-20 rounded-[3rem] shadow-2xl border border-wedding-gold/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-3 bg-wedding-gold opacity-50"></div>
                        <Heart size={48} className="text-wedding-gold mx-auto mb-10 animate-pulse" />
                        <h2 className="text-3xl md:text-4xl font-serif text-wedding-text mb-8 tracking-widest uppercase">{lang === 'my' ? 'ဖိတ်ကြားလွှာအကြောင်းပြန်ရန်' : lang === 'ja' ? 'ご出席のお願い' : 'Join Our Celebration'}</h2>
                        <p className="text-gray-600 mb-12 leading-relaxed font-serif italic text-lg md:text-xl">
                            {lang === 'my' 
                                ? 'ကျွန်ုပ်တို့၏မင်္ဂလာပွဲသို့ ကြွရောက်နိုင်ခြင်း ရှိ/မရှိ အောက်ပါ ခလုတ်ကို နှိပ်၍ အကြောင်းကြားပေးပါရန် လေးစားစွာဖြင့် ဖိတ်ကြားအပ်ပါသည်။' 
                                : lang === 'ja'
                                ? '皆様におかれましては ご多忙の折とは存じますが ぜひご出席くださいますようお願い申し上げます'
                                : 'We would be deeply honored by your presence as we celebrate our union. Please kindly confirm your attendance below.'}
                        </p>
                        <button 
                            onClick={() => setView('rsvp')}
                            className="bg-wedding-gold text-white px-10 md:px-14 py-4 md:py-5 rounded-full text-lg md:text-xl font-bold shadow-xl hover:bg-wedding-text transition-all hover:scale-110 active:scale-95 flex items-center gap-4 mx-auto"
                        >
                            <Heart size={24} fill="currentColor" /> {lang === 'my' ? 'တက်ရောက်မည်ဖြစ်ကြောင်းစာရင်းပေးရန်' : lang === 'ja' ? '返信フォーム' : 'RSVP Form'}
                        </button>
                    </div>
                </section>
            </ScrollReveal>
        )}

        {data.showCountdown && (
            <ScrollReveal>
                <section className="py-24 bg-white no-print">
                    <div className="max-w-4xl mx-auto text-center px-6">
                        <h2 className="text-wedding-gold font-serif text-lg md:text-xl tracking-[0.3em] uppercase mb-16">{lang === 'my' ? 'မင်္ဂလာရက်သို့ကျန်ရှိချိန်' : lang === 'ja' ? '式までのカウントダウン' : 'Counting Down'}</h2>
                        <Countdown targetDate={data.date} labels={{ days: lang === 'ja' ? '日' : 'Days', hours: lang === 'ja' ? '時' : 'Hours', mins: lang === 'ja' ? '分' : 'Mins', secs: lang === 'ja' ? '秒' : 'Secs' }} />
                    </div>
                </section>
            </ScrollReveal>
        )}

        <ScrollReveal>
            <ProfileSection data={data} language={lang} />
        </ScrollReveal>

        {data.showGallery && (data.images.hero || data.gallery.length > 0) && (
            <ScrollReveal>
                <section className="py-32 px-6 bg-wedding-sand/10">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-2xl md:text-3xl font-serif text-wedding-gold tracking-[0.3em] uppercase">{lang === 'my' ? 'အမှတ်တရဓာတ်ပုံများ' : lang === 'ja' ? 'ギャラリー' : 'Our Gallery'}</h2>
                            <div className="w-16 h-px bg-wedding-gold mx-auto mt-6 opacity-30"></div>
                        </div>
                        
                        {data.images.hero && (
                             <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative group mb-16">
                                <img 
                                    src={data.images.hero} 
                                    alt="Main Couple" 
                                    className="w-full aspect-[4/3] md:aspect-[16/9] object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                <div className="absolute bottom-10 left-10 text-white">
                                    <p className="text-xs tracking-widest uppercase opacity-70 mb-2">{lang === 'my' ? 'သတို့သားနှင့်သတို့သမီး' : lang === 'ja' ? '新郎新婦' : 'Groom & Bride'}</p>
                                    <h3 className="text-3xl md:text-5xl font-serif italic">{data.groomName.en} & {data.brideName.en}</h3>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </ScrollReveal>
        )}

        <footer ref={footerRef} className="py-20 bg-white text-center border-t border-gray-100">
             <div className="flex items-center justify-center gap-6 mb-6">
                 <div className="w-16 h-px bg-wedding-gold opacity-30"></div>
                 <span className="font-serif text-wedding-gold text-2xl tracking-[0.2em] italic">{data.groomName.en} & {data.brideName.en}</span>
                 <div className="w-16 h-px bg-wedding-gold opacity-30"></div>
             </div>
             <p className="text-[12px] uppercase tracking-[0.4em] text-gray-400 font-bold">Forever Begins Now</p>
             <p className="text-[10px] text-gray-300 mt-12 italic">© 2025 Amoré.wedding Tokyo</p>
        </footer>
      </div>

      <div className={`fixed bottom-10 right-10 flex flex-col gap-6 transition-all duration-1000 z-50 floating-controls ${isOpened ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        {data.showRsvp && (
           <button onClick={() => setView('rsvp')} className="p-5 bg-wedding-gold text-white rounded-full shadow-2xl hover:bg-black hover:scale-110 transition-all active:scale-95 animate-pulse"><Heart size={24} fill="currentColor" /></button>
        )}
        <button onClick={() => setShowAdmin(true)} className="p-5 bg-white/95 backdrop-blur rounded-full shadow-2xl text-gray-400 hover:text-wedding-gold border border-gray-100 hover:scale-110 transition-all active:scale-95"><Settings size={24} /></button>
        <button onClick={handleShare} className="p-5 bg-white/95 backdrop-blur rounded-full shadow-2xl text-gray-400 hover:text-wedding-gold border border-gray-100 hover:scale-110 transition-all active:scale-95"><Share2 size={24} /></button>
        {data.musicUrl && (<button onClick={toggleMusic} className="p-5 bg-white/95 backdrop-blur rounded-full shadow-2xl text-gray-400 hover:text-wedding-gold border border-gray-100 hover:scale-110 transition-all active:scale-95">{isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}</button>)}
      </div>

      {showAdmin && <AdminPanel data={data} onUpdate={handleUpdateData} onClose={() => setShowAdmin(false)} />}
    </div>
  );
};

export default App;