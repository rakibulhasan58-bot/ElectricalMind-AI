import React, { useState } from 'react';
import { CalculationTool } from '../types';

interface CalculatorCardProps {
  tool: CalculationTool;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ tool }) => {
  const [inputs, setInputs] = useState<Record<string, number>>({});
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
              {input.label} ({input.unit})
            </label>
            <input
              type="number"
              placeholder="0"
              className="bg-circuit-900 border border-circuit-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-electric-500 transition-colors"
              onChange={(e) => handleInputChange(input.name, e.target.value)}
            />
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
              {result.result.toFixed(4)} <span className="text-sm">{result.unit}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono border-t border-circuit-800 pt-2">
            {result.steps}
          </p>
        </div>
      )}
    </div>
  );
};

export default CalculatorCard;