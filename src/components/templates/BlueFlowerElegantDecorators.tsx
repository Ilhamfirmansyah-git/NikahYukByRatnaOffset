'use client';

const BASE = '/assets/templates/blue-flower-elegant';

/** Renders cutout9 (inner watercolor frame) — used as CoverTopOverlay, appears behind text (z:1 < text z:2) */
export function BlueFlowerFrame() {
  return (
    <img
      src={`${BASE}/cutout9.png`}
      alt=""
      style={{
        position: 'absolute',
        top: '10%',
        left: '8%',
        width: '84%',
        height: '80%',
        objectFit: 'fill',
        zIndex: 1,
        imageRendering: 'crisp-edges',
      }}
    />
  );
}

/** Renders cutouts 1–8 (bouquet corners) — used as CoverBottomDecor, appears above text (wrapper z:3 > text z:2) */
export function BlueFlowerBouquets() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* cutout4 — kiri atas */}
      <img
        src={`${BASE}/cutout4.png`}
        alt=""
        style={{
          position: 'absolute',
          top: '2%',
          left: '-3%',
          width: '35%',
          transform: 'rotate(10deg) scaleX(-1)',
        }}
      />
      {/* cutout2 — atas tengah-kanan */}
      <img
        src={`${BASE}/cutout2.png`}
        alt=""
        style={{
          position: 'absolute',
          top: '-3%',
          right: '10%',
          width: '40%',
        }}
      />
      {/* cutout8 — kanan tengah-atas */}
      <img
        src={`${BASE}/cutout8.png`}
        alt=""
        style={{
          position: 'absolute',
          top: '8%',
          right: '-3%',
          width: '38%',
          transform: 'rotate(-20deg)',
        }}
      />
      {/* cutout3 — kiri bawah */}
      <img
        src={`${BASE}/cutout3.png`}
        alt=""
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '-5%',
          width: '40%',
          transform: 'rotate(20deg) scaleX(-1)',
        }}
      />
      {/* cutout7 — kiri tengah-bawah */}
      <img
        src={`${BASE}/cutout7.png`}
        alt=""
        style={{
          position: 'absolute',
          bottom: '18%',
          left: '-5%',
          width: '35%',
          transform: 'rotate(15deg) scaleX(-1)',
        }}
      />
      {/* cutout5 — bawah kanan */}
      <img
        src={`${BASE}/cutout5.png`}
        alt=""
        style={{
          position: 'absolute',
          bottom: '2%',
          right: '-3%',
          width: '38%',
          transform: 'rotate(-10deg)',
        }}
      />
      {/* cutout6 — bawah tengah */}
      <img
        src={`${BASE}/cutout6.png`}
        alt=""
        style={{
          position: 'absolute',
          bottom: '0%',
          left: '25%',
          width: '50%',
          transform: 'rotate(5deg)',
        }}
      />
      {/* cutout1 — kanan atas, paling atas */}
      <img
        src={`${BASE}/cutout1.png`}
        alt=""
        style={{
          position: 'absolute',
          top: '-5%',
          right: '-5%',
          width: '45%',
          transform: 'rotate(-15deg)',
        }}
      />
    </div>
  );
}
