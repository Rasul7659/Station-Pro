'use client';
import { useState } from 'react';
import { FUELS, TANKS, TANK_HISTORY, TANK_OPS } from '@/lib/data';
import type { Tank } from '@/lib/types';
import Ico from '@/components/Ico';

function TankVisual({ tank, selected, onClick }: { tank: Tank; selected: boolean; onClick: () => void }) {
  const fuel    = FUELS[tank.fuel];
  const pct     = tank.vol / tank.max * 100;
  const minPct  = tank.minLevel / tank.max * 100;
  const critPct = tank.criticalLevel / tank.max * 100;
  const crit    = tank.vol < tank.criticalLevel;
  const low     = tank.vol < tank.minLevel;
  const status  = crit ? 'err' : low ? 'warn' : 'ok';
  const statusLbl = crit ? 'Критично' : low ? 'Низкий' : 'Норма';

  return (
    <button className={'tank-card' + (selected ? ' selected' : '')} onClick={onClick}>
      <div className="tank-card-h">
        <div className={`fuel-tag ${fuel.cls}`} style={{ minWidth: 44 }}>
          <div className="grade">{fuel.code.replace('АИ-', '')}</div>
          <div className="price">{fuel.price.toFixed(2)} ₽</div>
        </div>
        <div className="tank-meta">
          <div className="tank-id">№{tank.id}</div>
          <div className={`status-pill ${status}`}><span className="dot" />{statusLbl}</div>
        </div>
      </div>
      <div className="tank-vis">
        <div className="tank-shape">
          <div className="tank-fill" style={{ height: pct + '%', background: fuel.color, opacity: crit ? 0.85 : 1 }}>
            <div className="tank-shimmer" />
          </div>
          <div className="tank-mark crit" style={{ bottom: critPct + '%' }}><span>крит</span></div>
          <div className="tank-mark min"  style={{ bottom: minPct  + '%' }}><span>мин</span></div>
        </div>
        <div className="tank-readout">
          <div className="tank-pct mono">{pct.toFixed(1)}<small>%</small></div>
          <div className="tank-vol mono">{tank.vol.toLocaleString('ru-RU')} <small>/ {tank.max.toLocaleString('ru-RU')} л</small></div>
          <div className="tank-rows">
            <div className="kv2"><span className="k">Темп.</span><span className="v">{tank.temp.toFixed(1)} °C</span></div>
            <div className="kv2"><span className="k">Плотн.</span><span className="v">{tank.density.toFixed(3)}</span></div>
            <div className="kv2"><span className="k">Вода</span><span className="v" style={{ color: tank.water > 2 ? 'var(--warn)' : undefined }}>{tank.water} мм</span></div>
            <div className="kv2"><span className="k">Колонки</span><span className="v">{tank.pumps.join(', ')}</span></div>
          </div>
        </div>
      </div>
    </button>
  );
}

function TankHistoryChart({ tank }: { tank: Tank }) {
  const data = TANK_HISTORY[tank.id] || [];
  const fuel = FUELS[tank.fuel];
  const w = 720, h = 200, pad = { l: 48, r: 16, t: 16, b: 28 };
  const yMin = tank.minLevel, yCrit = tank.criticalLevel;
  const y = (v: number) => pad.t + (h - pad.t - pad.b) * (1 - v / tank.max);
  const xStep = (w - pad.l - pad.r) / Math.max(data.length - 1, 1);
  const path  = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${pad.l + i * xStep} ${y(v)}`).join(' ');
  const area  = path + ` L ${pad.l + (data.length - 1) * xStep} ${h - pad.b} L ${pad.l} ${h - pad.b} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((p) => Math.round(tank.max * p));

  return (
    <div className="card" style={{ padding: 0 }}>
      <div className="card-h">
        <span className="ttl">Уровень за 24 часа · ёмкость №{tank.id} · {fuel.code}</span>
        <div className="actions">
          <div className="seg"><button className="on">24 ч</button><button>7 д</button><button>30 д</button></div>
        </div>
      </div>
      <div style={{ padding: '8px 16px 14px' }}>
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 200 }}>
          <defs>
            <linearGradient id={`g${tank.id}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%"   stopColor={fuel.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={fuel.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((t, i) => (
            <g key={i}>
              <line x1={pad.l} y1={y(t)} x2={w - pad.r} y2={y(t)} stroke="var(--border)" strokeDasharray={i === 0 || i === ticks.length - 1 ? '' : '2 4'} />
              <text x={pad.l - 8} y={y(t) + 3} textAnchor="end" fill="var(--muted-foreground)" fontSize="10" fontFamily="var(--font-mono)">{t.toLocaleString('ru-RU')}</text>
            </g>
          ))}
          <line x1={pad.l} y1={y(yMin)}  x2={w - pad.r} y2={y(yMin)}  stroke="var(--warn)" strokeDasharray="3 3" strokeWidth="1" />
          <text x={w - pad.r} y={y(yMin) - 4}  textAnchor="end" fill="var(--warn)" fontSize="10" fontFamily="var(--font-mono)">мин {yMin.toLocaleString('ru-RU')}</text>
          <line x1={pad.l} y1={y(yCrit)} x2={w - pad.r} y2={y(yCrit)} stroke="var(--err)"  strokeDasharray="3 3" strokeWidth="1" />
          <text x={w - pad.r} y={y(yCrit) - 4} textAnchor="end" fill="var(--err)"  fontSize="10" fontFamily="var(--font-mono)">крит {yCrit.toLocaleString('ru-RU')}</text>
          <path d={area} fill={`url(#g${tank.id})`} />
          <path d={path} fill="none" stroke={fuel.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {data.length > 0 && (() => {
            const last = data.length - 1;
            return (
              <g>
                <circle cx={pad.l + last * xStep} cy={y(data[last])} r="4"  fill={fuel.color} />
                <circle cx={pad.l + last * xStep} cy={y(data[last])} r="8"  fill={fuel.color} opacity="0.2" />
              </g>
            );
          })()}
          {[0, 6, 12, 18, 23].map((i) => (
            <text key={i} x={pad.l + i * xStep} y={h - pad.b + 16} textAnchor="middle" fill="var(--muted-foreground)" fontSize="10" fontFamily="var(--font-mono)">
              {String((new Date().getHours() - (23 - i) + 24) % 24).padStart(2, '0')}:00
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

function TankDetailPanel({ tank }: { tank: Tank }) {
  const fuel     = FUELS[tank.fuel];
  const pct      = tank.vol / tank.max * 100;
  const daysLeft = Math.max(1, Math.round((tank.vol - tank.minLevel) / 800));

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div className="card-h"><span className="ttl">Паспорт ёмкости</span><span className="tag">№{tank.id}</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className={`fuel-tag ${fuel.cls}`} style={{ minWidth: 56, padding: '12px 8px' }}>
            <div className="grade" style={{ fontSize: 18 }}>{fuel.code.replace('АИ-', '')}</div>
            <div className="price">{fuel.price.toFixed(2)} ₽</div>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{fuel.code}</div>
            <div className="muted" style={{ fontSize: 12 }}>Резервуар №{tank.id}</div>
          </div>
        </div>
        {tank.vol < tank.minLevel && (
          <div className="banner warn">
            <Ico name="info" className="i-sm" />
            <div><b>Низкий уровень.</b> Прогноз: ~{daysLeft} {daysLeft === 1 ? 'день' : 'дня'}. Рекомендуется заказать поставку.</div>
          </div>
        )}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
            <span className="muted">Заполнение</span>
            <span className="mono" style={{ fontWeight: 600 }}>{pct.toFixed(1)}%</span>
          </div>
          <div style={{ height: 8, background: 'var(--secondary)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', left: tank.minLevel / tank.max * 100 + '%', top: -2, bottom: -2, width: 1, background: 'var(--warn)' }} />
            <div style={{ position: 'absolute', left: tank.criticalLevel / tank.max * 100 + '%', top: -2, bottom: -2, width: 1, background: 'var(--err)' }} />
            <div style={{ height: '100%', width: pct + '%', background: fuel.color, borderRadius: 4 }} />
          </div>
        </div>
        <div className="kv-grid">
          <div className="kv"><span className="k">Объём</span><span className="v">{tank.vol.toLocaleString('ru-RU')} л</span></div>
          <div className="kv"><span className="k">Вместимость</span><span className="v">{tank.max.toLocaleString('ru-RU')} л</span></div>
          <div className="kv"><span className="k">Свободно</span><span className="v">{(tank.max - tank.vol).toLocaleString('ru-RU')} л</span></div>
          <div className="kv"><span className="k">Температура</span><span className="v">{tank.temp.toFixed(1)} °C</span></div>
          <div className="kv"><span className="k">Плотность</span><span className="v">{tank.density.toFixed(3)} кг/л</span></div>
          <div className="kv"><span className="k">Подтоварная вода</span><span className="v" style={{ color: tank.water > 2 ? 'var(--warn)' : undefined }}>{tank.water} мм</span></div>
          <div className="kv"><span className="k">Мин. остаток</span><span className="v">{tank.minLevel.toLocaleString('ru-RU')} л</span></div>
          <div className="kv"><span className="k">Крит. остаток</span><span className="v">{tank.criticalLevel.toLocaleString('ru-RU')} л</span></div>
          <div className="kv"><span className="k">Колонки</span><span className="v">№{tank.pumps.join(', №')}</span></div>
          <div className="kv"><span className="k">Последний слив</span><span className="v" style={{ fontSize: 11 }}>{tank.lastFill}</span></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <button className="btn"><Ico name="drop" className="i-sm" /> Замер</button>
          <button className="btn"><Ico name="receive" className="i-sm" /> Приём</button>
          <button className="btn ghost">История</button>
          <button className="btn ghost">Паспорт</button>
        </div>
      </div>
    </div>
  );
}

function TankOpsList({ tank }: { tank: Tank }) {
  const ops = TANK_OPS;
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div className="card-h">
        <span className="ttl">Операции по ёмкости №{tank.id}</span>
        <div className="actions">
          <button className="btn ghost" style={{ height: 26, padding: '0 8px', fontSize: 11 }}>Замер</button>
          <button className="btn ghost" style={{ height: 26, padding: '0 8px', fontSize: 11 }}>Все</button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }} className="thin-scroll">
        {ops.map((op, i) => (
          <div key={i} className="evt" style={{ gridTemplateColumns: '70px 22px 1fr auto auto', gap: 10 }}>
            <span className="t">{op.t}</span>
            <span className={`ic ${op.kind === 'sale' ? 'info' : op.kind === 'fill' ? 'ok' : op.kind === 'measure' ? 'warn' : 'info'}`}>
              {op.kind === 'sale' ? '↓' : op.kind === 'fill' ? '↑' : op.kind === 'measure' ? '◇' : '⚑'}
            </span>
            <span className="msg">{op.msg}</span>
            <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: op.vol < 0 ? 'var(--err)' : op.kind === 'fill' ? 'var(--ok)' : 'var(--foreground)' }}>
              {(op.vol > 0 ? '+' : '') + op.vol.toLocaleString('ru-RU')} л
            </span>
            <span className="meta">{op.sum}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TanksScreen() {
  const [selId, setSelId] = useState(3);
  const tank = TANKS.find((t) => t.id === selId) || TANKS[0];

  const total    = TANKS.reduce((a, t) => a + t.vol, 0);
  const totalMax = TANKS.reduce((a, t) => a + t.max, 0);
  const lowCount = TANKS.filter((t) => t.vol < t.minLevel).length;

  return (
    <div className="tanks-screen thin-scroll">
      <div className="card" style={{ padding: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { lbl: 'Всего топлива', v: total.toLocaleString('ru-RU') + ' л', sub: `${(total / totalMax * 100).toFixed(1)}% от ${totalMax.toLocaleString('ru-RU')} л` },
          { lbl: 'Ёмкостей',      v: String(TANKS.length),                 sub: '5 видов топлива' },
          { lbl: 'Низкий уровень',v: String(lowCount),                      sub: 'требуется заказ', accent: lowCount ? 'var(--warn)' : undefined },
          { lbl: 'Расход за смену',v: '2 814 л',                            sub: '↓ 12% к прошлой' },
        ].map((s, i) => (
          <div key={i}>
            <div className="muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{s.lbl}</div>
            <div className="mono" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2, color: s.accent }}>{s.v}</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="tanks-row">
        {TANKS.map((t) => <TankVisual key={t.id} tank={t} selected={t.id === selId} onClick={() => setSelId(t.id)} />)}
      </div>

      <div className="tanks-detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <TankHistoryChart tank={tank} />
          <TankOpsList tank={tank} />
        </div>
        <TankDetailPanel tank={tank} />
      </div>
    </div>
  );
}
