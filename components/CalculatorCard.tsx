import React, { useState } from 'react';
import { CalculationTool } from '../types';

interface CalculatorCardProps {
  tool: CalculationTool;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ tool }) => {
  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    // Initialize default values for select inputs
    const defaults: Record<string, number> = {};
    tool.inputs.forEach(input => {
      if (input.options && input.options.length > 0) {
        defaults[input.name] = input.options[0].value;
      }
    });
    return defaults;
  });
  
  const [result, setResult] = useState<{ result: number; unit: string; steps: string } | null>(null);

  const handleInputChange = (name: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleCalculate = () => {
    const res = tool.calculate(inputs);
    setResult(res);
  };

  return (
    <div className="bg-circuit-800 border border-circuit-700 rounded-xl p-6 shadow-lg hover:shadow-electric-900/20 transition-all">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">{tool.name}</h3>
        <p className="text-sm text-slate-400">{tool.description}</p>
      </div>

      <div className="space-y-4">
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
                   value={inputs[input.name]}
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
              <input
                type="number"
                placeholder="0"
                className="bg-circuit-900 border border-circuit-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-electric-500 transition-colors"
                onChange={(e) => handleInputChange(input.name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleCalculate}
        className="w-full mt-6 bg-electric-600 hover:bg-electric-500 text-white font-semibold py-2 rounded-lg transition-colors active:transform active:scale-95"
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
          <p className="text-xs text-slate-500 font-mono border-t border-circuit-800 pt-2 whitespace-pre-wrap">
            {result.steps}
          </p>
        </div>
      )}
    </div>
  );
};

export default CalculatorCard;