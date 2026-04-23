"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";


interface Alert { id: number; title: string; message: string; type: string; }
interface Activity { id: number; season: string; category: string; name: string; description: string | null; price: string | null; image: string | null; }
interface Weather { temp: number; feelsLike: number; humidity: number; windSpeed: number; code: number; }

const UPCOMING_EVENTS = [
  { id: 1, day: "29", month: "Mar", time: "13:00", title: "Noche de Folklore Chileno", description: "Música y baile tradicional con artistas locales de la región del Biobío. Concierto sinfónico.", location: "Salón Los Riscos" },
  { id: 2, day: "30", month: "Mar", time: "13:00", title: "Cata de Vinos del Valle", description: "Selección de los mejores vinos de los valles centrales con maridaje.", location: "Salón Los Riscos" },
];

const quickLinks = [
  { href: "/habitacion",   label: "Mi Habitación",              iconClass: "fi-ts-bed-alt" },
  { href: "/restaurantes", label: "Comer y Beber",              iconClass: "fi-ts-utensils" },
  { href: "/wellness",     label: "Wellness & Spa",             iconClass: "fi-ts-hot-tub" },
  { href: "/actividades",  label: "Experiencias y Actividades", iconClass: "fi-ts-mountain" },
  { href: "/familia",      label: "Familia y Niños",            iconClass: "fi-ts-family" },
];

function weatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 86) return "🌦️";
  return "⛈️";
}

function getCurrentSeason(): "verano" | "invierno" {
  const m = new Date().getMonth() + 1;
  return m >= 6 && m <= 10 ? "invierno" : "verano";
}

function extractField(desc: string | null, key: string): string | null {
  if (!desc) return null;
  const match = desc.match(new RegExp(key + ":\\s*([^\\n]+)"));
  return match ? match[1].trim() : null;
}

function shortDesc(desc: string | null): string {
  if (!desc) return "";
  return desc.split("\n")[0];
}

