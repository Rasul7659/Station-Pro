'use client';
import Ico from '@/components/Ico';
import { FUELS } from '@/lib/data';

const HOURLY = [
  [8,4200,650],[9,8400,1100],[10,12600,1840],[11,15300,2210],
  [12,18900,2980],[13,21200,3420],[14,19800,2680],[15,17200,2100],
] as [number,number,number][];

const FUEL_BREAKDOWN = [
  { fuel:'92',  liters:1142, revenue:59870.80,  count:28 },
  { fuel:'95',  liters:1684, revenue:95819.60,  count:41 },
  { fuel:'98',  liters: 486, revenue:31201.20,  count:14 },
  { fuel:'DT',  liters:1280, revenue:74368.00,  count:22 },
  { fuel:'GAS', liters: 340, revenue: 9690.00,  count: 9 },
];

const PAYMENT_MIX = [
  { id:'cash', nm:'Наличные',    v:134250.80, c:58, color:'var(--ok)'     },
  { id:'card', nm:'Банк. карта', v:102480.20, c:41, color:'var(--brand)'  },
  { id:'fuel', nm:'Топл. карта', v: 28640.00, c:12, color:'var(--fuel-98)'},
  { id:'corp', nm:'Ведомость',   v:  7578.60, c: 3, color:'var(--warn)'   },
];

const TOP_PRODUCTS = [
  { nm:'Кофе Americano',  qty:38, sum:4560 },
  { nm:'Snickers 50 г',   qty:26, sum:2470 },
  { nm:'Coca-Cola 0.5 л', qty:22, sum:2420 },
  { nm:'Хот-дог классик', qty:18, sum:3240 },
  { nm:'Вода Aqua 0.5 л', qty:16, sum:1040 },
  { nm:'Кофе Capuccino',  qty:14, sum:2240 },
  { nm:'Жвачка Orbit',    qty:12, sum: 900 },
];

const PUMP_BREAKDOWN = [
  {id:1,fuel:'95',liters:420,revenue:23898},{id:2,fuel:'DT',liters:580,revenue:33698},
  {id:3,fuel:'92',liters:380,revenue:19912},{id:4,fuel:'95',liters:360,revenue:20484},
  {id:5,fuel:'98',liters:280,revenue:17976},{id:6,fuel:'DT',liters:480,revenue:27888},
  {id:7,fuel:'92',liters:420,revenue:22008},{id:8,fuel:'95',liters:510,revenue:29019},
  {id:9,fuel:'98',liters:206,revenue:13225},{id:10,fuel:'DT',liters:220,revenue:12782},
  {id:11,fuel:'GAS',liters:340,revenue:9690},{id:12,fuel:'92',liters:342,revenue:17920},
];

function MetricCard({ label, value, sub, accent, hint, big }: { label:string; value:string|number; sub?:string; accent?:string; hint?:{tone:string;t:string}; big?:boolean }) {
  return (
    <div className="card metric-tile">
      <div className="muted" style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</div>
      <div className="mono" style={{ fontSize: big ? 32 : 26, fontWeight:700, letterSpacing:'-0.03em', lineHeight:1, marginTop:8, color: accent||'var(--foreground)' }}>{value}</div>
      {sub  && <div className="muted" style={{ fontSize:11, marginTop:6 }}>{sub}</div>}
      {hint && <div style={{ fontSize:11, marginTop:6, color: hint.tone==='ok'?'var(--ok)':hint.tone==='err'?'var(--err)':'var(--muted-foreground)' }}>{hint.t}</div>}
    </div>
  );
}

