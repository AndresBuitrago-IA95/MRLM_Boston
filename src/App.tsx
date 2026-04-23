/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis, LineChart, Line, ReferenceLine
} from 'recharts';
import { 
  Activity, Home, Database, BarChart3, Calculator, 
  CheckCircle2, AlertCircle, Info, ChevronRight, ChevronLeft,
  Settings, Zap, BookOpen, BrainCircuit, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Model Coefficients from PDF page 16
const COEFFICIENTS = {
  intercept: 34.712342,
  crim: -0.104843,
  zn: 0.036634,
  chas: 2.967868,
  nox: -20.314416,
  rm: 3.977104,
  dis: -1.429370,
  rad: 0.128761,
  ptratio: -1.014914,
  b: 0.009700,
  lstat: -0.528147
};

// Sample data extracted from the CSV provided in the prompt
const SAMPLE_DATA = [
  { CRIM: 0.00632, ZN: 18.0, INDUS: 2.31, CHAS: 0, NOX: 0.538, RM: 6.575, AGE: 65.2, DIS: 4.09, RAD: 1, TAX: 296, PTRATIO: 15.3, B: 396.9, LSTAT: 4.98, MEDV: 24.0 },
  { CRIM: 0.02731, ZN: 0.0, INDUS: 7.07, CHAS: 0, NOX: 0.469, RM: 6.421, AGE: 78.9, DIS: 4.9671, RAD: 2, TAX: 242, PTRATIO: 17.8, B: 396.9, LSTAT: 9.14, MEDV: 21.6 },
  { CRIM: 0.02729, ZN: 0.0, INDUS: 7.07, CHAS: 0, NOX: 0.469, RM: 7.185, AGE: 61.1, DIS: 4.9671, RAD: 2, TAX: 242, PTRATIO: 17.8, B: 392.83, LSTAT: 4.03, MEDV: 34.7 },
  { CRIM: 0.03237, ZN: 0.0, INDUS: 2.18, CHAS: 0, NOX: 0.458, RM: 6.998, AGE: 45.8, DIS: 6.0622, RAD: 3, TAX: 222, PTRATIO: 18.7, B: 394.63, LSTAT: 2.94, MEDV: 33.4 },
  { CRIM: 0.06905, ZN: 0.0, INDUS: 2.18, CHAS: 0, NOX: 0.458, RM: 7.147, AGE: 54.2, DIS: 6.0622, RAD: 3, TAX: 222, PTRATIO: 18.7, B: 396.9, LSTAT: 5.33, MEDV: 36.2 },
  { CRIM: 0.02985, ZN: 0.0, INDUS: 2.18, CHAS: 0, NOX: 0.458, RM: 6.43, AGE: 58.7, DIS: 6.0622, RAD: 3, TAX: 222, PTRATIO: 18.7, B: 394.12, LSTAT: 5.21, MEDV: 28.7 },
  { CRIM: 0.08829, ZN: 12.5, INDUS: 7.87, CHAS: 0, NOX: 0.524, RM: 6.012, AGE: 66.6, DIS: 5.5605, RAD: 5, TAX: 311, PTRATIO: 15.2, B: 395.6, LSTAT: 12.43, MEDV: 22.9 },
  { CRIM: 0.14455, ZN: 12.5, INDUS: 7.87, CHAS: 0, NOX: 0.524, RM: 6.172, AGE: 96.1, DIS: 5.9505, RAD: 5, TAX: 311, PTRATIO: 15.2, B: 396.9, LSTAT: 19.15, MEDV: 27.1 },
  { CRIM: 0.21124, ZN: 12.5, INDUS: 7.87, CHAS: 0, NOX: 0.524, RM: 5.631, AGE: 100.0, DIS: 6.0821, RAD: 5, TAX: 311, PTRATIO: 15.2, B: 386.63, LSTAT: 29.93, MEDV: 16.5 },
];

export default function App() {
  const [view, setView] = useState<'presentation' | 'guide'>('presentation');
  const [step, setStep] = useState(0);

  const presentationSteps = [
    { title: "Introducción y Contexto", icon: Globe, component: <IntroView /> },
    { title: "Base de Datos Boston Housing", icon: Database, component: <DatabaseView /> },
    { title: "Selección de Variables", icon: Settings, component: <SelectionView /> },
    { title: "Multicolinealidad (VIF & K)", icon: AlertCircle, component: <MulticollinearityView /> },
    { title: "El Modelo Final", icon: BrainCircuit, component: <FinalModelView /> },
    { title: "Verificación de Supuestos", icon: Activity, component: <AssumptionsView /> },
    { title: "Simulador Interactivo", icon: Calculator, component: <SimulatorView /> },
    { title: "Conclusiones y Recomendaciones", icon: CheckCircle2, component: <ConclusionView /> },
  ];

  const handleNext = () => setStep((prev) => Math.min(prev + 1, presentationSteps.length - 1));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 italic-none">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl text-white shadow-lg shadow-cyan-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Boston Housing Regression
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Data Analysis Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          <button 
            onClick={() => setView('presentation')}
            className={cn(
              "px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300",
              view === 'presentation' ? "bg-slate-800 text-cyan-400 shadow-inner border border-slate-700" : "text-slate-500 hover:text-slate-300"
            )}
          >
            Tablero Interactivo
          </button>
          <button 
            onClick={() => setView('guide')}
            className={cn(
              "px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300",
              view === 'guide' ? "bg-slate-800 text-cyan-400 shadow-inner border border-slate-700" : "text-slate-500 hover:text-slate-300"
            )}
          >
            Guía de Exposición
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <AnimatePresence mode="wait">
          {view === 'presentation' ? (
            <motion.div 
              key="presentation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Progress Stepper */}
              <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-3xl border border-slate-800 backdrop-blur-md overflow-x-auto gap-4 no-scrollbar">
                {presentationSteps.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setStep(idx)}
                      className={cn(
                        "flex flex-col items-center gap-2 min-w-[100px] group transition-all",
                        step === idx ? "text-cyan-400" : "text-slate-600 grayscale hover:grayscale-0 hover:text-slate-400"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                        step === idx ? "bg-cyan-500/10 border border-cyan-500/30" : "bg-slate-800 group-hover:bg-slate-700 border border-slate-700"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] uppercase font-black tracking-widest text-center max-w-[80px] leading-tight opacity-80">
                        {s.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* View Container */}
              <div className="min-h-[600px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {presentationSteps[step].component}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between mt-12 pb-10">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 font-bold hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Anterior
                </button>
                <div className="bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800 text-slate-500 font-mono text-[10px] tracking-widest self-center uppercase">
                  Fase {step + 1} / {presentationSteps.length}
                </div>
                <button
                  onClick={handleNext}
                  disabled={step === presentationSteps.length - 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:from-cyan-500 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <GuideView />
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="py-8 text-center text-slate-600 text-[10px] font-mono tracking-widest border-t border-slate-800 bg-slate-950">
        <p>© 2026 // LINEAR_REGRESSION_MODEL // BOSTON_DATA_LAB</p>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS FOR PRESENTATION ---

function IntroView() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-stretch">
      <div className="bento-card flex flex-col justify-center space-y-6">
        <header className="space-y-2">
          <span className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">Contexto Global</span>
          <h2 className="text-4xl font-extrabold text-white leading-tight italic-none">Factores Ambientales e Impacto en Valorización</h2>
        </header>
        <p className="text-slate-400 leading-relaxed text-sm">
          Análisis econométrico del área metropolitana de Boston para cuantificar cómo la polución (NOX) y la criminalidad (CRIM) devalúan el patrimonio inmobiliario.
        </p>
        <div className="grid gap-3 pt-2">
          {[
            { label: "Propósito", text: "Cuantificar beneficios intangibles." },
            { label: "Variable Objetivo", text: "MEDV: Valor Promedio de Vivienda." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                <Info className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">{item.label}</h4>
                <p className="text-slate-500 text-xs">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bento-card flex flex-col justify-between relative group overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Globe className="w-48 h-48 text-cyan-500" />
        </div>
        <h3 className="font-bold text-slate-300 mb-6 flex items-center gap-2 uppercase text-[10px] tracking-widest">
          <Home className="w-4 h-4 text-cyan-400" />
          Cartografía del Censo
        </h3>
        <div className="flex-grow bg-slate-950/50 rounded-2xl flex items-center justify-center border border-slate-800 p-8 shadow-inner">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto">
              <Globe className="w-8 h-8 text-cyan-500 animate-pulse" />
            </div>
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest leading-loose">Visualización Espacial<br/>Boston Metropolitan Area</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DatabaseView() {
  return (
    <div className="space-y-6">
      <div className="bento-card">
        <h2 className="text-lg font-bold text-white mb-2">Diccionario de Datos</h2>
        <p className="text-slate-500 text-xs mb-6">Variables explicativas críticas extraídas de la muestra original.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { color: "border-red-500/30 text-red-400 bg-red-500/5", code: "CRIM", label: "Crimen" },
            { color: "border-blue-500/30 text-blue-400 bg-blue-500/5", code: "ZN", label: "Zonificación" },
            { color: "border-slate-500/30 text-slate-400 bg-slate-500/5", code: "INDUS", label: "Industrial" },
            { color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5", code: "CHAS", label: "Río Charles" },
            { color: "border-purple-500/30 text-purple-400 bg-purple-500/5", code: "NOX", label: "Polución" },
            { color: "border-amber-500/30 text-amber-400 bg-amber-500/5", code: "RM", label: "Habitaciones" },
            { color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5", code: "DIS", label: "Distancia" },
            { color: "border-orange-500/30 text-orange-400 bg-orange-500/5", code: "PTRATIO", label: "Escolaridad" },
            { color: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5", code: "LSTAT", label: "Social" },
            { color: "bg-cyan-600 text-slate-950 border-cyan-400", code: "MEDV", label: "VALOR" },
          ].map((v, i) => (
            <div key={i} className={cn("p-3 rounded-xl border flex flex-col gap-1 transition-all hover:scale-105", v.color)}>
              <span className="text-sm font-black tracking-widest">{v.code}</span>
              <span className="text-[8px] font-bold uppercase opacity-60 tracking-tight">{v.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bento-card">
        <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-4">Estructura Transaccional</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse font-mono text-[10px]">
            <thead className="bg-slate-800/50">
              <tr>
                {Object.keys(SAMPLE_DATA[0]).slice(0, 10).map(k => (
                  <th key={k} className="px-4 py-3 text-slate-500 uppercase tracking-tighter border-b border-slate-800">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_DATA.slice(0, 6).map((row: any, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors border-b border-slate-900">
                  {Object.keys(row).slice(0, 10).map(k => (
                    <td key={k} className={cn("px-4 py-2 border-r border-slate-900/50", k === 'MEDV' ? "text-cyan-400 font-bold" : "text-slate-400")}>{row[k].toFixed(2)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SelectionView() {
  return (
    <div className="grid md:grid-cols-12 gap-8 items-stretch">
      <div className="md:col-span-7 bento-card space-y-6">
        <header>
          <h2 className="text-2xl font-bold text-white mb-2">Ingeniería de Características</h2>
          <p className="text-slate-400 text-sm">Proceso de depuración automatizado mediante Stepwise (AIC Minimization).</p>
        </header>
        
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Zap className="w-24 h-24 text-amber-500" />
          </div>
          <h4 className="font-bold text-amber-500 text-[9px] uppercase tracking-[0.2em] mb-4">Eliminación por Baja Significancia</h4>
          <div className="flex flex-wrap gap-3">
            {['AGE', 'INDUS', 'TAX'].map(v => (
              <div key={v} className="px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3">
                <span className="text-xs font-black text-slate-500 line-through tracking-widest">{v}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-[10px] mt-6 italic">
            * Se priorizó la estabilidad eliminando multicolinealidad estructural.
          </p>
        </div>
      </div>

      <div className="md:col-span-5 bento-card space-y-6 flex flex-col justify-between">
        <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">Sensibilidad RM vs MEDV</h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
              <XAxis type="number" dataKey="RM" name="Habitaciones" domain={[5, 8]} axisLine={false} tick={{fill: '#475569', fontSize: 10}} />
              <YAxis type="number" dataKey="MEDV" name="Valor" axisLine={false} tick={{fill: '#475569', fontSize: 10}} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{backgroundColor: '#0F172A', border: '1px solid #1E293B', fontSize: '10px'}} />
              <Scatter name="Casas" data={SAMPLE_DATA} fill="#06B6D4" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/10 text-center">
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Correlación Positiva Dominante</p>
        </div>
      </div>
    </div>
  );
}

function MulticollinearityView() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-stretch">
      <div className="bento-card space-y-8">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-red-500 rounded-full"></span>
          VIF: Inflación de Varianza
        </h3>
        <div className="space-y-6">
          {[
            { name: "RAD (Accesibilidad)", value: 6.86, danger: true },
            { name: "TAX (Impuestos)", value: 7.27, danger: true },
            { name: "CRIM (Criminalidad)", value: 1.78, danger: false },
            { name: "RM (Habitaciones)", value: 1.83, danger: false }
          ].map((v, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.name}</span>
                <span className={cn("font-mono text-xs", v.danger ? "text-red-400 font-bold" : "text-cyan-400")}>{v.value}</span>
              </div>
              <div className="h-1.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${v.value * 10}%` }}
                  className={cn("h-full rounded-full", v.danger ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]")} 
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-slate-600 font-mono italic text-center">Threshold Critical: VIF &gt; 5.0 indicates data redundancy.</p>
      </div>

      <div className="bento-card bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col justify-center items-center relative group">
        <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
        <div className="text-center space-y-6 z-10">
          <h3 className="text-slate-500 text-[10px] uppercase font-black tracking-[0.4em]">Índice de Condición Final</h3>
          <div className="relative inline-block">
            <div className="text-7xl font-mono font-black text-white tracking-widest">7.90</div>
            <div className="absolute -bottom-2 -right-4 bg-cyan-500 text-slate-950 px-2 py-0.5 rounded text-[8px] font-bold uppercase">Estado: OK</div>
          </div>
          <p className="text-slate-400 text-xs max-w-[250px] mx-auto leading-relaxed font-medium">
            La remoción de <span className="text-red-400 font-bold">TAX</span> estabilizó la matriz de correlación, asegurando coeficientes robustos.
          </p>
        </div>
      </div>
    </div>
  );
}

function FinalModelView() {
  return (
    <div className="space-y-8">
      <header className="bento-card py-4 flex justify-between items-center bg-slate-900">
        <div className="flex gap-10">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Adjusted R²</div>
            <div className="text-2xl font-mono text-cyan-400 font-black">0.7342</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">F-Statistic</div>
            <div className="text-2xl font-mono text-cyan-400 font-black">136.7</div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-white tracking-tight italic-none">Predictor Core Engine</h2>
          <p className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.2em]">Validated v2.0 // Multiple Linear</p>
        </div>
      </header>

      <div className="bento-card flex flex-col items-center justify-center py-12 bg-slate-950/80 shadow-2xl relative border-cyan-500/20">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-600 text-slate-950 text-[10px] font-black px-4 py-1 rounded-full shadow-lg shadow-cyan-500/30 italic-none uppercase tracking-widest">Ecuación de Regresión</div>
        <div className="text-lg md:text-2xl font-mono text-slate-400 overflow-x-auto w-full text-center py-4 px-6 italic-none">
          <span className="text-cyan-400 font-bold">MEDV</span> = 34.71 - 0.10 <span className="text-slate-700">CRIM</span> + 0.04 <span className="text-slate-700">ZN</span> + 2.97 <span className="text-emerald-500">CHAS</span> - 20.31 <span className="text-red-500">NOX</span> + 3.98 <span className="text-emerald-500">RM</span> ... [11-vars]
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Gains (+)", items: ["RM (+3.98)", "CHAS (+2.97)"], color: "emerald", icon: Zap },
          { title: "Heavy Loss (-)", items: ["NOX (-20.31)", "DIS (-1.43)"], color: "red", icon: AlertCircle },
          { title: "Minor (-) ", items: ["CRIM (-0.10)", "LSTAT (-0.53)"], color: "slate", icon: Info }
        ].map((col, idx) => (
          <div key={idx} className="bento-card space-y-4">
            <h4 className={cn("font-black text-[10px] uppercase tracking-[0.3em]", `text-${col.color}-500 flex items-center gap-2`)}>
              <col.icon className="w-3 h-3" />
              {col.title}
            </h4>
            <div className="space-y-2">
              {col.items.map((it, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-900 group transition-all hover:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300 font-mono tracking-tighter">{it.split(' ')[0]}</span>
                  <span className={cn("text-xs font-mono font-black", it.includes('+') ? "text-emerald-400" : "text-red-400")}>
                    {it.split(' ')[1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssumptionsView() {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Durbin-Watson", id: "01", val: "1.09", res: "Rechazo H0", label: "Autocorrelación", color: "cyan" },
          { title: "Breusch-Pagan", id: "02", val: "56.4", res: "Rechazo H0", label: "Homocedasticidad", color: "red" },
          { title: "Shapiro-Wilk", id: "03", val: "0.90", res: "Rechazo H0", label: "Normalidad", color: "indigo" }
        ].map((test, idx) => (
          <div key={idx} className="bento-card border-slate-800 relative group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-mono text-slate-600 bg-slate-950 px-2 py-1 rounded inline-block">TEST_{test.id}</span>
              <span className="text-[8px] bg-red-500/20 text-red-500 border border-red-500/30 px-2 py-0.5 rounded font-black tracking-widest uppercase">{test.res}</span>
            </div>
            <h3 className="text-white font-bold text-sm mb-1">{test.title}</h3>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-6">{test.label}</p>
            <div className="text-4xl font-mono font-black text-cyan-400 tracking-tighter">{test.val}</div>
          </div>
        ))}
      </div>

      <div className="bento-card bg-slate-900 border-l-4 border-l-cyan-500 flex gap-8 items-center py-10 px-10">
        <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-2xl">
          <BrainCircuit className="w-8 h-8 text-cyan-500 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-white font-black text-xs uppercase tracking-widest">Inferencia Técnica</h3>
          <p className="text-slate-400 text-[13px] leading-relaxed max-w-2xl font-medium">
            A pesar de las omisiones formales en los supuestos (fenómeno esperado en grandes datasets espaciales), la <span className="text-cyan-400 font-bold">significancia global es excepcional</span>. El modelo proporciona estimaciones robustas con un margen de error (RMSE) de $4.79k.
          </p>
        </div>
      </div>
    </div>
  );
}

function SimulatorView() {
  const [inputs, setInputs] = useState({
    crim: 0.1, zn: 0, chas: 0, nox: 0.5, rm: 6, dis: 4, rad: 5, ptratio: 18, b: 390, lstat: 12
  });

  const prediction = useMemo(() => {
    let result = COEFFICIENTS.intercept;
    result += inputs.crim * COEFFICIENTS.crim;
    result += inputs.zn * COEFFICIENTS.zn;
    result += inputs.chas * COEFFICIENTS.chas;
    result += inputs.nox * COEFFICIENTS.nox;
    result += inputs.rm * COEFFICIENTS.rm;
    result += inputs.dis * COEFFICIENTS.dis;
    result += inputs.rad * COEFFICIENTS.rad;
    result += inputs.ptratio * COEFFICIENTS.ptratio;
    result += inputs.b * COEFFICIENTS.b;
    result += inputs.lstat * COEFFICIENTS.lstat;
    return result;
  }, [inputs]);

  const handleChange = (key: string, val: number) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="grid md:grid-cols-[1fr_380px] gap-8 items-stretch h-full">
      <div className="bento-card border border-slate-800 p-8 space-y-10">
        <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-8 border-b border-slate-800 pb-4">Simulación Paramétrica</h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-10">
          {[
            { id: 'crim', label: 'CRIMEN (CRIM)', min: 0, max: 10, step: 0.01 },
            { id: 'rm', label: 'HABITACIONES (RM)', min: 3, max: 10, step: 0.1 },
            { id: 'nox', label: 'POLUCIÓN (NOX)', min: 0.3, max: 0.9, step: 0.01 },
            { id: 'lstat', label: 'POB. EST. BAJO (%)', min: 1, max: 40, step: 1 },
          ].map((param) => (
            <div key={param.id} className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{param.label}</label>
                <span className="text-xs font-mono font-black text-cyan-400">{(inputs as any)[param.id]}</span>
              </div>
              <input 
                type="range" 
                min={param.min} 
                max={param.max} 
                step={param.step}
                value={(inputs as any)[param.id]}
                onChange={(e) => handleChange(param.id, parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
              />
            </div>
          ))}
          <div className="col-span-2 bento-card bg-slate-950 p-4 border-slate-800 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">¿Adyacente al Río Charles?</span>
            <button 
              onClick={() => handleChange('chas', inputs.chas === 1 ? 0 : 1)}
              className={cn(
                "px-8 py-2 rounded-xl text-[10px] font-black px-6 tracking-widest uppercase transition-all border",
                inputs.chas === 1 ? "bg-cyan-600 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "bg-slate-900 text-slate-600 border-slate-800"
              )}
            >
              {inputs.chas === 1 ? "SÍ (+$$)" : "NO"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bento-card flex-grow bg-slate-900 border-cyan-500/30 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 to-transparent opacity-50 pointer-events-none" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 italic-none relative z-10">Market Value Projection</h4>
          <div className="text-7xl font-mono font-black text-white tracking-widest italic-none relative z-10">${prediction.toFixed(1)}k</div>
          <div className="mt-8 text-[11px] font-mono text-cyan-400 uppercase tracking-widest relative z-10 bg-slate-950 px-4 py-2 rounded-full border border-cyan-500/20 shadow-inner">
            Dólares Americanos
          </div>
        </div>
        
        <div className="bento-card p-6 border-slate-800 bg-slate-950/50 flex gap-4 items-center">
           <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
           <p className="text-[9px] font-medium text-slate-500 font-mono tracking-tighter leading-relaxed">
             RMSE: 4.79 // PREDICTION_STABILITY: HIGH_CONF // LOWER_BND: {(prediction - 4.79).toFixed(1)}k
           </p>
        </div>
      </div>
    </div>
  );
}

function ConclusionView() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-white leading-tight">Síntesis de Investigación</h2>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
          El modelo confirma que la habitabilidad (RM) y el entorno ambiental (NOX) son los pilares fundamentales de la valorización económica en Boston.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Ecológico", text: "Mejorar calidad del aire impacta en +$20k por unidad de reducción.", icon: Zap, color: "from-cyan-500/20" },
          { title: "Social", text: "La criminalidad devalúa un 10% por cada unidad de incremento regional.", icon: Settings, color: "from-blue-500/20" },
          { title: "Estratégico", text: "Adyacencia al río Charles otorga un premio directo en valorización.", icon: Globe, color: "from-indigo-500/20" }
        ].map((item, i) => (
          <div key={i} className={cn("bento-card flex flex-col gap-6 bg-gradient-to-br to-transparent border-slate-800", item.color)}>
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-lg">
              <item.icon className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-white text-xs uppercase tracking-widest">{item.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed italic-none">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bento-card bg-slate-900 border-cyan-500/20 text-center py-6">
        <span className="text-cyan-400 font-mono text-[10px] font-black uppercase tracking-[0.5em]">"Data Insight // Policy Driver // Boston 2026"</span>
      </div>
    </div>
  );
}

function GuideView() {
  const scriptSteps = [
    { time: "0:00 - 1:00", part: "Apertura", text: "Presentaremos la modelación econométrica de la vivienda en Boston. El objetivo es cuantificar el impacto tangible del clima y el crimen en el patrimonio familiar." },
    { time: "1:00 - 2:00", part: "Contexto", text: "506 dataset censo filtrado por Stepwise. Eliminamos ruido estructural (AGE, INDUS) para centrarnos en los 10 KPIs maestros." },
    { time: "2:00 - 4:00", part: "Stability", text: "Remoción de TAX para anular multicolinealidad. K-Index final de 7.90 valida la salud estadística del modelo." },
    { time: "4:00 - 7:00", part: "Core Model", text: "R² 0.73. Coeficientes críticos: RM (+$4k) y NOX (-$20k). La contaminación es el principal detractor de valor." },
    { time: "7:00 - 8:30", part: "Assumptions", text: "Violación formal de supuestos por autocorrelación espacial, pero con alta potencia predictiva individual validada por T-student." },
    { time: "8:30 - 10:00", part: "Simulator", text: "Ajuste en vivo de parámetros: observemos cómo varía el precio al optimizar la seguridad o el espacio habitable. Q&A." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="bento-card bg-slate-900 border-slate-700/50 space-y-10 p-10">
        <header className="flex justify-between items-center border-b border-slate-800 pb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Guía de Exposición Estratégica</h2>
            <p className="text-slate-500 text-xs font-medium font-mono uppercase tracking-widest mt-1">Defense Protocol // Timed Execution</p>
          </div>
          <div className="bg-cyan-600 text-slate-950 px-6 py-2 rounded-xl font-black flex items-center gap-3 shadow-lg shadow-cyan-500/20 italic-none">
            <span className="text-xl font-mono">10:00</span>
            <span className="text-[8px] font-black uppercase">Mins</span>
          </div>
        </header>

        <div className="grid gap-4">
          {scriptSteps.map((step, i) => (
            <div key={i} className="flex gap-10 p-5 rounded-2xl border border-slate-800 hover:bg-slate-800/50 transition-all group items-center">
              <div className="w-32 space-y-1">
                <div className="text-cyan-400 font-mono font-black text-xs">{step.time}</div>
                <div className="text-[8px] font-black uppercase text-slate-600 group-hover:text-slate-500 tracking-[0.2em]">{step.part}</div>
              </div>
              <div className="text-slate-400 group-hover:text-slate-300 leading-relaxed text-xs font-medium italic-none">
                {step.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 flex gap-6 items-start">
          <BookOpen className="w-6 h-6 shrink-0 text-cyan-500 animate-pulse" />
          <div className="space-y-1">
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Tactical Note</h5>
            <p className="text-[10px] text-slate-500 leading-relaxed font-mono italic">
              Focus on the economic interpretation of coefficients. Policy makers value dollar shifts over algebraic p-values.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

