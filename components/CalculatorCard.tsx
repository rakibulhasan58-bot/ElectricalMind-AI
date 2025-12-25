import React, { useState } from 'react';
import { CalculationTool } from '../types';

interface CalculatorCardProps {
  tool: CalculationTool;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ tool }) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    tool.inputs.forEach(input => {
      if (input.options && input.options.length > 0) {
        defaults[input.name] = input.options[0].value.toString();
      } else {
        defaults[input.name] = '';
      }
    });
    return defaults;
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ result: number; unit: string; steps: string } | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  // Animation state key to force re-render animation
  const [resultKey, setResultKey] = useState(0);

  const handleInputChange = (name: string, value: string) => {
    setInputValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCalculate = () => {
    const numericValues: Record<string, number> = {};
    const newErrors: Record<string, string> = {};
    let hasError = false;

    tool.inputs.forEach(input => {
      const val = inputValues[input.name];
      if (input.options) {
        numericValues[input.name] = parseFloat(val);
      } else {
        if (!val || val.trim() === '') {
          newErrors[input.name] = 'Required';
          hasError = true;
        } else {
          const num = Number(val);
          if (isNaN(num)) {
            newErrors[input.name] = 'Invalid';
            hasError = true;
          } else {
            numericValues[input.name] = num;
          }
        }
      }
    });

    if (hasError) {
      setErrors(newErrors);
      setResult(null);
    } else {
      setErrors({});
      setResult(tool.calculate(numericValues));
      setResultKey(prev => prev + 1); // Trigger animation
      setShowSteps(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 shadow-lg hover:shadow-electric-500/10 hover:border-electric-500/30 transition-all duration-300 flex flex-col h-full group">
      <div className="mb-6 pb-4 border-b border-white/5">
        <h3 className="text-lg font-bold text-white group-hover:text-electric-400 transition-colors">{tool.name}</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tool.description}</p>
      </div>

      <div className="space-y-5 flex-grow">
        {tool.inputs.map((input) => (
          <div key={input.name} className="relative group/input">
            <label className="text-[10px] font-bold text-electric-500 uppercase tracking-wider mb-1 block">
              {input.label} {input.unit ? `(${input.unit})` : ''}
            </label>
            {input.options ? (
               <div className="relative">
                 <select
                   className="w-full appearance-none bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-all cursor-pointer"
                   onChange={(e) => handleInputChange(input.name, e.target.value)}
                   value={inputValues[input.name]}
                 >
                   {input.options.map(opt => (
                     <option key={opt.label} value={opt.value} className="bg-circuit-900">{opt.label}</option>
                   ))}
                 </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-electric-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
               </div>
            ) : (
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  className={`w-full bg-black/20 border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 transition-all placeholder-slate-600 ${
                    errors[input.name] 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' 
                      : 'border-white/10 focus:border-electric-500 focus:ring-electric-500'
                  }`}
                  onChange={(e) => handleInputChange(input.name, e.target.value)}
                  value={inputValues[input.name]}
                />
                {errors[input.name] && (
                  <span className="absolute right-0 -bottom-4 text-red-400 text-[10px] font-medium">
                    {errors[input.name]}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleCalculate}
        className="w-full mt-8 bg-gradient-to-r from-electric-600 to-electric-500 hover:from-electric-500 hover:to-electric-400 text-white font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-electric-900/20 active:scale-[0.98]"
      >
        Calculate
      </button>

      {result && (
        <div key={resultKey} className="mt-6 animate-fade-in-up">
          <div className="p-4 bg-gradient-to-br from-circuit-800 to-black rounded-lg border border-electric-500/20 relative overflow-hidden">
             {/* Glow effect behind result */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-electric-500/20 blur-xl rounded-full"></div>
             
             <div className="relative z-10 text-center">
                <div className="text-slate-400 text-xs uppercase tracking-widest mb-1">Result</div>
                <div className="text-3xl font-mono font-bold text-white drop-shadow-md">
                  {result.result.toExponential(4).replace('e+0', '')}
                  <span className="text-sm text-electric-400 ml-1">{result.unit}</span>
                </div>
             </div>
          </div>
          
          <div className="mt-2 text-center">
            <button 
              onClick={() => setShowSteps(!showSteps)}
              className="text-[10px] uppercase tracking-wide font-bold text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              {showSteps ? 'Hide Calculation' : 'Show Calculation'}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className={`w-3 h-3 transform transition-transform ${showSteps ? 'rotate-180' : ''}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          {showSteps && (
            <div className="mt-3 p-3 bg-black/30 rounded border border-white/5 animate-fade-in-up">
              <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                {result.steps}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculatorCard;