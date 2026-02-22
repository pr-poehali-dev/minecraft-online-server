import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const SERVER_IP = "lastcraft.ddns.net";
const SERVER_PORT = "2255";

const navLinks = [
  { id: "home", label: "ГЛАВНАЯ" },
  { id: "status", label: "СТАТУС" },
  { id: "connect", label: "ПОДКЛЮЧЕНИЕ" },
  { id: "rating", label: "РЕЙТИНГ" },
  { id: "shop", label: "МАГАЗИН" },
  { id: "forum", label: "ФОРУМ" },
  { id: "contacts", label: "КОНТАКТЫ" },
];

const players = [
  { rank: 1, name: "CyberKnight_X", level: 87, kills: 2341, hours: 1204, faction: "Нео-Синтекс" },
  { rank: 2, name: "VoidWalker99", level: 82, kills: 2109, hours: 987, faction: "Теневой Легион" },
  { rank: 3, name: "NeonHunter", level: 79, kills: 1897, hours: 876, faction: "Нео-Синтекс" },
  { rank: 4, name: "DataBreaker", level: 75, kills: 1654, hours: 743, faction: "Корпус Хаоса" },
  { rank: 5, name: "GlitchMaster", level: 71, kills: 1432, hours: 689, faction: "Теневой Легион" },
  { rank: 6, name: "NullPointer", level: 68, kills: 1211, hours: 612, faction: "Корпус Хаоса" },
  { rank: 7, name: "ByteDestroyer", level: 65, kills: 1098, hours: 534, faction: "Нео-Синтекс" },
];

const shopItems = [
  { name: "VIP", price: "199₽", color: "cyan", perks: ["Префикс [VIP]", "5 домов", "Цветной ник", "Fly в лобби"], icon: "Star" },
  { name: "ELITE", price: "499₽", color: "purple", perks: ["Префикс [ELITE]", "Безлимит домов", "Частицы", "Питомцы", "Kit каждый день"], icon: "Zap" },
  { name: "LEGEND", price: "999₽", color: "pink", perks: ["Префикс [LEGEND]", "Все привилегии ELITE", "Уник. скин частиц", "Авто-ресурсы", "Крылья"], icon: "Crown" },
];

const forumPosts = [
  { author: "CyberKnight_X", time: "2 ч назад", title: "Гайд по прокачке в новом районе Нео-Синтекс", replies: 24, views: 341, tag: "ГАЙД", tagColor: "cyan" },
  { author: "AdminBot", time: "5 ч назад", title: "⚡ ОБНОВЛЕНИЕ 2.4.1 — Новые биомы и механики", replies: 87, views: 1204, tag: "НОВОСТЬ", tagColor: "purple" },
  { author: "VoidWalker99", time: "1 д назад", title: "Лучшие тактики для PVP в киберпанк-арене", replies: 45, views: 678, tag: "PVP", tagColor: "pink" },
  { author: "NeonHunter", time: "2 д назад", title: "Поиск союзников во фракцию Нео-Синтекс", replies: 12, views: 234, tag: "ФРАКЦИЯ", tagColor: "green" },
];

const faqItems = [
  { q: "Что нужно для подключения?", a: "Лицензионная или пиратская версия Minecraft Java Edition 1.20.x. Никаких дополнительных модов не требуется." },
  { q: "Какая версия Minecraft нужна?", a: "Сервер поддерживает версии 1.18 — 1.20.4. Рекомендуемая версия: 1.20.1." },
  { q: "Как связаться с администрацией?", a: "Discord сервер, раздел #support, или напрямую через форму ниже. Среднее время ответа — 2 часа." },
  { q: "Есть ли мобильная версия?", a: "Сервер работает только с Java Edition. Bedrock/PE не поддерживается." },
];

