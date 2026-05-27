'use client';
import { useState, useEffect } from 'react';
import { FUELS } from '@/lib/data';
import Ico from '@/components/Ico';

type PayMethod = 'cash' | 'card' | 'fuel' | 'corp' | 'loyalty' | 'mixed';
type Stage = 'select' | 'processing' | 'done';

interface Order { pumpId: number; fuelCode: string; liters: number; sum: number; nozzleId: number; }
interface Props { order: Order; onClose: () => void; onComplete: () => void; }

export default function PaymentModal({ order, onClose, onComplete }: Props) {
  const [method, setMethod] = useState<PayMethod>('cash');
  const [given,  setGiven]  = useState('');
  const [stage,  setStage]  = useState<Stage>('select');

  const fuel      = FUELS[order.fuelCode as keyof typeof FUELS];
  const fuelSum   = order.sum;
  const storeItems = [{ nm: 'Кофе Americano', q: 1, p: 120 }, { nm: 'Snickers 50 г', q: 2, p: 95 }];
  const storeSum   = storeItems.reduce((s, x) => s + x.p * x.q, 0);
  const total      = fuelSum + storeSum;
  const change     = method === 'cash' && given ? Math.max(0, parseFloat(given) - total) : 0;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (stage === 'select') {
        if (e.key === 'F8')  { e.preventDefault(); setMethod('cash'); }
        if (e.key === 'F9')  { e.preventDefault(); setMethod('card'); }
        if (e.key === 'F10') { e.preventDefault(); setMethod('fuel'); }
        if (e.key === 'F11') { e.preventDefault(); setMethod('corp'); }
        if (e.key === 'F12') { e.preventDefault(); setMethod('loyalty'); }
        if (e.key === 'Enter') { setStage('processing'); setTimeout(() => setStage('done'), 1400); }
      } else if (stage === 'done' && e.key === 'Enter') {
        onComplete();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage, onClose, onComplete]);

  const payMethods = [
    { id: 'cash'    as PayMethod, ic: 'cash2',  nm: 'Наличные',          sub: 'Купюры / монеты',    hk: 'F8'  },
    { id: 'card'    as PayMethod, ic: 'card',   nm: 'Банковская карта',  sub: 'Visa / Mir / MC',    hk: 'F9'  },
    { id: 'fuel'    as PayMethod, ic: 'fuel',   nm: 'Топливная карта',   sub: 'Лукойл / Газпром',   hk: 'F10' },
    { id: 'corp'    as PayMethod, ic: 'shield', nm: 'Корп. ведомость',   sub: 'Контрагент',         hk: 'F11' },
    { id: 'loyalty' as PayMethod, ic: 'check',  nm: 'Скидка / лояльность', sub: 'Бонусы, программа', hk: 'F12' },
    { id: 'mixed'   as PayMethod, ic: 'plus',   nm: 'Смешанная',         sub: 'Нал + карта',        hk: 'F7'  },
  ];

  return (
    <div className="scrim" onClick={onClose}>
      <div className="dispense-modal" style={{ width: 'min(1080px, 94vw)' }} onClick={(e) => e.stopPropagation()}>
        <div className="dispense-h">
          <div className="pump-info">
            <div>
              <div className="lbl">Оплата · Колонка</div>
              <div className="num">{String(order.pumpId).padStart(2, '0')}</div>
            </div>
            <div className={`fuel-tag ${fuel.cls}`} style={{ minWidth: 56, padding: '8px 6px' }}>
              <div className="grade" style={{ fontSize: 14 }}>{fuel.code.replace('АИ-', '')}</div>
              <div className="price">{fuel.price.toFixed(2)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>К оплате</div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{total.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</div>
            </div>
          </div>
          <button className="btn ghost" onClick={onClose}><Ico name="close" /> <span className="hk">Esc</span></button>
        </div>

        <div className="dispense-body" style={{ gridTemplateColumns: '1fr 380px' }}>
          <div className="dispense-main">
            {stage === 'select' && (
              <>
                <div>
                  <div className="field-lbl">Способ оплаты</div>
                  <div className="pay-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {payMethods.map((m) => (
                      <div key={m.id} className={'pay-tile' + (method === m.id ? ' selected' : '')} onClick={() => setMethod(m.id)}>
                        <span className="hk"><span className="kbd">{m.hk}</span></span>
                        <div className="ic"><Ico name={m.ic} /></div>
                        <div><div className="nm">{m.nm}</div><div className="sub">{m.sub}</div></div>
                      </div>
                    ))}
                  </div>
                </div>

                {method === 'cash' && (
                  <div>
                    <div className="field-lbl">Получено наличными</div>
                    <input className="input xl" value={given} onChange={(e) => setGiven(e.target.value.replace(/[^0-9.]/g, ''))} placeholder={total.toFixed(2)} autoFocus />
                    <div className="preset-row" style={{ marginTop: 8 }}>
                      {['500','1000','2000','3000','5000', String(Math.ceil(total / 100) * 100)].map((v) => (
                        <button key={v} className="preset" onClick={() => setGiven(v)}>{parseInt(v).toLocaleString('ru-RU')} ₽</button>
                      ))}
                    </div>
                    {given && parseFloat(given) >= total && (
                      <div className="banner ok" style={{ marginTop: 10 }}>
                        <Ico name="cash2" /> Сдача: <b style={{ marginLeft: 4 }}>{change.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</b>
                      </div>
                    )}
                  </div>
                )}
                {method === 'card'    && <div className="banner ok"><Ico name="card" /> Сумма передана на терминал. Передайте терминал клиенту.</div>}
                {method === 'fuel'    && <div><div className="field-lbl">Топливная карта</div><input className="input lg" placeholder="Поднесите карту или введите номер" /></div>}
                {method === 'corp'    && <div><div className="field-lbl">Контрагент по ведомости</div><input className="input lg" defaultValue="ООО «Логистика-М» · Договор №2024-117" /></div>}
                {method === 'loyalty' && <div className="banner ok"><Ico name="check" /> Бонусный счёт подтверждён. Скидка применена.</div>}
              </>
            )}
            {stage === 'processing' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 16 }}>
                <Ico name="card" className="i-lg" style={{ width: 48, height: 48, color: 'var(--brand)' }} />
                <div style={{ fontSize: 18, fontWeight: 600 }}>Ожидание подтверждения банка…</div>
                <div className="muted">Терминал · Ingenico Move/5000 · OK</div>
                <div className="scrub" style={{ width: 280 }} />
              </div>
            )}
            {stage === 'done' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="banner ok" style={{ padding: '14px 16px', fontSize: 14 }}>
                  <Ico name="check" /> <b>Оплата прошла успешно.</b> Чек отправлен в фискальный регистратор.
                </div>
                <div className="receipt">
                  <div className="hdr">ЧЕК #4823 · АЗС-007</div>
                  <div className="line"><span>Колонка {String(order.pumpId).padStart(2, '0')} · {fuel.code}</span><span>{order.liters.toFixed(2)} л</span></div>
                  <div className="line"><span>Топливо</span><span>{fuelSum.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</span></div>
                  {storeItems.map((it, i) => (
                    <div className="line" key={i}><span>{it.nm} × {it.q}</span><span>{(it.p * it.q).toLocaleString('ru-RU')} ₽</span></div>
                  ))}
                  <div className="line tot"><span>ИТОГО</span><span>{total.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</span></div>
                  <div className="line"><span>Способ</span><span>{method === 'cash' ? 'Наличные' : method === 'card' ? 'Карта' : method === 'fuel' ? 'Топл. карта' : 'Ведомость'}</span></div>
                  {method === 'cash' && given && (
                    <div className="line"><span>Получено / Сдача</span><span>{parseFloat(given).toLocaleString('ru-RU')} / {change.toLocaleString('ru-RU', { minimumFractionDigits: 2 })}</span></div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="dispense-side">
            <div className="field-lbl">Состав чека</div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="kv"><span className="k">{fuel.code} · {order.liters.toFixed(2)} л</span><span className="v">{fuelSum.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</span></div>
              {storeItems.map((it, i) => (
                <div className="kv" key={i}><span className="k">{it.nm} × {it.q}</span><span className="v">{(it.p * it.q).toLocaleString('ru-RU')} ₽</span></div>
              ))}
              <div style={{ borderTop: '1px dashed var(--border)', marginTop: 6, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 600 }}>Итого</span>
                <span className="mono tnum" style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{total.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</span>
              </div>
            </div>

            <div className="field-lbl" style={{ marginTop: 'auto' }}>Оборудование</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
              <div className="kv" style={{ padding: '4px 0' }}><span className="k">Фиск. регистратор</span><span className="v" style={{ color: 'var(--ok)' }}>● Готов</span></div>
              <div className="kv" style={{ padding: '4px 0' }}><span className="k">Банк-терминал</span><span className="v" style={{ color: 'var(--ok)' }}>● Online</span></div>
              <div className="kv" style={{ padding: '4px 0' }}><span className="k">Принтер чеков</span><span className="v" style={{ color: 'var(--ok)' }}>● ОК</span></div>
            </div>
          </div>
        </div>

        <div className="dispense-foot">
          <button className="btn ghost"><Ico name="print" /> Копия чека</button>
          <div className="row-h" style={{ gap: 8 }}>
            {stage === 'select' && (
              <>
                <button className="btn" onClick={onClose}>Отмена <span className="hk">Esc</span></button>
                <button className="btn primary lg" onClick={() => { setStage('processing'); setTimeout(() => setStage('done'), 1400); }}>
                  <Ico name="check" /> Подтвердить оплату <span className="hk">Enter</span>
                </button>
              </>
            )}
            {stage === 'done' && (
              <>
                <button className="btn ghost"><Ico name="print" /> Печать копии</button>
                <button className="btn primary lg" onClick={onComplete}>
                  <Ico name="check" /> Завершить <span className="hk">Enter</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
