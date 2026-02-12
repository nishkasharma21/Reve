import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useTheme } from '../ThemeContent';

interface OnboardingData {
  topStyle?: string;
  bottomStyle?: string;
  height?: string;
  weight?: string;
  dorm?: string;
}

const topStyles = [
  { id: 'casual', label: 'Casual Tees', image: 'https://images.unsplash.com/photo-1600328759671-85927887458d?auto=format&fit=crop&w=1080&q=80' },
  { id: 'elegant', label: 'Elegant Blouses', image: 'https://images.unsplash.com/photo-1761117228880-df2425bd70da?auto=format&fit=crop&w=1080&q=80' },
  { id: 'trendy', label: 'Crop Tops', image: 'https://images.unsplash.com/photo-1760551600405-54c70e6d7f42?auto=format&fit=crop&w=1080&q=80' },
  { id: 'cozy', label: 'Oversized Sweaters', image: 'https://images.unsplash.com/photo-1628271900516-c018e1193d98?auto=format&fit=crop&w=1080&q=80' },
];

const bottomStyles = [
  { id: 'jeans', label: 'Denim Jeans', image: 'https://images.unsplash.com/photo-1609831190577-04538764f438?auto=format&fit=crop&w=1080&q=80' },
  { id: 'skirt', label: 'Mini Skirts', image: 'https://images.unsplash.com/photo-1507274301514-7de9f124ff54?auto=format&fit=crop&w=1080&q=80' },
  { id: 'athletic', label: 'Leggings', image: 'https://images.unsplash.com/photo-1768929096117-c0b04a7c8fc2?auto=format&fit=crop&w=1080&q=80' },
  { id: 'wide', label: 'Wide Leg Pants', image: 'https://images.unsplash.com/photo-1768651925914-76d953fb864a?auto=format&fit=crop&w=1080&q=80' },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({});
  const [direction, setDirection] = useState(1);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    } else {
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('userPreferences', JSON.stringify(data));
      navigate('/home');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const handleSkip = () => handleNext();

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className={`min-h-screen flex flex-col h-screen overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#0a0a1f] text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header with Progress */}
      <div className="w-full px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className={`text-2xl sm:text-3xl font-black mb-4 sm:mb-6 ${
            isDark 
              ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text' 
              : 'text-purple-600'
          }`}>
            REVE
          </div>
          
          <div className="flex gap-2 mb-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : index < currentStep
                    ? 'bg-purple-500/50'
                    : isDark ? 'bg-white/10' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-24 sm:pb-28 min-h-0">
        <div className="max-w-7xl mx-auto h-full flex items-center py-4">
          <div className="w-full">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              >
                {/* Step 1: Top Style (Detailed Grid Style) */}
                {currentStep === 0 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="text-center space-y-1 sm:space-y-2">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Choose your top style</h2>
                      <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Select all that match your vibe</p>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                      {topStyles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setData({ ...data, topStyle: style.id })}
                          className={`relative h-64 sm:h-72 lg:h-96 xl:h-[28rem] rounded-xl sm:rounded-2xl overflow-hidden group transition-all duration-300 ${
                            data.topStyle === style.id
                              ? 'ring-2 sm:ring-4 ring-purple-500'
                              : isDark ? 'hover:ring-2 hover:ring-white/30' : 'hover:ring-2 hover:ring-gray-300'
                          }`}
                        >
                          <ImageWithFallback src={style.image} alt={style.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                            <div className="font-black text-sm sm:text-base md:text-lg text-white">{style.label}</div>
                          </div>
                          {data.topStyle === style.id && (
                            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Bottom Style (Detailed Grid Style) */}
                {currentStep === 1 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="text-center space-y-1 sm:space-y-2">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Choose your bottom style</h2>
                      <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>What do you usually wear?</p>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                      {bottomStyles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setData({ ...data, bottomStyle: style.id })}
                          className={`relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden group transition-all duration-300 ${
                            data.bottomStyle === style.id
                              ? 'ring-2 sm:ring-4 ring-pink-500'
                              : isDark ? 'hover:ring-2 hover:ring-white/30' : 'hover:ring-2 hover:ring-gray-300'
                          }`}
                        >
                          <ImageWithFallback src={style.image} alt={style.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                            <div className="font-black text-sm sm:text-base md:text-lg text-white">{style.label}</div>
                          </div>
                          {data.bottomStyle === style.id && (
                            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-pink-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Measurements (Dark/Light adapted) */}
                {currentStep === 2 && (
                  <div className="space-y-6 sm:space-y-8 max-w-md mx-auto">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Your measurements</h2>
                      <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>This helps us find the perfect fit</p>
                    </div>
                    <div className="space-y-4">
                      {['height', 'weight'].map((field) => (
                        <div key={field}>
                          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {field.charAt(0).toUpperCase() + field.slice(1)} 
                          </label>
                          <input
                            type="text"
                            placeholder={field === 'height' ? 'e.g., 5`6' : 'e.g., 130 lbs'}
                            value={(data as any)[field] || ''}
                            onChange={(e) => setData({ ...data, [field]: e.target.value })}
                            className={`w-full px-4 sm:px-5 py-3 border rounded-xl transition-colors focus:outline-none focus:border-purple-400 ${
                              isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Dorm (Dark/Light adapted) */}
                {currentStep === 3 && (
                  <div className="space-y-6 sm:space-y-8 max-w-md mx-auto">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Where do you live?</h2>
                      <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Find borrowers near you</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Dorm name </label>
                      <input
                        type="text"
                        placeholder="e.g., Roble Hall"
                        value={data.dorm || ''}
                        onChange={(e) => setData({ ...data, dorm: e.target.value })}
                        className={`w-full px-4 sm:px-5 py-3 border rounded-xl transition-colors focus:outline-none focus:border-purple-400 ${
                          isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className={`fixed bottom-0 left-0 right-0 backdrop-blur-md border-t p-4 sm:p-6 flex-shrink-0 z-10 transition-colors ${
        isDark ? 'bg-[#0a0a1f]/95 border-white/5' : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`p-2 sm:p-3 rounded-xl transition-all ${
                currentStep === 0 ? 'opacity-0 pointer-events-none' : isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button onClick={handleSkip} className={`px-4 sm:px-6 py-2 sm:py-3 text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              Skip
            </button>
          </div>
          
          <button
            onClick={handleNext}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 text-sm sm:text-base"
          >
            {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}