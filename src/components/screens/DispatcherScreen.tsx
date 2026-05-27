'use client';
import { useStore } from '@/lib/store';
import { FUELS, TANKS } from '@/lib/data';
import type { Pump } from '@/lib/types';
import Ico from '@/components/Ico';

function PumpCard({ p, selected, onSelect }: { p: Pump; selected: boolean; onSelect: (id: number) => void }) {
  const fuel = FUELS[p.fuel];
  const stateMap: Record<string, { pill: string; label: string; dot?: boolean }> = {
    active:  { pill: 'ok',   label: 'Отпуск',       dot: true },
    pending: { pill: 'warn', label: 'Готов к пуску' },
    paused:  { pill: 'warn', label: 'Пауза' },
    idle:    { pill: 'idle', label: 'Свободна' },
    error:   { pill: 'err',  label: 'Ошибка' },
    offline: { pill: 'err',  label: 'Не на связи' },
  };
  const st = stateMap[p.state];
  const pct = p.target > 0 ? Math.min(100, (p.mode === 'liters' ? p.liters : p.sum) / p.target * 100) : 0;
  const hk = p.id <= 9 ? String(p.id) : p.id === 10 ? '0' : p.id === 11 ? '-' : '=';

  return (
    <div className={`pump state-${p.state}${selected ? ' selected' : ''}`} onClick={() => onSelect(p.id)}>
      <div className="pump-head">
        <div className="pump-num">
          <span className="num">{String(p.id).padStart(2, '0')}</span>
          <span className="lbl">КОЛОНКА</span>
          <span className="hkbox">{hk}</span>
        </div>
        <span className={`status-pill ${st.pill}`}>
          {st.dot && <span className="dot" />}{st.label}
        </span>
      </div>
      <div className="pump-body">
        <div className={`fuel-tag ${fuel.cls}`}>
          <div className="grade">{fuel.code.replace('АИ-', '')}</div>
          <div className="price">{fuel.price.toFixed(2)} ₽</div>
        </div>
        <div className="pump-readout">
          <div>
            <div className="label">Сумма</div>
            <div className="v sum tnum">{p.sum.toLocaleString('ru-RU', { minimumFractionDigits: 2 })}<span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 3 }}>₽</span></div>
          </div>
          <div>
            <div className="label">Литры</div>
            <div className="v tnum">{p.liters.toFixed(2)}<span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 3 }}>л</span></div>
          </div>
        </div>
      </div>
      {(p.state === 'active' || p.state === 'paused') ? (
        <div className={`pump-progress${p.state === 'paused' ? ' warn' : ''}`}>
          <div className="bar" style={{ width: pct + '%' }} />
        </div>
      ) : <div style={{ height: 4 }} />}
      <div className="pump-foot">
        <span className="nozzle"><Ico name="nozzle" className="i-sm" /> Рукав {p.nozzle} · {fuel.code}</span>
        {p.nozzleLifted && <span className="nozzle-lifted">пистолет снят</span>}
        {p.error && <span className="hint" style={{ color: 'var(--err)' }}>{p.error}</span>}
        {p.customer && p.state === 'active' && (
          <span className="hint mono" style={{ maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.customer}</span>
        )}
      </div>
    </div>
  );
}

function SidePanel() {
  const pumps         = useStore((s) => s.pumps);
  const selectedPumpId = useStore((s) => s.selectedPumpId);
  const selectPump    = useStore((s) => s.selectPump);
  const openDispense  = useStore((s) => s.openDispense);
  const updatePump    = useStore((s) => s.updatePump);
  const pump = pumps.find((p) => p.id === selectedPumpId) ?? null;
  const fuel = pump ? FUELS[pump.fuel] : null;

  const stateLabel: Record<string, string> = {
    active: 'Отпуск', idle: 'Свободна', pending: 'Готов к пуску',
    paused: 'Пауза', error: 'Ошибка', offline: 'Не на связи',
  };

  return (
    <div className="card side-panel">
      <div className="card-h">
        <span className="ttl">Выбранная колонка</span>
        {pump && <span className="tag">№{String(pump.id).padStart(2, '0')}</span>}
      </div>
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0, overflow: 'auto' }} className="thin-scroll">
        {!pump ? (
          <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: 30, fontSize: 12 }}>
            Выберите колонку клавишами <span className="kbd">1</span>–<span className="kbd">9</span> или мышью
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className={`fuel-tag ${fuel!.cls}`} style={{ minWidth: 56, padding: '10px 6px' }}>
                <div className="grade" style={{ fontSize: 18 }}>{fuel!.code.replace('АИ-', '')}</div>
                <div className="price">{fuel!.price.toFixed(2)} ₽</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>Рукав {pump.nozzle}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{fuel!.code}</div>
              </div>
            </div>
            <div className="kv"><span className="k">Состояние</span><span className="v" style={{ color: pump.state === 'active' ? 'var(--ok)' : pump.state === 'error' ? 'var(--err)' : 'var(--text-1)' }}>{stateLabel[pump.state]}</span></div>
            <div className="kv"><span className="k">Сумма</span><span className="v">{pump.sum.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</span></div>
            <div className="kv"><span className="k">Объём</span><span className="v">{pump.liters.toFixed(2)} л</span></div>
            {pump.target > 0 && (
              <div className="kv"><span className="k">Цель</span><span className="v">{pump.mode === 'liters' ? pump.target.toFixed(2) + ' л' : pump.target.toLocaleString('ru-RU') + ' ₽'}</span></div>
            )}
            {pump.customer && <div className="kv"><span className="k">Клиент</span><span className="v" style={{ fontSize: 11 }}>{pump.customer}</span></div>}
            {pump.error && <div className="banner err"><Ico name="info" className="i-sm" /> {pump.error}</div>}
            {pump.nozzleLifted && <div className="banner ok"><Ico name="nozzle" className="i-sm" /> Пистолет снят — можно запускать</div>}

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(pump.state === 'idle' || pump.state === 'pending') && (
                <button className="btn primary lg" onClick={openDispense}>
                  <Ico name="play" /> Отпуск топлива <span className="hk">Space</span>
                </button>
              )}
              {pump.state === 'active' && (
                <>
                  <button className="btn danger lg" onClick={() => updatePump(pump.id, { state: 'idle', sum: 0, liters: 0, target: 0 })}>
                    <Ico name="stop" /> Остановить <span className="hk">S</span>
                  </button>
                  <button className="btn lg" onClick={() => updatePump(pump.id, { state: 'paused' })}>
                    <Ico name="pause" /> Пауза <span className="hk">P</span>
                  </button>
                </>
              )}
              {pump.state === 'paused' && (
                <button className="btn success lg" onClick={() => updatePump(pump.id, { state: 'active' })}>
                  <Ico name="play" /> Продолжить <span className="hk">Space</span>
                </button>
              )}
              {(pump.state === 'error' || pump.state === 'offline') && (
                <button className="btn lg" disabled style={{ opacity: 0.5 }}>Колонка недоступна</button>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <button className="btn ghost" style={{ height: 36 }}>Сменить рукав <span className="hk">N</span></button>
                <button className="btn ghost" style={{ height: 36 }} onClick={() => selectPump(null)}>Сброс <span className="hk">Esc</span></button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TanksMini() {
  const setScreen = useStore((s) => s.setScreen);
  return (
    <div className="card">
      <div className="card-h">
        <span className="ttl">Ёмкости</span>
        <button className="btn ghost" style={{ height: 26, padding: '0 8px', fontSize: 11 }} onClick={() => setScreen('tanks')}>F4 →</button>
      </div>
      <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0, overflow: 'auto' }} className="thin-scroll">
        {TANKS.map((t) => {
          const fuel = FUELS[t.fuel];
          const pct = (t.vol / t.max) * 100;
          return (
            <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 10, alignItems: 'center' }}>
              <div className={`fuel-tag ${fuel.cls}`} style={{ minWidth: 36, padding: '4px 4px' }}>
                <div className="grade" style={{ fontSize: 11 }}>{fuel.code.replace('АИ-', '')}</div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span className="muted mono">{t.vol.toLocaleString('ru-RU')} / {t.max.toLocaleString('ru-RU')} л</span>
                  <span className="mono" style={{ fontWeight: 600, color: t.low ? 'var(--warn)' : 'var(--text-1)' }}>{pct.toFixed(0)}%</span>
                </div>
                <div style={{ height: 4, background: 'var(--bg-surface-sunken)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: pct + '%', background: t.low ? 'var(--warn)' : fuel.color }} />
                </div>
              </div>
              {t.low && <Ico name="info" className="i-sm" style={{ color: 'var(--warn)' }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventLog() {
  const events = useStore((s) => s.events);
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
      <div className="card-h">
        <span className="ttl">Журнал событий</span>
        <div className="actions"><span className="tag">live</span></div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }} className="thin-scroll evt-log">
        {events.map((e, i) => (
          <div key={i} className="evt">
            <span className="t">{e.t}</span>
            <span className={`ic ${e.kind}`}>{e.kind === 'ok' ? '✓' : e.kind === 'err' ? '!' : e.kind === 'warn' ? '⚠' : 'i'}</span>
            <span className="msg">{e.msg}</span>
            <span className="meta">{e.meta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DispatcherScreen() {
  const pumps          = useStore((s) => s.pumps);
  const selectedPumpId = useStore((s) => s.selectedPumpId);
  const selectPump     = useStore((s) => s.selectPump);
  const active  = pumps.filter((p) => p.state === 'active').length;
  const idle    = pumps.filter((p) => p.state === 'idle').length;
  const errors  = pumps.filter((p) => p.state === 'error' || p.state === 'offline').length;

  return (
    <div className="disp">
      <div className="pumps-area">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <div className="card-h">
            <span className="ttl">Колонки · 12</span>
            <div className="actions">
              <span className="tag" style={{ background: 'var(--ok-bg)', color: 'var(--ok)', borderColor: 'var(--ok-border)' }}>{active} активны</span>
              <span className="tag">{idle} свободны</span>
              {errors > 0 && <span className="tag" style={{ background: 'var(--err-bg)', color: 'var(--err)', borderColor: 'var(--err-border)' }}>{errors} ошибок</span>}
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 10 }} className="thin-scroll">
            <div className="pumps-grid cols-4">
              {pumps.map((p) => (
                <PumpCard key={p.id} p={p} selected={selectedPumpId === p.id} onSelect={selectPump} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="selected-area">
        <SidePanel />
      </div>
      <div className="log-area">
        <EventLog />
      </div>
      <div className="tanks-area">
        <TanksMini />
      </div>
    </div>
  );
}
