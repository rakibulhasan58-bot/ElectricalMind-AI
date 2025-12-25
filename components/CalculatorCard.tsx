import React, { useState } from 'react';
import { CalculationTool } from '../types';

interface CalculatorCardProps {
  tool: CalculationTool;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ tool }) => {
  // Store inputs as strings to allow typing (e.g., "0." or "-") and validate later
  const [inputValues, setInputValues] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    tool.inputs.forEach(input => {
      if (input.options && input.options.length > 0) {
        defaults[input.name] = input.options[0].value.toString();
      } else {
        defaults[input.name] = ''; // Initialize empty for text inputs
      }
    });
    return defaults;
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ result: number; unit: string; steps: string } | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user types
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
        // Dropdown inputs are safe, just parse
        numericValues[input.name] = parseFloat(val);
      } else {
        // Text inputs validation
        if (!val || val.trim() === '') {
          newErrors[input.name] = 'Value required';
          hasError = true;
        } else {
          // Strict number check
          const num = Number(val);
          if (isNaN(num)) {
            newErrors[input.name] = 'Invalid number';
            hasError = true;
          } else {
            numericValues[input.name] = num;
          }
        }
      }
    });

    if (hasError) {
      setErrors(newErrors);
      setResult(null); // Clear result if validation fails
    } else {
      setErrors({});
      // Execute calculation with validated numbers
      setResult(tool.calculate(numericValues));
      // Keep showSteps state as is (user preference)
    }
  };

  return (
    <div className="bg-circuit-800 border border-circuit-700 rounded-xl p-6 shadow-lg hover:shadow-electric-900/20 transition-all flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">{tool.name}</h3>
        <p className="text-sm text-slate-400">{tool.description}</p>
      </div>

      <div className="space-y-4 flex-grow">
        {tool.inputs.map((input) => (
          <div key={input.name} className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-electric-400 uppercase tracking-wider">
              {input.label} {input.unit ? `(${input.unit})` : ''}
            </label>
            {input.options ? (
               <div className="relative">
                 <select
                   className="w-full appearance-none bg-circuit-900 border border-circuit-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-electric-500 transition-colors"
                   onChange={(e) => handleInputChange(input.name, e.target.value)}
                   value={inputValues[input.name]}
                 >
                   {input.options.map(opt => (
                     <option key={opt.label} value={opt.value}>{opt.label}</option>
                   ))}
                 </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
               </div>
            ) : (
              <div className="flex flex-col">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter value"
                  className={`bg-circuit-900 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors ${
                    errors[input.name] 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-circuit-700 focus:border-electric-500'
                  }`}
                  onChange={(e) => handleInputChange(input.name, e.target.value)}
                  value={inputValues[input.name]}
                />
                {errors[input.name] && (
                  <span className="text-red-400 text-xs mt-1 font-medium animate-pulse">
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
        className="w-full mt-6 bg-electric-600 hover:bg-electric-500 text-white font-semibold py-2 rounded-lg transition-colors active:transform active:scale-95 shadow-md shadow-electric-900/20"
      >
        Calculate
      </button>

      {result && (
        <div className="mt-4 p-4 bg-circuit-900 rounded-lg border border-circuit-700 animate-fade-in">
          <div className="flex justify-between items-end mb-2">
            <span className="text-slate-400 text-sm">Result:</span>
            <span className="text-2xl font-mono text-electric-400">
              {result.result.toExponential(4).replace('e+0', '')} <span className="text-sm">{result.unit}</span>
            </span>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => setShowSteps(!showSteps)}
              className="text-xs text-electric-500 hover:text-electric-400 flex items-center gap-1 transition-colors"
            >
              {showSteps ? 'Hide Steps' : 'Show Steps'}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className={`w-3 h-3 transform transition-transform ${showSteps ? 'rotate-180' : ''}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          {showSteps && (
            <div className="mt-2 pt-2 border-t border-circuit-800 animate-fade-in-down">
              <p className="text-xs text-slate-500 font-mono whitespace-pre-wrap leading-relaxed">
                {result.steps}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculatorCard;