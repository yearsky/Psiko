import type { TestPackage } from '@/types/psikotest'
import { shuffle } from '@/lib/utils'
import { verbalQuestions } from './verbal'
import { numerikQuestions } from './numerik'
import { logikaQuestions } from './logika'
import { gambarQuestions } from './gambar'

function makePackage(pkg: Omit<TestPackage, 'totalQuestions'>): TestPackage {
  const totalQuestions = pkg.sections.reduce((sum, s) => sum + s.questions.length, 0)
  return { ...pkg, totalQuestions }
}

export const dummyPackages: TestPackage[] = [
  // ── Paket 1: Verbal Dasar ─────────────────────────────────────────────────
  makePackage({
    id: 'pkt-verbal-dasar',
    slug: 'verbal-dasar',
    title: 'Verbal Dasar',
    description: 'Latihan antonim, sinonim, dan analogi kata untuk persiapan psikotes kerja.',
    category: 'tpa',
    difficulty: 'easy',
    thumbnailUrl: undefined,
    totalTimeLimitMinutes: 20,
    passingScore: 65,
    targetPosition: 'Staff Umum',
    metadata: {
      isFeatured: true,
      isVerified: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-05-01T00:00:00Z',
    },
    sections: [
      {
        id: 'sec-verbal-antonim',
        title: 'Antonim',
        description: 'Pilih kata yang paling berlawanan maknanya.',
        instructions: 'Pilihlah satu jawaban yang paling berlawanan arti dengan kata yang dicetak KAPITAL.',
        questionTypes: ['verbal_antonym'],
        questions: shuffle(verbalQuestions.filter(q => q.type === 'verbal_antonym')),
        timeLimitSeconds: 300,
        passingScore: 60,
      },
      {
        id: 'sec-verbal-sinonim',
        title: 'Sinonim',
        description: 'Pilih kata yang paling mirip maknanya.',
        instructions: 'Pilihlah satu jawaban yang paling mirip atau sama artinya dengan kata yang dicetak KAPITAL.',
        questionTypes: ['verbal_synonym'],
        questions: shuffle(verbalQuestions.filter(q => q.type === 'verbal_synonym')),
        timeLimitSeconds: 300,
      },
      {
        id: 'sec-verbal-analogi',
        title: 'Analogi Kata',
        description: 'Temukan hubungan kata yang serupa.',
        instructions: 'Pilihlah jawaban yang melengkapi hubungan analogi.',
        questionTypes: ['verbal_analogy'],
        questions: shuffle(verbalQuestions.filter(q => q.type === 'verbal_analogy')),
        timeLimitSeconds: 300,
      },
    ],
  }),

  // ── Paket 2: Numerik Menengah ─────────────────────────────────────────────
  makePackage({
    id: 'pkt-numerik-menengah',
    slug: 'numerik-menengah',
    title: 'Numerik Menengah',
    description: 'Soal deret angka, aritmatika, dan soal cerita untuk persiapan TPA dan psikotes.',
    category: 'tpa',
    difficulty: 'medium',
    totalTimeLimitMinutes: 25,
    passingScore: 60,
    metadata: {
      isFeatured: true,
      isVerified: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-05-01T00:00:00Z',
    },
    sections: [
      {
        id: 'sec-numerik-deret',
        title: 'Deret Angka',
        description: 'Temukan pola dan lanjutkan deret.',
        instructions: 'Tentukan angka yang tepat untuk melanjutkan atau mengisi deret berikut.',
        questionTypes: ['numerical_series'],
        questions: shuffle(numerikQuestions.filter(q => q.type === 'numerical_series')),
        timeLimitSeconds: 600,
        questionTimeLimitSeconds: 60,
      },
      {
        id: 'sec-numerik-aritmatika',
        title: 'Aritmatika & Aljabar',
        description: 'Operasi hitung dan persamaan matematis.',
        instructions: 'Selesaikan soal hitungan dan persamaan berikut.',
        questionTypes: ['numerical_arithmetic'],
        questions: shuffle(numerikQuestions.filter(q => q.type === 'numerical_arithmetic')),
        timeLimitSeconds: 600,
        questionTimeLimitSeconds: 90,
      },
      {
        id: 'sec-numerik-cerita',
        title: 'Soal Cerita',
        description: 'Penerapan matematika dalam kehidupan sehari-hari.',
        instructions: 'Baca dan pahami soal cerita, kemudian tentukan jawaban yang tepat.',
        questionTypes: ['numerical_word_problem'],
        questions: shuffle(numerikQuestions.filter(q => q.type === 'numerical_word_problem')),
        timeLimitSeconds: 600,
        questionTimeLimitSeconds: 120,
      },
    ],
  }),

  // ── Paket 3: Logika & Penalaran ───────────────────────────────────────────
  makePackage({
    id: 'pkt-logika-dasar',
    slug: 'logika-dasar',
    title: 'Logika & Penalaran',
    description: 'Latihan silogisme dan penalaran logis untuk psikotes dan seleksi CPNS.',
    category: 'cpns',
    difficulty: 'medium',
    totalTimeLimitMinutes: 20,
    passingScore: 65,
    targetPosition: 'ASN/CPNS',
    metadata: {
      isFeatured: false,
      isVerified: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-05-01T00:00:00Z',
    },
    sections: [
      {
        id: 'sec-logika-silogisme',
        title: 'Silogisme',
        description: 'Tarik kesimpulan dari dua pernyataan.',
        instructions: 'Berdasarkan dua pernyataan yang diberikan, pilihlah kesimpulan yang PASTI benar.',
        questionTypes: ['logical_syllogism'],
        questions: shuffle(logikaQuestions.filter(q => q.type === 'logical_syllogism')),
        timeLimitSeconds: 600,
      },
      {
        id: 'sec-logika-penalaran',
        title: 'Penalaran Logis',
        description: 'Analisis dan simpulkan dari informasi yang diberikan.',
        instructions: 'Analisis informasi yang diberikan dan tentukan kesimpulan yang paling tepat.',
        questionTypes: ['logical_reasoning'],
        questions: shuffle(logikaQuestions.filter(q => q.type === 'logical_reasoning')),
        timeLimitSeconds: 600,
      },
      {
        id: 'sec-logika-perbandingan',
        title: 'Perbandingan Logis',
        description: 'Bandingkan dua nilai dan tentukan hubungannya.',
        instructions: 'Tentukan hubungan antara x dan y berdasarkan informasi yang diberikan.',
        questionTypes: ['logical_comparison'],
        questions: shuffle(logikaQuestions.filter(q => q.type === 'logical_comparison')),
        timeLimitSeconds: 600,
      },
    ],
  }),

  // ── Paket 4: Tes Gambar ───────────────────────────────────────────────────
  makePackage({
    id: 'pkt-gambar-figur',
    slug: 'gambar-figur',
    title: 'Tes Gambar & Figur',
    description: 'Latihan soal seri gambar, matriks, dan pola figur untuk psikotes bergambar.',
    category: 'psikotes_kerja',
    difficulty: 'medium',
    totalTimeLimitMinutes: 20,
    passingScore: 60,
    metadata: {
      isFeatured: true,
      isVerified: false,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-05-01T00:00:00Z',
    },
    sections: [
      {
        id: 'sec-gambar-seri',
        title: 'Seri Gambar',
        description: 'Temukan gambar selanjutnya dalam pola seri.',
        instructions: 'Perhatikan pola pada gambar yang tersedia, lalu pilih gambar yang melengkapi pola tersebut.',
        questionTypes: ['figure_series', 'figure_odd_one_out'],
        questions: shuffle(gambarQuestions.filter(q =>
          q.type === 'figure_series' || q.type === 'figure_odd_one_out'
        )),
        timeLimitSeconds: 600,
        questionTimeLimitSeconds: 30,
      },
      {
        id: 'sec-gambar-matriks',
        title: 'Matriks Gambar',
        description: 'Lengkapi matriks gambar 3×3.',
        instructions: 'Perhatikan pola pada matriks gambar, lalu pilih gambar yang mengisi kotak kosong.',
        questionTypes: ['figure_matrix'],
        questions: shuffle(gambarQuestions.filter(q => q.type === 'figure_matrix')),
        timeLimitSeconds: 600,
        questionTimeLimitSeconds: 45,
      },
    ],
  }),

  // ── Paket 5: Paket Lengkap CPNS ───────────────────────────────────────────
  makePackage({
    id: 'pkt-lengkap-cpns',
    slug: 'paket-lengkap-cpns',
    title: 'Paket Lengkap CPNS',
    description: 'Simulasi lengkap psikotes CPNS mencakup verbal, numerik, logika, dan gambar.',
    category: 'cpns',
    difficulty: 'hard',
    totalTimeLimitMinutes: 60,
    passingScore: 70,
    targetPosition: 'CPNS / ASN',
    year: 2025,
    metadata: {
      isFeatured: true,
      isVerified: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-05-01T00:00:00Z',
    },
    sections: [
      {
        id: 'sec-cpns-verbal',
        title: 'Tes Verbal',
        description: 'Kemampuan bahasa dan perbendaharaan kata.',
        instructions: 'Kerjakan soal verbal berikut dengan teliti.',
        questionTypes: ['verbal_antonym', 'verbal_synonym', 'verbal_analogy'],
        questions: shuffle(verbalQuestions).slice(0, 10),
        timeLimitSeconds: 900,
      },
      {
        id: 'sec-cpns-numerik',
        title: 'Tes Numerik',
        description: 'Kemampuan berhitung dan penalaran angka.',
        instructions: 'Kerjakan soal numerik berikut. Kalkulator tidak diperbolehkan.',
        questionTypes: ['numerical_series', 'numerical_arithmetic', 'numerical_word_problem'],
        questions: shuffle(numerikQuestions).slice(0, 10),
        timeLimitSeconds: 900,
        questionTimeLimitSeconds: 90,
      },
      {
        id: 'sec-cpns-logika',
        title: 'Tes Logika',
        description: 'Kemampuan penalaran dan berpikir logis.',
        instructions: 'Analisis setiap pernyataan dan tentukan jawaban yang paling logis.',
        questionTypes: ['logical_syllogism', 'logical_reasoning', 'logical_comparison'],
        questions: shuffle(logikaQuestions).slice(0, 10),
        timeLimitSeconds: 900,
      },
      {
        id: 'sec-cpns-gambar',
        title: 'Tes Gambar',
        description: 'Kemampuan persepsi visual dan pola gambar.',
        instructions: 'Perhatikan pola pada gambar dan pilih jawaban yang paling tepat.',
        questionTypes: ['figure_series', 'figure_matrix'],
        questions: shuffle(gambarQuestions).slice(0, 8),
        timeLimitSeconds: 900,
        questionTimeLimitSeconds: 30,
      },
    ],
  }),
]