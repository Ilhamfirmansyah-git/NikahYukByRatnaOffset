'use client';

const BOUQUET = '/assets/templates/blue-flower-elegant/bouquet.png';

const KEYFRAMES = `
  @keyframes bfe-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }
  @keyframes bfe-sway {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50%       { transform: translateY(-8px) rotate(2deg); }
  }
  @keyframes bfe-breathe {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.07); }
  }
`;

export function BlueFlowerBouquets() {
  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>

        {/* ===== ATAS ===== */}

        {/* T1 — kiri atas */}
        <div style={{
          position: 'absolute', top: '2%', left: '-3%', width: '35%',
          animation: 'bfe-sway 4.5s ease-in-out 0.3s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(130deg) scaleX(-1)' }} />
        </div>

        {/* T2 — atas tengah-kanan */}
        <div style={{
          position: 'absolute', top: '-3%', right: '10%', width: '40%',
          animation: 'bfe-float 5s ease-in-out 0.8s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(180deg)' }} />
        </div>

        {/* T3 — kanan tengah-atas */}
        <div style={{
          position: 'absolute', top: '8%', right: '-3%', width: '38%',
          animation: 'bfe-breathe 4.2s ease-in-out 1.5s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(85deg)' }} />
        </div>

        {/* T4 — kanan atas paling atas */}
        <div style={{
          position: 'absolute', top: '-5%', right: '-5%', width: '45%',
          animation: 'bfe-float 4.3s ease-in-out 0.2s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(185deg)' }} />
        </div>

        {/* ===== SAMPING ===== */}

        {/* S1 — kiri tengah */}
        <div style={{
          position: 'absolute', top: '36%', left: '-8%', width: '28%',
          animation: 'bfe-breathe 6s ease-in-out 1.8s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(-75deg) scaleX(-1)' }} />
        </div>

        {/* S2 — kiri bawah-tengah */}
        <div style={{
          position: 'absolute', bottom: '28%', left: '-5%', width: '36%',
          animation: 'bfe-float 3.8s ease-in-out 2.0s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(-20deg) scaleX(-1)' }} />
        </div>

        {/* ===== BAWAH — RAPAT & TURUN ===== */}

        {/* B1 — bawah kiri, besar, turun jauh */}
        <div style={{
          position: 'absolute', bottom: '-22%', left: '-8%', width: '58%',
          animation: 'bfe-sway 4.8s ease-in-out 0.4s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'scaleX(-1)' }} />
        </div>

        {/* B2 — bawah tengah-kiri */}
        <div style={{
          position: 'absolute', bottom: '-28%', left: '5%', width: '52%',
          animation: 'bfe-float 5.2s ease-in-out 1.0s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(-5deg)' }} />
        </div>

        {/* B3 — bawah tengah besar, paling turun */}
        <div style={{
          position: 'absolute', bottom: '-32%', left: '18%', width: '68%',
          animation: 'bfe-breathe 5.5s ease-in-out 0.6s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(5deg)' }} />
        </div>

        {/* B4 — bawah tengah-kanan */}
        <div style={{
          position: 'absolute', bottom: '-28%', right: '5%', width: '52%',
          animation: 'bfe-float 4.6s ease-in-out 1.4s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(5deg) scaleX(-1)' }} />
        </div>

        {/* B5 — bawah kanan, besar, turun jauh */}
        <div style={{
          position: 'absolute', bottom: '-22%', right: '-8%', width: '58%',
          animation: 'bfe-sway 5.8s ease-in-out 0.9s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(-8deg)' }} />
        </div>

        {/* B6 — bawah kiri overlap lebih atas sedikit */}
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-3%', width: '44%',
          animation: 'bfe-breathe 4.0s ease-in-out 1.6s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(18deg) scaleX(-1)' }} />
        </div>

        {/* B7 — bawah kanan overlap lebih atas sedikit */}
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-3%', width: '44%',
          animation: 'bfe-float 4.4s ease-in-out 0.1s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(-12deg)' }} />
        </div>

      </div>
    </>
  );
}
