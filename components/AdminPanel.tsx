import React, { useState } from 'react';
import { WeddingData, LocalizedString, FONT_OPTIONS, ScheduleItem, FaqItem, VENUE_PRESETS } from '../types';
import { X, Sparkles, Save, Loader2, Palette, Database, Image as ImageIcon, Type, Upload, MapPin, Clock, HelpCircle, Trash2, Plus, CalendarClock, Wand2, LogOut, Music, Camera, Code, FileText, Copy, Check, Heart, Settings, AlignLeft, ToggleLeft, MonitorPlay, Download, AlertTriangle, Link, FolderInput, FileDown, Printer, Facebook } from 'lucide-react';
import { generateGreeting, fetchVenueDetails, generateSchedule } from '../services/geminiService';

interface Props {
  data: WeddingData;
  onUpdate: (newData: WeddingData) => void;
  onClose: () => void;
}

const THEME_PRESETS = [
  { name: 'Classic Gold', primary: '#C5A059', text: '#4A4A4A', bg: '#F5F0E6' },
  { name: 'Sakura Pink', primary: '#D48695', text: '#5D4037', bg: '#FCE4EC' },
  { name: 'Forest Green', primary: '#5D7052', text: '#2C3E26', bg: '#EDF2EB' },
  { name: 'Ocean Blue', primary: '#6B8E9B', text: '#2B3A42', bg: '#EFF5F7' },
];

type Tab = 'basics' | 'content' | 'design' | 'settings';

