export type Language = 'en' | 'ja' | 'my';

export interface LocalizedString {
  en: string;
  ja: string;
  my: string;
}

export interface ScheduleItem {
  time: string;
  title: LocalizedString;
  icon: 'ceremony' | 'reception' | 'party' | 'toast' | 'meal' | 'camera' | string;
}

export interface FaqItem {
  question: LocalizedString;
  answer: LocalizedString;
  icon: string;
}

export interface ProfileDetail {
  label: LocalizedString;
  groomValue: LocalizedString;
  brideValue: LocalizedString;
}

export interface ProfileQA {
  question: LocalizedString;
  groomAnswer: LocalizedString;
  brideAnswer: LocalizedString;
}

export const FONT_OPTIONS = {
  en: [
    { label: 'Cormorant Garamond', value: '"Cormorant Garamond", serif' },
    { label: 'Great Vibes (Script)', value: '"Great Vibes", cursive' },
  ],
  ja: [
    { label: 'Mincho', value: 'serif' },
    { label: 'Gothic', value: 'sans-serif' },
  ],
  my: [
    { label: 'Noto Serif Myanmar', value: '"Noto Serif Myanmar", "Padauk", serif' },
  ],
};

export const VENUE_PRESETS = [
  {
    name: { 
      en: 'THERAVADA MONASTERY (Wako-shi)', 
      ja: '和光市テーラワーダ・パリヤッティ僧院', 
      my: 'ဝကိုးရှိ ထေရဝါဒပရိယတ္တိကျောင်းတော်ကြီး' 
    },
    address: { 
      en: '2 Chome-27-18 Niikura, Wako, Saitama 351-0115', 
      ja: '〒351-0115 埼玉県和光市新倉2丁目27-18', 
      my: '၂-၂၇-၁၈ နီအီကူရာ၊ ဝါကိုး၊ ဆိုင်တားမား ၃၅၁-၀၁၁၅၊ ဂျပန်နိုင်ငံ။' 
    }
  }
];

export interface WeddingData {
  title: LocalizedString;
  coverTitle: LocalizedString;
  groomName: LocalizedString;
  academicGroom: string;
  brideName: LocalizedString;
  academicBride: string;
  parentsName: string;
  date: string;
  time: LocalizedString;
  day: string;
  location: {
    name: LocalizedString;
    address: LocalizedString;
    mapUrl: string;
  };
  welcomeMessage: LocalizedString;
  message?: LocalizedString;
  fontSize: number;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  archColor: string;
  showGlitter: boolean;
  photoFilter: 'grayscale' | 'none' | 'sepia';
  layoutMode: 'heritage' | 'modern';
  musicUrl?: string;
  rsvpDeadline?: string;
  showRsvp: boolean; 
  showSchedule: boolean;
  showGallery: boolean;
  showCountdown: boolean;
  showProvider: boolean;
  schedule: ScheduleItem[];
  faq: FaqItem[];
  images: {
    hero: string;
    groom: string;
    bride: string;
  };
  gallery: string[];
  theme: {
    primary: string;
    text: string;
    backgroundTint: string;
  };
  fonts: {
    en: string;
    ja: string;
    my: string;
  };
  visuals: {
    enableEnvelope: boolean;
    enableAnimations: boolean;
  };
  googleScriptUrl?: string;
  googleFormUrl?: string;
  profile: {
    show: boolean;
    showDetails: boolean; 
    showQa: boolean;      
    details: ProfileDetail[];
    qa: ProfileQA[];
  };
}

export const INITIAL_DATA: WeddingData = {
  title: {
    en: 'Wedding Invitation',
    ja: '結婚披露宴のご案内',
    my: 'မင်္ဂလာဦးဆွမ်းကျွေး ဖိတ်ကြားလွှာ'
  },
  coverTitle: {
    en: 'Wedding Announcement',
    ja: '結婚のご報告',
    my: 'မင်္ဂလာသတင်းလွှာ'
  },
  groomName: {
    en: 'Groom',
    ja: '新郎',
    my: 'သတို့သား'
  },
  academicGroom: '',
  brideName: {
    en: 'Bride',
    ja: '新婦',
    my: 'သတို့သမီး'
  },
  academicBride: '',
  parentsName: '',
  date: '2025-11-15T10:30',
  time: {
    en: '10:30 AM to 1:00 PM',
    ja: '午前10時30分から午後1時まで',
    my: 'နံနက် (၁၀:၃၀) နာရီမှ (၁:၀၀) နာရီအထိ'
  },
  day: 'Saturday',
  location: {
    name: {
      en: 'THERAVADA MONASTERY',
      ja: 'テーラワーダ・パリヤッティ僧院',
      my: 'ထေရဝါဒပရိယတ္တိကျောင်းတော်ကြီး'
    },
    address: {
      en: 'Tokyo, Japan',
      ja: '東京都和光市',
      my: 'တိုကျိုမြို့၊ ဂျပန်နိုင်ငံ။'
    },
    mapUrl: ''
  },
  welcomeMessage: {
    en: 'We cordially invite you to join our Wedding Reception.',
    ja: '謹んでご案内申し上げます',
    my: 'ကျွန်ုပ်တို့၏ မင်္ဂလာဦးဆွမ်းကျွေးပွဲသို့ ကြွရောက်ချီးမြှင့်ပေးပါရန် လေးစားစွာဖြင့် ဖိတ်ကြားအပ်ပါသည်။'
  },
  fontSize: 18,
  textColor: '#1a1a1a',
  accentColor: '#C5A059',
  fontFamily: '"Noto Serif Myanmar", "Padauk", serif',
  archColor: '#C5A059',
  showGlitter: false,
  photoFilter: 'none',
  layoutMode: 'heritage',
  musicUrl: 'https://ia800203.us.archive.org/21/items/BurmeseTraditionalMusic/BurmeseTraditionalMusic-SaungGauk-BurmeseHarp.mp3', 
  showRsvp: true,
  showSchedule: true,
  showGallery: true, 
  showCountdown: true,
  showProvider: true,
  schedule: [],
  faq: [],
  images: {
    hero: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    groom: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff',
    bride: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb'
  },
  gallery: [],
  theme: {
    primary: '#C5A059',
    text: '#1a1a1a',
    backgroundTint: '#fdfbf7'
  },
  fonts: {
    en: '"Cormorant Garamond", serif',
    ja: 'serif',
    my: '"Noto Serif Myanmar", "Padauk", serif'
  },
  visuals: {
    enableEnvelope: true,
    enableAnimations: true
  },
  profile: {
    show: true,
    showDetails: false, 
    showQa: false,      
    details: [],
    qa: []
  }
};