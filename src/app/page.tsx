'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { OPERATORS } from '@/lib/data';
import type { Operator, Screen } from '@/lib/types';
import Ico from '@/components/Ico';
import DispatcherScreen from '@/components/screens/DispatcherScreen';
import StoreScreen      from '@/components/screens/StoreScreen';
import TanksScreen      from '@/components/screens/TanksScreen';
import ReceiveScreen    from '@/components/screens/ReceiveScreen';
import CashScreen       from '@/components/screens/CashScreen';
import ReportsScreen    from '@/components/screens/ReportsScreen';
import DispenseModal    from '@/components/modals/DispenseModal';
import PaymentModal     from '@/components/modals/PaymentModal';

// ─── Login ───────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (op: Operator) => void }) {
  const [sel, setSel] = useState(0);
  const [pin, setPin] = useState('');
  const op = OPERATORS[sel];

  function setKey(k: string) {
    if (k === 'C') setPin('');
    else if (k === '←') setPin((p) => p.slice(0, -1));
    else if (pin.length < 6) setPin((p) => p + k);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter') { onLogin(op); return; }
      if (e.key === 'Backspace') { setPin((p) => p.slice(0, -1)); return; }
      if (/^\d$/.test(e.key)) setKey(e.key);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [op, pin]);

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-side">
          <div className="brand">
            <div className="glyph">СП</div>
            <div>
              <div className="nm">Станция Pro</div>
              <div className="sm">Operator Workstation · v2.4.18</div>
            </div>
          </div>
          <svg className="pattern" viewBox="0 0 200 200" fill="none" stroke="white" strokeWidth="1">
            <circle cx="100" cy="100" r="80" /><circle cx="100" cy="100" r="60" />
            <circle cx="100" cy="100" r="40" /><path d="M20 100h160M100 20v160" />
          </svg>
          <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, maxWidth: 280 }}>
            АЗС-007 · М-4 «Дон» · 218 км<br />12 колонок · 5 ёмкостей · POS магазина
          </div>
          <div className="stat-strip">
            <div className="stat-row"><span className="lbl">Смена</span><span className="val ok">№47 · открыта</span></div>
            <div className="stat-row"><span className="lbl">Ост. в кассе</span><span className="val">184 320.50 ₽</span></div>
            <div className="stat-row"><span className="lbl">Ёмкость АИ-98</span><span className="val warn">42.7% — низкий</span></div>
            <div className="stat-row"><span className="lbl">Оборудование</span><span className="val ok">Все системы ОК</span></div>
            <div className="stat-row" style={{ borderBottom: 0 }}><span className="lbl">Версия / связь</span><span className="val">v2.4.18 · ●</span></div>
          </div>
        </div>

        <div className="login-form">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h1>Вход в смену</h1>
            <div className="sub" style={{ marginTop: 0 }}>Выберите оператора и введите PIN-код</div>
          </div>

          <div>
            <div className="field-lbl">Оператор</div>
            <div className="op-grid">
              {OPERATORS.map((o, i) => (
                <div key={o.id} className={'op-card' + (sel === i ? ' selected' : '')} onClick={() => setSel(i)}>
                  <div className="av">{o.initials}</div>
                  <div className="info">
                    <span className="nm">{o.nm}</span>
                    <span className="rl">{o.rl}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="field-lbl">PIN-код</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              {[0,1,2,3,4,5].map((i) => (
                <div key={i} style={{ flex: 1, height: 44, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: pin[i] ? 'var(--text-1)' : 'var(--text-4)' }}>
                  {pin[i] ? '•' : ''}
                </div>
              ))}
            </div>
            <div className="numpad">
              {['1','2','3','4','5','6','7','8','9','C','0','←'].map((k) => (
                <button key={k} className={k === 'C' || k === '←' ? 'act' : ''} onClick={() => setKey(k)}>{k}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button className="btn lg" style={{ flex: 1 }}><Ico name="lock" /> Карта оператора</button>
            <button className="btn primary lg" style={{ flex: 1.4 }} onClick={() => onLogin(op)}>
              <Ico name="check" /> Войти и открыть смену <span className="hk">Enter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Rail ─────────────────────────────────────────────────────────────────────
function Rail({ active, onNav }: { active: Screen; onNav: (s: Screen) => void }) {
  const items = [
    { id: 'pumps'   as Screen, ic: 'pumps',   lbl: 'АЗС',     hk: 'F2' },
    { id: 'store'   as Screen, ic: 'store',   lbl: 'Магазин', hk: 'F3' },
    { id: 'tanks'   as Screen, ic: 'tank',    lbl: 'Ёмкости', hk: 'F4' },
    { id: 'receive' as Screen, ic: 'receive', lbl: 'Приём',   hk: 'F5' },
    { id: 'cash'    as Screen, ic: 'cash',    lbl: 'Касса',   hk: 'F6' },
    { id: 'reports' as Screen, ic: 'report',  lbl: 'Отчёты',  hk: 'F7' },
  ];
  const setTweaks = useStore((s) => s.setTweaks);
  const tweaks = useStore((s) => s.tweaks);
  return (
    <div className="rail">
      <div className="logo" title="Станция Pro">СП</div>
      {items.map((it) => (
        <button key={it.id} className={'nav-btn' + (active === it.id ? ' active' : '')} onClick={() => onNav(it.id)}>
          <span className="hk">{it.hk}</span>
          <Ico name={it.ic} className="icon" />
          <span className="lbl">{it.lbl}</span>
        </button>
      ))}
      <div className="rail-spacer" />
      <button className="nav-btn" title="Тема" onClick={() => setTweaks({ theme: tweaks.theme === 'night' ? 'light' : 'night' })}>
        <Ico name={tweaks.theme === 'night' ? 'sun' : 'moon'} className="icon" />
      </button>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ onLogout, onShowHotkeys }: { onLogout: () => void; onShowHotkeys: () => void }) {
  const screen   = useStore((s) => s.screen);
  const operator = useStore((s) => s.operator);
  const pumps    = useStore((s) => s.pumps);
  const tweaks   = useStore((s) => s.tweaks);
  const setTweaks = useStore((s) => s.setTweaks);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', weekday: 'short' });

  const labels: Record<Screen, string> = {
    pumps: 'Управление АЗС', store: 'Магазин · POS',
    tanks: 'Ёмкости', receive: 'Приём топлива',
    cash: 'Кассовые операции', reports: 'Отчёты и закрытие смены',
  };

  const alerts = pumps.filter((p) => p.state === 'error' || p.state === 'offline').length;

  return (
    <div className="header">
      <div className="crumb"><b>{labels[screen] || 'Панель оператора'}</b></div>
      <div className="sep" />
      <span className="shift-pill"><span className="dot" />Смена 47 · открыта 08:00</span>
      <div className="sep" />
      <div className="row-h" style={{ gap: 4 }}>
        <span className="clock">{time}</span>
        <span className="muted" style={{ fontSize: 11 }}>{date}</span>
      </div>
      <div className="spacer" />
      {alerts > 0 && (
        <button className="btn ghost" style={{ height: 32, color: 'var(--warn)' }}>
          <Ico name="bell" /> {alerts} предупр.
        </button>
      )}
      <button className="icon-btn" title="Горячие клавиши (?)" onClick={onShowHotkeys}><Ico name="keyboard" /></button>
      <button className="icon-btn" title={tweaks.theme === 'night' ? 'Светлая тема' : 'Ночная смена'} onClick={() => setTweaks({ theme: tweaks.theme === 'night' ? 'light' : 'night' })}>
        <Ico name={tweaks.theme === 'night' ? 'sun' : 'moon'} />
      </button>
      <div className="op-chip">
        <span className="av">{operator?.initials || 'ОП'}</span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span className="nm">{operator?.nm}</span>
          <span className="rl">{operator?.rl}</span>
        </div>
      </div>
      <button className="btn" style={{ height: 32 }} onClick={onLogout}>Выход <span className="hk">Ctrl+L</span></button>
    </div>
  );
}

// ─── StatusBar ────────────────────────────────────────────────────────────────
function StatusBar() {
  const pumps = useStore((s) => s.pumps);
  const active = pumps.filter((p) => p.state === 'active').length;
  const errors = pumps.filter((p) => p.state === 'error' || p.state === 'offline').length;
  return (
    <div className="statusbar">
      <span className="sb-item"><span className="live-dot" /> ОНЛАЙН</span>
      <span className="sb-item"><span className="dot ok" /> Фиск. регистратор · ОК</span>
      <span className="sb-item"><span className="dot ok" /> Банк-терминал · ОК</span>
      <span className="sb-item"><span className="dot ok" /> CAN-bus · 11/12 ТРК</span>
      <span className="sb-item"><span className="dot warn" /> 1С · синхр. 14:28</span>
      <span className="sb-spacer" />
      <span className="sb-item">Активных: <b style={{ color: '#4ade80', marginLeft: 4 }}>{active}</b></span>
      {errors > 0 && <span className="sb-item err">Ошибок: <b style={{ marginLeft: 4 }}>{errors}</b></span>}
      <span className="sb-item">Касса: <b style={{ color: '#fff', marginLeft: 4 }}>184 320.50 ₽</b></span>
      <span className="sb-item">v2.4.18 · АЗС-007</span>
    </div>
  );
}

// ─── HotkeyOverlay ────────────────────────────────────────────────────────────
function HotkeyOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape' || e.key === '?') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const groups = [
    { ttl: 'Навигация', items: [['F2','АЗС / Колонки'],['F3','Магазин'],['F4','Ёмкости'],['F5','Приём топлива'],['F6','Касса'],['F7','Отчёты'],['Esc','Закрыть окно'],['Ctrl+L','Выход']] },
    { ttl: 'Колонки',   items: [['1–9, 0, -, =','Выбор колонки 1–12'],['Space','Запуск отпуска'],['S','Стоп / пауза'],['Esc','Сброс выбора']] },
    { ttl: 'Отпуск',    items: [['L','Режим: на литры'],['M','Режим: на сумму'],['F','До полного бака'],['D','Прямой пуск'],['Enter','Подтвердить и запустить']] },
    { ttl: 'Оплата',    items: [['F8','Наличные'],['F9','Банковская карта'],['F10','Топливная карта'],['F11','Ведомость'],['F12','Скидка / лояльность']] },
  ];

  return (
    <div className="hk-overlay" onClick={onClose}>
      <div className="hk-card" onClick={(e) => e.stopPropagation()}>
        <div className="row-h" style={{ marginBottom: 12 }}>
          <Ico name="keyboard" /><h3 style={{ margin: 0 }}>Горячие клавиши</h3>
          <span className="spacer" />
          <button className="btn ghost" onClick={onClose}><Ico name="close" /></button>
        </div>
        <div className="hk-list">
          {groups.map((g, i) => (
            <div key={i}>
              <div className="field-lbl" style={{ marginBottom: 4 }}>{g.ttl}</div>
              {g.items.map(([k, v], j) => (
                <div className="hk-row" key={j}>
                  <span>{v}</span>
                  <span className="keys">{k.split(/[\s,]+/).filter(Boolean).map((kk, x) => <span key={x} className="kbd">{kk}</span>)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const operator          = useStore((s) => s.operator);
  const screen            = useStore((s) => s.screen);
  const tweaks            = useStore((s) => s.tweaks);
  const showHotkeyOverlay = useStore((s) => s.showHotkeyOverlay);
  const dispenseOpen      = useStore((s) => s.dispenseOpen);
  const paymentOpen       = useStore((s) => s.paymentOpen);
  const paymentOrder      = useStore((s) => s.paymentOrder);
  const selectedPumpId    = useStore((s) => s.selectedPumpId);
  const pumps             = useStore((s) => s.pumps);

  const setOperator           = useStore((s) => s.setOperator);
  const setScreen             = useStore((s) => s.setScreen);
  const setShowHotkeyOverlay  = useStore((s) => s.setShowHotkeyOverlay);
  const openDispense          = useStore((s) => s.openDispense);
  const closeDispense         = useStore((s) => s.closeDispense);
  const closePayment          = useStore((s) => s.closePayment);
  const selectPump            = useStore((s) => s.selectPump);

  const selectedPump = pumps.find((p) => p.id === selectedPumpId) ?? null;

  // Apply theme + density to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
    document.documentElement.setAttribute('data-density', tweaks.density);
    if (tweaks.touch) document.documentElement.setAttribute('data-touch', 'touch');
    else document.documentElement.removeAttribute('data-touch');
  }, [tweaks]);

  // Global hotkeys
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!operator) return;
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA';

      if (e.key === '?') { e.preventDefault(); setShowHotkeyOverlay(true); return; }
      if (e.key === 'Escape') { closeDispense(); closePayment(); selectPump(null); setShowHotkeyOverlay(false); return; }

      if (!isInput) {
        if (e.key === 'F2') { e.preventDefault(); setScreen('pumps'); }
        if (e.key === 'F3') { e.preventDefault(); setScreen('store'); }
        if (e.key === 'F4') { e.preventDefault(); setScreen('tanks'); }
        if (e.key === 'F5') { e.preventDefault(); setScreen('receive'); }
        if (e.key === 'F6') { e.preventDefault(); setScreen('cash'); }
        if (e.key === 'F7') { e.preventDefault(); setScreen('reports'); }
        if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); setOperator(null); }

        if (screen === 'pumps' && !dispenseOpen && !paymentOpen) {
          const pumpMap: Record<string, number> = { '1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'0':10,'-':11,'=':12 };
          if (pumpMap[e.key]) selectPump(pumpMap[e.key]);
          if (e.key === ' ' && selectedPumpId) { e.preventDefault(); openDispense(); }
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [operator, screen, dispenseOpen, paymentOpen, selectedPumpId, setScreen, setOperator, selectPump, openDispense, closeDispense, closePayment, setShowHotkeyOverlay]);

  if (!operator) return <LoginScreen onLogin={(op) => setOperator(op)} />;

  return (
    <div className="app" data-theme={tweaks.theme} data-density={tweaks.density}>
      <Rail active={screen} onNav={setScreen} />
      <Header onLogout={() => setOperator(null)} onShowHotkeys={() => setShowHotkeyOverlay(true)} />
      <main className="main">
        {screen === 'pumps'   && <DispatcherScreen />}
        {screen === 'store'   && <StoreScreen />}
        {screen === 'tanks'   && <TanksScreen />}
        {screen === 'receive' && <ReceiveScreen />}
        {screen === 'cash'    && <CashScreen />}
        {screen === 'reports' && <ReportsScreen />}
      </main>
      <StatusBar />

      {dispenseOpen && selectedPump && (
        <DispenseModal pump={selectedPump} onClose={closeDispense} />
      )}
      {paymentOpen && paymentOrder && (
        <PaymentModal order={paymentOrder} onClose={closePayment} onComplete={closePayment} />
      )}
      {showHotkeyOverlay && <HotkeyOverlay onClose={() => setShowHotkeyOverlay(false)} />}
    </div>
  );
}
