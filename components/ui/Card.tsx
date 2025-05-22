import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, className = '', style }: CardProps) {
  return (
    <div 
      className={`relative bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 hover:border-blue-200/50 transition-all duration-300 ${className}`}
      style={style}
    >

      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`relative px-6 py-5 border-b border-gradient-to-r from-gray-100 to-blue-50 bg-gradient-to-r from-gray-50/50 to-blue-50/30 ${className}`}>

      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`relative px-6 py-5 ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`relative px-6 py-4 bg-gradient-to-r from-gray-50/70 to-blue-50/30 border-t border-gray-100/80 backdrop-blur-sm ${className}`}>
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      {children}
    </div>
  );
}