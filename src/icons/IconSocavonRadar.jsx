export default function IconSocavonRadar({ className }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Montaña/Cerro */}
      <path
        d="M20 120 L50 80 L80 60 L120 40 L160 60 L180 120 L20 120 Z"
        fill="#8B7355"
        stroke="#654321"
        strokeWidth="2"
      />
      
      {/* Entrada del socavón */}
      <ellipse
        cx="100"
        cy="120"
        rx="25"
        ry="15"
        fill="#2C1810"
        stroke="#654321"
        strokeWidth="1.5"
      />
      
      {/* Túnel interior (efecto de profundidad) */}
      <ellipse
        cx="100"
        cy="118"
        rx="20"
        ry="12"
        fill="#1A0F08"
      />
      
      {/* Rieles del tren */}
      <rect x="85" y="125" width="2" height="15" fill="#666" />
      <rect x="113" y="125" width="2" height="15" fill="#666" />
      
      {/* Traviesas de los rieles */}
      <rect x="82" y="127" width="20" height="2" fill="#8B4513" />
      <rect x="82" y="131" width="20" height="2" fill="#8B4513" />
      <rect x="82" y="135" width="20" height="2" fill="#8B4513" />
      
      {/* Estructura de soporte del túnel */}
      <path
        d="M85 110 Q100 105 115 110"
        stroke="#A0522D"
        strokeWidth="3"
        fill="none"
      />
      
      {/* Torre del radar */}
      <rect x="140" y="70" width="6" height="40" fill="#4A5568" />
      
      {/* Base del radar */}
      <rect x="138" y="108" width="10" height="4" fill="#2D3748" />
      
      {/* Antena del radar */}
      <circle cx="143" cy="75" r="8" fill="none" stroke="#E53E3E" strokeWidth="2" />
      <line x1="143" y1="67" x2="143" y2="83" stroke="#E53E3E" strokeWidth="2" />
      <line x1="135" y1="75" x2="151" y2="75" stroke="#E53E3E" strokeWidth="2" />
      
      {/* Ondas del radar (animadas) */}
      <g className="radar-waves">
        <circle
          cx="143"
          cy="75"
          r="12"
          fill="none"
          stroke="#FF6B6B"
          strokeWidth="1"
          opacity="0.6"
        >
          <animate
            attributeName="r"
            values="8;20;8"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        
        <circle
          cx="143"
          cy="75"
          r="16"
          fill="none"
          stroke="#FF6B6B"
          strokeWidth="1"
          opacity="0.4"
        >
          <animate
            attributeName="r"
            values="12;25;12"
            dur="2s"
            begin="0.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0;0.6"
            dur="2s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
      
      {/* Señales de detección en el túnel */}
      <circle cx="90" cy="115" r="2" fill="#00FF00" opacity="0.8">
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
      
      <circle cx="110" cy="115" r="2" fill="#00FF00" opacity="0.8">
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="1.5s"
          begin="0.7s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Texto "RADAR" */}
      <text
        x="143"
        y="95"
        textAnchor="middle"
        fontSize="8"
        fill="#2D3748"
        fontWeight="bold"
      >
        RADAR
      </text>
      
      {/* Base/suelo */}
      <rect x="0" y="140" width="200" height="60" fill="#D69E2E" />
      
      {/* Vegetación decorativa */}
      <circle cx="30" cy="140" r="3" fill="#38A169" />
      <circle cx="35" cy="138" r="2" fill="#38A169" />
      <circle cx="170" cy="140" r="4" fill="#38A169" />
      <circle cx="165" cy="137" r="2.5" fill="#38A169" />
    </svg>
  );
}