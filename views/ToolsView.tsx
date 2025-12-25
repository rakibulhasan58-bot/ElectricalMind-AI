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
    id: 'dc_motor',
    name: "DC Motor Calculator",
    description: "Calculate Speed, Torque & Power (Ideal).",
    category: 'Power',
    inputs: [
      { name: 'v', label: 'Voltage', unit: 'V' },
      { name: 'i', label: 'Current', unit: 'A' },
      { name: 'kt', label: 'Motor Constant (Kt)', unit: 'Nm/A' },
    ],
    calculate: (val) => {
      const torque = val.kt * val.i;
      // w (rad/s) = V / Kt (assuming ideal E=V)
      const w = val.kt > 0 ? val.v / val.kt : 0;
      const rpm = w * 9.54929658551; // 60 / 2pi
      const power = val.v * val.i;

      return {
        result: rpm,
        unit: 'RPM',
        steps: `Speed: ${rpm.toFixed(1)} RPM\nTorque: ${torque.toFixed(4)} Nm\nPower: ${power.toFixed(2)} W`
      };
    }
  },
  {
    id: 'transformer_ideal',
    name: "Ideal Transformer",
    description: "Calculate Secondary Voltage & Current from Ratio.",
    category: 'Power',
    inputs: [
      { name: 'vp', label: 'Primary Voltage', unit: 'V' },
      { name: 'ip', label: 'Primary Current', unit: 'A' },
      { name: 'n', label: 'Turns Ratio (Np/Ns)', unit: '' },
    ],
    calculate: (v) => {
      // Vs = Vp / N
      // Is = Ip * N (Power conservation Vp*Ip = Vs*Is -> Vp*Ip = (Vp/N)*Is -> Is = Ip*N)
      const vs = v.n === 0 ? 0 : v.vp / v.n;
      const is = v.ip * v.n;
      return {
        result: vs,
        unit: 'V',
        steps: `Secondary Voltage (Vs) = Vp / N = ${v.vp} / ${v.n} = ${vs.toFixed(2)} V\nSecondary Current (Is) = Ip × N = ${v.ip} × ${v.n} = ${is.toFixed(2)} A`
      };
    }
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
  },
  {
    id: 'rlc_series',
    name: "RLC Series Circuit",
    description: "Calculate Impedance, Phase & Resonance (Series).",
    category: 'Components',
    inputs: [
      { name: 'r', label: 'Resistance', unit: 'Ω' },
      { name: 'l', label: 'Inductance', unit: 'H' },
      { name: 'c', label: 'Capacitance', unit: 'F' },
      { name: 'f', label: 'Frequency', unit: 'Hz' },
    ],
    calculate: (v) => {
      const omega = 2 * Math.PI * v.f;
      const xl = omega * v.l;
      const xc = v.c > 0 ? 1 / (omega * v.c) : 0;
      const reactance = xl - xc;
      const z = Math.sqrt(v.r * v.r + reactance * reactance);
      
      const fr = (v.l > 0 && v.c > 0) ? 1 / (2 * Math.PI * Math.sqrt(v.l * v.c)) : 0;
      const phaseRad = Math.atan2(reactance, v.r);
      const phaseDeg = phaseRad * (180 / Math.PI);

      return {
        result: z,
        unit: 'Ω',
        steps: `XL = ${xl.toFixed(2)}Ω, XC = ${xc.toFixed(2)}Ω\nZ = √[R² + (XL-XC)²]\n\nPhase Angle: ${phaseDeg.toFixed(2)}°\nResonance Freq: ${fr.toFixed(2)} Hz`
      };
    }
  },
  {
    id: 'rlc_parallel',
    name: "RLC Parallel Circuit",
    description: "Calculate Impedance, Phase & Resonance (Parallel).",
    category: 'Components',
    inputs: [
      { name: 'r', label: 'Resistance', unit: 'Ω' },
      { name: 'l', label: 'Inductance', unit: 'H' },
      { name: 'c', label: 'Capacitance', unit: 'F' },
      { name: 'f', label: 'Frequency', unit: 'Hz' },
    ],
    calculate: (v) => {
      const omega = 2 * Math.PI * v.f;
      const xl = omega * v.l;
      const xc = v.c > 0 ? 1 / (omega * v.c) : 0;
      
      // Susceptance (B) and Conductance (G)
      const g = v.r > 0 ? 1 / v.r : 0;
      const bl = xl > 0 ? 1 / xl : 0;
      const bc = xc > 0 ? 1 / xc : 0;
      
      // Total Admittance Y = sqrt(G^2 + (Bc - Bl)^2)
      // Convention: Bc leads, Bl lags. B_net = Bc - Bl
      const b_net = bc - bl;
      const y = Math.sqrt(g * g + b_net * b_net);
      
      const z = y > 0 ? 1 / y : 0;
      
      const fr = (v.l > 0 && v.c > 0) ? 1 / (2 * Math.PI * Math.sqrt(v.l * v.c)) : 0;
      
      // Phase of Impedance (Z) is negative of Phase of Admittance (Y)
      // Theta_Y = atan(B_net / G)
      const phaseY = Math.atan2(b_net, g);
      const phaseZDeg = -phaseY * (180 / Math.PI);

      return {
        result: z,
        unit: 'Ω',
        steps: `XL=${xl.toFixed(1)}Ω, XC=${xc.toFixed(1)}Ω\nAdmittance (Y)=${y.toFixed(4)} S\n\nPhase (Z): ${phaseZDeg.toFixed(2)}°\nResonance Freq: ${fr.toFixed(2)} Hz`
      };
    }
  },
  {
    id: 'unit_converter',
    name: "Metric Unit Converter",
    description: "Convert between metric prefixes (e.g. mV to V, mA to A).",
    category: 'Basic',
    inputs: [
      { name: 'val', label: 'Value' },
      { 
        name: 'from', 
        label: 'From Prefix', 
        options: [
            { label: 'Pico (p)', value: 1e-12 },
            { label: 'Nano (n)', value: 1e-9 },
            { label: 'Micro (µ)', value: 1e-6 },
            { label: 'Milli (m)', value: 1e-3 },
            { label: 'Base Unit', value: 1 },
            { label: 'Kilo (k)', value: 1e3 },
            { label: 'Mega (M)', value: 1e6 },
            { label: 'Giga (G)', value: 1e9 },
        ] 
      },
      { 
        name: 'to', 
        label: 'To Prefix', 
        options: [
            { label: 'Pico (p)', value: 1e-12 },
            { label: 'Nano (n)', value: 1e-9 },
            { label: 'Micro (µ)', value: 1e-6 },
            { label: 'Milli (m)', value: 1e-3 },
            { label: 'Base Unit', value: 1 },
            { label: 'Kilo (k)', value: 1e3 },
            { label: 'Mega (M)', value: 1e6 },
            { label: 'Giga (G)', value: 1e9 },
        ] 
      },
    ],
    calculate: (v) => {
        const factor = v.from / v.to;
        const res = v.val * factor;
        return {
            result: res,
            unit: 'Units',
            steps: `Result = ${v.val} × (${v.from.toExponential()} / ${v.to.toExponential()})\nMultiplier: ${factor.toExponential()}`
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