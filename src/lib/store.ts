'use client';
import { create } from 'zustand';
import { PUMPS_INIT, EVENTS_INIT } from './data';
import type { Pump, AppEvent, CartItem, Operator, Screen, AppTweaks } from './types';

interface AppState {
  screen: Screen;
  operator: Operator | null;
  pumps: Pump[];
  events: AppEvent[];
  cart: CartItem[];
  selectedPumpId: number | null;
  dispenseOpen: boolean;
  paymentOpen: boolean;
  paymentOrder: { pumpId: number; fuelCode: string; liters: number; sum: number; nozzleId: number } | null;
  tweaks: AppTweaks;
  showHotkeyOverlay: boolean;

  setScreen: (screen: Screen) => void;
  setOperator: (op: Operator | null) => void;
  selectPump: (id: number | null) => void;
  openDispense: () => void;
  closeDispense: () => void;
  openPayment: (order: AppState['paymentOrder']) => void;
  closePayment: () => void;
  updatePump: (id: number, patch: Partial<Pump>) => void;
  addEvent: (ev: AppEvent) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  setTweaks: (t: Partial<AppTweaks>) => void;
  setShowHotkeyOverlay: (v: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  screen: 'pumps',
  operator: null,
  pumps: PUMPS_INIT,
  events: EVENTS_INIT,
  cart: [],
  selectedPumpId: null,
  dispenseOpen: false,
  paymentOpen: false,
  paymentOrder: null,
  tweaks: { theme: 'light', density: 'regular', layout: 'grid', touch: false, showHotkeys: true },
  showHotkeyOverlay: false,

  setScreen: (screen) => set({ screen }),
  setOperator: (operator) => set({ operator }),
  selectPump: (selectedPumpId) => set({ selectedPumpId }),
  openDispense: () => set({ dispenseOpen: true }),
  closeDispense: () => set({ dispenseOpen: false }),
  openPayment: (paymentOrder) => set({ paymentOpen: true, paymentOrder, dispenseOpen: false }),
  closePayment: () => set({ paymentOpen: false, paymentOrder: null }),
  updatePump: (id, patch) =>
    set({ pumps: get().pumps.map((p) => (p.id === id ? { ...p, ...patch } : p)) }),
  addEvent: (ev) => set({ events: [ev, ...get().events].slice(0, 50) }),
  addToCart: (item) => {
    const existing = get().cart.find((c) => c.product.id === item.product.id);
    if (existing) {
      set({ cart: get().cart.map((c) => c.product.id === item.product.id ? { ...c, qty: c.qty + 1 } : c) });
    } else {
      set({ cart: [...get().cart, item] });
    }
  },
  removeFromCart: (productId) => set({ cart: get().cart.filter((c) => c.product.id !== productId) }),
  updateCartQty: (productId, qty) => {
    if (qty <= 0) {
      get().removeFromCart(productId);
    } else {
      set({ cart: get().cart.map((c) => c.product.id === productId ? { ...c, qty } : c) });
    }
  },
  clearCart: () => set({ cart: [] }),
  setTweaks: (t) => set({ tweaks: { ...get().tweaks, ...t } }),
  setShowHotkeyOverlay: (showHotkeyOverlay) => set({ showHotkeyOverlay }),
}));
