import type { AirlineCompany, Offer, Segment } from '@/types/search'

// ─── Airlines ────────────────────────────────────────────────────────────────

const AIRLINES: Record<string, AirlineCompany> = {
  KZ: { code: 'KZ', name: 'Air Astana',           logo: 'https://logo.clearbit.com/airastana.com' },
  SU: { code: 'SU', name: 'Аэрофлот',             logo: 'https://logo.clearbit.com/aeroflot.ru' },
  TK: { code: 'TK', name: 'Turkish Airlines',     logo: 'https://logo.clearbit.com/turkishairlines.com' },
  FZ: { code: 'FZ', name: 'flydubai',             logo: 'https://logo.clearbit.com/flydubai.com' },
  EK: { code: 'EK', name: 'Emirates',             logo: 'https://logo.clearbit.com/emirates.com' },
  QR: { code: 'QR', name: 'Qatar Airways',        logo: 'https://logo.clearbit.com/qatarairways.com' },
  S7: { code: 'S7', name: 'S7 Airlines',          logo: 'https://logo.clearbit.com/s7.ru' },
  U6: { code: 'U6', name: 'Уральские авиалинии',  logo: 'https://logo.clearbit.com/uralairlines.ru' },
  HY: { code: 'HY', name: 'Uzbekistan Airways',   logo: 'https://logo.clearbit.com/uzairways.com' },
  DV: { code: 'DV', name: 'SCAT Airlines',        logo: '' },
  KC: { code: 'KC', name: 'Air Astana (KC)',      logo: 'https://logo.clearbit.com/airastana.com' },
  WZ: { code: 'WZ', name: 'Red Wings',            logo: 'https://logo.clearbit.com/redwings.aero' },
  DP: { code: 'DP', name: 'Pobeda',               logo: 'https://logo.clearbit.com/pobeda.aero' },
};

// ─── Airports ────────────────────────────────────────────────────────────────

// Промежуточные аэропорты для стыковок
const HUB_AIRPORTS = ['IST', 'DXB', 'DOH', 'NQZ', 'SVX', 'TAS', 'AUH', 'FCO', 'VIE', 'WAW'];

// Авиакомпании на каждый хаб
const HUB_AIRLINES: Record<string, keyof typeof AIRLINES> = {
  IST: 'TK',
  DXB: 'EK',
  DOH: 'QR',
  NQZ: 'DV',
  SVX: 'U6',
  TAS: 'HY',
  AUH: 'EK',
  FCO: 'SU',
  VIE: 'TK',
  WAW: 'S7',
};

// Воздушные суда
const AIRCRAFTS = [
  'Boeing 737-800',
  'Boeing 737 MAX 8',
  'Boeing 767-300',
  'Boeing 787-8',
  'Airbus A319',
  'Airbus A320',
  'Airbus A321',
  'Airbus A330-200',
  'Airbus A380',
  'Embraer 190',
];

// Варианты политики возврата
type RefundPolicy = 'none' | 'paid' | 'free';
const REFUND_POLICIES: RefundPolicy[] = ['none', 'paid', 'free'];

// Варианты веса багажа
const BAGGAGE_WEIGHTS = [15, 20, 23, 30];

// ─── Утилиты ─────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Добавляет минуты к ISO-строке */
function addMinutes(isoDate: string, minutes: number): string {
  return new Date(new Date(isoDate).getTime() + minutes * 60_000).toISOString().slice(0, 19);
}

/** Генерирует случайное время вылета на заданную дату */
function randomDeparture(date: string): string {
  const hours   = String(randInt(0, 23)).padStart(2, '0');
  const minutes = pick(['00', '15', '30', '45']);
  return `${date}T${hours}:${minutes}:00`;
}

// ─── Генераторы сегментов ────────────────────────────────────────────────────

let segCounter = 1;

function makeDirectSegment(
  from: string,
  to: string,
  departureDate: string,
  airlineCode: keyof typeof AIRLINES,
): Segment {
  const id            = `seg-${String(segCounter++).padStart(4, '0')}`;
  const departure_time = randomDeparture(departureDate);
  const flightMinutes  = randInt(90, 480);
  const arrival_time   = addMinutes(departure_time, flightMinutes);

  return {
    id,
    departure_airport: from,
    arrival_airport:   to,
    departure_time,
    arrival_time,
    airline:           AIRLINES[airlineCode],
    stops_count:       0,
    flight_number:     `${airlineCode} ${randInt(100, 9999)}`,
    aircraft_type:     pick(AIRCRAFTS),
  };
}

// ─── Генератор офферов ───────────────────────────────────────────────────────

export interface GenerateOptions {
  /** Кол-во офферов (по умолчанию 50) */
  count?: number;
  /** Дата вылета, напр. '2025-08-15' */
  date?: string;
  /** Аэропорт отправления */
  from?: string;
  /** Аэропорт назначения */
  to?: string;
  /** Максимальное кол-во пересадок (0–2) */
  maxStops?: number;
}

