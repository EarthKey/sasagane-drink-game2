import React from 'react';

const SakuraPetal: React.FC = () => {
    const style = {
      left: `${Math.random() * 100}vw`,
      width: `${Math.random() * 10 + 5}px`,
      height: `${Math.random() * 10 + 5}px`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `${Math.random() * 5}s`,
    };
    return <div className="sakura-petal" style={style}></div>;
};

export default SakuraPetal;
