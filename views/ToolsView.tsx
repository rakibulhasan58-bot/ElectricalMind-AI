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
    id: 'transformer_load',
    name: "Transformer Analysis",
    description: "Calculate Load (kVA) & Core Losses (Hysteresis/Eddy).",
    category: 'Power',
    inputs: [
      { name: 'v', label: 'Voltage (Line)', unit: 'V' },
      { name: 'i', label: 'Current', unit: 'A' },
      { name: 'pf', label: 'Power Factor', unit: '0-1' },
      { 
        name: 'ph', 
        label: 'System Phase', 
        options: [
          { label: '3-Phase', value: 3 },
          { label: '1-Phase', value: 1 }
        ]
      },
      // Core Loss Inputs
      { name: 'f', label: 'Frequency', unit: 'Hz' },
      { name: 'b', label: 'Flux Density (Bm)', unit: 'T' },
      { name: 'mass', label: 'Core Mass', unit: 'kg' },
      { name: 'kh', label: 'Hysteresis Coeff', unit: 'typ 0.01' },
      { name: 'ke', label: 'Eddy Coeff', unit: 'typ 0.001' },
      { name: 'n', label: 'Steinmetz Exp', unit: 'typ 1.6' }
    ],
    calculate: (v) => {
      // Load Analysis
      const isThreePhase = v.ph === 3;
      const factor = isThreePhase ? Math.sqrt(3) : 1;
      const s = (factor * v.v * v.i) / 1000; // kVA
      const p = s * v.pf; // kW
      const q = s * Math.sqrt(1 - Math.pow(Math.min(v.pf, 1), 2)); // kVAR

      // Core Loss Analysis (Steinmetz)
      // Defaults if not provided to avoid 0 result issues for valid inputs
      const f = v.f || 50; 
      const b = v.b || 0; 
      const mass = v.mass || 0;
      const kh = v.kh || 0.01; 
      const ke = v.ke || 0.001; 
      const n_exp = v.n || 1.6;

      // Hysteresis Loss Ph = Kh * f * B^n * Mass
      const ph_loss = kh * f * Math.pow(b, n_exp) * mass;
      // Eddy Current Loss Pe = Ke * f^2 * B^2 * Mass
      const pe_loss = ke * Math.pow(f, 2) * Math.pow(b, 2) * mass;
      const core_total = ph_loss + pe_loss;

      return {
        result: s,
        unit: 'kVA',
        steps: `LOAD ANALYSIS:\nApparent Power (S): ${s.toFixed(2)} kVA\nReal Power (P): ${p.toFixed(2)} kW\nReactive Power (Q): ${q.toFixed(2)} kVAR\n\nCORE LOSS ANALYSIS:\nInputs: f=${f}Hz, B=${b}T, Mass=${mass}kg\nConstants: Kh=${kh}, Ke=${ke}, n=${n_exp}\n\nHysteresis Loss: ${ph_loss.toFixed(2)} W\nEddy Current Loss: ${pe_loss.toFixed(2)} W\nTotal Core Loss: ${core_total.toFixed(2)} W`
      };
    }
  },
  {
    id: 'transformer_eff',
    name: "Transformer Efficiency",
    description: "Calculate efficiency at Full & Half Load.",
    category: 'Power',
    inputs: [
      { name: 'kva', label: 'Rated Power', unit: 'kVA' },
      { name: 'wi', label: 'Core Loss (Wi)', unit: 'W' },
      { name: 'wc', label: 'F.L. Copper Loss (Wc)', unit: 'W' },
      { name: 'pf', label: 'Power Factor', unit: '0-1' },
    ],
    calculate: (v) => {
      const kva = v.kva;
      const wi = v.wi;
      const wc = v.wc;
      const pf = v.pf;

      // Full Load (x=1)
      const out_fl = kva * 1000 * pf;
      const loss_fl = wi + wc;
      const in_fl = out_fl + loss_fl;
      const eff_fl = in_fl > 0 ? (out_fl / in_fl) * 100 : 0;

      // Half Load (x=0.5)
      const out_hl = 0.5 * kva * 1000 * pf;
      const loss_hl = wi + (0.25 * wc);
      const in_hl = out_hl + loss_hl;
      const eff_hl = in_hl > 0 ? (out_hl / in_hl) * 100 : 0;

      return {
        result: eff_fl,
        unit: '% (Full Load)',
        steps: `Full Load (x=1):\nOutput = ${(out_fl/1000).toFixed(2)} kW\nLosses = ${wi} + ${wc} = ${loss_fl.toFixed(2)} W\nη = ${eff_fl.toFixed(2)}%\n\nHalf Load (x=0.5):\nOutput = ${(out_hl/1000).toFixed(2)} kW\nLosses = ${wi} + 0.25 × ${wc} = ${loss_hl.toFixed(2)} W\nη = ${eff_hl.toFixed(2)}%`
      };
    }
  },
  {
    id: 'arc_flash',
    name: "Arc Flash Hazard",
    description: "Est. Incident Energy (Ralph Lee) & PPE Category (NFPA 70E).",
    category: 'Power',
    inputs: [
      { name: 'v', label: 'Sys. Voltage', unit: 'kV' },
      { name: 'i', label: 'Fault Current', unit: 'kA' },
      { name: 't', label: 'Arc Duration', unit: 's' },
      { name: 'd', label: 'Work Distance', unit: 'mm' }, 
    ],
    calculate: (val) => {
        // Ralph Lee Theoretical Max Power Model (Conservative)
        // E (cal/cm2) = 512,000 * V(kV) * I(kA) * t(s) / D(mm)^2
        const v = val.v;
        const i = val.i;
        const t = val.t;
        // Default distance to 455mm (18 inches) if 0/undefined to avoid division by zero
        const d = val.d || 455; 

        const k = 512000;
        const energy = (k * v * i * t) / (d * d);
        
        // Arc Flash Boundary (Db) where Energy = 1.2 cal/cm2
        // 1.2 = (k * v * i * t) / Db^2  => Db = sqrt((k * v * i * t) / 1.2)
        const boundary = energy > 0 ? Math.sqrt((k * v * i * t) / 1.2) : 0;

        // Determine PPE Category (Approximate NFPA 70E Guide)
        let ppe = "Cat 0 (No Hazard)";
        if (energy > 40) ppe = "DANGEROUS (>40 cal) - NO SAFE PPE";
        else if (energy > 25) ppe = "Category 4 (Min 40 cal/cm²)";
        else if (energy > 8) ppe = "Category 3 (Min 25 cal/cm²)";
        else if (energy > 4) ppe = "Category 2 (Min 8 cal/cm²)";
        else if (energy > 1.2) ppe = "Category 1 (Min 4 cal/cm²)";
        
        return {
            result: energy,
            unit: 'cal/cm²',
            steps: `Method: Ralph Lee (Theoretical Max Power)\nFormula: E = 512,000 × V × Ibf × t / D²\n\nInputs:\nV=${v}kV, I=${i}kA, t=${t}s, D=${d}mm\n\nResults:\nIncident Energy: ${energy.toFixed(2)} cal/cm²\nArc Flash Boundary (1.2 cal): ${boundary.toFixed(0)} mm\n\nPPE Requirement: ${ppe}`
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
      const phaseDeg = Math.atan2(reactance, v.r) * (180 / Math.PI);

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
    description: "Calculate Z, Phase & Resonance (Parallel R||L||C).",
    category: 'Components',
    inputs: [
      { name: 'r', label: 'Resistance', unit: 'Ω' },
      { name: 'l', label: 'Inductance', unit: 'H' },
      { name: 'c', label: 'Capacitance', unit: 'F' },
      { name: 'f', label: 'Frequency', unit: 'Hz' },
    ],
    calculate: (v) => {
      const omega = 2 * Math.PI * v.f;
      // Safety checks for 0 inputs (treating 0 as Component Not Present/Open for parallel)
      const xl = (omega * v.l) || 0;
      const xc = (v.c > 0 && omega > 0) ? 1 / (omega * v.c) : 0;
      
      // Susceptance (B) and Conductance (G)
      // For parallel, R=0 input typically implies "No Resistor" (Open), so G=0. 
      // Physical R=0 (Short) would result in Z=0. We assume the former for calculator usability.
      const g = v.r > 0 ? 1 / v.r : 0;
      const bl = xl > 0 ? 1 / xl : 0;
      const bc = xc > 0 ? 1 / xc : 0;
      
      // Net Susceptance B = Bc - Bl (Convention: Capacitive is positive B, Inductive is negative B)
      const b_net = bc - bl;
      
      // Total Admittance Y = sqrt(G^2 + B^2)
      const y = Math.sqrt(g * g + b_net * b_net);
      
      // Total Impedance Z = 1 / Y
      const z = y > 0 ? 1 / y : 0;
      
      // Resonance Frequency = 1 / (2π√(LC))
      const fr = (v.l > 0 && v.c > 0) ? 1 / (2 * Math.PI * Math.sqrt(v.l * v.c)) : 0;
      
      // Phase Angle = -arctan(B/G)
      // Note: If circuit is capacitive (Bc > Bl), B_net > 0. Phase Y is positive. Phase Z is negative (Current leads Voltage).
      const phaseY = Math.atan2(b_net, g);
      const phaseZDeg = -phaseY * (180 / Math.PI);

      return {
        result: z,
        unit: 'Ω',
        steps: `XL = ${xl.toFixed(2)} Ω\nXC = ${xc.toFixed(2)} Ω\n\nResonance Freq: ${fr.toFixed(2)} Hz\nPhase Angle: ${phaseZDeg.toFixed(2)}°\n\nAdmittance (Y): ${y.toExponential(4)} S`
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