export function generateOffers(options: GenerateOptions = {}): Offer[] {
  const {
    count    = 50,
    date     = '2025-08-15',
    from     = 'ALA',
    to       = 'SVO',
    maxStops = 2,
  } = options;

  const offers: Offer[] = [];
  const airlineCodes = Object.keys(AIRLINES) as (keyof typeof AIRLINES)[];

  for (let i = 0; i < count; i++) {
    const offerId   = `offer-gen-${String(i + 1).padStart(4, '0')}`;
    const stopsCount = randInt(0, maxStops);

    let segments: Segment[];
    let totalStops: number;

    if (stopsCount === 0) {
      // ── Прямой рейс ──────────────────────────────────────────────────────
      const airline = pick(airlineCodes);
      segments   = [makeDirectSegment(from, to, date, airline)];
      totalStops = 0;

    } else if (stopsCount === 1) {
      // ── 1 пересадка ──────────────────────────────────────────────────────
      const hub        = pick(HUB_AIRPORTS);
      const airline1   = HUB_AIRLINES[hub] ?? pick(airlineCodes);
      const airline2   = pick(airlineCodes);

      const seg1       = makeDirectSegment(from, hub, date, airline1);
      // Стыковка: вылет из хаба через 1–4 ч после прилёта
      const layoverMin = randInt(60, 240);
      const seg2Dep    = addMinutes(seg1.arrival_time, layoverMin);
      const seg2       = makeDirectSegment(hub, to, seg2Dep.slice(0, 10), airline2);
      // Подгоняем время вылета seg2 точно под стыковку
      seg2.departure_time = seg2Dep;
      seg2.arrival_time   = addMinutes(seg2Dep, randInt(90, 360));

      segments   = [seg1, seg2];
      totalStops = 1;

    } else {
      // ── 2 пересадки ──────────────────────────────────────────────────────
      const hub1 = pick(HUB_AIRPORTS);
      let   hub2 = pick(HUB_AIRPORTS);
      // Хабы не должны совпадать
      while (hub2 === hub1) hub2 = pick(HUB_AIRPORTS);

      const airline1 = HUB_AIRLINES[hub1] ?? pick(airlineCodes);
      const airline2 = HUB_AIRLINES[hub2] ?? pick(airlineCodes);
      const airline3 = pick(airlineCodes);

      const seg1        = makeDirectSegment(from, hub1, date, airline1);
      const layover1    = randInt(60, 180);
      const seg2Dep     = addMinutes(seg1.arrival_time, layover1);
      const seg2        = makeDirectSegment(hub1, hub2, seg2Dep.slice(0, 10), airline2);
      seg2.departure_time = seg2Dep;
      seg2.arrival_time   = addMinutes(seg2Dep, randInt(60, 300));

      const layover2    = randInt(60, 180);
      const seg3Dep     = addMinutes(seg2.arrival_time, layover2);
      const seg3        = makeDirectSegment(hub2, to, seg3Dep.slice(0, 10), airline3);
      seg3.departure_time = seg3Dep;
      seg3.arrival_time   = addMinutes(seg3Dep, randInt(90, 360));

      segments   = [seg1, seg2, seg3];
      totalStops = 2;
    }

    // ── Цена ─────────────────────────────────────────────────────────────────
    // Прямые дороже, многопересадочные дешевле
    const basePrice = totalStops === 0
      ? randInt(35_000, 140_000)
      : totalStops === 1
        ? randInt(28_000, 90_000)
        : randInt(20_000, 55_000);

    // ── Багаж ────────────────────────────────────────────────────────────────
    const hasBaggage      = Math.random() > 0.4;
    const baggage_weight  = hasBaggage ? pick(BAGGAGE_WEIGHTS) : undefined;
    const baggageSurcharge = hasBaggage ? randInt(5_000, 20_000) : 0;

    // ── Возврат ──────────────────────────────────────────────────────────────
    const refund_policy: RefundPolicy = pick(REFUND_POLICIES);
    const refundSurcharge = refund_policy === 'free' ? randInt(8_000, 25_000) : 0;

    const price = basePrice + baggageSurcharge + refundSurcharge;

    offers.push({
      id:                  offerId,
      segments,
      price:               { amount: price, currency: 'KZT' },
      is_baggage_included: hasBaggage,
      ...(baggage_weight !== undefined && { baggage_weight }),
      refund_policy,
      departure_airport:   from,
      arrival_airport:     to,
      total_stops:         totalStops,
    });
  }

  return offers;
}

// ─── Пример использования ────────────────────────────────────────────────────
//
//   import { generateOffers } from '@/data/generateOffers';
//
//   // 100 офферов с дефолтами (ALA → SVO, 15 авг)
//   const offers = generateOffers({ count: 100 });
//
//   // Кастомный маршрут без пересадок
//   const directOnly = generateOffers({ count: 20, from: 'ALA', to: 'DXB', maxStops: 0 });
//
//   // В axios-mock:
//   mock.onPost('/api/travel/search/flight').reply(() =>
//     new Promise((res) =>
//       setTimeout(() => res([200, generateOffers({ count: 50 })]), 1200)
//     )
//   );