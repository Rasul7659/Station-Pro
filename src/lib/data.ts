import type { Fuel, FuelCode, Pump, Tank, Delivery, AppEvent, Product, Category, Operator, TankOp } from './types';

export const FUELS: Record<FuelCode, Fuel> = {
  '92':  { code: 'АИ-92', cls: 'f-92', price: 52.40, color: '#f59e0b' },
  '95':  { code: 'АИ-95', cls: 'f-95', price: 56.90, color: '#16a34a' },
  '98':  { code: 'АИ-98', cls: 'f-98', price: 64.20, color: '#2563eb' },
  'DT':  { code: 'ДТ',    cls: 'f-dt', price: 58.10, color: '#0f172a' },
  'GAS': { code: 'Газ',   cls: 'f-gas', price: 28.50, color: '#a855f7' },
};

export const PUMPS_INIT: Pump[] = [
  { id: 1,  nozzle: 1, fuel: '95', state: 'active',  sum: 1840.50, liters: 32.34, target: 2000, mode: 'sum',    customer: 'Toyota Camry · Е547КВ' },
  { id: 2,  nozzle: 2, fuel: 'DT', state: 'active',  sum: 4096.20, liters: 70.50, target: 80,   mode: 'liters', customer: 'КАМАЗ · О234ТТ' },
  { id: 3,  nozzle: 1, fuel: '92', state: 'pending', sum: 0,       liters: 0,     target: 1500, mode: 'sum',    nozzleLifted: true },
  { id: 4,  nozzle: 2, fuel: '95', state: 'idle',    sum: 0,       liters: 0,     target: 0,    mode: 'sum' },
  { id: 5,  nozzle: 1, fuel: '98', state: 'active',  sum: 2810.40, liters: 43.78, target: 50,   mode: 'liters', customer: 'BMW X5 · М112ОР' },
  { id: 6,  nozzle: 2, fuel: 'DT', state: 'paused',  sum: 1240.00, liters: 21.34, target: 3000, mode: 'sum' },
  { id: 7,  nozzle: 1, fuel: '92', state: 'idle',    sum: 0,       liters: 0,     target: 0,    mode: 'sum' },
  { id: 8,  nozzle: 2, fuel: '95', state: 'idle',    sum: 0,       liters: 0,     target: 0,    mode: 'sum' },
  { id: 9,  nozzle: 1, fuel: '98', state: 'error',   sum: 0,       liters: 0,     target: 0,    mode: 'sum',    error: 'Связь с ТРК потеряна' },
  { id: 10, nozzle: 2, fuel: 'DT', state: 'idle',    sum: 0,       liters: 0,     target: 0,    mode: 'sum' },
  { id: 11, nozzle: 1, fuel: 'GAS', state: 'active', sum: 712.50,  liters: 25.00, target: 25,   mode: 'liters', customer: 'Lada Vesta · К902АН' },
  { id: 12, nozzle: 2, fuel: '92', state: 'offline', sum: 0,       liters: 0,     target: 0,    mode: 'sum',    error: 'ТРК отключена' },
];

export const TANKS: Tank[] = [
  { id: 1, fuel: '92',  vol: 19400, max: 25000, temp: 12.4, density: 0.745, water: 2,  pumps: [3, 7],     lastFill: '24 апр · 14 200 л', minLevel: 5000,  criticalLevel: 2500 },
  { id: 2, fuel: '95',  vol: 21800, max: 25000, temp: 12.8, density: 0.751, water: 1,  pumps: [1, 4, 8],  lastFill: '26 апр · 18 500 л', minLevel: 5000,  criticalLevel: 2500 },
  { id: 3, fuel: '98',  vol: 6400,  max: 15000, temp: 12.1, density: 0.760, water: 3,  pumps: [5, 9],     lastFill: '21 апр · 12 000 л', minLevel: 7000,  criticalLevel: 3500, low: true },
  { id: 4, fuel: 'DT',  vol: 23120, max: 30000, temp: 10.6, density: 0.840, water: 1,  pumps: [2, 6, 10], lastFill: '27 апр · 22 000 л', minLevel: 6000,  criticalLevel: 3000 },
  { id: 5, fuel: 'GAS', vol: 4900,  max: 12000, temp: 14.2, density: 0.510, water: 0,  pumps: [11],       lastFill: '23 апр · 9 800 л',  minLevel: 3000,  criticalLevel: 1500 },
];

export const TANK_HISTORY: Record<number, number[]> = {
  1: [21200,21100,21100,21000,20800,20800,20700,20650,20600,20500,20500,20400,20300,20200,20100,20000,19980,19900,19850,19800,19750,19600,19500,19400],
  2: [24800,24700,24600,24500,24400,24300,24200,24100,24000,23900,23800,23600,23400,23200,23000,22800,22650,22500,22300,22200,22100,22000,21900,21800],
  3: [10200,10100,10100,10000, 9900, 9900, 9800, 9700, 9500, 9300, 9100, 9000, 8800, 8500, 8200, 8000, 7800, 7500, 7300, 7100, 7000, 6800, 6600, 6400],
  4: [27500,27300,27200,27000,26800,26600,26400,26200,26000,25800,25600,25400,25200,25000,24800,24600,24400,24200,24000,23800,23600,23400,23250,23120],
  5: [ 6200, 6100, 6100, 6000, 5950, 5900, 5850, 5800, 5800, 5750, 5700, 5650, 5600, 5550, 5500, 5400, 5300, 5200, 5150, 5100, 5050, 5000, 4950, 4900],
};

