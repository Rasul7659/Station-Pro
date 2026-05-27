'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { FUELS } from '@/lib/data';
import type { Pump } from '@/lib/types';
import Ico from '@/components/Ico';

type Stage = 'config' | 'running' | 'done';
type Mode  = 'sum' | 'liters' | 'full' | 'direct';

interface Props { pump: Pump; onClose: () => void; }

export default function DispenseModal({ pump, onClose }: Props) {
  const openPayment  = useStore((s) => s.openPayment);
  const operator     = useStore((s) => s.operator);

  const [nozzleId, setNozzleId] = useState(pump.nozzle);
  const [fuelCode, setFuelCode] = useState(pump.fuel);
  const [mode, setMode]         = useState<Mode>('sum');
  const [amount, setAmount]     = useState('1500');
  const [stage, setStage]       = useState<Stage>('config');
  const [progress, setProgress] = useState(0);

  const fuel      = FUELS[fuelCode];
  const target    = mode === 'sum' ? parseFloat(amount) || 0 : mode === 'liters' ? parseFloat(amount) || 0 : 0;
  const maxLiters = mode === 'sum' ? target / fuel.price : target;
  const maxSum    = mode === 'sum' ? target : target * fuel.price;

  useEffect(() => {
    if (stage !== 'running') return;
    const id = setInterval(() => {
      setProgress((p) => {
        const np = Math.min(100, p + 1.6);
        if (np >= 100) { clearInterval(id); setStage('done'); }
        return np;
      });
    }, 60);
    return () => clearInterval(id);
  }, [stage]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (stage === 'config') {
        if (e.key.toLowerCase() === 'l') setMode('liters');
        if (e.key.toLowerCase() === 'm') setMode('sum');
        if (e.key.toLowerCase() === 'f') setMode('full');
        if (e.key.toLowerCase() === 'd') setMode('direct');
        if (e.key === 'Enter') setStage('running');
      } else if (stage === 'running') {
        if (e.key.toLowerCase() === 's') setStage('done');
      } else if (stage === 'done') {
        if (e.key === 'Enter') handleToPay();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, mode, maxLiters, maxSum, fuelCode, nozzleId]);

  function handleToPay() {
    openPayment({ pumpId: pump.id, fuelCode, liters: maxLiters, sum: maxSum, nozzleId });
  }

  const liveLiters = maxLiters * progress / 100;
  const liveSum    = maxSum    * progress / 100;

  const nozzles = [{ n: 1, f: '92' as const }, { n: 2, f: '95' as const }, { n: 3, f: '98' as const }];

  return (
    <div className="scrim" onClick={onClose}>
      <div className="dispense-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dispense-h">
          <div className="pump-info">
            <div>
              <div className="lbl">Колонка</div>
              <div className="num">{String(pump.id).padStart(2, '0')}</div>
            </div>
            <div className={`fuel-tag ${fuel.cls}`} style={{ minWidth: 64, padding: '10px 8px' }}>
              <div className="grade" style={{ fontSize: 16 }}>{fuel.code.replace('АИ-', '')}</div>
              <div className="price">{fuel.price.toFixed(2)} ₽/л</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>Сценарий</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {stage === 'config' ? 'Параметры отпуска' : stage === 'running' ? 'Отпуск топлива' : 'Завершено · к оплате'}
              </div>
            </div>
          </div>
          <button className="btn ghost" onClick={onClose}><Ico name="close" /> <span className="hk">Esc</span></button>
        </div>

        <div className="dispense-body">
          <div className="dispense-main">
            {stage === 'config' && (
              <>
                <div>
                  <div className="field-lbl">Рукав / Топливо</div>
                  <div className="nozzle-pick">
                    {nozzles.map((nz, i) => {
                      const f = FUELS[nz.f];
                      return (
                        <div key={i} className={'nozzle-card' + (nozzleId === nz.n ? ' selected' : '')}
                             onClick={() => { setNozzleId(nz.n); setFuelCode(nz.f); }}>
                          <span className="hk"><span className="kbd">{i + 1}</span></span>
                          <div className="top">
                            <div className={`fuel-tag ${f.cls}`} style={{ minWidth: 40, padding: '4px 4px' }}>
                              <div className="grade" style={{ fontSize: 12 }}>{f.code.replace('АИ-', '')}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div className="price">{f.price.toFixed(2)} <span className="unit">₽/л</span></div>
                            </div>
                          </div>
                          <div className="grade-name">Рукав {nz.n} · {f.code}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="field-lbl">Режим отпуска</div>
                  <div className="seg" style={{ width: '100%' }}>
                    {(['sum','liters','full','direct'] as Mode[]).map((m) => (
                      <button key={m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)} style={{ flex: 1 }}>
                        {m === 'sum' ? 'На сумму' : m === 'liters' ? 'На литры' : m === 'full' ? 'До полного' : 'Прямой пуск'}
                        <span className="hk-inline kbd" style={{ marginLeft: 4 }}>{m === 'sum' ? 'M' : m === 'liters' ? 'L' : m === 'full' ? 'F' : 'D'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {(mode === 'sum' || mode === 'liters') && (
                  <div>
                    <div className="field-lbl">{mode === 'sum' ? 'Сумма, ₽' : 'Объём, л'}</div>
                    <input className="input xl" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} autoFocus />
                    <div className="preset-row" style={{ marginTop: 8 }}>
                      {(mode === 'sum' ? ['500','1000','1500','2000','3000','5000'] : ['10','20','30','40','50','80']).map((v) => (
                        <button key={v} className="preset" onClick={() => setAmount(v)}>
                          {parseFloat(v).toLocaleString('ru-RU')} {mode === 'sum' ? '₽' : 'л'}
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-3)' }}>
                      <span>Расчётно:</span>
                      <span className="mono tnum" style={{ color: 'var(--text-1)', fontWeight: 600, fontSize: 14 }}>
                        {mode === 'sum'
                          ? `≈ ${(parseFloat(amount || '0') / fuel.price).toFixed(2)} л`
                          : `≈ ${(parseFloat(amount || '0') * fuel.price).toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽`}
                      </span>
                    </div>
                  </div>
                )}
                {mode === 'full'   && <div className="banner ok"  style={{ padding: '12px 14px' }}><Ico name="info" /> Отпуск до автоматической остановки пистолета. Списание — по факту.</div>}
                {mode === 'direct' && <div className="banner warn" style={{ padding: '12px 14px' }}><Ico name="info" /> Прямой пуск: лимит не задаётся, оператор останавливает вручную.</div>}
              </>
            )}

            {stage === 'running' && (
              <div className="live-meter" style={{ borderRadius: 14 }}>
                <div className="row">
                  <div>
                    <div className="lbl">Идёт отпуск</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#e7ecf5', marginTop: 2 }}>{fuel.code} · Колонка {String(pump.id).padStart(2, '0')} · Рукав {nozzleId}</div>
                  </div>
                  <span className="status-pill ok" style={{ background: 'rgba(74,222,128,0.18)', color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)' }}><span className="dot" />Активна</span>
                </div>
                <div>
                  <div className="lbl">Объём</div>
                  <div className="v-big tnum">{liveLiters.toFixed(2)}<small> / {maxLiters.toFixed(2)} л</small></div>
                </div>
                <div className="row" style={{ alignItems: 'flex-end' }}>
                  <div><div className="lbl">Сумма</div><div className="v-mid tnum">{liveSum.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</div></div>
                  <div style={{ textAlign: 'right' }}><div className="lbl">Скорость</div><div className="v-mid tnum">38.4 л/мин</div></div>
                </div>
                <div className="barwrap"><div className="bar" style={{ width: progress + '%' }} /></div>
              </div>
            )}

            {stage === 'done' && (
              <>
                <div className="banner ok" style={{ padding: '12px 14px' }}><Ico name="check" /> <b>Отпуск завершён.</b> Перейдите к оплате.</div>
                <div className="receipt">
                  <div className="hdr">ОПЕРАЦИЯ #4823</div>
                  <div className="line"><span>Колонка / Рукав</span><span>{String(pump.id).padStart(2, '0')} / {nozzleId}</span></div>
                  <div className="line"><span>Топливо</span><span>{fuel.code}</span></div>
                  <div className="line"><span>Цена</span><span>{fuel.price.toFixed(2)} ₽/л</span></div>
                  <div className="line"><span>Объём</span><span>{maxLiters.toFixed(2)} л</span></div>
                  <div className="line tot"><span>Итого</span><span>{maxSum.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</span></div>
                </div>
              </>
            )}
          </div>

          <div className="dispense-side">
            <div className="field-lbl">Сводка</div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="kv"><span className="k">Колонка</span><span className="v">№ {String(pump.id).padStart(2, '0')}</span></div>
              <div className="kv"><span className="k">Рукав</span><span className="v">№ {nozzleId}</span></div>
              <div className="kv"><span className="k">Топливо</span><span className="v">{fuel.code}</span></div>
              <div className="kv"><span className="k">Цена</span><span className="v">{fuel.price.toFixed(2)} ₽/л</span></div>
              <div className="kv"><span className="k">Режим</span><span className="v">{mode === 'sum' ? 'На сумму' : mode === 'liters' ? 'На литры' : mode === 'full' ? 'До полного' : 'Прямой'}</span></div>
              {(mode === 'sum' || mode === 'liters') && (
                <>
                  <div className="kv"><span className="k">Лимит</span><span className="v">{mode === 'sum' ? amount + ' ₽' : amount + ' л'}</span></div>
                  <div className="kv" style={{ borderTop: '1px dashed var(--border)', marginTop: 4, paddingTop: 8 }}>
                    <span className="k">К оплате</span>
                    <span className="v" style={{ fontSize: 16, color: 'var(--accent)' }}>{maxSum.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</span>
                  </div>
                </>
              )}
            </div>
            <div style={{ marginTop: 'auto', fontSize: 11, color: 'var(--text-3)' }}>
              <div className="field-lbl">Подсказки</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[['Enter','Запустить'],['L / M','Литры / Сумма'],['F','До полного'],['D','Прямой пуск'],['S','Стоп'],['Esc','Отмена']].map(([k, v]) => (
                  <div key={k} className="row-h"><span className="kbd">{k}</span><span>{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dispense-foot">
          <div className="row-h" style={{ gap: 8, color: 'var(--text-3)', fontSize: 12 }}>
            <Ico name="shield" className="i-sm" /> Оператор: {operator?.nm || '—'} · Смена 47 · {new Date().toLocaleTimeString('ru-RU').slice(0, 5)}
          </div>
          <div className="row-h" style={{ gap: 8 }}>
            {stage === 'config' && (
              <>
                <button className="btn" onClick={onClose}>Отмена <span className="hk">Esc</span></button>
                <button className="btn primary lg" onClick={() => setStage('running')}>
                  <Ico name="play" /> Запустить <span className="hk">Enter</span>
                </button>
              </>
            )}
            {stage === 'running' && (
              <>
                <button className="btn" onClick={() => setStage('done')}>Пауза <span className="hk">P</span></button>
                <button className="btn danger lg" onClick={() => setStage('done')}>
                  <Ico name="stop" /> Остановить <span className="hk">S</span>
                </button>
              </>
            )}
            {stage === 'done' && (
              <>
                <button className="btn" onClick={onClose}>Закрыть</button>
                <button className="btn primary lg" onClick={handleToPay}>
                  <Ico name="card" /> К оплате <span className="hk">Enter</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
