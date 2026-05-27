export type FuelCode = '92' | '95' | '98' | 'DT' | 'GAS';
export type PumpState = 'active' | 'pending' | 'paused' | 'idle' | 'error' | 'offline';
export type DispenseMode = 'sum' | 'liters' | 'full' | 'direct';
export type Screen = 'pumps' | 'store' | 'tanks' | 'receive' | 'cash' | 'reports';
export type Theme = 'light' | 'night';
export type Density = 'compact' | 'regular' | 'comfy';
export type LayoutMode = 'grid' | 'row' | 'mixed';

export interface Fuel {
  code: string;
  cls: string;
  price: number;
  color: string;
}

export interface Pump {
  id: number;
  nozzle: number;
  fuel: FuelCode;
  state: PumpState;
  sum: number;
  liters: number;
  target: number;
  mode: DispenseMode;
  customer?: string;
  nozzleLifted?: boolean;
  error?: string;
}

export interface Tank {
  id: number;
  fuel: FuelCode;
  vol: number;
  max: number;
  temp: number;
  density: number;
  water: number;
  pumps: number[];
  lastFill: string;
  minLevel: number;
  criticalLevel: number;
  low?: boolean;
}

export interface Delivery {
  id: string;
  ttn: string;
  supplier: string;
  truck: string;
  driver: string;
  fuel: FuelCode;
  vol: number;
  density: number;
  temp: number;
  eta: string;
  status: 'arrived' | 'expected' | 'done';
  factVol?: number;
  deltaPct?: number;
}

export interface AppEvent {
  t: string;
  kind: 'ok' | 'warn' | 'err' | 'info';
  msg: string;
  meta: string;
}

export interface Product {
  id: string;
  cat: string;
  nm: string;
  price: number;
  stock: number;
  ico: string;
  low?: boolean;
}

export interface Category {
  id: string;
  nm: string;
  cnt: number;
}

export interface Operator {
  id: string;
  nm: string;
  rl: string;
  initials: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface TankOp {
  t: string;
  kind: 'sale' | 'measure' | 'shift' | 'fill';
  msg: string;
  vol: number;
  sum: string;
}

export interface AppTweaks {
  theme: Theme;
  density: Density;
  layout: LayoutMode;
  touch: boolean;
  showHotkeys: boolean;
}
