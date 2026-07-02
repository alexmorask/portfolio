export function IdempotentWritePathDiagram() {
  return (
    <svg viewBox="0 0 640 500" className="block h-auto w-full">
      <title>Idempotent write path diagram</title>
      <defs>
        <marker id="arrowWU" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="oklch(75% 0.15 70)" />
        </marker>
      </defs>
      <path
        d="M320,76 V118"
        stroke="#3a4150"
        strokeWidth="1.5"
        markerEnd="url(#arrowWU)"
        fill="none"
      />
      <path
        d="M320,190 V215 H150 V237"
        stroke="#3a4150"
        strokeWidth="1.5"
        markerEnd="url(#arrowWU)"
        fill="none"
      />
      <path
        d="M320,190 V215 H490 V237"
        stroke="#3a4150"
        strokeWidth="1.5"
        markerEnd="url(#arrowWU)"
        fill="none"
      />
      <path
        d="M490,304 V327"
        stroke="#3a4150"
        strokeWidth="1.5"
        markerEnd="url(#arrowWU)"
        fill="none"
      />
      <path
        d="M150,300 V400 H317"
        stroke="#3a4150"
        strokeWidth="1.5"
        markerEnd="url(#arrowWU)"
        fill="none"
      />
      <path
        d="M490,386 V400 H323"
        stroke="#3a4150"
        strokeWidth="1.5"
        markerEnd="url(#arrowWU)"
        fill="none"
      />
      <text x="235" y="208" fill="#7a8494" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        yes
      </text>
      <text x="425" y="208" fill="#7a8494" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        no
      </text>

      <rect
        x="200"
        y="20"
        width="240"
        height="56"
        rx="8"
        fill="#12161d"
        stroke="oklch(75% 0.15 70)"
        strokeWidth="1.5"
      />
      <text
        x="320"
        y="43"
        textAnchor="middle"
        fill="#e8eaed"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="12"
      >
        Client sends request
      </text>
      <text
        x="320"
        y="60"
        textAnchor="middle"
        fill="#7a8494"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="11"
      >
        Idempotency-Key: abc123
      </text>

      <polygon
        points="320,110 430,150 320,190 210,150"
        fill="#12161d"
        stroke="oklch(75% 0.15 70)"
        strokeWidth="1.5"
      />
      <text
        x="320"
        y="146"
        textAnchor="middle"
        fill="#e8eaed"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="11"
      >
        Key seen
      </text>
      <text
        x="320"
        y="161"
        textAnchor="middle"
        fill="#e8eaed"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="11"
      >
        in cache?
      </text>

      <rect
        x="40"
        y="240"
        width="220"
        height="60"
        rx="8"
        fill="#12161d"
        stroke="rgba(255,255,255,.16)"
        strokeWidth="1.5"
      />
      <text
        x="150"
        y="265"
        textAnchor="middle"
        fill="#e8eaed"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="12"
      >
        Return cached
      </text>
      <text
        x="150"
        y="282"
        textAnchor="middle"
        fill="#e8eaed"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="12"
      >
        response (200 OK)
      </text>

      <rect
        x="380"
        y="240"
        width="220"
        height="64"
        rx="8"
        fill="#12161d"
        stroke="rgba(255,255,255,.16)"
        strokeWidth="1.5"
      />
      <text
        x="490"
        y="265"
        textAnchor="middle"
        fill="#e8eaed"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="12"
      >
        Append entry to
      </text>
      <text
        x="490"
        y="282"
        textAnchor="middle"
        fill="#e8eaed"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="12"
      >
        ledger (locked)
      </text>

      <rect
        x="380"
        y="330"
        width="220"
        height="56"
        rx="8"
        fill="#12161d"
        stroke="rgba(255,255,255,.16)"
        strokeWidth="1.5"
      />
      <text
        x="490"
        y="353"
        textAnchor="middle"
        fill="#e8eaed"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="12"
      >
        Cache response under
      </text>
      <text
        x="490"
        y="370"
        textAnchor="middle"
        fill="#e8eaed"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="12"
      >
        idempotency key
      </text>

      <rect
        x="200"
        y="420"
        width="240"
        height="56"
        rx="8"
        fill="#12161d"
        stroke="oklch(75% 0.15 70)"
        strokeWidth="1.5"
      />
      <text
        x="320"
        y="452"
        textAnchor="middle"
        fill="#e8eaed"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="12"
      >
        Response returned to client
      </text>
    </svg>
  );
}
