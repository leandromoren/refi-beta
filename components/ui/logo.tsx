import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <span className="text-3xl font-extrabold tracking-tighter">
        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">REFI</span>
        <span className="relative">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">SIM</span>
          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 to-cyan-500"></span>
        </span>
      </span>
    </div>
  );
};

export default Logo;