import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface OnboardingData {
  topStyle?: string;
  bottomStyle?: string;
  height?: string;
  weight?: string;
  dorm?: string;
}

const topStyles = [
  { id: 'casual', label: 'Casual Tees', image: 'https://images.unsplash.com/photo-1600328759671-85927887458d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjB3aGl0ZSUyMHQtc2hpcnQlMjB3b21lbnxlbnwxfHx8fDE3NzA1MzI5OTl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'elegant', label: 'Elegant Blouses', image: 'https://images.unsplash.com/photo-1761117228880-df2425bd70da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmxvdXNlJTIwd29tZW4lMjBmYXNoaW9ufGVufDF8fHx8MTc3MDUzMzAwMHww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'trendy', label: 'Crop Tops', image: 'https://images.unsplash.com/photo-1760551600405-54c70e6d7f42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9wJTIwdG9wJTIwdHJlbmR5JTIwd29tZW58ZW58MXx8fHwxNzcwNTMzMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'cozy', label: 'Oversized Sweaters', image: 'https://images.unsplash.com/photo-1628271900516-c018e1193d98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdmVyc2l6ZWQlMjBzd2VhdGVyJTIwd29tZW58ZW58MXx8fHwxNzcwNTMzMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080' },
];

const bottomStyles = [
  { id: 'jeans', label: 'Denim Jeans', image: 'https://images.unsplash.com/photo-1609831190577-04538764f438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwamVhbnMlMjB3b21lbiUyMGRlbmltfGVufDF8fHx8MTc3MDUzMzAwMXww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'skirt', label: 'Mini Skirts', image: 'https://images.unsplash.com/photo-1507274301514-7de9f124ff54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pJTIwc2tpcnQlMjBmYXNoaW9uJTIwd29tZW58ZW58MXx8fHwxNzcwNTMzMDAxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'athletic', label: 'Leggings', image: 'https://images.unsplash.com/photo-1768929096117-c0b04a7c8fc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGxlZ2dpbmdzJTIwYXRobGV0aWMlMjB3b21lbnxlbnwxfHx8fDE3NzA1MzMwMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'wide', label: 'Wide Leg Pants', image: 'https://images.unsplash.com/photo-1768651925914-76d953fb864a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWRlJTIwbGVnJTIwcGFudHMlMjB3b21lbnxlbnwxfHx8fDE3NzA1MzMwMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
];

export function Onboarding() {  // Remove the props parameter
  const navigate = useNavigate();  // Add this
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({});
  const [direction, setDirection] = useState(1);

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      // Save data and navigate to home
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('userPreferences', JSON.stringify(data));
      navigate('/home');  // Changed from onComplete() to navigate
    }
  };

  const handleSkip = () => {
    setDirection(1);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('onboardingComplete', 'true');
      navigate('/home');  // Changed from onComplete() to navigate
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const selectTopStyle = (styleId: string) => {
    setData({ ...data, topStyle: styleId });
  };

  const selectBottomStyle = (styleId: string) => {
    setData({ ...data, bottomStyle: styleId });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text mb-8">
            REVE
          </div>
          
          {/* Progress Dots */}
          <div className="flex gap-2 mb-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : index < currentStep
                    ? 'bg-purple-500/50'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
          
          <p className="text-sm text-gray-400">
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Content Area */}
        <div className="flex-1 flex items-start justify-center px-4 sm:px-6 pb-32 pt-4">
        <div className="w-full max-w-2xl relative" style={{ minHeight: '400px' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >

              {/* Step 1: Top Style */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-black">
                      Choose your top style
                    </h2>
                    <p className="text-gray-400">Select all that match your vibe</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {topStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => selectTopStyle(style.id)}
                        className={`relative h-48 sm:h-64 rounded-2xl overflow-hidden group transition-all duration-300 ${
                          data.topStyle === style.id
                            ? 'ring-4 ring-purple-500'
                            : 'hover:ring-2 hover:ring-white/30'
                        }`}
                      >
                        <ImageWithFallback
                          src={style.image}
                          alt={style.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="font-black text-lg">{style.label}</div>
                        </div>
                        {data.topStyle === style.id && (
                          <div className="absolute top-4 right-4 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5" fill="white" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Bottom Style */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-black">
                      Choose your bottom style
                    </h2>
                    <p className="text-gray-400">What do you usually wear?</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {bottomStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => selectBottomStyle(style.id)}
                        className={`relative h-48 sm:h-64 rounded-2xl overflow-hidden group transition-all duration-300 ${
                          data.bottomStyle === style.id
                            ? 'ring-4 ring-pink-500'
                            : 'hover:ring-2 hover:ring-white/30'
                        }`}
                      >
                        <ImageWithFallback
                          src={style.image}
                          alt={style.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="font-black text-lg">{style.label}</div>
                        </div>
                        {data.bottomStyle === style.id && (
                          <div className="absolute top-4 right-4 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5" fill="white" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Height & Weight */}
              {currentStep === 2 && (
                <div className="space-y-6 max-w-md mx-auto">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-black">
                      Your measurements
                    </h2>
                    <p className="text-gray-400">This helps us find the perfect fit</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">
                        Height (optional)
                      </label>
                      <input
                        type="text"
                        placeholder='e.g., 5`6'
                        value={data.height || ''}
                        onChange={(e) => setData({ ...data, height: e.target.value })}
                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">
                        Weight (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 130 lbs"
                        value={data.weight || ''}
                        onChange={(e) => setData({ ...data, weight: e.target.value })}
                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Dorm */}
              {currentStep === 3 && (
                <div className="space-y-6 max-w-md mx-auto">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-black">
                      Where do you live?
                    </h2>
                    <p className="text-gray-400">Find borrowers near you</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">
                      Dorm name (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Roble Hall"
                      value={data.dorm || ''}
                      onChange={(e) => setData({ ...data, dorm: e.target.value })}
                      className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a1f]/80 backdrop-blur-md border-t border-white/5 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`p-3 rounded-xl transition-all ${
              currentStep === 0
                ? 'opacity-0 pointer-events-none'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleSkip}
            className="px-6 py-3 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Skip
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}