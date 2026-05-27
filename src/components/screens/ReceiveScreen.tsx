'use client';
import { useState, useEffect, useRef } from 'react';
import { DELIVERIES } from '@/lib/data';
import type { Delivery } from '@/lib/types';
import Ico from '@/components/Ico';

const STEPS = [
  { id: 'docs',    name: 'Документы', sub: 'ТТН и пломбы' },
  { id: 'check',   name: 'Осмотр',    sub: 'Целостность АЦ' },
  { id: 'quality', name: 'Качество',  sub: 'Плотность и проба' },
  { id: 'measure', name: 'Замер',     sub: 'До слива' },
  { id: 'pour',    name: 'Слив',      sub: 'Контроль наполнения' },
  { id: 'final',   name: 'Завершение',sub: 'Замер и акт' },
];

const SEALS: Record<string, string[]> = {
  'TTN-44892': ['СП-128842','СП-128843','СП-128844','СП-128845'],
  'TTN-44895': ['ГП-77104','ГП-77105'],
  'TTN-44871': ['СП-128801','СП-128802'],
};

function StatusBadge({ status }: { status: Delivery['status'] }) {
  if (status === 'arrived')  return <span className="status-pill warn"><span className="dot" />На разгрузке</span>;
  if (status === 'expected') return <span className="status-pill info"><span className="dot" />Ожидается</span>;
  return <span className="status-pill ok"><span className="dot" />Принято</span>;
}

