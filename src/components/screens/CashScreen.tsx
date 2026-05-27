'use client';
import Ico from '@/components/Ico';

const DENOMS = [
  { v: 5000, count: 12, kind: 'note' as const },
  { v: 2000, count:  8, kind: 'note' as const },
  { v: 1000, count: 34, kind: 'note' as const },
  { v:  500, count: 52, kind: 'note' as const },
  { v:  200, count: 26, kind: 'note' as const },
  { v:  100, count: 78, kind: 'note' as const },
  { v:   50, count: 64, kind: 'note' as const },
  { v:   10, count: 142, kind: 'coin' as const },
  { v:    5, count: 188, kind: 'coin' as const },
  { v:    2, count: 240, kind: 'coin' as const },
  { v:    1, count: 410, kind: 'coin' as const },
];

const OPS = [
  { t: '14:32', kind: 'sale',   msg: 'Чек #4823 · Колонка 5 · АИ-98',       amt: +2810.40, pay: 'наличные', op: 'И.Соколов' },
  { t: '14:31', kind: 'sale',   msg: 'Чек #4822 · Магазин',                  amt:  +485.00, pay: 'наличные', op: 'И.Соколов' },
  { t: '14:24', kind: 'sale',   msg: 'Чек #4818 · Колонка 1 · АИ-95',       amt: +1840.50, pay: 'наличные', op: 'И.Соколов' },
  { t: '14:18', kind: 'in',     msg: 'Внесение в кассу · разменный фонд',    amt: +5000.00, pay: 'служ.',    op: 'И.Соколов' },
  { t: '13:42', kind: 'sale',   msg: 'Чек #4815 · Колонка 8 · АИ-95',       amt: +2200.00, pay: 'наличные', op: 'И.Соколов' },
  { t: '12:30', kind: 'out',    msg: 'Изъятие · инкассация в сейф',          amt: -50000.00,pay: 'служ.',    op: 'И.Соколов' },
  { t: '12:14', kind: 'sale',   msg: 'Чек #4810 · Магазин · кофе+снек',     amt:  +320.00, pay: 'наличные', op: 'И.Соколов' },
  { t: '11:48', kind: 'refund', msg: 'Возврат по чеку #4799 · колонка 4',   amt: -1180.00, pay: 'наличные', op: 'И.Соколов' },
  { t: '11:20', kind: 'sale',   msg: 'Чек #4805 · Колонка 11 · Газ',        amt:  +712.50, pay: 'наличные', op: 'И.Соколов' },
  { t: '10:55', kind: 'sale',   msg: 'Чек #4804 · Колонка 2 · ДТ',          amt: +4096.20, pay: 'наличные', op: 'И.Соколов' },
  { t: '09:40', kind: 'in',     msg: 'Внесение в кассу · подкрепление',      amt: +20000.00,pay: 'служ.',    op: 'И.Соколов' },
  { t: '08:00', kind: 'open',   msg: 'Открытие смены 47 · стартовый остаток',amt: +15000.00,pay: 'служ.',    op: 'И.Соколов' },
];

const STATS = [
  { lbl: 'Старт смены',      v: '15 000.00 ₽',      sub: '08:00',        tone: 'muted'  },
  { lbl: 'Внесений',         v: '+25 000.00 ₽',     sub: '2 операции',   tone: 'ok'     },
  { lbl: 'Изъятий',          v: '−50 000.00 ₽',     sub: '1 инкассация', tone: 'warn'   },
  { lbl: 'Продажи наличные', v: '+218 320.50 ₽',    sub: '34 чека',      tone: 'ok'     },
  { lbl: 'Возвраты',         v: '−1 180.00 ₽',      sub: '1 операция',   tone: 'err'    },
  { lbl: 'Текущий остаток',  v: '184 320.50 ₽',     sub: 'факт',         tone: 'brand'  },
];

