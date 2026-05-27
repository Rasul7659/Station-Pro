'use client';
import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import type { Product } from '@/lib/types';
import Ico from '@/components/Ico';

export default function StoreScreen() {
  const [cat, setCat] = useState('all');
  const [q,   setQ]   = useState('');
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([
    { id: 'p1', qty: 1 }, { id: 'p5', qty: 2 },
  ]);

  const openPayment = useStore((s) => s.openPayment);

  const products = useMemo(() => PRODUCTS.filter((p) => {
    if (cat !== 'all' && cat !== 'fav' && p.cat !== cat) return false;
    if (q && !p.nm.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [cat, q]);

  function add(id: string) {
    setCart((c) => {
      const ex = c.find((x) => x.id === id);
      if (ex) return c.map((x) => x.id === id ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { id, qty: 1 }];
    });
  }
  function changeQty(id: string, d: number) {
    setCart((c) => c.map((x) => x.id === id ? { ...x, qty: Math.max(0, x.qty + d) } : x).filter((x) => x.qty > 0));
  }

  const cartItems = cart.map((c) => {
    const p = PRODUCTS.find((x) => x.id === c.id)!;
    return { ...p, qty: c.qty };
  });
  const total = cartItems.reduce((s, x) => s + x.price * x.qty, 0);
  const tax   = total * 0.20 / 1.20;

  return (
    <div className="pos">
      <div className="pos-left">
        <div className="card" style={{ padding: 10 }}>
          <div className="pos-search-row">
            <div className="pos-search">
              <Ico name="search" className="si" />
              <input className="input" placeholder="Поиск товара по названию или коду…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
            </div>
            <button className="btn"><Ico name="barcode" /> Штрихкод <span className="hk">F2</span></button>
            <button className="btn ghost"><Ico name="plus" /> Произвольный товар</button>
          </div>
          <div className="pos-cats" style={{ marginTop: 10 }}>
            {CATEGORIES.map((c) => (
              <button key={c.id} className={'pos-cat' + (cat === c.id ? ' on' : '')} onClick={() => setCat(c.id)}>
                {c.nm} <span className="cnt">{c.cnt}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="card-h">
            <span className="ttl">Товары · {products.length}</span>
            <div className="actions"><span className="tag">Сортировка: популярность</span></div>
          </div>
          <div className="pos-grid thin-scroll">
            {products.map((p) => (
              <div key={p.id} className={'prod' + (p.low ? ' low' : '')} onClick={() => add(p.id)}>
                <div className="img">{p.ico}</div>
                <div className="nm">{p.nm}</div>
                <div className="row">
                  <span className="price">{p.price} ₽</span>
                  <span className="stock" style={{ color: p.low ? 'var(--warn)' : 'var(--text-3)' }}>{p.low ? '⚠ ост. ' : ''}{p.stock} шт</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card cart">
        <div className="card-h">
          <span className="ttl">Корзина · {cartItems.length}</span>
          <button className="btn ghost" style={{ height: 26, fontSize: 11 }} onClick={() => setCart([])}>Очистить</button>
        </div>
        <div className="cart-list thin-scroll">
          {cartItems.length === 0 ? (
            <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-3)', fontSize: 12 }}>Корзина пуста</div>
          ) : cartItems.map((it) => (
            <div key={it.id} className="cart-item">
              <div>
                <div className="nm">{it.nm}</div>
                <div className="meta">{it.price.toFixed(2)} ₽/шт</div>
              </div>
              <div className="qty">
                <button onClick={() => changeQty(it.id, -1)}>−</button>
                <span className="n">{it.qty}</span>
                <button onClick={() => changeQty(it.id, +1)}>+</button>
              </div>
              <span className="price">{(it.price * it.qty).toLocaleString('ru-RU')} ₽</span>
            </div>
          ))}
        </div>
        <div className="cart-foot">
          <div className="cart-tot"><span className="muted">Подытог</span><span className="v mono">{(total - tax).toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</span></div>
          <div className="cart-tot"><span className="muted">НДС 20%</span><span className="v mono">{tax.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</span></div>
          <div className="cart-tot grand"><span style={{ fontWeight: 600 }}>К оплате</span><span className="v mono" style={{ color: 'var(--accent)' }}>{total.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</span></div>
          <button className="btn primary xl" disabled={cartItems.length === 0}
            onClick={() => openPayment({ pumpId: 0, fuelCode: '95', liters: 0, sum: total, nozzleId: 0 })}>
            <Ico name="card" /> Перейти к оплате <span className="hk">Enter</span>
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <button className="btn ghost"><Ico name="fuel" className="i-sm" /> К топливу <span className="hk">F2</span></button>
            <button className="btn ghost">Отложить <span className="hk">F4</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}
