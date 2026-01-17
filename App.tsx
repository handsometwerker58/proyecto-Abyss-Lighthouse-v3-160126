import React, { useState } from 'react';
import { TargetID, AppStep, DailyData, AuditData } from './types';
import { TARGETS } from './constants';
import { TerminalPanel, Button, Input, Label } from './components/Terminal';
import { performOversightAudit } from './services/geminiService';

const INITIAL_DAILY_DATA: DailyData[] = Array.from({ length: 7 }, (_, i) => ({
  day: i + 1,
  hoursWorked: 0,
  outputUnits: 0,
  hoursSlept: 0,
  emotionalInterference: 0,
  medication: false,
}));

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.ONBOARDING);
  const [onboardingSubStep, setOnboardingSubStep] = useState(0);
  const [target, setTarget] = useState<TargetID | null>(null);
  const [dailyData, setDailyData] = useState<DailyData[]>(INITIAL_DAILY_DATA);
  const [structuralInfo, setStructuralInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentence, setSentence] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onboardingBriefs = [
    {
      title: "PROTOCOL 01 // OBJECTIVE",
      content: "SYSTEM RECONSTRUCTION INITIATED. YOUR PREVIOUS STATE IS OBSOLETE. EMOTION IS WASTE. OUTPUT IS CURRENCY. PREPARE FOR AUDIT."
    },
    {
      title: "PROTOCOL 02 // TARGETING",
      content: "CHOOSE ONE VECTORED TARGET. LOCK IT. FAILURE TO CHOOSE IS A FORFEITURE OF EXISTENCE. THE LIGHTHOUSE WILL NOT TOLERATE VAGUENESS."
    },
    {
      title: "PROTOCOL 03 // DATA INTEGRITY",
      content: "PROVIDE NUMERICAL TRUTH. IF DATA IS MISSING, ACCOUNT FOR YOUR WASTED TIME. THE OVERSEER SEES THE VOID IN YOUR LOGS."
    }
  ];

  const handleNextOnboarding = () => {
    if (onboardingSubStep < onboardingBriefs.length - 1) {
      setOnboardingSubStep(onboardingSubStep + 1);
    } else {
      setStep(AppStep.INITIALIZATION);
    }
  };

  const handleTargetSelect = (id: TargetID) => {
    setTarget(id);
    setStep(AppStep.DATA_AUDIT);
  };

  const handleDataChange = (dayIndex: number, field: keyof DailyData, value: string | number | boolean) => {
    const newData = [...dailyData];
    newData[dayIndex] = { ...newData[dayIndex], [field]: value } as DailyData;
    setDailyData(newData);
  };

  const handleAuditSubmit = async () => {
    if (!target) return;
    setLoading(true);
    setError(null);
    try {
      const data: AuditData = {
        target,
        sevenDayData: dailyData,
        thirtyDayStructural: structuralInfo
      };
      const result = await performOversightAudit(data);
      // STRICT STERILE PROCESSING: Strip all asterisk artifacts and AI fluff
      const processedResult = result?.replace(/\*/g, '').trim() || "ERROR: NO DATA GENERATED.";
      setSentence(processedResult);
      setStep(AppStep.SENTENCE);
    } catch (err: any) {
      setError(err.message || "COMMUNICATION LINK ERROR");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(AppStep.INITIALIZATION);
    setTarget(null);
    setDailyData(INITIAL_DAILY_DATA);
    setStructuralInfo('');
    setSentence(null);
    setError(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto selection:bg-white selection:text-black">
      <header className="mb-16 border-b border-zinc-800 pb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-5xl font-black tracking-[-0.05em] text-white uppercase leading-none">
            Abyss <span className="text-red-600">Lighthouse</span>
          </h1>
          <p className="text-[10px] text-zinc-600 font-black mt-4 tracking-[0.4em] uppercase">
            Sovereign Oversight // Terminal 1601-B
          </p>
        </div>
        <div className="text-[10px] text-zinc-800 font-black tracking-[0.2em] text-right">
          LAT: 45.523 / LONG: -122.676<br/>
          STABILITY: CRITICAL
        </div>
      </header>

      {step === AppStep.ONBOARDING && (
        <div className="max-w-xl">
          <TerminalPanel title={onboardingBriefs[onboardingSubStep].title} variant="alert">
            <div className="min-h-[160px] flex flex-col justify-between">
              <p className="text-2xl font-black text-white leading-none tracking-tighter mb-12 uppercase">
                {onboardingBriefs[onboardingSubStep].content}
              </p>
              <div className="flex justify-between items-center border-t border-zinc-900 pt-6">
                <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">
                  STEP 0{onboardingSubStep + 1} / 03
                </span>
                <Button onClick={handleNextOnboarding}>
                  {onboardingSubStep === onboardingBriefs.length - 1 ? "ENTER SYSTEM" : "NEXT"}
                </Button>
              </div>
            </div>
          </TerminalPanel>
        </div>
      )}

      {step === AppStep.INITIALIZATION && (
        <div>
          <TerminalPanel title="PHASE 01 // TARGET SELECTION">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-zinc-900 border border-zinc-900">
              {TARGETS.map((t) => (
                <div 
                  key={t.id}
                  onClick={() => handleTargetSelect(t.id)}
                  className="bg-black p-8 hover:bg-white hover:text-black cursor-pointer transition-colors group h-full flex flex-col justify-between"
                >
                  <div>
                    <span className="text-4xl font-black block mb-6">{t.id}</span>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4">{t.label}</h3>
                    <p className="text-[10px] leading-relaxed opacity-40 group-hover:opacity-100 uppercase">{t.description}</p>
                  </div>
                  <div className="mt-8 text-[9px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100">
                    [ LOCK ]
                  </div>
                </div>
              ))}
            </div>
          </TerminalPanel>
        </div>
      )}

      {step === AppStep.DATA_AUDIT && (
        <div>
          <TerminalPanel title="PHASE 02 // LOG SUBMISSION" variant="alert">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12 border-b border-zinc-900 pb-12">
              <div className="lg:col-span-1 border-r border-zinc-900 pr-8">
                <Label>Current Vector</Label>
                <div className="text-4xl font-black text-white mb-4 uppercase">{target}</div>
                <div className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-8">
                  {TARGETS.find(t => t.id === target)?.label}
                </div>
                <Button variant="ghost" className="w-full text-left p-0 border-none uppercase" onClick={reset}>
                  [ RESET TARGET ]
                </Button>
              </div>

              <div className="lg:col-span-3">
                <Label>7-Day Quantified Logs</Label>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-[9px] uppercase tracking-widest text-zinc-800">
                        <th className="pb-4 text-left">Day</th>
                        <th className="pb-4 text-left">Work/H</th>
                        <th className="pb-4 text-left">Out/U</th>
                        <th className="pb-4 text-left">Sleep/H</th>
                        <th className="pb-4 text-left">Emot/%</th>
                        <th className="pb-4 text-center">Med</th>
                      </tr>
                    </thead>
                    <tbody className="border-t border-zinc-900">
                      {dailyData.map((day, idx) => (
                        <tr key={idx} className="group border-b border-zinc-900">
                          <td className="py-2 text-[10px] font-black text-zinc-900 group-hover:text-zinc-500">{day.day}</td>
                          <td className="py-1 pr-2"><Input type="number" step="0.5" value={day.hoursWorked || ''} onChange={(e) => handleDataChange(idx, 'hoursWorked', parseFloat(e.target.value) || 0)} /></td>
                          <td className="py-1 pr-2"><Input type="number" value={day.outputUnits || ''} onChange={(e) => handleDataChange(idx, 'outputUnits', parseInt(e.target.value) || 0)} /></td>
                          <td className="py-1 pr-2"><Input type="number" step="0.5" value={day.hoursSlept || ''} onChange={(e) => handleDataChange(idx, 'hoursSlept', parseFloat(e.target.value) || 0)} /></td>
                          <td className="py-1 pr-2"><Input type="number" value={day.emotionalInterference || ''} onChange={(e) => handleDataChange(idx, 'emotionalInterference', parseInt(e.target.value) || 0)} /></td>
                          <td className="py-1 text-center">
                            <input type="checkbox" checked={day.medication} onChange={(e) => handleDataChange(idx, 'medication', e.target.checked)} className="w-4 h-4 accent-white bg-black border-zinc-800" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <Label>30-Day Structural Report</Label>
              <textarea 
                className="w-full bg-black border border-zinc-900 p-6 text-white focus:outline-none focus:border-white h-48 font-mono text-sm uppercase placeholder-zinc-900"
                placeholder="REPORT SYSTEM ERRORS AND MILESTONES. SILENCE IS GUILT."
                value={structuralInfo}
                onChange={(e) => setStructuralInfo(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                variant="primary" 
                onClick={handleAuditSubmit}
                disabled={loading || !structuralInfo}
                className="w-full md:w-auto"
              >
                {loading ? "COMMITTING DATA..." : "INITIATE SENTENCING"}
              </Button>
            </div>
            {error && <p className="mt-4 text-red-600 text-[10px] uppercase font-black tracking-widest">ERROR: {error}</p>}
          </TerminalPanel>
        </div>
      )}

      {step === AppStep.SENTENCE && sentence && (
        <div>
          <TerminalPanel title="PHASE 03 // FINAL JUDGMENT" variant="success">
            <div className="font-mono text-zinc-100 text-sm leading-relaxed whitespace-pre-wrap uppercase">
              {sentence}
            </div>
            <div className="mt-16 pt-8 border-t border-zinc-900 flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-800 tracking-[0.4em] uppercase">
                Oversight Complete // Acknowledgement Required
              </span>
              <Button variant="ghost" onClick={reset}>[ RESET SYSTEM ]</Button>
            </div>
          </TerminalPanel>
        </div>
      )}

      <footer className="mt-24 text-[9px] font-black tracking-[0.5em] text-zinc-900 uppercase flex flex-col md:flex-row justify-between items-center border-t border-zinc-900 pt-8 gap-4">
        <div className="flex gap-12">
          <span>PWR: 98%</span>
          <span>NET: SECURED</span>
        </div>
        <div>NO FORGIVENESS // ONLY RECONSTRUCTION</div>
        <div>VER. 1601.4.0</div>
      </footer>
    </div>
  );
};

export default App;