'use client';

const BOUQUET = '/assets/templates/blue-flower-elegant/bouquet.png';

/** Four-corner bouquet decoration using a single high-res watercolor PNG (2000×2000 transparent bg) */
export function BlueFlowerBouquets() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Kanan atas — dibalik 180° agar bunga mengarah ke dalam */}
      <img
        src={BOUQUET}
        alt=""
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '55%',
          transform: 'rotate(180deg)',
        }}
      />
      {/* Kiri atas — mirror + 180° */}
      <img
        src={BOUQUET}
        alt=""
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '48%',
          transform: 'rotate(180deg) scaleX(-1)',
        }}
      />
      {/* Kanan bawah — orientasi natural (bunga menghadap atas-kiri) */}
      <img
        src={BOUQUET}
        alt=""
        style={{
          position: 'absolute',
          bottom: '-8%',
          right: '-10%',
          width: '55%',
        }}
      />
      {/* Kiri bawah — mirror horizontal */}
      <img
        src={BOUQUET}
        alt=""
        style={{
          position: 'absolute',
          bottom: '-8%',
          left: '-10%',
          width: '48%',
          transform: 'scaleX(-1)',
        }}
      />
    </div>
  );
}
