const AnimacaoLua = () => (
  <div 
    style={{ 
      width: "100vw", /* Força a ocupar a tela inteira, ignorando o container pai */
      height: "310px", 
      position: "relative",
      left: "50%",
      transform: "translateX(-50%)", /* Centraliza perfeitamente na tela */
      overflow: "hidden" /* Evita criar barra de rolagem horizontal se a tela for menor */
    }}
  >
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
      viewBox="0 0 1440 310"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="moonBodyG" cx="34%" cy="32%" r="66%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="38%" stopColor="#f5f0e9" />
          <stop offset="100%" stopColor="#e0c58f" />
        </radialGradient>
        <filter id="mGlow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="arcGF" x="-5%" y="-60%" width="110%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="arcLG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(224,197,143,0)" />
          <stop offset="18%"  stopColor="rgba(224,197,143,0.5)" />
          <stop offset="50%"  stopColor="rgba(224,197,143,0.72)" />
          <stop offset="82%"  stopColor="rgba(224,197,143,0.5)" />
          <stop offset="100%" stopColor="rgba(224,197,143,0)" />
        </linearGradient>
      </defs>

      <path
        id="orbitPath"
        d="M -90 290 Q 720 -55 1530 290"
        fill="none"
        stroke="url(#arcLG)"
        strokeWidth="1"
        strokeDasharray="4 11"
      />
      <path
        d="M -90 290 Q 720 -55 1530 290"
        fill="none"
        stroke="rgba(224,197,143,0.11)"
        strokeWidth="5"
        filter="url(#arcGF)"
      />
      
      {[0.18, 0.38, 0.5, 0.62, 0.82].map((t, i) => {
        const x = (1-t)*(1-t)*(-90) + 2*(1-t)*t*720 + t*t*1530;
        const y = (1-t)*(1-t)*290 + 2*(1-t)*t*(-55) + t*t*290;
        return (
          <circle
            key={i}
            cx={x} cy={y}
            r={i === 2 ? 3.2 : 1.6}
            fill={`rgba(224,197,143,${i === 2 ? 0.55 : 0.28})`}
          />
        );
      })}

      <g>
        <circle cx="0" cy="0" r="58" fill="rgba(224,197,143,0.038)" />
        <circle cx="0" cy="0" r="38" fill="rgba(245,240,233,0.065)" />
        <g filter="url(#mGlow)">
          <circle cx="0" cy="0" r="24" fill="url(#moonBodyG)" />
          <circle cx="-7" cy="-5" r="5.5" fill="rgba(172,148,95,0.2)" />
          <circle cx="9" cy="8" r="3.5" fill="rgba(172,148,95,0.17)" />
          <circle cx="-2" cy="12" r="2.5" fill="rgba(172,148,95,0.14)" />
        </g>
        <animateMotion dur="22s" repeatCount="indefinite" calcMode="linear">
          <mpath href="#orbitPath" />
        </animateMotion>
        <animate
          attributeName="opacity"
          values="0;0;1;1;1;1;0;0"
          keyTimes="0;0.045;0.085;0.44;0.56;0.915;0.955;1"
          dur="22s"
          repeatCount="indefinite"
        />
      </g>

      <g>
        <circle cx="0" cy="0" r="9" fill="rgba(245,240,233,0.14)" />
        <animateMotion dur="22s" repeatCount="indefinite" calcMode="linear" begin="-0.55s">
          <mpath href="#orbitPath" />
        </animateMotion>
        <animate
          attributeName="opacity"
          values="0;0;0.65;0.65;0.65;0.65;0;0"
          keyTimes="0;0.045;0.085;0.44;0.56;0.915;0.955;1"
          dur="22s"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  </div>
);

export default AnimacaoLua;