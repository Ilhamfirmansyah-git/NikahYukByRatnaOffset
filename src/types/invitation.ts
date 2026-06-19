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

export function emptyInvitationData(): InvitationData {
  const year = new Date().getFullYear() + 1;
  return {
    mempelai: {
      pria: {
        namaLengkap: '',
        namaPanggilan: '',
        anakKe: '',
        ayah: '',
        ibu: '',
        instagram: '',
        foto: '',
      },
      wanita: {
        namaLengkap: '',
        namaPanggilan: '',
        anakKe: '',
        ayah: '',
        ibu: '',
        instagram: '',
        foto: '',
      },
      urutanTampil: 'pria-dulu',
    },
    acara: [
      {
        nama: 'Akad Nikah',
        tanggal: `${year}-01-01`,
        waktuMulai: '08:00',
        waktuSelesai: '10:00',
        lokasi: '',
        alamat: '',
        mapsUrl: '',
      },
      {
        nama: 'Resepsi Pernikahan',
        tanggal: `${year}-01-01`,
        waktuMulai: '11:00',
        waktuSelesai: '16:00',
        lokasi: '',
        alamat: '',
        mapsUrl: '',
      },
    ],
    countdown: { tanggal: `${year}-01-01` },
    galeri: [],
    loveStory: [],
    quote: { teks: '', sumber: '' },
    musik: { autoplay: false },
    amplopDigital: {
      aktif: false,
      rekening: [],
      eWallet: [],
    },
    livestream: { aktif: false, platform: 'YouTube', url: '' },
    rsvpAktif: true,
    guestbookAktif: true,
    protokolKesehatan: { aktif: false, catatan: '' },
    tema: {
      warnaPrimer: '#8B5E3C',
      warnaSekunder: '#F5E6D3',
      font: 'Playfair Display',
    },
  };
}

export function defaultInvitationData(): InvitationData {
  const year = new Date().getFullYear() + 1;
  return {
    mempelai: {
      pria: {
        namaLengkap: 'Ahmad Rizki Firmansyah',
        namaPanggilan: 'Rizki',
        anakKe: '2',
        ayah: 'Hendra Firmansyah',
        ibu: 'Ratna Dewi',
        instagram: '@rizki.firmansyah',
        foto: 'https://picsum.photos/seed/groom-demo/400/500',
      },
      wanita: {
        namaLengkap: 'Siti Aminah Rahayu',
        namaPanggilan: 'Aminah',
        anakKe: '1',
        ayah: 'Agus Rahayu',
        ibu: 'Sri Wahyuni',
        instagram: '@aminah.rahayu',
        foto: 'https://picsum.photos/seed/bride-demo/400/500',
      },
      urutanTampil: 'pria-dulu',
    },
    acara: [
      {
        nama: 'Akad Nikah',
        tanggal: `${year}-06-15`,
        waktuMulai: '08:00',
        waktuSelesai: '10:00',
        lokasi: 'Masjid Agung Al-Falah',
        alamat: 'Jl. Merdeka No. 1, Kota Bandung, Jawa Barat',
        mapsUrl: 'https://maps.google.com',
      },
      {
        nama: 'Resepsi Pernikahan',
        tanggal: `${year}-06-15`,
        waktuMulai: '11:00',
        waktuSelesai: '16:00',
        lokasi: 'Gedung Serbaguna Graha Indah',
        alamat: 'Jl. Sudirman No. 45, Kota Bandung, Jawa Barat',
        mapsUrl: 'https://maps.google.com',
      },
    ],
    countdown: { tanggal: `${year}-06-15` },
    galeri: [
      'https://picsum.photos/seed/wed-g1/600/600',
      'https://picsum.photos/seed/wed-g2/600/600',
      'https://picsum.photos/seed/wed-g3/600/600',
      'https://picsum.photos/seed/wed-g4/600/600',
      'https://picsum.photos/seed/wed-g5/600/600',
      'https://picsum.photos/seed/wed-g6/600/600',
    ],
    loveStory: [
      { tahun: '2019', judul: 'Pertama Bertemu', cerita: 'Kami pertama kali bertemu di sebuah seminar pendidikan di Bandung. Pertemuan sederhana yang ternyata menjadi awal segalanya.' },
      { tahun: '2020', judul: 'Saling Mengenal', cerita: 'Dari obrolan singkat berubah menjadi percakapan panjang setiap hari. Kami mulai menyadari betapa banyak kesamaan di antara kami.' },
      { tahun: '2022', judul: 'Resmi Bersama', cerita: 'Dengan restu kedua keluarga, kami memulai perjalanan baru yang lebih bermakna dan penuh harapan.' },
      { tahun: '2024', judul: 'Lamaran', cerita: 'Di bawah senja yang indah, Rizki mengungkapkan niatnya untuk menjadikan Aminah sebagai pendamping hidup selamanya.' },
    ],
    quote: {
      teks: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.',
      sumber: 'QS. Ar-Rum: 21',
    },
    musik: { autoplay: false },
    amplopDigital: {
      aktif: true,
      rekening: [
        { bank: 'BCA', nomor: '1234567890', atasNama: 'Ahmad Rizki Firmansyah' },
        { bank: 'BRI', nomor: '0987654321', atasNama: 'Siti Aminah Rahayu' },
      ],
      eWallet: [
        { jenis: 'GoPay', nomor: '081234567890' },
        { jenis: 'OVO', nomor: '081234567890' },
      ],
    },
    livestream: { aktif: false, platform: 'YouTube', url: '' },
    rsvpAktif: true,
    guestbookAktif: true,
    protokolKesehatan: {
      aktif: true,
      catatan: 'Mohon hadir dalam kondisi sehat. Gunakan masker apabila diperlukan. Patuhi protokol kesehatan yang berlaku di venue.',
    },
    tema: {
      warnaPrimer: '#8B5E3C',
      warnaSekunder: '#F5E6D3',
      font: 'Playfair Display',
    },
  };
}
