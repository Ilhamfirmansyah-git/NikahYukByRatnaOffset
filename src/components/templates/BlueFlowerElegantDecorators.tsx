'use client';

const BOUQUET = '/assets/templates/blue-flower-elegant/bouquet.png';

/** 9-position bouquet decoration using a high-res watercolor PNG (2000×2000 transparent bg).
 *  Each instance is rotated/mirrored so flowers face toward the center of the cover. */
export function BlueFlowerBouquets() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* 1 — Kiri atas: bunga menghadap kanan-bawah */}
      <img
        src={BOUQUET}
        alt=""
        style={{
          position: 'absolute',
          top: '-2%',
          left: '-5%',
          width: '34%',
          transform: 'rotate(155deg) scaleX(-1)',
        }}
      />
      {/* 2 — Atas tengah-kanan: bunga menghadap ke bawah */}
      <img
        src={BOUQUET}
        alt=""
        style={{
          position: 'absolute',
          top: '-6%',
          right: '8%',
          width: '40%',
          transform: 'rotate(180deg)',
        }}
      />
      {/* 3 — Kanan tengah-atas: bunga menghadap kiri */}
      <img
        src={BOUQUET}
        alt=""
        style={{
          position: 'absolute',
          top: '6%',
          right: '-6%',
          width: '37%',
          transform: 'rotate(100deg)',
        }}
      />
      {/* 4 — Kiri bawah: bunga menghadap kanan-atas */}
      <img
        src={BOUQUET}
        alt=""
        style={{
          position: 'absolute',
          bottom: '4%',
          left: '-6%',
          width: '40%',
          transform: 'rotate(15deg) scaleX(-1)',
        }}
      />
      {/* 5 — Kiri tengah-bawah: bunga menghadap kanan */}
      <img
        src={BOUQUET}
        alt=""
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '-6%',
          width: '34%',
          transform: 'rotate(-20deg) scaleX(-1)',
        }}
      />
      {/* 6 — Bawah kanan: bunga menghadap atas-kiri */}
      <img
        src={BOUQUET}
        alt=""
        style={{
          position: 'absolute',
          bottom: '2%',
          right: '-5%',
          width: '38%',
          transform: 'rotate(-12deg)',
        }}
      />
      {/* 7 — Bawah tengah: bunga menghadap ke atas */}
      <img
        src={BOUQUET}
        alt=""
        style={{
          position: 'absolute',
          bottom: '-2%',
          left: '22%',
          width: '48%',
          transform: 'rotate(5deg)',
        }}
      />
      {/* 8 — Kanan atas paling atas: bunga menghadap kiri-bawah */}
      <img
        src={BOUQUET}
        alt=""
        style={{
          position: 'absolute',
          top: '-8%',
          right: '-8%',
          width: '52%',
          transform: 'rotate(185deg)',
        }}
      />
      {/* 9 — Kiri tengah: aksen samping */}
      <img
        src={BOUQUET}
        alt=""
        style={{
          position: 'absolute',
          top: '38%',
          left: '-8%',
          width: '30%',
          transform: 'rotate(-80deg) scaleX(-1)',
        }}
      />
    </div>
  );
}
