import React from 'react';
import CalculatorCard from '../components/CalculatorCard';
import { CalculationTool } from '../types';

const tools: CalculationTool[] = [
  {
    id: 'ohm',
    name: "Ohm's Law (Find V)",
    description: "Calculate Voltage given Current and Resistance.",
    category: 'Basic',
    inputs: [
      { name: 'i', label: 'Current', unit: 'A' },
      { name: 'r', label: 'Resistance', unit: 'Ω' },
    ],
    calculate: (v) => ({
      result: v.i * v.r,
      unit: 'V',
      steps: `V = I × R = ${v.i} × ${v.r}`
    })
  },
  {
    id: 'power_dc',
    name: "DC Power Calculator",
    description: "Calculate Power given Voltage and Current.",
    category: 'Power',
    inputs: [
      { name: 'v', label: 'Voltage', unit: 'V' },
      { name: 'i', label: 'Current', unit: 'A' },
    ],
    calculate: (v) => ({
      result: v.v * v.i,
      unit: 'W',
      steps: `P = V × I = ${v.v} × ${v.i}`
    })
  },
  {
    id: 'res_parallel',
    name: "Parallel Resistors (2)",
    description: "Calculate equivalent resistance of two parallel resistors.",
    category: 'Basic',
    inputs: [
      { name: 'r1', label: 'R1', unit: 'Ω' },
      { name: 'r2', label: 'R2', unit: 'Ω' },
    ],
    calculate: (v) => {
      const denom = v.r1 + v.r2;
      const res = denom === 0 ? 0 : (v.r1 * v.r2) / denom;
      return {
        result: res,
        unit: 'Ω',
        steps: `Req = (R1 × R2) / (R1 + R2) = (${v.r1} × ${v.r2}) / (${v.r1} + ${v.r2})`
      };
    }
  },
  {
    id: 'cap_energy',
    name: "Capacitor Energy",
    description: "Energy stored in a capacitor.",
    category: 'Components',
    inputs: [
      { name: 'c', label: 'Capacitance', unit: 'F' },
      { name: 'v', label: 'Voltage', unit: 'V' },
    ],
    calculate: (v) => ({
      result: 0.5 * v.c * Math.pow(v.v, 2),
      unit: 'J',
      steps: `E = ½ × C × V² = 0.5 × ${v.c} × ${v.v}²`
    })
  },
  {
    id: 'freq_period',
    name: "Frequency ↔ Period",
    description: "Calculate Frequency from Period.",
    category: 'Basic',
    inputs: [
      { name: 't', label: 'Period', unit: 's' }
    ],
    calculate: (v) => {
        const res = v.t === 0 ? 0 : 1/v.t;
        return {
            result: res,
            unit: 'Hz',
            steps: `f = 1 / T = 1 / ${v.t}`
        }
    }
  },
  {
      id: 'reactance_c',
      name: "Capacitive Reactance",
      description: "Opposition to current flow in a capacitor.",
      category: 'Components',
      inputs: [
          { name: 'f', label: 'Frequency', unit: 'Hz' },
          { name: 'c', label: 'Capacitance', unit: 'F' }
      ],
      calculate: (v) => {
          const val = 2 * Math.PI * v.f * v.c;
          const res = val === 0 ? 0 : 1 / val;
          return {
              result: res,
              unit: 'Ω',
              steps: `Xc = 1 / (2πfC)`
          }
      }
  }
];

const ToolsView: React.FC = () => {
  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto bg-circuit-950">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Engineering Toolbox</h2>
        <p className="text-slate-400">Offline-capable calculation tools for rapid design and verification.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <CalculatorCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default ToolsView;