function StepIndicator({ current }: { current: string }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="step-indicator">
      {STEPS.map((s, i) => {
        const state = i < idx ? 'done' : i === idx ? 'active' : 'pending';
        return (
          <div key={s.id} style={{ display: 'contents' }}>
            <div className={`step-item ${state}`}>
              <div className="step-circle">{state === 'done' ? '✓' : i + 1}</div>
              <div className="step-text">
                <div className="step-nm">{s.name}</div>
                <div className="step-sub">{s.sub}</div>
              </div>
            </div>
            {i < STEPS.length - 1 && <div className={`step-conn${i < idx ? ' done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}

function StepDocs({ d }: { d: Delivery }) {
  const seals = SEALS[d.ttn] || [];
  return (
    <div className="step-body">
      <div className="step-h"><h2>Шаг 1. Документы и пломбы</h2><p>Сверьте ТТН и проверьте целостность пломб на отсеках цистерны.</p></div>
      <div className="card kv-card" style={{ borderStyle: 'none' }}>
        <div className="kv-row"><span className="kv-l">ТТН</span><span className="kv-v" style={{ fontFamily: 'var(--font-mono)' }}>{d.ttn}</span></div>
        <div className="kv-row"><span className="kv-l">Поставщик</span><span className="kv-v">{d.supplier}</span></div>
        <div className="kv-row"><span className="kv-l">Бензовоз</span><span className="kv-v" style={{ fontFamily: 'var(--font-mono)' }}>{d.truck}</span></div>
        <div className="kv-row"><span className="kv-l">Водитель</span><span className="kv-v">{d.driver}</span></div>
        <div className="kv-row"><span className="kv-l">Прибытие</span><span className="kv-v">{d.eta}</span></div>
      </div>
      <div>
        <div className="section-h" style={{ marginBottom: 8 }}><h3>Пломбы · {seals.length} шт.</h3></div>
        <div className="check-list">
          {seals.map((s, i) => (
            <div key={s} className={`check-row${i < seals.length - 1 ? ' checked' : ''}`}>
              <div className="check-box">{i < seals.length - 1 ? '✓' : ''}</div>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{s}</span>
              <span style={{ color: 'var(--muted-foreground)', marginLeft: 'auto', fontSize: 11 }}>отсек {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="banner banner-info"><span style={{ fontSize: 16 }}>ⓘ</span><div><div style={{ fontWeight: 600, fontSize: 12 }}>Проверьте номера пломб</div><div style={{ fontSize: 12, marginTop: 2, opacity: 0.85 }}>Номера должны совпадать с ТТН. При несовпадении — отказ от приёма.</div></div></div>
    </div>
  );
}

function StepCheck() {
  const [checks, setChecks] = useState({ seals: true, hatches: true, hoses: false, ground: false, fire: false, papers: false });
  const items = [
    { k: 'seals',   t: 'Пломбы целы и соответствуют ТТН' },
    { k: 'hatches', t: 'Люки и крышки без повреждений' },
    { k: 'hoses',   t: 'Сливные рукава в исправном состоянии' },
    { k: 'ground',  t: 'Заземление подключено' },
    { k: 'fire',    t: 'Огнетушители у бензовоза в зоне досягаемости' },
    { k: 'papers',  t: 'Паспорт качества и сертификаты получены' },
  ] as { k: keyof typeof checks; t: string }[];
  const allDone = items.every((i) => checks[i.k]);
  return (
    <div className="step-body">
      <div className="step-h"><h2>Шаг 2. Визуальный осмотр</h2><p>Проверьте техническое состояние автоцистерны и подготовку к сливу.</p></div>
      <div className="check-list">
        {items.map((i) => (
          <button key={i.k} className={`check-row${checks[i.k] ? ' checked' : ''}`} onClick={() => setChecks((c) => ({ ...c, [i.k]: !c[i.k] }))} style={{ cursor: 'pointer', textAlign: 'left' }}>
            <div className="check-box">{checks[i.k] ? '✓' : ''}</div>
            <span style={{ flex: 1 }}>{i.t}</span>
          </button>
        ))}
      </div>
      <div className={`banner ${allDone ? 'banner-info' : 'banner-warn'}`}>
        <span style={{ fontSize: 16 }}>{allDone ? '✓' : '⚠'}</span>
        <div><div style={{ fontWeight: 600, fontSize: 12 }}>{allDone ? 'Все пункты подтверждены' : `Осталось: ${items.filter((i) => !checks[i.k]).length}`}</div><div style={{ fontSize: 12, marginTop: 2, opacity: 0.85 }}>Без подтверждения всех пунктов слив запрещён.</div></div>
      </div>
    </div>
  );
}

function StepQuality({ d }: { d: Delivery }) {
  return (
    <div className="step-body">
      <div className="step-h"><h2>Шаг 3. Контроль качества</h2><p>Снимите пробу и сверьте плотность с паспортом качества.</p></div>
      <div className="qual-grid">
        {[
          { lbl: 'Плотность по паспорту', v: d.density.toFixed(3), u: 'кг/л', cmp: 'при +15°C' },
          { lbl: 'Плотность измеренная',  v: (d.density + 0.001).toFixed(3), u: 'кг/л', cmp: 'в допуске · Δ +0.001' },
          { lbl: 'Температура продукта',  v: d.temp.toFixed(1), u: '°C', cmp: 'внешняя +8.4 °C' },
          { lbl: 'Проба', v: 'Прозрачная', u: '', cmp: 'без примесей' },
        ].map((m, i) => (
          <div key={i} className="card metric-card">
            <div className="metric-lbl">{m.lbl}</div>
            <div className="metric-v">{m.v}<small> {m.u}</small></div>
            <div className="metric-cmp"><span className="tag-ok">{m.cmp}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepMeasure({ d }: { d: Delivery }) {
  const vol = 8240, cap = 30000;
  return (
    <div className="step-body">
      <div className="step-h"><h2>Шаг 4. Замер до слива</h2><p>Зафиксируйте уровень в резервуаре перед началом слива.</p></div>
      <div className="measure-row">
        <div className="card metric-card">
          <div className="metric-lbl">Резервуар · {d.fuel}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 12 }}>
            <div><div style={{ fontSize: 10, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 600 }}>Уровень</div><div className="metric-v" style={{ marginTop: 2 }}>{(vol / 1000).toFixed(2)}<small> м³</small></div></div>
            <div><div style={{ fontSize: 10, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 600 }}>Свободно</div><div className="metric-v" style={{ marginTop: 2 }}>{((cap - vol) / 1000).toFixed(2)}<small> м³</small></div></div>
          </div>
        </div>
      </div>
      <div className="banner banner-info"><span style={{ fontSize: 16 }}>ⓘ</span><div><div style={{ fontWeight: 600, fontSize: 12 }}>Совместимость по плотности проверена</div><div style={{ fontSize: 12, marginTop: 2, opacity: 0.85 }}>Δρ = 0.001 кг/л · смешивание допустимо без отстоя.</div></div></div>
    </div>
  );
}

function StepPour({ d }: { d: Delivery }) {
  const total  = d.vol;
  const [poured, setPoured] = useState(0);
  const [running, setRunning] = useState(true);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setPoured((p) => Math.min(total, p + total / 240)), 250);
    return () => clearInterval(id);
  }, [running, total]);

  const pct     = poured / total * 100;
  const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
  const rate    = running ? 1380 : 0;

  return (
    <div className="step-body">
      <div className="step-h"><h2>Шаг 5. Слив топлива</h2><p>Контролируйте темп слива и не покидайте пост до окончания операции.</p></div>
      <div className="pour-hero">
        <div className="pour-meter">
          <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Принято в РВС</div>
          <div className="pour-pct">{pct.toFixed(1)}<small>%</small></div>
          <div className="pour-vol">{Math.round(poured).toLocaleString('ru-RU')} <small>/ {total.toLocaleString('ru-RU')} л</small></div>
          <div className="pour-bar"><div className="pour-bar-fill" style={{ width: `${pct}%`, background: 'oklch(0.78 0.15 145)' }} /></div>
          <div className="pour-rate">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.78 0.15 145)', display: 'inline-block' }} />
            {running ? `${rate} л/мин · осталось ~${Math.max(0, Math.ceil((total - poured) / rate))} мин` : 'Слив приостановлен'}
          </div>
        </div>
      </div>
      <div className="pour-stats">
        {[['Время', `${String(Math.floor(elapsed/60)).padStart(2,'0')}:${String(elapsed%60).padStart(2,'0')}`],['Темп',`${rate} л/мин`],['Температура','13.7 °C'],['Плотность','0.744 кг/л']].map(([l,v]) => (
          <div key={l} className="stat"><div className="stat-l">{l}</div><div className="stat-v">{v}</div></div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn ghost" onClick={() => setRunning((r) => !r)}>{running ? '⏸ Пауза' : '▶ Продолжить'}</button>
        <button className="btn danger" onClick={() => setRunning(false)}>⏹ Аварийная остановка</button>
      </div>
    </div>
  );
}

function StepFinal({ d }: { d: Delivery }) {
  const actual = d.vol - 18;
  const diff   = actual - d.vol;
  return (
    <div className="step-body">
      <div className="step-h"><h2>Шаг 6. Завершение и акт</h2><p>Сравните фактический объём с ТТН и сформируйте акт приёма.</p></div>
      <div className="qual-grid">
        <div className="card metric-card"><div className="metric-lbl">По ТТН</div><div className="metric-v">{d.vol.toLocaleString('ru-RU')}<small> л</small></div><div className="metric-cmp">плотность {d.density} кг/л</div></div>
        <div className="card metric-card"><div className="metric-lbl">Фактически принято</div><div className="metric-v">{actual.toLocaleString('ru-RU')}<small> л</small></div><div className="metric-cmp"><span className="tag-ok">{diff} л · в допуске</span></div></div>
      </div>
      <div className="card act-doc" style={{ padding: 22 }}>
        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Акт приёма топлива</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16, marginTop: 4 }}>№ АП-44892/01</div>
        </div>
        <div className="kv-card">
          <div className="kv-row"><span className="kv-l">ТТН</span><span className="kv-v" style={{ fontFamily: 'var(--font-mono)' }}>{d.ttn}</span></div>
          <div className="kv-row"><span className="kv-l">Топливо</span><span className="kv-v">{d.fuel}</span></div>
          <div className="kv-row"><span className="kv-l">Объём по ТТН</span><span className="kv-v" style={{ fontFamily: 'var(--font-mono)' }}>{d.vol.toLocaleString('ru-RU')} л</span></div>
          <div className="kv-row"><span className="kv-l">Принято</span><span className="kv-v" style={{ fontFamily: 'var(--font-mono)' }}>{actual.toLocaleString('ru-RU')} л</span></div>
          <div className="kv-row"><span className="kv-l">Расхождение</span><span className="kv-v" style={{ color: 'var(--ok)', fontFamily: 'var(--font-mono)' }}>{diff} л · 0.15%</span></div>
        </div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 11, color: 'var(--muted-foreground)' }}>
          <div><div>Сдал:</div><div style={{ marginTop: 18, paddingTop: 4, borderTop: '1px solid var(--border)', color: 'var(--foreground)' }}>{d.driver}</div></div>
          <div><div>Принял:</div><div style={{ marginTop: 18, paddingTop: 4, borderTop: '1px solid var(--border)', color: 'var(--foreground)' }}>Иванова М. К.</div></div>
        </div>
      </div>
      <div className="banner banner-info"><span style={{ fontSize: 16 }}>✓</span><div><div style={{ fontWeight: 600, fontSize: 12 }}>Топливо успешно принято</div><div style={{ fontSize: 12, marginTop: 2, opacity: 0.85 }}>После подписания акта остаток в РВС обновится в учётной системе.</div></div></div>
    </div>
  );
}

export default function ReceiveScreen() {
  const [selected, setSelected] = useState(DELIVERIES[0].id);
  const [step, setStep] = useState('docs');
  const d   = DELIVERIES.find((x) => x.id === selected)!;
  const idx = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="receive-screen">
      <div className="receive-left">
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="section-h" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <h3>Поставки сегодня</h3>
            <span className="status-pill">{DELIVERIES.length}</span>
          </div>
          <div style={{ overflow: 'auto', flex: 1 }}>
            <div className="deliv-list">
              {DELIVERIES.map((del, i) => (
                <button key={del.id} className={`deliv-row${del.id === selected ? ' selected' : ''}`} onClick={() => { setSelected(del.id); setStep('docs'); }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11 }}>№{i + 1}</div>
                  <div className="deliv-main">
                    <div className="deliv-r1"><span className="deliv-supplier">{del.supplier}</span></div>
                    <div className="deliv-r2">
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--muted-foreground)' }}>{del.ttn}</span>
                      <span style={{ color: 'var(--muted-foreground)' }}>·</span>
                      <span style={{ color: 'var(--muted-foreground)' }}>{(del.vol / 1000).toFixed(0)} тыс. л</span>
                    </div>
                  </div>
                  <div className="deliv-side">
                    <StatusBadge status={del.status} />
                    <span style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{del.eta}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
            <button className="btn ghost" style={{ width: '100%' }}>+ Незапланированная поставка</button>
          </div>
        </div>
      </div>

      <div className="receive-right">
        <div className="card receive-wizard">
          <div className="wizard-h">
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Приём поставки</div>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 2 }}>{d.supplier} · <span style={{ fontFamily: 'var(--font-mono)' }}>{d.ttn}</span></div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>{d.fuel} {(d.vol / 1000).toFixed(0)} тыс. л · плотн. {d.density}</div>
            </div>
            <StatusBadge status={d.status} />
          </div>
          <StepIndicator current={step} />
          <div className="wizard-body">
            {step === 'docs'    && <StepDocs    d={d} />}
            {step === 'check'   && <StepCheck />}
            {step === 'quality' && <StepQuality d={d} />}
            {step === 'measure' && <StepMeasure d={d} />}
            {step === 'pour'    && <StepPour    d={d} />}
            {step === 'final'   && <StepFinal   d={d} />}
          </div>
          <div className="wizard-foot">
            <button className="btn ghost" disabled={idx === 0} onClick={() => idx > 0 && setStep(STEPS[idx - 1].id)}>← Назад</button>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>Шаг {idx + 1} из {STEPS.length}</div>
            {idx < STEPS.length - 1
              ? <button className="btn primary" onClick={() => setStep(STEPS[idx + 1].id)}>Далее →</button>
              : <button className="btn primary">Подписать и закрыть</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
