import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { supportedLanguages } from '../data/mockData';
import { ArrowRight, Check } from 'lucide-react';

const slides = [
  { emoji: '📊', title: 'AI-Powered Signals', desc: 'Get confidence-based trading signals for crypto, gold, oil, and silver — powered by a hybrid engine of technical analysis and AI.' },
  { emoji: '🛡️', title: 'Honest & Transparent', desc: 'We tell you when there\'s no safe setup. Our system prioritizes your safety over generating forced signals.' },
  { emoji: '🔄', title: 'Safer Alternatives', desc: 'When a specific asset has no clear setup, we suggest better opportunities with higher confidence scores.' },
  { emoji: '🌐', title: 'Your Language', desc: 'Use SignalAnalyst AI in your preferred language. Signals, explanations, and the entire experience — localized for you.' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState('en');
  const { setLanguage, user } = useApp();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      setLanguage(selectedLang);
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    setLanguage(selectedLang);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${i === step ? 'w-8 bg-cyan-400' : i < step ? 'w-8 bg-gray-600' : 'w-4 bg-gray-700'}`} />
          ))}
        </div>
        <button onClick={handleSkip} className="text-sm text-gray-500 hover:text-gray-300">Skip</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
        {step < slides.length - 1 ? (
          <>
            <span className="text-6xl mb-6">{slides[step].emoji}</span>
            <h2 className="text-2xl font-bold mb-3">{slides[step].title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{slides[step].desc}</p>
          </>
        ) : (
          <>
            <span className="text-6xl mb-6">🌐</span>
            <h2 className="text-2xl font-bold mb-3">Select Your Language</h2>
            <p className="text-gray-400 text-sm mb-6">Choose your preferred language for signals and explanations</p>
            <div className="w-full grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {supportedLanguages.map(lang => (
                <button key={lang.code} onClick={() => setSelectedLang(lang.code)} className={`flex items-center gap-2 p-3 rounded-xl border transition text-left ${selectedLang === lang.code ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'}`}>
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                  {selectedLang === lang.code && <Check className="w-4 h-4 text-cyan-400 ml-auto" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="py-4 space-y-3">
        <button onClick={handleNext} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition">
          {step < slides.length - 1 ? 'Next' : 'Start Trading'} <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-center text-xs text-gray-600">Welcome, {user?.name || 'Trader'}! 🎉</p>
      </div>
    </div>
  );
}
