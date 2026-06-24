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

/**
 * 9 bouquet positions matching original cutout layout.
 * Outer div: handles position + animation (translateY/sway/breathe).
 * Inner img: handles rotation so flowers always face inward toward center.
 */
export function BlueFlowerBouquets() {
  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>

        {/* 1 — cutout4: kiri atas — bunga mengarah kanan-bawah */}
        <div style={{
          position: 'absolute', top: '2%', left: '-3%', width: '35%',
          animation: 'bfe-sway 4.5s ease-in-out 0.3s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(130deg) scaleX(-1)' }} />
        </div>

        {/* 2 — cutout2: atas tengah-kanan — bunga mengarah ke bawah */}
        <div style={{
          position: 'absolute', top: '-3%', right: '10%', width: '40%',
          animation: 'bfe-float 5s ease-in-out 0.8s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(180deg)' }} />
        </div>

        {/* 3 — cutout8: kanan tengah-atas — bunga mengarah ke kiri */}
        <div style={{
          position: 'absolute', top: '8%', right: '-3%', width: '38%',
          animation: 'bfe-breathe 4.2s ease-in-out 1.5s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(85deg)' }} />
        </div>

        {/* 4 — cutout3: kiri bawah — bunga mengarah kanan-atas */}
        <div style={{
          position: 'absolute', bottom: '5%', left: '-5%', width: '40%',
          animation: 'bfe-sway 4.8s ease-in-out 0.5s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(15deg) scaleX(-1)' }} />
        </div>

        {/* 5 — cutout7: kiri tengah-bawah — bunga mengarah ke kanan */}
        <div style={{
          position: 'absolute', bottom: '18%', left: '-5%', width: '35%',
          animation: 'bfe-float 3.8s ease-in-out 2.0s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(-20deg) scaleX(-1)' }} />
        </div>

        {/* 6 — cutout5: bawah kanan — bunga mengarah atas-kiri */}
        <div style={{
          position: 'absolute', bottom: '2%', right: '-3%', width: '38%',
          animation: 'bfe-breathe 5.5s ease-in-out 1.2s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(-10deg)' }} />
        </div>

        {/* 7 — cutout6: bawah tengah — bunga menghadap ke atas */}
        <div style={{
          position: 'absolute', bottom: '0%', left: '25%', width: '50%',
          animation: 'bfe-sway 5.2s ease-in-out 0.7s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(5deg)' }} />
        </div>

        {/* 8 — cutout1: kanan atas paling atas — bunga mengarah kiri-bawah */}
        <div style={{
          position: 'absolute', top: '-5%', right: '-5%', width: '45%',
          animation: 'bfe-float 4.3s ease-in-out 0.2s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(185deg)' }} />
        </div>

        {/* 9 — pengganti cutout9 (frame): aksen kiri tengah */}
        <div style={{
          position: 'absolute', top: '36%', left: '-8%', width: '28%',
          animation: 'bfe-breathe 6s ease-in-out 1.8s infinite',
        }}>
          <img src={BOUQUET} alt="" style={{ width: '100%', transform: 'rotate(-75deg) scaleX(-1)' }} />
        </div>

      </div>
    </>
  );
}
