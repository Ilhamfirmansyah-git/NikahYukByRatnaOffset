export interface MempelaiPerson {
  namaLengkap?: string;
  namaPanggilan?: string;
  anakKe?: string;
  ayah?: string;
  ibu?: string;
  instagram?: string;
  foto?: string;
}

export interface Mempelai {
  pria: MempelaiPerson;
  wanita: MempelaiPerson;
  urutanTampil: 'pria-dulu' | 'wanita-dulu';
}

export interface Acara {
  nama: string;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  lokasi: string;
  alamat: string;
  mapsUrl?: string;
}

export interface Countdown {
  tanggal?: string;
}

export interface LoveStoryItem {
  tahun: string;
  judul: string;
  cerita: string;
}

export interface Quote {
  teks?: string;
  sumber?: string;
}

export interface Musik {
  url?: string;
  judul?: string;
  autoplay: boolean;
}

export interface RekeningItem {
  bank: string;
  nomor: string;
  atasNama: string;
}

export interface EWalletItem {
  jenis: string;
  nomor: string;
  qrUrl?: string;
}

export interface AmplopDigital {
  aktif: boolean;
  rekening: RekeningItem[];
  eWallet: EWalletItem[];
  alamatKado?: string;
}

export interface Livestream {
  aktif: boolean;
  platform?: string;
  url?: string;
}

export interface ProtokolKesehatan {
  aktif: boolean;
  catatan?: string;
}

export interface Tema {
  warnaPrimer: string;
  warnaSekunder: string;
  font: string;
}

export interface InvitationData {
  mempelai: Mempelai;
  acara: Acara[];
  countdown: Countdown;
  galeri: string[];
  loveStory: LoveStoryItem[];
  quote: Quote;
  musik: Musik;
  amplopDigital: AmplopDigital;
  livestream: Livestream;
  rsvpAktif: boolean;
  guestbookAktif: boolean;
  protokolKesehatan: ProtokolKesehatan;
  tema: Tema;
}

export function defaultInvitationData(): InvitationData {
  return {
    mempelai: {
      pria: {},
      wanita: {},
      urutanTampil: 'pria-dulu',
    },
    acara: [],
    countdown: {},
    galeri: [],
    loveStory: [],
    quote: {},
    musik: { autoplay: false },
    amplopDigital: { aktif: false, rekening: [], eWallet: [] },
    livestream: { aktif: false },
    rsvpAktif: true,
    guestbookAktif: true,
    protokolKesehatan: { aktif: false },
    tema: {
      warnaPrimer: '#8B5E3C',
      warnaSekunder: '#F5E6D3',
      font: 'Playfair Display',
    },
  };
}
