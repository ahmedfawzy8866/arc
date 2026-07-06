'use client';

export default function ShieldLogo({ size = 44 }: { size?: number }) {
  return (
    <img 
      src="/unnamed_logo.png" 
      alt="Sierra Blu Logo" 
      style={{ 
        width: size, 
        height: 'auto', 
        maxHeight: size * 1.2,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle'
      }} 
    />
  );
}
