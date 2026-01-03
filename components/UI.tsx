
import React from 'react';

// Theme classes applied to the main container are used to drive these styles
export const BORDER_STYLE = "border-2 border-[var(--primary)]";
export const SHADOW_STYLE = "hover:shadow-[0_0_15px_var(--shadow-color)] transition-all";
export const CARD_BASE = `bg-[var(--card-bg)] ${BORDER_STYLE} rounded-[var(--radius)]`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export const NeoButton: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  ...props 
}) => {
  const baseColors = {
    primary: 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] border-[var(--primary)]',
    secondary: 'bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] border-[var(--primary)]',
    danger: 'bg-black text-[#ff4141] border-[#ff4141] hover:bg-[#3b0000]',
    success: 'bg-black text-[var(--primary)] border-[var(--primary)] hover:bg-[var(--hover-bg)]',
  };

  return (
    <button
      className={`
        ${baseColors[variant]} 
        border-2 
        ${SHADOW_STYLE} 
        px-6 py-2 
        font-mono font-bold text-lg
        uppercase tracking-widest
        disabled:opacity-30
        active:translate-y-1
        rounded-[var(--radius)]
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export const NeoCard: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => {
  return (
    <div className={`${CARD_BASE} ${className} flex flex-col overflow-hidden`}>
      {title && (
        <div className="border-b-2 border-[var(--primary)] bg-[var(--header-bg)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--header-text)]">
          :: {title} ::
        </div>
      )}
      <div className="flex-1 overflow-auto bg-[var(--card-inner-bg)]">
        {children}
      </div>
    </div>
  );
};

export const NeoInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[var(--primary)] font-bold">{">"}</span>
      <input 
        className={`w-full bg-transparent text-[var(--primary)] border-b-2 border-[var(--primary)] px-2 py-1 font-mono focus:outline-none placeholder:text-[var(--dim)] ${className}`}
        {...props}
      />
    </div>
  );
};