export const DELIVERIES: Delivery[] = [
  { id: 'd1', ttn: 'А-7842', supplier: 'ООО «Лукойл-Северо-Запад»', truck: 'Volvo FH · К172ОТ',   driver: 'А. Воронцов', fuel: '98', vol: 12000, density: 0.762, temp: 11.8, eta: '14:50', status: 'arrived' },
  { id: 'd2', ttn: 'А-7843', supplier: 'ООО «Лукойл-Северо-Запад»', truck: 'Volvo FH · М284НР',   driver: 'С. Михайлов', fuel: '95', vol: 18000, density: 0.751, temp: 12.2, eta: '17:30', status: 'expected' },
  { id: 'd3', ttn: 'А-7821', supplier: 'ПАО «Газпром нефть»',       truck: 'MAN TGS · Т401ВВ',    driver: 'Д. Кравцов',  fuel: '95', vol: 18500, density: 0.751, temp: 12.0, eta: '26 апр', status: 'done', factVol: 18512, deltaPct: 0.06 },
  { id: 'd4', ttn: 'А-7780', supplier: 'ПАО «Татнефть»',            truck: 'Scania R450 · Е881МЕ', driver: 'И. Лебедев',  fuel: 'DT', vol: 22000, density: 0.840, temp: 10.4, eta: '24 апр', status: 'done', factVol: 21988, deltaPct: -0.05 },
  { id: 'd5', ttn: 'А-7702', supplier: 'ООО «Лукойл-Северо-Запад»', truck: 'Volvo FH · К172ОТ',   driver: 'А. Воронцов', fuel: '92', vol: 14200, density: 0.745, temp: 13.1, eta: '21 апр', status: 'done', factVol: 14198, deltaPct: -0.01 },
];

export const TANK_OPS: TankOp[] = [
  { t: '13:08', kind: 'sale',    msg: 'Отпуск через колонку 1',    vol: -32.34, sum: '−1 840.50 ₽' },
  { t: '11:42', kind: 'sale',    msg: 'Отпуск через колонку 4',    vol: -18.20, sum: '−1 035.58 ₽' },
  { t: '10:15', kind: 'measure', msg: 'Замер · оп. И.Соколов',     vol: 21850,  sum: 'факт' },
  { t: '08:00', kind: 'shift',   msg: 'Открытие смены 47',          vol: 22150,  sum: 'старт' },
  { t: '04:22', kind: 'sale',    msg: 'Отпуск через колонку 8',    vol: -45.10, sum: '−2 567.19 ₽' },
  { t: '00:00', kind: 'measure', msg: 'Автозамер (УУП)',            vol: 22890,  sum: 'auto' },
  { t: '26 апр 18:30', kind: 'fill', msg: 'Слив · ТТН №А-7821',    vol: 18500,  sum: 'поставка' },
  { t: '26 апр 18:25', kind: 'measure', msg: 'Замер до слива',      vol: 4380,   sum: 'до' },
];

export const EVENTS_INIT: AppEvent[] = [
  { t: '14:32:18', kind: 'ok',   msg: 'Колонка 11 · Отпуск завершён · 25.00 л · 712.50 ₽',  meta: 'Чек #4821' },
  { t: '14:31:54', kind: 'info', msg: 'Колонка 5 · Запуск отпуска · АИ-98 · 50.00 л',         meta: 'оп. И.Соколов' },
  { t: '14:31:09', kind: 'warn', msg: 'Колонка 9 · Пауза по таймауту связи',                   meta: 'auto' },
  { t: '14:30:47', kind: 'ok',   msg: 'Внесение в кассу · 5 000.00 ₽',                         meta: 'оп. И.Соколов' },
  { t: '14:29:31', kind: 'err',  msg: 'Колонка 9 · Связь с ТРК потеряна',                      meta: 'CAN-bus' },
  { t: '14:28:02', kind: 'ok',   msg: 'Колонка 2 · Запуск отпуска · ДТ · 80.00 л',             meta: 'топл. карта' },
  { t: '14:27:18', kind: 'info', msg: 'Магазин · Продажа · Кофе + шок. батончик',              meta: '320.00 ₽' },
  { t: '14:25:55', kind: 'warn', msg: 'Емкость 3 (АИ-98) · Низкий уровень · 6 400 л / 15 000', meta: '42.7%' },
  { t: '14:24:12', kind: 'ok',   msg: 'Колонка 1 · Отпуск завершён · 32.34 л · 1 840.50 ₽',   meta: 'Чек #4818' },
  { t: '14:22:48', kind: 'info', msg: 'Смена 47 продолжена · оп. И.Соколов',                   meta: '08:00' },
];

