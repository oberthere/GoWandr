import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, UploadCloud, MapPin, ImagePlus, Calendar, Activity } from 'lucide-react';
import { toast } from 'sonner';

const DESTINATIONS = [
  { id: 1, name: 'Tokyo', img: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb2t5byUyMGNpdHklMjBza3lsaW5lfGVufDF8fHx8MTc4MDQzMjQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 2, name: 'Paris', img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc4MDQzMjQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 3, name: 'Bali', img: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYWxpJTIwYmVhY2glMjBzdW5zZXR8ZW58MXx8fHwxNzgwNDMyNDczfDA&ixlib=rb-4.1.0&q=80&w=1080' },
];

export function LandingPage({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [customBudget, setCustomBudget] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAction = (actionName: string) => {
    if (!isLoggedIn) {
      toast.error('Account required', {
        description: `Please log in to ${actionName}.`,
      });
    } else {
      toast.success(`Success! Added to your trip plan.`);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      toast.success('Image uploaded successfully!');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full bg-[#121212] pt-24 pb-32 px-4 sm:px-6 lg:px-8 text-center rounded-b-[3rem] shadow-2xl -mt-24"
      >
        <div className="max-w-4xl mx-auto mt-16">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-10">
            What kind of trip do you want to plan?
          </h1>

          {/* Gemini-style Structured Form */}
          <div className="relative group max-w-2xl mx-auto rounded-[1.75rem] p-0.5 overflow-hidden shadow-2xl">
            {/* Constant rainbow outline */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-orange-500"></div>
            
            <div className="relative bg-[#1a1a1a] rounded-[1.65rem] flex flex-col p-6 sm:p-8 z-10 w-full text-left">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Destination or vibe</label>
                  <input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g., Tokyo, Japan or 'Relaxing beach'"
                    className="w-full bg-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none border border-slate-700/50 focus:border-indigo-500/50 transition-colors text-lg shadow-inner"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Duration (Days)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 7"
                      className="w-full bg-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none border border-slate-700/50 focus:border-indigo-500/50 transition-colors text-lg shadow-inner"
                    />
                  </div>

                  <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Budget</label>
                    <div className="relative">
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full bg-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none border border-slate-700/50 focus:border-indigo-500/50 transition-colors text-lg appearance-none cursor-pointer shadow-inner"
                      >
                        <option value="" disabled>Select budget...</option>
                        <option value="budget">Budget-friendly</option>
                        <option value="moderate">Moderate</option>
                        <option value="luxury">Luxury</option>
                        <option value="custom">Custom</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                    {budget === 'custom' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3">
                        <input
                          type="text"
                          value={customBudget}
                          onChange={(e) => setCustomBudget(e.target.value)}
                          placeholder="e.g. $5,000"
                          className="w-full bg-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none border border-slate-700/50 focus:border-indigo-500/50 transition-colors text-lg shadow-inner"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-800/80">
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button 
                    onClick={triggerFileUpload}
                    className="p-2.5 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-slate-400"
                    title="Add inspiration image"
                  >
                    <ImagePlus size={20} />
                  </button>
                </div>
                <button 
                  onClick={() => handleAction('generate an itinerary')}
                  className="bg-white text-black px-6 py-2.5 rounded-full hover:bg-slate-200 transition-all shadow-sm flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  disabled={!destination.trim() && !selectedImage}
                >
                  <Sparkles size={18} className="text-indigo-600" />
                  Generate Trip
                </button>
              </div>
            </div>
          </div>


        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-16 pb-20">
        {/* Curated Vibes Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-slate-800">
              Or choose a place to get started
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DESTINATIONS.map((dest) => (
              <div 
                key={dest.id} 
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/60 flex flex-col" 
              >
                <div className="aspect-4/3 overflow-hidden relative">
                  <img 
                    src={dest.img} 
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-4 sm:p-5 flex items-center justify-between bg-white">
                  <h3 className="font-semibold text-xl text-slate-900">{dest.name}</h3>
                  <button 
                    onClick={() => handleAction('start this trip')}
                    className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Get started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Build your own Card - Updated Layout */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full mt-24 bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-12 relative"
        >
          {/* Left Column */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Or, build your own itinerary</h2>
            
            <div className="space-y-4 mb-8">
              <button className="w-full flex items-center gap-4 px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100 text-slate-600 text-left font-medium">
                <MapPin size={22} className="text-slate-400" />
                Select destination
              </button>
              <button className="w-full flex items-center gap-4 px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100 text-slate-600 text-left font-medium">
                <Calendar size={22} className="text-slate-400" />
                Select dates
              </button>
              <button className="w-full flex items-center gap-4 px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100 text-slate-600 text-left font-medium">
                <Activity size={22} className="text-slate-400" />
                Select activities
              </button>
            </div>

            <button 
              onClick={() => handleAction('generate itinerary')}
              className="self-start px-8 py-3.5 bg-black text-white font-medium rounded-full shadow-sm hover:bg-slate-800 transition-colors"
            >
              Generate itinerary
            </button>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-slate-100 self-stretch my-2"></div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col justify-center">
            {selectedImage ? (
              <div className="w-full aspect-4/3 rounded-3xl overflow-hidden relative border border-slate-200 shadow-sm group">
                <img src={selectedImage} alt="Uploaded" className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }} 
                  className="absolute top-4 right-4 bg-black/60 p-2.5 rounded-full text-white hover:bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div 
                onClick={triggerFileUpload}
                className="w-full aspect-4/3 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group"
              >
                <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-105 transition-transform">
                  <UploadCloud size={28} className="text-slate-400" />
                </div>
                <div className="text-center text-lg">
                  <span className="text-indigo-600 font-medium hover:underline">Select file</span>
                  <span className="text-slate-500"> or drop it here</span>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => handleAction('generate using image')}
              className="mt-6 w-full px-8 py-3.5 bg-white border border-slate-200 text-slate-900 font-medium rounded-full shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
              disabled={!selectedImage}
            >
              Generate using Image
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
}