function ActivityCard({ a }: { a: Activity }) {
  const location = extractField(a.description, "Lugar");
  const schedule = extractField(a.description, "Horario") ?? extractField(a.description, "Duración");

  return (
    <div className="shrink-0 w-[335px] h-[430px] bg-white rounded-3xl overflow-hidden shadow-sm snap-start flex flex-col">
      <div className="w-full h-[252px] relative overflow-hidden bg-[#1B4332] shrink-0">
        {a.image ? (
          <Image src={a.image} alt={a.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1B4332] to-[#47835A]" />
        )}
        {a.price && (
          <div className="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1 text-[12px] font-semibold text-[#1B4332]">
            {a.price}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-[#1B4332] text-[15px] leading-snug mb-2">{a.name}</h3>
        <p className="text-[#6B6B6B] text-[13px] leading-relaxed line-clamp-3 mb-3">{shortDesc(a.description)}</p>
        <div className="flex flex-col gap-1.5 mt-auto">
          {location && (
            <div className="flex items-center gap-1.5 text-[#7B6354]">
              <i className="fi-rs-marker shrink-0" style={{ fontSize: 12 }} />
              <span className="text-[12px]">{location}</span>
            </div>
          )}
          {schedule && (
            <div className="flex items-center gap-1.5 text-[#7B6354]">
              <i className="fi-rs-clock-three shrink-0" style={{ fontSize: 12 }} />
              <span className="text-[12px]">{schedule}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[#9B9280]">
            <i className="fi-rs-info shrink-0" style={{ fontSize: 12 }} />
            <span className="text-[12px]">Para más información, acércate al mesón</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getWelcome(name: string): string {
  const first = name.trim().split(/\s+/)[0].toLowerCase();
  const femaleEndings = ["a", "ia", "ina", "ela", "ela", "ila", "ara", "era", "ira", "ora", "ura"];
  const femaleNames = ["luz", "paz", "sol", "mar", "flor", "pilar", "inés", "ines", "belen", "belen", "ruth", "edith", "judith", "naomi", "noemi", "leah", "lea"];
  const maleNames = ["jose", "jorge", "jorge", "alex", "alexis", "elvis", "boris", "lucas", "matias", "nicolas", "andres", "carlos", "pablo", "daniel", "miguel", "angel", "samuel", "david", "juan", "pedro", "luis", "manuel", "roberto", "sergio", "oscar", "diego", "ivan", "ruben", "cesar", "hector", "victor"];
  if (maleNames.includes(first)) return "Bienvenido";
  if (femaleNames.includes(first)) return "Bienvenida";
  if (femaleEndings.some(e => first.endsWith(e))) return "Bienvenida";
  return "Bienvenido";
}

export default function HomePage() {
  const router = useRouter();
  const [guestName, setGuestName] = useState("Bienvenido/a");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("htch_guest");
    if (!stored) { router.replace("/"); return; }
    const { name } = JSON.parse(stored);
    setGuestName(name.split(" ")[0]);

    fetch("/api/alerts")
      .then((r) => r.json())
      .then((data) => setAlerts(data.alerts ?? []))
      .catch(() => {});

    fetch("/api/actividades")
      .then((r) => r.json())
      .then((data) => setActivities(data.activities ?? []))
      .catch(() => {});

    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-36.6067&longitude=-72.1034&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh&timezone=America/Santiago"
    )
      .then((r) => r.json())
      .then((data) => {
        const c = data.current;
        setWeather({
          temp: Math.round(c.temperature_2m),
          feelsLike: Math.round(c.apparent_temperature),
          humidity: Math.round(c.relative_humidity_2m),
          windSpeed: Math.round(c.wind_speed_10m),
          code: c.weather_code,
        });
      })
      .catch(() => {});
  }, [router]);

  const season = getCurrentSeason();
  const seasonActivities = activities.filter((a) => a.season === season).slice(0, 8);

  return (
    <div className="min-h-svh bg-[#F5F0E8]">
      <Header />

      {/* Hero */}
      <div className="relative h-[378px] overflow-hidden rounded-b-3xl">
        <img src="/images/home-hero.jpg" alt="Hotel Termas" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center pt-14">
          <h1 className="font-playfair text-white text-[32px] font-bold drop-shadow-lg leading-tight text-center">
            {getWelcome(guestName)},<br />{guestName}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 pb-24">
        <div className="px-4">
          <p className="font-playfair text-[#3D2B1F] text-[32px] font-bold text-center mb-5">
            ¿En qué podemos<br />ayudarte hoy?
          </p>

          {/* Quick links grid 3+2 */}
          <div className="flex flex-wrap justify-center gap-3 mb-5">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{ width: "calc(33.333% - 8px)" }}>
                <div className="rounded-2xl flex flex-col items-center gap-2 active:scale-95 transition-transform justify-center aspect-square" style={{ background: "linear-gradient(180deg, #215732 0%, #47835A 50%, #215732 100%)" }}>
                  <i className={`${link.iconClass} text-white`} style={{ fontSize: 38 }} />
                  <span className="text-white text-[10px] font-semibold text-center leading-tight px-1">{link.label}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Alertas */}
          {alerts.length > 0 ? (
            <div className="flex flex-col gap-2">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-[#D4722A] rounded-2xl px-4 py-3 flex items-center gap-3">
                  <i className="fi-ts-bell text-white" style={{ fontSize: 18 }} />
                  <div className="flex-1">
                    <p className="text-white font-semibold text-[13px]">{alert.title}</p>
                    <p className="text-white/80 text-[12px]">{alert.message}</p>
                  </div>
                  <i className="fi-rs-angle-right text-white" style={{ fontSize: 16 }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#EDE6D8] rounded-2xl px-4 py-3 flex items-center gap-3">
              <i className="fi-ts-bell" style={{ fontSize: 18, color: "#7B6354" }} />
              <p className="text-[#7B6354] text-[13px] font-medium">Sin alertas activas hoy</p>
            </div>
          )}
        </div>

        {/* Clima */}
        {weather && (
          <div className="mx-4 mt-5 rounded-2xl px-4 py-4" style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/70 text-[11px] mb-0.5">Clima en Chillán</p>
                <p className="text-white text-[40px] font-bold leading-none">{weather.temp}<span className="text-[22px] font-normal">°C</span></p>
              </div>
              <span className="text-[40px]">{weatherIcon(weather.code)}</span>
            </div>
            <div className="flex gap-4 mt-3 text-white/80 text-[11px]">
              <span>Sensación: <span className="font-semibold text-white">{weather.feelsLike}°C</span></span>
              <span>Humedad: <span className="font-semibold text-white">{weather.humidity}%</span></span>
              <span>Viento: <span className="font-semibold text-white">{weather.windSpeed} km/h</span></span>
            </div>
          </div>
        )}

        {/* Experiencias de esta Temporada */}
        {seasonActivities.length > 0 && (
          <div className="mt-7">
            <p className="font-playfair text-[#3D2B1F] text-[22px] font-bold text-center mb-4 px-4">
              Experiencias de<br />esta Temporada
            </p>
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory">
              {seasonActivities.map((a) => <ActivityCard key={a.id} a={a} />)}
              <div className="shrink-0 w-1" />
            </div>
          </div>
        )}

        {/* Próximos eventos */}
        <div className="mt-7 px-4">
          <p className="font-playfair text-[#3D2B1F] text-[22px] font-bold text-center mb-4">
            Próximos eventos
          </p>
          <div className="flex flex-col gap-3">
            {UPCOMING_EVENTS.map((ev) => (
              <div key={ev.id} className="bg-white rounded-2xl overflow-hidden flex shadow-sm">
                <div className="w-[72px] shrink-0 flex flex-col items-center justify-center py-4 text-white" style={{ background: "linear-gradient(180deg, #215732 0%, #47835A 100%)" }}>
                  <span className="text-[28px] font-bold leading-none">{ev.day}</span>
                  <span className="text-[13px] font-semibold mt-0.5">{ev.month}</span>
                  <span className="text-[11px] text-white/80 mt-1">{ev.time}</span>
                </div>
                <div className="flex-1 px-4 py-3.5">
                  <h3 className="font-semibold text-[#2D2D2D] text-[14px] leading-snug mb-1">{ev.title}</h3>
                  <p className="text-[#6B6B6B] text-[12px] leading-relaxed mb-2">{ev.description}</p>
                  <div className="flex items-center gap-1.5 text-[#7B6354]">
                    <i className="fi-rs-marker shrink-0" style={{ fontSize: 11 }} />
                    <span className="text-[11px]">{ev.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergencia */}
        <div className="mt-7 mx-4">
          <div className="bg-[#EDE8E3] rounded-2xl p-6 text-center">
            <h2 className="font-playfair text-[20px] font-bold text-[#2D2D2D] mb-3 underline decoration-2 underline-offset-4">
              Emergencia
            </h2>
            <p className="text-[#4A4A4A] text-[13px] leading-relaxed mb-4">
              Si necesitas atención médica inmediata,<br />comunícate con la recepción llamando al:
            </p>
            <a href="tel:3500" className="inline-flex items-center gap-2 bg-[#B85C45] text-white font-semibold text-[16px] px-8 py-2.5 rounded-full mb-5 active:opacity-80">
              <i className="fi-rs-phone-call" style={{ fontSize: 16 }} />
              3500
            </a>
            <p className="text-[#4A4A4A] text-[13px] leading-relaxed mb-4">
              Si te encuentras fuera del Hotel, llama al:
            </p>
            <a href="tel:+56223223500" className="inline-flex items-center gap-2 bg-[#B85C45] text-white font-semibold text-[16px] px-8 py-2.5 rounded-full active:opacity-80">
              <i className="fi-rs-phone-call" style={{ fontSize: 16 }} />
              +562 2322 3500
            </a>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