const MC_STATUS_URL = "https://functions.poehali.dev/4360cd53-29d9-4482-a3c3-856bfd035f46";
const MC_PLUGIN_URL = "https://functions.poehali.dev/5cea14d7-18cf-44b7-9257-447beb666f20";

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(500);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [serverLatency, setServerLatency] = useState(0);
  const [serverVersion, setServerVersion] = useState("1.20.1");
  const [pluginDownloading, setPluginDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminAuth, setAdminAuth] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  const fetchServerStatus = async () => {
    try {
      const res = await fetch(MC_STATUS_URL);
      const data = await res.json();
      setServerOnline(data.online);
      setOnlinePlayers(data.players ?? 0);
      setMaxPlayers(data.max_players ?? 500);
      setServerLatency(data.latency ?? 0);
      setServerVersion(data.version ?? "1.20.1");
    } catch {
      setServerOnline(false);
    }
  };

  const downloadPlugin = async () => {
    setPluginDownloading(true);
    try {
      const res = await fetch(MC_PLUGIN_URL);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "LastCraftOnline-1.0.0.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Ошибка скачивания. Попробуйте позже.");
    }
    setPluginDownloading(false);
  };

  useEffect(() => {
    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const copyIP = () => {
    navigator.clipboard.writeText(`${SERVER_IP}:${SERVER_PORT}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 4000);
    setContactForm({ name: "", email: "", message: "" });
  };

  const rankColor = (rank: number) => {
    if (rank === 1) return "neon-text-cyan";
    if (rank === 2) return "neon-text-purple";
    if (rank === 3) return "neon-text-pink";
    return "text-gray-400";
  };

  return (
    <div className="min-h-screen grid-bg" style={{ backgroundColor: "var(--dark-bg)" }}>

      <div className="fixed inset-0 scanlines pointer-events-none z-10" />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: "rgba(7,11,20,0.95)", borderColor: "rgba(0,255,255,0.2)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border neon-border-cyan flex items-center justify-center">
              <span className="font-orbitron text-xs neon-text-cyan font-bold">LC</span>
            </div>
            <span className="font-orbitron font-bold text-lg neon-text-cyan neon-flicker hidden sm:block">LASTCRAFT</span>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-3 py-1.5 font-rajdhani font-semibold text-sm tracking-widest transition-all ${
                  activeSection === link.id ? "neon-text-cyan border-b border-cyan-400" : "text-gray-400 hover:text-cyan-300"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded border" style={{ borderColor: serverOnline === false ? "rgba(255,50,50,0.4)" : "rgba(57,255,20,0.4)", backgroundColor: serverOnline === false ? "rgba(255,50,50,0.05)" : "rgba(57,255,20,0.05)" }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: serverOnline === false ? "#ff3232" : "var(--neon-green)", ...(serverOnline !== false && { animation: "pulse-online 2s infinite", boxShadow: "0 0 6px var(--neon-green)" }) }} />
              <span className="font-mono-tech text-xs" style={{ color: serverOnline === false ? "#ff5555" : "var(--neon-green)" }}>
                {serverOnline === null ? "..." : serverOnline ? `${onlinePlayers}/${maxPlayers}` : "OFFLINE"}
              </span>
            </div>
            <button onClick={() => setAdminOpen(true)} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded neon-btn-purple font-rajdhani font-semibold text-sm">
              <Icon name="Shield" size={14} />
              ADMIN
            </button>
            <button className="lg:hidden text-gray-400" onClick={() => setMobileMenu(!mobileMenu)}>
              <Icon name={mobileMenu ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="lg:hidden border-t py-4 px-4 flex flex-col gap-2" style={{ borderColor: "rgba(0,255,255,0.2)", backgroundColor: "rgba(7,11,20,0.98)" }}>
            {navLinks.map(link => (
              <button key={link.id} onClick={() => scrollTo(link.id)} className="text-left font-rajdhani font-semibold text-sm tracking-widest py-2 px-3 rounded hover:bg-cyan-900/20 text-gray-300 hover:text-cyan-300 transition-all">
                {link.label}
              </button>
            ))}
            <button onClick={() => { setAdminOpen(true); setMobileMenu(false); }} className="text-left font-rajdhani font-semibold text-sm tracking-widest py-2 px-3 rounded neon-btn-purple mt-2">
              ADMIN PANEL
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://cdn.poehali.dev/projects/d474792f-6cf2-48d9-8a8d-bd98e7b8b4d2/files/e9c34240-3b1c-40de-8c74-0afd4b34bac9.jpg" alt="LastCraft" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(7,11,20,0.3) 0%, rgba(7,11,20,0.6) 50%, rgba(7,11,20,1) 100%)" }} />
        </div>

        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-60"
            style={{
              backgroundColor: i % 3 === 0 ? "var(--neon-cyan)" : i % 3 === 1 ? "var(--neon-purple)" : "var(--neon-pink)",
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 4) * 15}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              boxShadow: `0 0 6px ${i % 3 === 0 ? "var(--neon-cyan)" : i % 3 === 1 ? "var(--neon-purple)" : "var(--neon-pink)"}`
            }}
          />
        ))}

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 font-mono-tech text-xs tracking-widest" style={{ borderColor: serverOnline === false ? "rgba(255,50,50,0.4)" : "rgba(0,255,255,0.4)", backgroundColor: serverOnline === false ? "rgba(255,50,50,0.05)" : "rgba(0,255,255,0.05)", color: serverOnline === false ? "#ff5555" : "var(--neon-cyan)" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: serverOnline === false ? "#ff3232" : "var(--neon-green)", ...(serverOnline !== false && { animation: "pulse-online 2s infinite" }) }} />
            {serverOnline === null ? "ПОДКЛЮЧЕНИЕ..." : serverOnline ? `СЕРВЕР ОНЛАЙН · ${onlinePlayers} ИГРОКОВ` : "СЕРВЕР ОФФЛАЙН"}
          </div>

          <h1 className="font-orbitron font-black text-5xl sm:text-7xl md:text-8xl mb-4 leading-none glitch-text" data-text="LASTCRAFT" style={{ color: "var(--neon-cyan)", textShadow: "0 0 20px var(--neon-cyan), 0 0 60px rgba(0,255,255,0.5)" }}>
            LASTCRAFT
          </h1>

          <p className="font-rajdhani text-xl sm:text-2xl text-gray-300 mb-2 tracking-wide">КИБЕРПАНК MINECRAFT СЕРВЕР</p>
          <p className="font-mono-tech text-sm text-gray-500 mb-10 tracking-widest">VERSION 2.4.1 · JAVA EDITION · PVP · FACTIONS · CUSTOM BOSSES</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button onClick={() => scrollTo("connect")} className="neon-btn-cyan px-8 py-3 rounded font-orbitron font-bold text-sm tracking-widest animate-border-glow">
              ПОДКЛЮЧИТЬСЯ
            </button>
            <button onClick={() => scrollTo("shop")} className="neon-btn-purple px-8 py-3 rounded font-orbitron font-bold text-sm tracking-widest">
              ДОНАТ-МАГАЗИН
            </button>
          </div>

          <div onClick={copyIP} className="inline-flex items-center gap-3 px-6 py-3 rounded cursor-pointer border transition-all hover:bg-cyan-900/10" style={{ borderColor: "rgba(0,255,255,0.3)", backgroundColor: "rgba(0,255,255,0.05)" }}>
            <Icon name="Server" size={16} className="text-cyan-400" />
            <span className="font-mono-tech text-cyan-300 tracking-widest">{SERVER_IP}:{SERVER_PORT}</span>
            <Icon name={copied ? "Check" : "Copy"} size={16} className={copied ? "text-green-400" : "text-gray-500"} />
            {copied && <span className="text-xs text-green-400 font-rajdhani">СКОПИРОВАНО!</span>}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
          <Icon name="ChevronDown" size={24} className="text-cyan-400" />
        </div>
      </section>

      {/* TICKER */}
      <div className="border-y overflow-hidden py-2" style={{ borderColor: "rgba(0,255,255,0.2)", backgroundColor: "rgba(0,255,255,0.03)" }}>
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 mr-8 font-mono-tech text-xs" style={{ color: "var(--neon-cyan)" }}>
              <span>⚡ СЕРВЕР ОНЛАЙН</span><span>·</span>
              <span>🏆 ТОП ИГРОК: CyberKnight_X</span><span>·</span>
              <span>🎯 НОВОЕ ОБНОВЛЕНИЕ 2.4.1</span><span>·</span>
              <span>💜 СКИДКА 30% НА ELITE ДО 28 ФЕВРАЛЯ</span><span>·</span>
              <span>⚔️ ТУРНИР ФРАКЦИЙ В СУББОТУ</span><span>·</span>
              <span>🌐 lastcraft.ddns.net:2255</span><span>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* STATUS */}
      <section id="status" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono-tech text-xs tracking-widest mb-2" style={{ color: "var(--neon-cyan)" }}>// SYSTEM STATUS</p>
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl neon-text-cyan">СТАТУС СЕРВЕРА</h2>
            <button onClick={fetchServerStatus} className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded border font-mono-tech text-xs tracking-widest transition-all hover:bg-cyan-900/10" style={{ borderColor: "rgba(0,255,255,0.3)", color: "var(--neon-cyan)" }}>
              <Icon name="RefreshCw" size={12} />
              ОБНОВИТЬ
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "ОНЛАЙН", value: serverOnline === null ? "..." : `${onlinePlayers}`, sub: `/ ${maxPlayers} слотов`, icon: "Users", color: "cyan" },
              { label: "СТАТУС", value: serverOnline === null ? "..." : serverOnline ? "ONLINE" : "OFFLINE", sub: serverOnline ? "сервер работает" : "недоступен", icon: "Activity", color: serverOnline === false ? "pink" : "green" },
              { label: "ПИНГ", value: serverOnline ? `${serverLatency}ms` : "—", sub: "до сервера", icon: "Wifi", color: "purple" },
              { label: "ВЕРСИЯ", value: serverVersion.replace("Purpur ", "").replace("Paper ", ""), sub: "Java Edition", icon: "Cpu", color: "pink" },
            ].map(stat => (
              <div key={stat.label} className="cyber-card rounded p-5 text-center hover-scale relative">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded mb-3 ${stat.color === "cyan" ? "bg-cyan-900/30" : stat.color === "green" ? "bg-green-900/30" : stat.color === "purple" ? "bg-purple-900/30" : "bg-pink-900/30"}`}>
                  <Icon name={stat.icon} size={20} className={stat.color === "cyan" ? "text-cyan-400" : stat.color === "green" ? "text-green-400" : stat.color === "purple" ? "text-purple-400" : "text-pink-400"} />
                </div>
                <div className={`font-orbitron font-bold text-2xl mb-1 ${stat.color === "cyan" ? "neon-text-cyan" : stat.color === "green" ? "neon-text-green" : stat.color === "purple" ? "neon-text-purple" : "neon-text-pink"}`}>{stat.value}</div>
                <div className="font-mono-tech text-xs text-gray-500 tracking-widest">{stat.label}</div>
                <div className="font-rajdhani text-xs text-gray-600 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="cyber-card rounded p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="font-rajdhani font-semibold text-gray-300 tracking-wide">ЗАГРУЗКА СЕРВЕРА</span>
              <span className="font-mono-tech text-xs" style={{ color: "var(--neon-cyan)" }}>{Math.round(onlinePlayers / maxPlayers * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-900 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${onlinePlayers / maxPlayers * 100}%`, background: "linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))", boxShadow: "0 0 10px var(--neon-cyan)" }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-mono-tech text-xs text-gray-600">0</span>
              <span className="font-mono-tech text-xs text-gray-600">{maxPlayers} MAX</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONNECT */}
      <section id="connect" className="py-20 px-4" style={{ background: "linear-gradient(180deg, transparent, rgba(0,255,255,0.03), transparent)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono-tech text-xs tracking-widest mb-2" style={{ color: "var(--neon-purple)" }}>// CONNECTION GUIDE</p>
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl neon-text-purple">ПОДКЛЮЧЕНИЕ</h2>
          </div>

          <div className="cyber-card cyber-card-purple rounded p-8 mb-6">
            <div className="text-center mb-8">
              <p className="font-rajdhani text-gray-400 mb-3 tracking-wide">АДРЕС СЕРВЕРА</p>
              <div onClick={copyIP} className="inline-flex items-center gap-4 px-8 py-4 rounded border cursor-pointer hover:bg-purple-900/10 transition-all" style={{ borderColor: "rgba(191,0,255,0.4)", backgroundColor: "rgba(191,0,255,0.05)" }}>
                <span className="font-orbitron font-bold text-xl sm:text-2xl neon-text-purple tracking-widest">{SERVER_IP}:{SERVER_PORT}</span>
                <Icon name={copied ? "Check" : "Copy"} size={20} className={copied ? "text-green-400" : "text-gray-500"} />
              </div>
              {copied && <p className="font-mono-tech text-xs text-green-400 mt-2 tracking-widest">IP СКОПИРОВАН В БУФЕР ОБМЕНА</p>}
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { step: "01", title: "Запустите игру", desc: "Откройте Minecraft Java Edition версии 1.18–1.20.4" },
                { step: "02", title: "Мультиплеер", desc: "Нажмите «Мультиплеер» → «Добавить сервер»" },
                { step: "03", title: "Введите IP", desc: `Вставьте ${SERVER_IP}:${SERVER_PORT} и нажмите «Готово»` },
              ].map(item => (
                <div key={item.step} className="relative p-4 rounded" style={{ backgroundColor: "rgba(191,0,255,0.05)", border: "1px solid rgba(191,0,255,0.15)" }}>
                  <div className="font-orbitron font-black text-3xl mb-2 opacity-20" style={{ color: "var(--neon-purple)" }}>{item.step}</div>
                  <div className="font-rajdhani font-semibold text-white mb-1">{item.title}</div>
                  <div className="font-rajdhani text-sm text-gray-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="cyber-card cyber-card-purple rounded overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="font-rajdhani font-semibold text-gray-200">{item.q}</span>
                  <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={16} className="text-purple-400 flex-shrink-0" />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 font-rajdhani text-gray-400 text-sm border-t" style={{ borderColor: "rgba(191,0,255,0.15)" }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RATING */}
      <section id="rating" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono-tech text-xs tracking-widest mb-2" style={{ color: "var(--neon-pink)" }}>// LEADERBOARD</p>
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl neon-text-pink">РЕЙТИНГ ИГРОКОВ</h2>
          </div>

          <div className="cyber-card cyber-card-pink rounded overflow-hidden">
            <div className="hidden sm:grid grid-cols-6 px-6 py-3 border-b font-mono-tech text-xs text-gray-600 tracking-widest" style={{ borderColor: "rgba(255,0,191,0.15)" }}>
              <span>#</span><span className="col-span-2">ИГРОК</span><span>УРОВЕНЬ</span><span>УБИЙСТВ</span><span>ЧАСОВ</span>
            </div>
            {players.map((p, i) => (
              <div key={p.rank} className="grid grid-cols-3 sm:grid-cols-6 px-6 py-4 border-b items-center hover:bg-pink-900/5 transition-all" style={{ borderColor: "rgba(255,0,191,0.08)" }}>
                <span className={`font-orbitron font-bold text-lg ${rankColor(p.rank)}`}>
                  {p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : p.rank === 3 ? "🥉" : `#${p.rank}`}
                </span>
                <div className="col-span-2">
                  <div className="font-rajdhani font-semibold text-white">{p.name}</div>
                  <div className="font-mono-tech text-xs text-gray-600">{p.faction}</div>
                </div>
                <div className="font-orbitron text-sm" style={{ color: "var(--neon-cyan)" }}>LVL {p.level}</div>
                <div className="font-rajdhani text-gray-300 hidden sm:block">{p.kills.toLocaleString()}</div>
                <div className="font-rajdhani text-gray-400 hidden sm:block">{p.hours}ч</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP */}
      <section id="shop" className="py-20 px-4" style={{ background: "linear-gradient(180deg, transparent, rgba(191,0,255,0.03), transparent)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono-tech text-xs tracking-widest mb-2" style={{ color: "var(--neon-cyan)" }}>// DONATE STORE</p>
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl neon-text-cyan">МАГАЗИН ПРИВИЛЕГИЙ</h2>
            <p className="font-rajdhani text-gray-500 mt-2">Поддержи сервер и получи уникальные возможности</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {shopItems.map((item, i) => (
              <div key={item.name} className={`cyber-card ${item.color === "purple" ? "cyber-card-purple" : item.color === "pink" ? "cyber-card-pink" : ""} rounded p-6 hover-scale relative ${i === 1 ? "sm:-mt-4 sm:mb-4" : ""}`}>
                {i === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full font-mono-tech text-xs tracking-widest text-white" style={{ backgroundColor: "var(--neon-purple)" }}>
                    ПОПУЛЯРНЫЙ
                  </div>
                )}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 ${item.color === "cyan" ? "bg-cyan-900/30" : item.color === "purple" ? "bg-purple-900/30" : "bg-pink-900/30"}`}>
                    <Icon name={item.icon} size={24} className={item.color === "cyan" ? "text-cyan-400" : item.color === "purple" ? "text-purple-400" : "text-pink-400"} />
                  </div>
                  <div className={`font-orbitron font-black text-xl mb-1 ${item.color === "cyan" ? "neon-text-cyan" : item.color === "purple" ? "neon-text-purple" : "neon-text-pink"}`}>{item.name}</div>
                  <div className={`font-orbitron font-bold text-3xl ${item.color === "cyan" ? "neon-text-cyan" : item.color === "purple" ? "neon-text-purple" : "neon-text-pink"}`}>{item.price}</div>
                </div>
                <ul className="space-y-2 mb-6">
                  {item.perks.map(perk => (
                    <li key={perk} className="flex items-center gap-2 font-rajdhani text-sm text-gray-300">
                      <Icon name="Check" size={14} className={item.color === "cyan" ? "text-cyan-400" : item.color === "purple" ? "text-purple-400" : "text-pink-400"} />
                      {perk}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded font-orbitron font-bold text-sm tracking-widest ${item.color === "cyan" ? "neon-btn-cyan" : item.color === "purple" ? "neon-btn-purple" : "neon-btn-pink"}`}>
                  КУПИТЬ {item.name}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center font-rajdhani text-xs text-gray-600 mt-6">Все привилегии выдаются автоматически после оплаты · Возврат не предусмотрен</p>
        </div>
      </section>

      {/* FORUM */}
      <section id="forum" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono-tech text-xs tracking-widest mb-2" style={{ color: "var(--neon-purple)" }}>// COMMUNITY</p>
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl neon-text-purple">ФОРУМ</h2>
          </div>

          <div className="space-y-3">
            {forumPosts.map((post, i) => (
              <div key={i} className="cyber-card cyber-card-purple rounded p-5 hover-scale cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded border flex items-center justify-center flex-shrink-0 font-orbitron font-bold text-sm" style={{ borderColor: "rgba(191,0,255,0.4)", backgroundColor: "rgba(191,0,255,0.1)", color: "var(--neon-purple)" }}>
                      {post.author[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-mono-tech ${post.tagColor === "cyan" ? "bg-cyan-900/30 text-cyan-400" : post.tagColor === "purple" ? "bg-purple-900/30 text-purple-400" : post.tagColor === "pink" ? "bg-pink-900/30 text-pink-400" : "bg-green-900/30 text-green-400"}`}>{post.tag}</span>
                      </div>
                      <p className="font-rajdhani font-semibold text-white mb-1">{post.title}</p>
                      <p className="font-mono-tech text-xs text-gray-600">{post.author} · {post.time}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex gap-4 font-mono-tech text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Icon name="MessageSquare" size={12} />{post.replies}</span>
                    <span className="flex items-center gap-1"><Icon name="Eye" size={12} />{post.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="neon-btn-purple px-8 py-3 rounded font-orbitron font-bold text-sm tracking-widest">ВСЕ ТЕМЫ ФОРУМА</button>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono-tech text-xs tracking-widest mb-2" style={{ color: "var(--neon-pink)" }}>// SUPPORT</p>
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl neon-text-pink">КОНТАКТЫ И ПОДДЕРЖКА</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {[
              { icon: "MessageCircle", label: "Discord", value: "discord.gg/lastcraft", color: "purple", hint: "Быстрый ответ" },
              { icon: "Send", label: "Telegram", value: "@lastcraft_mc", color: "cyan", hint: "Поддержка 24/7" },
              { icon: "Mail", label: "Email", value: "admin@lastcraft.net", color: "pink", hint: "Официальные запросы" },
              { icon: "Globe", label: "ВКонтакте", value: "vk.com/lastcraft", color: "green", hint: "Новости и обновления" },
            ].map(c => (
              <div key={c.label} className="cyber-card rounded p-5 flex items-center gap-4 hover-scale cursor-pointer">
                <div className={`w-12 h-12 rounded flex items-center justify-center ${c.color === "purple" ? "bg-purple-900/30" : c.color === "cyan" ? "bg-cyan-900/30" : c.color === "pink" ? "bg-pink-900/30" : "bg-green-900/30"}`}>
                  <Icon name={c.icon} size={22} className={c.color === "purple" ? "text-purple-400" : c.color === "cyan" ? "text-cyan-400" : c.color === "pink" ? "text-pink-400" : "text-green-400"} />
                </div>
                <div>
                  <div className="font-rajdhani font-semibold text-white">{c.label}</div>
                  <div className={`font-mono-tech text-xs ${c.color === "purple" ? "text-purple-400" : c.color === "cyan" ? "text-cyan-400" : c.color === "pink" ? "text-pink-400" : "text-green-400"}`}>{c.value}</div>
                  <div className="font-rajdhani text-xs text-gray-600">{c.hint}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="cyber-card cyber-card-pink rounded p-8">
            <h3 className="font-orbitron font-bold text-lg neon-text-pink mb-6">НАПИСАТЬ В ПОДДЕРЖКУ</h3>
            {formSent ? (
              <div className="text-center py-8">
                <Icon name="CheckCircle" size={48} className="text-green-400 mx-auto mb-3" />
                <p className="font-rajdhani text-green-400 text-lg font-semibold">Сообщение отправлено!</p>
                <p className="font-rajdhani text-gray-500 text-sm">Мы ответим в течение 2 часов</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono-tech text-xs text-gray-500 tracking-widest block mb-1">НИК / ИМЯ</label>
                    <input value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} required className="w-full px-4 py-2.5 rounded font-rajdhani text-white outline-none focus:ring-1 focus:ring-pink-500 transition-all" style={{ backgroundColor: "rgba(255,0,191,0.05)", border: "1px solid rgba(255,0,191,0.2)" }} placeholder="YourNickname" />
                  </div>
                  <div>
                    <label className="font-mono-tech text-xs text-gray-500 tracking-widest block mb-1">EMAIL</label>
                    <input type="email" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} required className="w-full px-4 py-2.5 rounded font-rajdhani text-white outline-none focus:ring-1 focus:ring-pink-500 transition-all" style={{ backgroundColor: "rgba(255,0,191,0.05)", border: "1px solid rgba(255,0,191,0.2)" }} placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="font-mono-tech text-xs text-gray-500 tracking-widest block mb-1">СООБЩЕНИЕ</label>
                  <textarea value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} required rows={4} className="w-full px-4 py-2.5 rounded font-rajdhani text-white outline-none focus:ring-1 focus:ring-pink-500 transition-all resize-none" style={{ backgroundColor: "rgba(255,0,191,0.05)", border: "1px solid rgba(255,0,191,0.2)" }} placeholder="Опишите вашу проблему или вопрос..." />
                </div>
                <button type="submit" className="neon-btn-pink w-full py-3 rounded font-orbitron font-bold text-sm tracking-widest">ОТПРАВИТЬ СООБЩЕНИЕ</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-10 px-4" style={{ borderColor: "rgba(0,255,255,0.15)", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border neon-border-cyan flex items-center justify-center">
              <span className="font-orbitron text-xs neon-text-cyan font-bold">LC</span>
            </div>
            <span className="font-orbitron font-bold neon-text-cyan">LASTCRAFT</span>
          </div>
          <div className="font-mono-tech text-xs text-gray-600 text-center">© 2024 LastCraft Server · {SERVER_IP}:{SERVER_PORT}</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full status-online" style={{ backgroundColor: "var(--neon-green)" }} />
            <span className="font-mono-tech text-xs text-green-400">ONLINE</span>
          </div>
        </div>
      </footer>

      {/* ADMIN MODAL */}
      {adminOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
          <div className="cyber-card rounded-lg w-full max-w-lg animate-fade-in">
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(0,255,255,0.2)" }}>
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={18} className="text-cyan-400" />
                <span className="font-orbitron font-bold neon-text-cyan">ADMIN PANEL</span>
              </div>
              <button onClick={() => { setAdminOpen(false); setAdminAuth(false); setAdminPass(""); }} className="text-gray-500 hover:text-white">
                <Icon name="X" size={18} />
              </button>
            </div>

            {!adminAuth ? (
              <div className="p-6">
                <p className="font-mono-tech text-xs text-gray-500 mb-4 tracking-widest">ВВЕДИТЕ ПАРОЛЬ АДМИНИСТРАТОРА</p>
                <input
                  type="password"
                  value={adminPass}
                  onChange={e => setAdminPass(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && adminPass === "admin123" && setAdminAuth(true)}
                  className="w-full px-4 py-3 rounded font-mono-tech text-cyan-300 outline-none mb-4"
                  style={{ backgroundColor: "rgba(0,255,255,0.05)", border: "1px solid rgba(0,255,255,0.3)" }}
                  placeholder="••••••••"
                />
                <button onClick={() => adminPass === "admin123" && setAdminAuth(true)} className="w-full neon-btn-cyan py-3 rounded font-orbitron font-bold text-sm tracking-widest">
                  ВОЙТИ В СИСТЕМУ
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-3">
                <p className="font-mono-tech text-xs text-green-400 mb-4 tracking-widest">✓ ДОСТУП РАЗРЕШЁН</p>
                {[
                  { icon: "Users", label: "Управление игроками", desc: `${onlinePlayers} онлайн`, color: "cyan" },
                  { icon: "Ban", label: "Бан / Кик / Мут", desc: "Модерация чата и игроков", color: "pink" },
                  { icon: "Package", label: "Управление донатом", desc: "Выдача привилегий", color: "purple" },
                  { icon: "Terminal", label: "Консоль сервера", desc: "RCON команды", color: "green" },
                  { icon: "BarChart2", label: "Статистика", desc: "Нагрузка, логи, метрики", color: "cyan" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4 p-3 rounded cursor-pointer hover:bg-cyan-900/10 transition-all border border-transparent hover:border-cyan-900/30">
                    <div className={`w-9 h-9 rounded flex items-center justify-center ${item.color === "cyan" ? "bg-cyan-900/30" : item.color === "pink" ? "bg-pink-900/30" : item.color === "purple" ? "bg-purple-900/30" : "bg-green-900/30"}`}>
                      <Icon name={item.icon} size={16} className={item.color === "cyan" ? "text-cyan-400" : item.color === "pink" ? "text-pink-400" : item.color === "purple" ? "text-purple-400" : "text-green-400"} />
                    </div>
                    <div>
                      <div className="font-rajdhani font-semibold text-white text-sm">{item.label}</div>
                      <div className="font-mono-tech text-xs text-gray-500">{item.desc}</div>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-gray-600 ml-auto" />
                  </div>
                ))}

                <div className="pt-2 border-t" style={{ borderColor: "rgba(0,255,255,0.15)" }}>
                  <p className="font-mono-tech text-xs text-gray-600 mb-3 tracking-widest">// ПЛАГИН ДЛЯ СЕРВЕРА</p>
                  <button
                    onClick={downloadPlugin}
                    disabled={pluginDownloading}
                    className="w-full flex items-center gap-3 p-3 rounded transition-all border"
                    style={{ borderColor: "rgba(57,255,20,0.4)", backgroundColor: "rgba(57,255,20,0.05)", color: "var(--neon-green)" }}
                  >
                    <div className="w-9 h-9 rounded bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Icon name={pluginDownloading ? "Loader" : "Download"} size={16} className="text-green-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-rajdhani font-semibold text-white text-sm">Скачать плагин LastCraftOnline</div>
                      <div className="font-mono-tech text-xs" style={{ color: "var(--neon-green)" }}>
                        {pluginDownloading ? "Загрузка..." : "v1.0.0 · Bukkit/Spigot/Paper 1.20.1"}
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-gray-600 ml-auto" />
                  </button>
                  <p className="font-mono-tech text-xs text-gray-600 mt-2 px-1">
                    Установи плагин на сервер → сайт получит реальный онлайн каждые 30 сек
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}