export const PRODUCTS: Product[] = [
  { id: 'p1',  cat: 'cof', nm: 'Кофе Americano',     price: 120, stock: 40, ico: '☕' },
  { id: 'p2',  cat: 'cof', nm: 'Кофе Capuccino',     price: 160, stock: 28, ico: '☕' },
  { id: 'p3',  cat: 'cof', nm: 'Кофе Latte',          price: 180, stock: 22, ico: '☕' },
  { id: 'p4',  cat: 'cof', nm: 'Чай чёрный',          price: 80,  stock: 50, ico: '🍵' },
  { id: 'p5',  cat: 'snk', nm: 'Snickers 50 г',       price: 95,  stock: 64, ico: '🍫' },
  { id: 'p6',  cat: 'snk', nm: 'Twix 55 г',           price: 95,  stock: 48, ico: '🍫' },
  { id: 'p7',  cat: 'snk', nm: 'Чипсы Lays 80 г',     price: 145, stock: 30, ico: '🥔' },
  { id: 'p8',  cat: 'snk', nm: 'Сухарики Кириешки',   price: 75,  stock: 56, ico: '🍘' },
  { id: 'p9',  cat: 'drk', nm: 'Coca-Cola 0.5 л',     price: 110, stock: 72, ico: '🥤' },
  { id: 'p10', cat: 'drk', nm: 'Pepsi 0.5 л',         price: 105, stock: 38, ico: '🥤' },
  { id: 'p11', cat: 'drk', nm: 'Вода Aqua 0.5 л',     price: 65,  stock: 110, ico: '💧' },
  { id: 'p12', cat: 'drk', nm: 'Сок Я Apple 0.3 л',   price: 130, stock: 24, ico: '🧃' },
  { id: 'p13', cat: 'auto', nm: 'Незамерзайка -25 °C', price: 290, stock: 18, ico: '🧴' },
  { id: 'p14', cat: 'auto', nm: 'Стеклоомыватель',    price: 320, stock: 14, ico: '🧴' },
  { id: 'p15', cat: 'auto', nm: 'Масло Mobil 1 л',    price: 980, stock: 6,  ico: '🛢️', low: true },
  { id: 'p16', cat: 'auto', nm: 'Перчатки одноразовые', price: 45, stock: 88, ico: '🧤' },
  { id: 'p17', cat: 'cig', nm: 'Сигареты Parliament', price: 280, stock: 24, ico: '🚬' },
  { id: 'p18', cat: 'cig', nm: 'Сигареты Marlboro',   price: 270, stock: 28, ico: '🚬' },
  { id: 'p19', cat: 'sup', nm: 'Salt 200 г',          price: 55,  stock: 32, ico: '🧂' },
  { id: 'p20', cat: 'sup', nm: 'Жвачка Orbit',        price: 75,  stock: 96, ico: '🍬' },
  { id: 'p21', cat: 'cof', nm: 'Эспрессо',            price: 90,  stock: 40, ico: '☕' },
  { id: 'p22', cat: 'snk', nm: 'Хот-дог классик',     price: 180, stock: 12, ico: '🌭' },
  { id: 'p23', cat: 'snk', nm: 'Сэндвич с курицей',   price: 220, stock: 8,  ico: '🥪' },
  { id: 'p24', cat: 'auto', nm: 'WD-40 100 мл',       price: 410, stock: 9,  ico: '🛢️' },
];

export const CATEGORIES: Category[] = [
  { id: 'all',  nm: 'Все',         cnt: PRODUCTS.length },
  { id: 'fav',  nm: '★ Избранное', cnt: 8 },
  { id: 'cof',  nm: 'Кофе и чай',  cnt: PRODUCTS.filter(p => p.cat === 'cof').length },
  { id: 'snk',  nm: 'Снеки',       cnt: PRODUCTS.filter(p => p.cat === 'snk').length },
  { id: 'drk',  nm: 'Напитки',     cnt: PRODUCTS.filter(p => p.cat === 'drk').length },
  { id: 'auto', nm: 'Автохимия',   cnt: PRODUCTS.filter(p => p.cat === 'auto').length },
  { id: 'cig',  nm: 'Табак',       cnt: PRODUCTS.filter(p => p.cat === 'cig').length },
  { id: 'sup',  nm: 'Прочее',      cnt: PRODUCTS.filter(p => p.cat === 'sup').length },
];

export const OPERATORS: Operator[] = [
  { id: 'op1', nm: 'И. Соколов', rl: 'Старший оператор', initials: 'ИС' },
  { id: 'op2', nm: 'А. Петрова', rl: 'Оператор-кассир',  initials: 'АП' },
  { id: 'op3', nm: 'М. Новиков', rl: 'Оператор',         initials: 'МН' },
  { id: 'op4', nm: 'Е. Сидоров', rl: 'Стажёр',           initials: 'ЕС' },
];