const AdminPanel: React.FC<Props> = ({ data, onUpdate, onClose }) => {
  const [localData, setLocalData] = useState<WeddingData>(data);
  const [activeTab, setActiveTab] = useState<Tab>('basics');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingVenue, setIsFetchingVenue] = useState(false);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  const handleChange = (section: keyof WeddingData, key: string | null, value: any) => {
    setLocalData(prev => {
      const sectionValue = prev[section];
      if (key && typeof sectionValue === 'object' && !Array.isArray(sectionValue)) {
        return {
          ...prev,
          [section]: {
            ...(sectionValue as any),
            [key]: value
          }
        };
      }
      return { ...prev, [section]: value };
    });
  };

  const handleUpdateData = () => {
      onUpdate(localData);
      onClose();
  };

  const handleDownloadUpdate = () => {
      const jsonStr = JSON.stringify(localData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wedding-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
  };

  const handlePrintPdf = () => {
      onUpdate(localData);
      onClose();
      // Ensure UI has updated before print dialog
      setTimeout(() => {
          window.print();
      }, 500);
  };

  const handleExportHtml = () => {
      const dataString = JSON.stringify(localData);
      const currentUrl = window.location.href.split('?')[0];
      
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${localData.groomName.en} & ${localData.brideName.en} Wedding Invitation</title>
    <style>
        body { font-family: 'Georgia', serif; background: #C5A059; color: white; text-align: center; padding: 100px 20px; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { max-width: 600px; background: white; padding: 60px 40px; border-radius: 20px; box-shadow: 0 40px 100px rgba(0,0,0,0.3); color: #4A4A4A; position: relative; }
        .card::before { content: ""; position: absolute; inset: 10px; border: 1px solid #C5A059; border-radius: 15px; pointer-events: none; }
        h1 { font-size: 2.5rem; margin-bottom: 20px; color: #C5A059; font-weight: normal; font-style: italic; }
        p { color: #666; font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px; }
        .btn { display: inline-block; padding: 18px 50px; background: #C5A059; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; transition: all 0.3s; box-shadow: 0 10px 30px rgba(197, 160, 89, 0.4); }
        .btn:hover { background: #000; transform: translateY(-3px); box-shadow: 0 15px 40px rgba(0,0,0,0.2); }
    </style>
</head>
<body>
    <div class="card">
        <h1>Wedding Invitation</h1>
        <p>You have a personalized invitation from<br><strong>${localData.groomName.en} & ${localData.brideName.en}</strong>.</p>
        <p>This file allows you to view the invitation online with the latest configuration.</p>
        <a id="openBtn" href="${currentUrl}?embedded=true" class="btn">View Invitation Online</a>
    </div>

    <script>
        // Pre-fill localStorage with the exported data
        try {
            const weddingData = ${dataString};
            localStorage.setItem('invitation_data', JSON.stringify(weddingData));
        } catch(e) { console.error(e); }
        
        // Redirect logic is handled by clicking the button
    </script>
</body>
</html>`;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wedding_invite_${localData.groomName.en}_${localData.brideName.en}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleGenerateGreeting = async () => {
    setIsGenerating(true);
    try {
      const newGreeting = await generateGreeting(localData);
      setLocalData(prev => ({ ...prev, message: newGreeting }));
    } catch (e) {
      alert("Failed to generate greeting. Check API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAutoGenerateSchedule = async () => {
      setIsGeneratingSchedule(true);
      const timeStr = new Date(localData.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      try {
          const schedule = await generateSchedule(timeStr);
          if (schedule.length > 0) {
              setLocalData(prev => ({ ...prev, schedule }));
          } else {
              alert("Failed to generate schedule.");
          }
      } catch (e) {
          console.error(e);
          alert("Error generating schedule.");
      } finally {
          setIsGeneratingSchedule(false);
      }
  };

  const handleThemeChange = (key: 'primary' | 'text' | 'backgroundTint', value: string) => {
    setLocalData(prev => ({
      ...prev,
      theme: { ...prev.theme, [key]: value }
    }));
  };

  const applyPreset = (preset: typeof THEME_PRESETS[0]) => {
    setLocalData(prev => ({
      ...prev,
      theme: { primary: preset.primary, text: preset.text, backgroundTint: preset.bg }
    }));
  };

  const removeScheduleItem = (index: number) => {
    const newSchedule = localData.schedule.filter((_, i) => i !== index);
    setLocalData({ ...localData, schedule: newSchedule });
  };

  const addScheduleItem = () => {
    const newItem: ScheduleItem = { time: '00:00', title: { en: 'New Event', ja: 'イベント', my: 'Event' }, icon: 'ceremony' };
    setLocalData({ ...localData, schedule: [...localData.schedule, newItem] });
  };

  const updateScheduleItem = (index: number, field: 'time' | 'en' | 'ja' | 'my' | 'icon', value: string) => {
    const newSchedule = [...localData.schedule];
    if (field === 'time') {
      newSchedule[index].time = value;
    } else if (field === 'icon') {
        newSchedule[index].icon = value as any;
    } else {
      (newSchedule[index].title as any)[field] = value;
    }
    setLocalData({ ...localData, schedule: newSchedule });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        
        <div className="p-4 border-b flex justify-between items-center bg-white z-20">
          <h2 className="text-xl font-serif font-bold text-wedding-text">Planner Dashboard</h2>
          <div className="flex gap-2">
            <button 
                onClick={onClose}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-bold flex items-center gap-1"
            >
                <LogOut size={14} /> Exit
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex border-b bg-gray-50/50">
           <button onClick={() => setActiveTab('basics')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex justify-center items-center gap-2 border-b-2 transition-colors ${activeTab === 'basics' ? 'border-wedding-gold text-wedding-gold bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}><Heart size={14} /> Basics</button>
           <button onClick={() => setActiveTab('content')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex justify-center items-center gap-2 border-b-2 transition-colors ${activeTab === 'content' ? 'border-wedding-gold text-wedding-gold bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}><AlignLeft size={14} /> Content</button>
           <button onClick={() => setActiveTab('design')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex justify-center items-center gap-2 border-b-2 transition-colors ${activeTab === 'design' ? 'border-wedding-gold text-wedding-gold bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}><Palette size={14} /> Design</button>
           <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex justify-center items-center gap-2 border-b-2 transition-colors ${activeTab === 'settings' ? 'border-wedding-gold text-wedding-gold bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}><Settings size={14} /> Settings</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'basics' && (
            <div className="space-y-6 animate-fade-in">
                <section className="space-y-4">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">Couple Names (English)</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <input className="border p-2 rounded w-full text-sm" placeholder="Groom (EN)" value={localData.groomName.en} onChange={e => handleChange('groomName', 'en', e.target.value)} />
                            <input className="border p-2 rounded w-full text-sm" placeholder="Bride (EN)" value={localData.brideName.en} onChange={e => handleChange('brideName', 'en', e.target.value)} />
                        </div>
                    </div>
                </section>
                <section className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-500 flex items-center gap-2"><CalendarClock size={16} /> Date & Time</h3>
                    <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Wedding Date & Time</label>
                        <input type="datetime-local" className="w-full border p-2 rounded text-sm bg-white" value={localData.date.substring(0, 16)} onChange={e => handleChange('date', null, e.target.value)} />
                    </div>
                    </div>
                </section>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6 animate-fade-in">
                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-center mb-2"><h3 className="text-sm font-bold text-blue-800 flex items-center gap-2"><Sparkles size={16} /> AI Greeting Assistant</h3></div>
                    <button onClick={handleGenerateGreeting} disabled={isGenerating} className="w-full bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded shadow-sm text-sm hover:bg-blue-50 flex items-center justify-center gap-2">{isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Generate Message</button>
                </section>
                <section className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2"><Clock size={16} /> Schedule</h3>
                        <button onClick={handleAutoGenerateSchedule} disabled={isGeneratingSchedule} className="text-xs bg-wedding-text text-white px-2 py-1 rounded flex items-center gap-1 hover:opacity-90 disabled:opacity-50" title="Auto-generate plan">{isGeneratingSchedule ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>} Auto-Plan</button>
                    </div>
                    <div className="space-y-4">
                        {localData.schedule.map((item, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border border-gray-200 relative group">
                            <button onClick={() => removeScheduleItem(idx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                            <div className="flex gap-2 mb-2 items-center">
                              <input type="time" className="border rounded p-1 text-sm" value={item.time} onChange={e => updateScheduleItem(idx, 'time', e.target.value)} />
                              <input className="border rounded p-1 text-sm flex-1" placeholder="Event Title (EN)" value={item.title.en} onChange={e => updateScheduleItem(idx, 'en', e.target.value)} />
                            </div>
                        </div>
                        ))}
                        <button onClick={addScheduleItem} className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-400 text-xs font-bold hover:border-gray-400 hover:text-gray-500 flex justify-center items-center gap-2"><Plus size={14} /> Add Event</button>
                    </div>
                </section>
            </div>
          )}

          {activeTab === 'design' && (
             <div className="space-y-6 animate-fade-in">
                <section className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-500 flex items-center gap-2"><Palette size={16} /> Color & Typography</h3>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {THEME_PRESETS.map(preset => (
                            <button key={preset.name} onClick={() => applyPreset(preset)} className="flex flex-col items-center gap-1 group">
                                <div className="w-8 h-8 rounded-full border shadow-sm group-hover:scale-110 transition-transform" style={{ backgroundColor: preset.primary }} />
                                <span className="text-[10px] text-gray-500">{preset.name}</span>
                            </button>
                        ))}
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Accent</label>
                        <div className="flex items-center gap-2 border rounded p-1 bg-white"><input type="color" value={localData.theme.primary} onChange={e => handleThemeChange('primary', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer" /></div>
                    </div>
                </section>
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="space-y-6 animate-fade-in">
                <section className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4"><h3 className="font-bold flex items-center gap-2 text-lg"><Printer size={20}/> Export Invitation</h3></div>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={handlePrintPdf} className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-lg border border-white/30 transition-all flex flex-col items-center gap-2 text-xs">
                         <Printer size={20}/> Save as PDF
                      </button>
                      <button onClick={handleExportHtml} className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-lg border border-white/30 transition-all flex flex-col items-center gap-2 text-xs">
                         <FileDown size={20}/> Standalone Web
                      </button>
                    </div>
                    <div className="mt-6 border-t border-white/20 pt-6">
                        <button onClick={handleDownloadUpdate} className="w-full bg-white text-emerald-600 font-bold py-4 rounded-lg shadow-md hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 group">{downloaded ? <Check size={20}/> : <Download size={20}/>}{downloaded ? "Downloaded Config" : "Download Configuration"}</button>
                    </div>
                </section>

                <section className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-blue-800 flex items-center gap-2"><Facebook size={16} /> Service Provider</h3>
                    <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 cursor-pointer">
                        <div className="flex flex-col"><span className="text-sm font-bold text-gray-700">Amoré.wedding Tokyo Banner</span></div>
                        <input type="checkbox" checked={localData.showProvider ?? true} onChange={e => handleChange('showProvider', null, e.target.checked)} className="w-5 h-5 accent-blue-600 cursor-pointer" />
                    </label>
                </section>
             </div>
          )}
        </div>
        <div className="p-4 border-t bg-white z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            <button onClick={handleUpdateData} className="w-full bg-wedding-text text-white py-3 rounded-lg font-bold shadow-lg hover:bg-black transition-colors flex items-center justify-center gap-2" style={{ backgroundColor: localData.theme.text }}><Save size={18} /> Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;