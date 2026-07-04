import { useState } from 'react';
import { learningModules } from '../data/mockData';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', ...new Set(learningModules.map(m => m.category))];
  const filtered = selectedCategory === 'all' ? learningModules : learningModules.filter(m => m.category === selectedCategory);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold">Learn</h1>
        <p className="text-gray-400 text-sm mt-1">Master trading with AI signals</p>
      </div>

      {/* Beginner Banner */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎓</span>
          <div>
            <h3 className="font-bold">Beginner? Start Here</h3>
            <p className="text-xs text-gray-400 mt-0.5">Learn the basics of AI signals and how to use them wisely</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${selectedCategory === cat ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-gray-800 text-gray-400'}`}>
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Modules */}
      <div className="space-y-3">
        {filtered.map(module => (
          <div key={module.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-cyan-500/30 transition cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{module.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{module.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{module.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{module.category}</span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {module.duration}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" /> Quick Tips
        </h3>
        <div className="space-y-3">
          {[
            'Always check the confidence score before acting on a signal',
            'Use stop-losses — they protect your capital when markets move against you',
            'When SignalAnalyst AI says "No Signal", it means patience is the best trade',
            'Start with the Free plan to understand how signals work',
            'Multi-timeframe analysis gives you a bigger picture view',
            'Never risk more than you can afford to lose on a single trade',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-cyan-400 text-xs font-bold mt-0.5">{i + 1}.</span>
              <p className="text-sm text-gray-300">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Disclaimer */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
        <p className="text-xs text-amber-400/80">
          ⚠️ <strong>Risk Disclaimer:</strong> Trading involves significant risk. AI signals are for informational purposes only and should not be considered financial advice. Past performance does not guarantee future results. Always do your own research.
        </p>
      </div>
    </div>
  );
}
