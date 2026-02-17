import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContent';
import { Users, Sparkles, Shirt, Instagram, TrendingUp, Menu, X, Moon, Sun } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAuth } from '../../contexts/AuthContexts';

export function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      const hasCompletedOnboarding = localStorage.getItem('onboardingComplete');
      navigate(hasCompletedOnboarding ? '/home' : '/onboard');
    }
  }, [user, loading, navigate]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ 
    type: null, 
    message: '' 
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setStatus({ type: 'error', message: 'Please fill in all fields!' });
      return;
    }
    
    if (!formData.email.endsWith('@stanford.edu')) {
      setStatus({ type: 'error', message: 'Please make sure to use your @stanford.edu email' });
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setStatus({ type: 'success', message: 'Successfully joined the waitlist!' });
        setFormData({ firstName: '', lastName: '', email: '' });
      } else {
        setStatus({ type: 'error', message: 'Something went wrong' });
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus({ type: 'error', message: 'Failed to join waitlist' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return <div>Loading...</div>; // Add your loading spinner
  }

  const handleStanfordLogin = () => {
    //window.location.href = 'https://goreve-d2e7c1150e3c.herokuapp.com/saml/login';
    window.location.href = `${import.meta.env.VITE_API_URL}/saml/login`;
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a1f] text-white' : 'bg-gray-50 text-gray-900'} overflow-x-hidden transition-colors duration-300`}>
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 ${isDark ? 'bg-[#0a0a1f]/80' : 'bg-white/80'} backdrop-blur-md ${isDark ? 'border-white/5' : 'border-gray-200'} border-b transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">
            REVE
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <button 
              onClick={() => scrollToSection('about')}
              className={`text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className={`text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              Features
            </button>
            <button 
              onClick={toggleTheme} // Use the global toggle
              className={`p-2 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => scrollToSection('waitlist')}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm text-white hover:opacity-90 transition-opacity"
            >
              Join Waitlist
            </button>
            {/* <button
              onClick={handleStanfordLogin}
              className="w-full px-8 py-4 bg-[#8C1515] text-white font-bold rounded-xl hover:bg-[#7A0F0F] transition-all flex items-center justify-center gap-3"
            >
              <span>🌲</span>
              Login with Stanford
            </button> */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={toggleTheme} // Combined functionality: triggers global context change
              className={`p-2 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
              aria-label="Toggle theme"
            >
              {/* Icon switches based on the global theme state */}
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${isDark ? 'bg-[#0a0a1f]/95' : 'bg-white/95'} backdrop-blur-lg ${isDark ? 'border-white/5' : 'border-gray-200'} border-t transition-colors duration-300`}>
            <div className="px-4 py-6 space-y-4">
              <button 
                onClick={() => scrollToSection('about')}
                className={`block w-full text-left px-4 py-3 ${isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className={`block w-full text-left px-4 py-3 ${isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('waitlist')}
                className="block w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white hover:opacity-90 transition-opacity text-center"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="waitlist" className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className={`absolute top-20 left-0 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 ${isDark ? 'bg-purple-500/30' : 'bg-purple-300/40'} rounded-full blur-3xl transition-colors duration-300`}></div>
        <div className={`absolute bottom-20 right-0 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 ${isDark ? 'bg-cyan-500/30' : 'bg-cyan-300/40'} rounded-full blur-3xl transition-colors duration-300`}></div>

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 w-full">
            <div className={`inline-block px-3 sm:px-4 py-2 ${isDark ? 'bg-purple-500/20 border-purple-400/30' : 'bg-purple-100 border-purple-300'} rounded-full text-xs sm:text-sm border transition-colors duration-300`}>
              🎓 College-only access • Launching soon
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight break-words">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">
                Your closet.
              </span>
              <br />
              <span className={isDark ? 'text-white' : 'text-gray-900'}>Your campus.</span>
            </h1>

            <p className={`text-base sm:text-lg lg:text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed max-w-xl transition-colors duration-300`}>
              The social fashion marketplace where college women share fits, discover looks, and borrow from each other's wardrobes.
            </p>

            {/* Waitlist Form */}
            {status.type !== 'success' ? (
              <>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 w-full max-w-md">
                  {/* Names - Stack on mobile, side-by-side on larger screens */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className={`w-full sm:flex-1 px-4 sm:px-5 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'} border rounded-xl focus:outline-none ${isDark ? 'focus:border-purple-400' : 'focus:border-purple-500'} transition-colors text-sm sm:text-base`}
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className={`w-full sm:flex-1 px-4 sm:px-5 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'} border rounded-xl focus:outline-none ${isDark ? 'focus:border-purple-400' : 'focus:border-purple-500'} transition-colors text-sm sm:text-base`}
                    />
                  </div>
                  
                  {/* Email - Full width on all screens */}
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your @stanford.edu email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 sm:px-5 py-3 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'} border rounded-xl focus:outline-none ${isDark ? 'focus:border-purple-400' : 'focus:border-purple-500'} transition-colors text-sm sm:text-base`}
                  />
                  
                  {/* Submit Button - Full width on mobile */}
                  <button
                    type="submit"
                    className="w-full px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base"
                  >
                    Join Waitlist
                  </button>
                </form>
                
                {/* Error Message */}
                {status.type === 'error' && (
                  <p className="text-red-400 text-sm">{status.message}</p>
                )}
              </>
            ) : (
              <div className={`w-full max-w-md p-5 sm:p-6 ${isDark ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30' : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300'} border rounded-xl transition-colors duration-300`}>
                <p className="text-base sm:text-lg font-semibold">✨ You're on the list!</p>
                <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2 transition-colors duration-300`}>We'll notify you when REVE launches at your campus.</p>
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-6 sm:gap-8 pt-4 flex-wrap">
              <div>
                <div className="text-2xl sm:text-3xl font-black">2.5K+</div>
                <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>On Waitlist</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black">12</div>
                <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Campuses</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Coming
                </div>
                <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Spring 2026</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Grid - Hidden on mobile, shown on lg+ */}
          <div className="hidden lg:grid grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-4 lg:space-y-6">
              <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden group">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1533656812321-1868a4d2b72a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZ2lybHMlMjBmYXNoaW9uJTIwb3V0Zml0fGVufDF8fHx8MTc3MDUyODc0MHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Fashion outfit"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-purple-900/50' : 'bg-gradient-to-t from-purple-600/40'} to-transparent transition-colors duration-300`}></div>
              </div>
              <div className="relative h-48 lg:h-56 rounded-2xl overflow-hidden group">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1562505208-0b9bad881640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwd29tZW4lMjBjbG90aGluZyUyMHJhY2t8ZW58MXx8fHwxNzcwNTI4NzQyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Clothing rack"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-pink-900/50' : 'bg-gradient-to-t from-pink-600/40'} to-transparent transition-colors duration-300`}></div>
              </div>
            </div>
            <div className="space-y-4 lg:space-y-6 pt-12">
              <div className="relative h-48 lg:h-56 rounded-2xl overflow-hidden group">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1753161022911-53d8bf22f186?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuZHklMjB3b21hbiUyMGNsb3NldCUyMHdhcmRyb2JlfGVufDF8fHx8MTc3MDUyODc0MXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Wardrobe"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-cyan-900/50' : 'bg-gradient-to-t from-cyan-600/40'} to-transparent transition-colors duration-300`}></div>
              </div>
              <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden group">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1635269862022-1ff41e59fabe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBwaW5rJTIwcHVycGxlfGVufDF8fHx8MTc3MDUyODc0M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Fashion model"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-purple-900/50' : 'bg-gradient-to-t from-purple-600/40'} to-transparent transition-colors duration-300`}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Image Section */}
      <section className="relative h-64 sm:h-80 lg:h-[500px] w-full overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1753161021323-3687a18aab50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaXJscyUyMHNoYXJpbmclMjBjbG90aGVzJTIwZnJpZW5kc3xlbnwxfHx8fDE3NzA1Mjg3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Friends sharing clothes"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-purple-900/80 to-pink-900/80' : 'bg-gradient-to-r from-purple-800/70 to-pink-800/70'} flex items-center justify-center transition-colors duration-300`}>
          <div className="text-center space-y-3 sm:space-y-4 px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white">
              Borrow. Share. Discover.
            </h2>
            <p className={`text-sm sm:text-lg lg:text-xl ${isDark ? 'text-gray-200' : 'text-gray-100'} max-w-2xl mx-auto transition-colors duration-300`}>
              Turn your closet into a social experience and never run out of outfit options again.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                How It Works
              </span>
            </h2>
            <p className={`text-base sm:text-lg lg:text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Everything you need to become the fashion icon you are</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className={`group relative ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-3xl p-6 sm:p-8 transition-all duration-300`}>
              <div className="absolute -top-6 left-6 sm:left-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-3 mt-6">Borrow from Your Campus</h3>
              <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed transition-colors duration-300`}>
                Access fits from girls at your school. Trade, borrow, and share your wardrobe with your community.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`group relative ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-3xl p-6 sm:p-8 transition-all duration-300`}>
              <div className="absolute -top-6 left-6 sm:left-8">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-3 mt-6">AI Outfit Discovery</h3>
              <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed transition-colors duration-300`}>
                Get personalized recommendations based on your style, vibe, and what's trending on campus.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`group relative ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-3xl p-6 sm:p-8 transition-all duration-300 sm:col-span-2 lg:col-span-1`}>
              <div className="absolute -top-6 left-6 sm:left-8">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Shirt className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-3 mt-6">Build Your Digital Closet</h3>
              <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed transition-colors duration-300`}>
                Post your fits, tag your items, and earn by sharing your closet with your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Showcase */}
      <section className="py-12 sm:py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1727859452051-cc042ba1609a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbG9va2Jvb2slMjBkaXZlcnNlJTIwd29tZW58ZW58MXx8fHwxNzcwNTI4NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Fashion lookbook"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 sm:p-6">
                <div>
                  <div className="font-black text-lg sm:text-xl mb-1 text-white">Share Your Fits</div>
                  <div className="text-xs sm:text-sm text-gray-300">Post & inspire others</div>
                </div>
              </div>
            </div>

            <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1764583473832-0a439620990f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXN0aGV0aWMlMjBjbG90aGluZyUyMHRyZW5keSUyMG91dGZpdHxlbnwxfHx8fDE3NzA1Mjg3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Trendy outfit"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 sm:p-6">
                <div>
                  <div className="font-black text-lg sm:text-xl mb-1 text-white">Discover Trends</div>
                  <div className="text-xs sm:text-sm text-gray-300">See what's hot on campus</div>
                </div>
              </div>
            </div>

            <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden group sm:col-span-2 lg:col-span-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1765766600589-ddad380d6534?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YXJkcm9iZSUyMG9yZ2FuaXplZCUyMGNsb3RoZXN8ZW58MXx8fHwxNzcwNTI4NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Organized wardrobe"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 sm:p-6">
                <div>
                  <div className="font-black text-lg sm:text-xl mb-1 text-white">Organize Your Closet</div>
                  <div className="text-xs sm:text-sm text-gray-300">Digitize & monetize</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why REVE Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 sm:space-y-6">
          <div className={`inline-block px-3 sm:px-4 py-2 ${isDark ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30' : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300'} rounded-full text-xs sm:text-sm border transition-colors duration-300`}>
            💜 Why REVE?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            More than just borrowing clothes
          </h2>
          <p className={`text-sm sm:text-base lg:text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed transition-colors duration-300`}>
            REVE is where fashion meets community. With <span className="text-purple-400 font-semibold">.edu verification</span>, you're only connecting with verified students from your campus. Get <span className="text-pink-400 font-semibold">3 free borrows</span>, then unlock unlimited access to an entire campus wardrobe. Rate lenders and borrowers Airbnb-style, ensuring quality and trust in every exchange.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8">
            <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border rounded-2xl p-5 sm:p-6 text-left transition-all duration-300`}>
              <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400 mb-3" />
              <div className="font-black text-base sm:text-lg mb-2">Earn While You Share</div>
              <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm transition-colors duration-300`}>
                List your items and set your own prices. We only take a 7% commission—the rest is yours.
              </div>
            </div>
            <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border rounded-2xl p-5 sm:p-6 text-left transition-all duration-300`}>
              <Instagram className="w-7 h-7 sm:w-8 sm:h-8 text-pink-400 mb-3" />
              <div className="font-black text-base sm:text-lg mb-2">Social Fashion Feed</div>
              <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm transition-colors duration-300`}>
                Show off your fits, get inspired, and build your personal style brand on campus.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 lg:py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black">
            Ready to revolutionize
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">
              your campus closet?
            </span>
          </h2>
          <p className={`text-base sm:text-lg lg:text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
            Join 2,500+ college women already on the waitlist
          </p>
          <button 
            onClick={() => scrollToSection('waitlist')}
            className="w-full sm:w-auto px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-base sm:text-lg text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Join the Waitlist
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDark ? 'border-white/10' : 'border-gray-200'} border-t py-8 sm:py-12 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text mb-2">
                REVE
              </div>
              <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                © 2026 Reve • Made for college women, by college women
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className={`w-10 h-10 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'} border rounded-full flex items-center justify-center transition-colors`}>
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className={`w-10 h-10 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'} border rounded-full flex items-center justify-center transition-colors`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