function HourlyChart() {
  const w=760, h=220, pad={l:44,r:16,t:16,b:28};
  const innerW=w-pad.l-pad.r, innerH=h-pad.t-pad.b;
  const max=Math.max(...HOURLY.map(([,f,s])=>f+s))*1.1;
  const xStep=innerW/HOURLY.length;
  return (
    <div className="card" style={{ padding:0 }}>
      <div className="card-h">
        <span className="ttl">Выручка по часам</span>
        <div className="actions">
          <div className="seg"><button className="on">Смена</button><button>День</button><button>Неделя</button></div>
          <span className="tag"><span style={{ width:8,height:8,background:'var(--brand)',borderRadius:2,display:'inline-block',marginRight:4 }} />Топливо</span>
          <span className="tag"><span style={{ width:8,height:8,background:'var(--warn)',borderRadius:2,display:'inline-block',marginRight:4 }} />Магазин</span>
        </div>
      </div>
      <div style={{ padding:'8px 16px 14px' }}>
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width:'100%', height:220 }}>
          {[0,.25,.5,.75,1].map((p,i)=>(
            <g key={i}>
              <line x1={pad.l} y1={pad.t+innerH*(1-p)} x2={w-pad.r} y2={pad.t+innerH*(1-p)} stroke="var(--border)" strokeDasharray={p===0||p===1?'':'2 4'} />
              <text x={pad.l-8} y={pad.t+innerH*(1-p)+3} textAnchor="end" fill="var(--muted-foreground)" fontSize="10" fontFamily="var(--font-mono)">{Math.round(max*p/1000)}k</text>
            </g>
          ))}
          {HOURLY.map(([hour,f,s],i)=>{
            const fH=(f/max)*innerH, sH=(s/max)*innerH;
            const x=pad.l+i*xStep+xStep*0.18, bw=xStep*0.64;
            return (
              <g key={i}>
                <rect x={x} y={pad.t+innerH-fH}    width={bw} height={fH} rx="3" fill="var(--brand)" />
                <rect x={x} y={pad.t+innerH-fH-sH} width={bw} height={sH} rx="3" fill="var(--warn)" />
                <text x={x+bw/2} y={pad.t+innerH-fH-sH-6} textAnchor="middle" fill="var(--foreground)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">{Math.round((f+s)/1000)}k</text>
                <text x={x+bw/2} y={h-pad.b+16} textAnchor="middle" fill="var(--muted-foreground)" fontSize="10" fontFamily="var(--font-mono)">{String(hour).padStart(2,'0')}:00</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function PaymentMixDonut() {
  const total=PAYMENT_MIX.reduce((s,p)=>s+p.v,0);
  const r=70, cx=100, cy=100, sw=22;
  let acc=0;
  return (
    <div className="card" style={{ padding:0, display:'flex', flexDirection:'column', minHeight:0, height:'100%' }}>
      <div className="card-h"><span className="ttl">Виды оплат</span><span className="tag">{PAYMENT_MIX.reduce((s,p)=>s+p.c,0)} чеков</span></div>
      <div style={{ padding:16, display:'flex', gap:16, alignItems:'center', flex:1 }}>
        <svg viewBox="0 0 200 200" style={{ width:200, height:200, flexShrink:0 }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--secondary)" strokeWidth={sw} />
          {PAYMENT_MIX.map((p,i)=>{
            const portion=p.v/total, len=portion*2*Math.PI*r, tot=2*Math.PI*r;
            const offset=-acc*2*Math.PI*r+tot*0.25;
            acc+=portion;
            return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={p.color} strokeWidth={sw} strokeDasharray={`${len} ${tot-len}`} strokeDashoffset={offset} transform={`rotate(-90 ${cx} ${cy})`} />;
          })}
          <text x={cx} y={cy-6}  textAnchor="middle" fontSize="11" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">ИТОГО</text>
          <text x={cx} y={cy+18} textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--foreground)" fontFamily="var(--font-mono)">{(total/1000).toFixed(1)}k</text>
          <text x={cx} y={cy+32} textAnchor="middle" fontSize="10" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">₽</text>
        </svg>
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
          {PAYMENT_MIX.map(p=>(
            <div key={p.id} className="pay-mix-row">
              <span className="pay-dot" style={{ background:p.color }} />
              <span style={{ fontSize:12, fontWeight:500, flex:1 }}>{p.nm}</span>
              <span className="muted mono" style={{ fontSize:11 }}>{((p.v/total)*100).toFixed(0)}%</span>
              <span className="mono" style={{ fontSize:12, fontWeight:600, minWidth:78, textAlign:'right' }}>{p.v.toLocaleString('ru-RU',{minimumFractionDigits:2})} ₽</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FuelBreakdown() {
  const totalL=FUEL_BREAKDOWN.reduce((s,f)=>s+f.liters,0);
  const totalR=FUEL_BREAKDOWN.reduce((s,f)=>s+f.revenue,0);
  return (
    <div className="card" style={{ padding:0 }}>
      <div className="card-h">
        <span className="ttl">Топливо по видам</span>
        <div className="actions">
          <span className="tag">{totalL.toLocaleString('ru-RU')} л</span>
          <span className="tag">{totalR.toLocaleString('ru-RU')} ₽</span>
        </div>
      </div>
      <div style={{ padding:12 }}>
        <table className="rpt-table">
          <thead><tr><th>Топливо</th><th>Литры</th><th>Доля</th><th>Чеков</th><th style={{ textAlign:'right' }}>Выручка</th></tr></thead>
          <tbody>
            {FUEL_BREAKDOWN.map(f=>{
              const fuel=FUELS[f.fuel as keyof typeof FUELS];
              const pct=(f.liters/totalL)*100;
              return (
                <tr key={f.fuel}>
                  <td><div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div className={`fuel-tag ${fuel.cls}`} style={{ minWidth:40, padding:'4px 4px' }}><div className="grade" style={{ fontSize:11 }}>{fuel.code.replace('АИ-','')}</div></div>
                    <span style={{ fontWeight:500 }}>{fuel.code}</span>
                  </div></td>
                  <td className="mono tnum">{f.liters.toLocaleString('ru-RU')} л</td>
                  <td><div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ flex:1, height:6, background:'var(--secondary)', borderRadius:3, overflow:'hidden', minWidth:60 }}>
                      <div style={{ height:'100%', width:pct+'%', background:fuel.color, borderRadius:3 }} />
                    </div>
                    <span className="mono" style={{ fontSize:11, color:'var(--muted-foreground)', minWidth:32, textAlign:'right' }}>{pct.toFixed(0)}%</span>
                  </div></td>
                  <td className="mono tnum">{f.count}</td>
                  <td className="mono tnum" style={{ textAlign:'right', fontWeight:600 }}>{f.revenue.toLocaleString('ru-RU')} ₽</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot><tr>
            <td>Итого</td>
            <td className="mono tnum">{totalL.toLocaleString('ru-RU')} л</td>
            <td>—</td>
            <td className="mono tnum">{FUEL_BREAKDOWN.reduce((s,f)=>s+f.count,0)}</td>
            <td className="mono tnum" style={{ textAlign:'right' }}>{totalR.toLocaleString('ru-RU')} ₽</td>
          </tr></tfoot>
        </table>
      </div>
    </div>
  );
}

function TopProducts() {
  const maxQ=Math.max(...TOP_PRODUCTS.map(p=>p.qty));
  return (
    <div className="card" style={{ padding:0, display:'flex', flexDirection:'column' }}>
      <div className="card-h"><span className="ttl">Топ товаров магазина</span><button className="btn ghost" style={{ height:26, fontSize:11, padding:'0 8px' }}>Все</button></div>
      <div style={{ padding:12, flex:1 }}>
        {TOP_PRODUCTS.map((p,i)=>(
          <div key={i} className="top-prod">
            <span className="top-prod-rank mono">{String(i+1).padStart(2,'0')}</span>
            <span className="top-prod-nm">{p.nm}</span>
            <div className="top-prod-bar"><div style={{ width:(p.qty/maxQ)*100+'%' }} /></div>
            <span className="mono" style={{ fontSize:12, fontWeight:600, minWidth:40, textAlign:'right' }}>{p.qty} шт</span>
            <span className="mono muted" style={{ fontSize:11, minWidth:70, textAlign:'right' }}>{p.sum.toLocaleString('ru-RU')} ₽</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PumpBreakdown() {
  const max=Math.max(...PUMP_BREAKDOWN.map(p=>p.revenue));
  const totalR=PUMP_BREAKDOWN.reduce((s,p)=>s+p.revenue,0);
  return (
    <div className="card" style={{ padding:0 }}>
      <div className="card-h"><span className="ttl">Выручка по колонкам</span><span className="tag mono">{totalR.toLocaleString('ru-RU')} ₽</span></div>
      <div style={{ padding:14, display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:10 }}>
        {PUMP_BREAKDOWN.map(p=>{
          const fuel=FUELS[p.fuel as keyof typeof FUELS];
          const pct=(p.revenue/max)*100;
          return (
            <div key={p.id} className="pump-bar">
              <div className="pump-bar-vis"><div className="pump-bar-fill" style={{ height:pct+'%', background:fuel.color }} /></div>
              <div className="pump-bar-label">
                <div className="mono" style={{ fontSize:11, fontWeight:700 }}>{String(p.id).padStart(2,'0')}</div>
                <div className="mono muted" style={{ fontSize:10 }}>{fuel.code.replace('АИ-','')}</div>
              </div>
              <div className="mono" style={{ fontSize:11, fontWeight:600 }}>{(p.revenue/1000).toFixed(1)}k</div>
              <div className="mono muted" style={{ fontSize:10 }}>{p.liters} л</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ReportsScreen() {
  const totalRev    = PAYMENT_MIX.reduce((s,p)=>s+p.v,0);
  const totalChecks = PAYMENT_MIX.reduce((s,p)=>s+p.c,0);
  const totalLiters = FUEL_BREAKDOWN.reduce((s,f)=>s+f.liters,0);

  return (
    <div className="reports-screen thin-scroll">
      <div className="reports-header">
        <div>
          <div className="muted mono" style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>Отчёт смены</div>
          <h1 style={{ margin:'4px 0 0', fontSize:22, fontWeight:600, letterSpacing:'-0.02em' }}>Смена 47 · 30 апр 2026 · 08:00 — текущий момент</h1>
          <div className="muted" style={{ fontSize:12, marginTop:4 }}>Оператор: И. Соколов · АЗС-007 · М-4 «Дон» 218 км · период 6 ч 32 мин</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn"><Ico name="report" /> Excel</button>
          <button className="btn"><Ico name="print" /> PDF</button>
          <button className="btn danger lg"><Ico name="lock" /> Закрыть смену</button>
        </div>
      </div>

      <div className="rpt-metrics">
        <MetricCard label="Общая выручка"   value={totalRev.toLocaleString('ru-RU',{minimumFractionDigits:2})+' ₽'} sub="за смену"       accent="var(--brand)" hint={{tone:'ok',t:'↑ 14% к прошлой'}} big />
        <MetricCard label="Чеков"            value={totalChecks}                           sub="ср. чек 2 670 ₽" hint={{tone:'ok',t:'↑ 8%'}} />
        <MetricCard label="Литров продано"   value={totalLiters.toLocaleString('ru-RU')+' л'} sub="по 5 видам" hint={{tone:'ok',t:'↑ 6%'}} />
        <MetricCard label="Магазин"          value="22 280 ₽"                              sub="38 чеков"        hint={{tone:'ok',t:'↑ 22%'}} />
        <MetricCard label="Возвраты"         value="−1 180 ₽"                              sub="1 операция"      hint={{tone:'muted',t:'0.4% от выручки'}} accent="var(--err)" />
        <MetricCard label="Касса · ост."     value="184 320.50 ₽"                          sub="наличными"       hint={{tone:'ok',t:'инкассация 12:30'}} />
      </div>

      <div className="rpt-row-1">
        <HourlyChart />
        <PaymentMixDonut />
      </div>

      <div className="rpt-row-2">
        <FuelBreakdown />
        <TopProducts />
      </div>

      <PumpBreakdown />

      <div className="card" style={{ padding:18, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:600 }}>Закрытие смены</div>
          <div className="muted" style={{ fontSize:12, marginTop:4 }}>Запустит чек-лист: пересчёт кассы → замеры ёмкостей → Z-отчёт → подпись.</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn"><Ico name="check" className="i-sm" /> Z-отчёт превью</button>
          <button className="btn danger lg"><Ico name="lock" /> Закрыть смену <span className="hk">Shift+F12</span></button>
        </div>
      </div>
    </div>
  );
}
