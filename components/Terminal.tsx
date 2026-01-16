
import React from 'react';

interface TerminalPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'normal' | 'alert' | 'success';
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({ title, children, className = '', variant = 'normal' }) => {
  const borderColor = {
    normal: 'border-zinc-700',
    alert: 'border-red-600',
    success: 'border-zinc-400',
  }[variant];

  const headerBg = {
    normal: 'bg-zinc-800',
    alert: 'bg-red-900',
    success: 'bg-zinc-700',
  }[variant];

  return (
    <div className={`border-2 ${borderColor} bg-black shadow-none overflow-hidden mb-6 ${className}`}>
      <div className={`${headerBg} px-3 py-1 flex justify-between items-center border-b ${borderColor}`}>
        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white">{title}</span>
        <div className="flex gap-2">
          <div className="w-1 h-3 bg-black/30"></div>
          <div className="w-1 h-3 bg-black/30"></div>
        </div>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'ghost' }> = ({ children, className = '', variant = 'primary', ...props }) => {
  const styles = {
    primary: 'bg-white text-black hover:invert border-white',
    danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600',
    ghost: 'bg-transparent text-zinc-500 border-zinc-800 hover:text-white hover:border-zinc-500',
  }[variant];

  return (
    <button 
      className={`px-8 py-3 border-none font-black uppercase text-xs tracking-[0.2em] transition-all disabled:opacity-20 disabled:grayscale ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    {...props} 
    className="bg-black border border-zinc-800 p-3 text-white focus:outline-none focus:border-zinc-100 w-full font-mono text-sm placeholder-zinc-800 uppercase"
  />
);

export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-[10px] uppercase font-black text-zinc-600 mb-2 tracking-[0.15em]">
    {children}
  </label>
);