export default function CashScreen() {
  const totalCash = DENOMS.reduce((s, d) => s + d.v * d.count, 0);
  const notes = DENOMS.filter((d) => d.kind === 'note');
  const coins  = DENOMS.filter((d) => d.kind === 'coin');

  return (
    <div className="cash-screen">
      {/* Summary */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Сводка по кассе</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Смена 47 · 08:00 → сейчас · оп. И.Соколов</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn"><Ico name="report" className="i-sm" /> X-отчёт <span className="hk">F11</span></button>
            <button className="btn"><Ico name="print" className="i-sm" /> Последний чек <span className="hk">F12</span></button>
          </div>
        </div>
        <div className="cash-stats">
          {STATS.map((s, i) => (
            <div key={i} className="cash-stat">
              <div className="muted" style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.lbl}</div>
              <div className={`mono cash-stat-v tone-${s.tone}`}>{s.v}</div>
              <div className="muted" style={{ fontSize: 11 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cash-body">
        {/* Drawer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <div className="card-h">
            <span className="ttl">Денежный ящик</span>
            <div className="actions">
              <span className="tag" style={{ background: 'var(--ok-bg)', color: 'var(--ok)', borderColor: 'var(--ok-border)' }}>● подключен</span>
              <button className="btn ghost" style={{ height: 28, padding: '0 10px', fontSize: 12 }}>Открыть</button>
            </div>
          </div>
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16, flex: 1, minHeight: 0, overflow: 'auto' }} className="thin-scroll">
            <div className="cash-hero">
              <div>
                <div className="muted" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Остаток в кассе</div>
                <div className="mono" style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 6 }}>
                  {totalCash.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} <small style={{ fontSize: 18, fontWeight: 500, color: 'var(--muted-foreground)' }}>₽</small>
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                  Купюр: <span className="mono" style={{ color: 'var(--foreground)', fontWeight: 600 }}>{notes.reduce((s, n) => s + n.count, 0)} шт</span>
                  <span style={{ margin: '0 8px' }}>·</span>
                  Монет: <span className="mono" style={{ color: 'var(--foreground)', fontWeight: 600 }}>{coins.reduce((s, n) => s + n.count, 0)} шт</span>
                </div>
              </div>
              <div className="cash-actions">
                <button className="btn primary lg"><Ico name="plus" /> Внести <span className="hk">F8</span></button>
                <button className="btn lg"><Ico name="minus" /> Изъять <span className="hk">F9</span></button>
                <button className="btn lg"><Ico name="shield" /> Инкассация <span className="hk">F10</span></button>
              </div>
            </div>

            <div>
              <div className="muted" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Купюры</div>
              <div className="denom-grid">
                {notes.map((d) => (
                  <div key={d.v} className="denom">
                    <div className={`bill bill-${d.v}`}>
                      <div className="bill-corner tl">{d.v}</div>
                      <div className="bill-num mono">{d.v >= 1000 ? d.v / 1000 + ' ₽K' : d.v + ' ₽'}</div>
                      <div className="bill-corner br">{d.v}</div>
                    </div>
                    <div className="denom-meta">
                      <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{d.count}</span>
                      <span className="muted" style={{ fontSize: 11 }}>шт</span>
                      <span className="spacer" />
                      <span className="mono" style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{(d.v * d.count).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="muted" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Монеты</div>
              <div className="coin-row">
                {coins.map((d) => (
                  <div key={d.v} className="coin-card">
                    <div className={`coin coin-${d.v}`}>{d.v}</div>
                    <div style={{ textAlign: 'center', marginTop: 6 }}>
                      <div className="mono" style={{ fontSize: 14, fontWeight: 700 }}>{d.count}</div>
                      <div className="muted mono" style={{ fontSize: 10 }}>{(d.v * d.count).toLocaleString('ru-RU')} ₽</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Operations log */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <div className="card-h">
            <span className="ttl">Журнал кассовых операций</span>
            <div className="actions">
              <div className="seg">
                <button className="on">Все</button><button>Продажи</button><button>Служ.</button><button>Возвраты</button>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }} className="thin-scroll">
            {OPS.map((op, i) => {
              const iconMap: Record<string, string> = { sale:'↑', in:'+', out:'−', refund:'↺', open:'⚑' };
              const colorMap: Record<string, string> = { sale:'info', in:'ok', out:'warn', refund:'err', open:'info' };
              return (
                <div key={i} className="cash-op">
                  <span className="t mono">{op.t}</span>
                  <span className={`ic ${colorMap[op.kind]}`}>{iconMap[op.kind]}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{op.msg}</span>
                    <span className="muted mono" style={{ fontSize: 11, marginTop: 1 }}>{op.pay} · {op.op}</span>
                  </div>
                  <span className="mono cash-op-amt" style={{ color: op.amt < 0 ? 'var(--err)' : 'var(--ok)' }}>
                    {op.amt > 0 ? '+' : ''}{op.amt.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
