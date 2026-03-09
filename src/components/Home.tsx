import { Link } from "react-router-dom";
import { ArrowRight, Plug, Clock, BarChart3, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Auth } from "@/components/Auth";
import { Separator } from "@/components/ui/separator";

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-primary">{children}</p>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    Icon: BarChart3,
    title: "Evidence-based acuity scoring",
    body: "Every patient is scored across 9 clinical factors — medications, IV drips, devices, mobility, wound care, and more — before the assignment is calculated.",
  },
  {
    Icon: Plug,
    title: "Any FHIR R4 EHR",
    body: "Works with Epic, Cerner, HAPI FHIR, or any SMART on FHIR R4-compliant system. No proprietary connectors. No IT tickets.",
  },
  {
    Icon: Clock,
    title: "Shift-ready in under 10 seconds",
    body: "Designed for the charge nurse at handoff. Select your unit, confirm your team, and generate a balanced assignment in one click.",
  },
];

// ─── How it works ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    number: "01",
    title: "Connect your EHR",
    body: "Sign in via SMART on FHIR OAuth2. Nursify discovers your server configuration automatically — no manual setup.",
  },
  {
    number: "02",
    title: "Review tonight's team",
    body: "See the nurses scheduled for your unit. Remove anyone who called out. Add last-minute staff in seconds.",
  },
  {
    number: "03",
    title: "Generate the assignment",
    body: "One click. Nursify scores every patient and distributes them using a load-balanced algorithm. Adjustments are always possible.",
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "9", label: "Acuity factors scored" },
  { value: "FHIR R4", label: "Standard compliant" },
  { value: "<3s", label: "Time to assignment" },
  { value: "0", label: "Manual math required" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export const Home = () => {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            <Shield className="h-3 w-3 text-primary" />
            SMART on FHIR R4 · Any compliant EHR
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Safer patient assignments,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
              in seconds.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Nursify reads clinical acuity from your EHR and balances patient loads across your
            nursing team automatically — so charge nurses spend less time on paperwork and more
            time on care.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/demo">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
                Try the demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Auth />
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <dt className="text-2xl font-bold text-slate-900">{value}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <SectionLabel>Why Nursify</SectionLabel>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Built for the reality of the bedside
            </h2>
            <p className="mt-4 text-muted-foreground">
              Charge nurses carry one of the hardest jobs in healthcare. Nursify gives them a
              tool that fits their workflow.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-border p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From login to assignment in three steps
            </h2>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {STEPS.map(({ number, title, body }) => (
              <div key={number}>
                <div className="text-5xl font-bold text-slate-100 select-none">{number}</div>
                <div className="-mt-6">
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex justify-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <CheckCircle2 key={i} className="h-5 w-5 text-emerald-400" />
            ))}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to make safer assignments?
          </h2>
          <p className="mt-4 text-slate-400">
            No credit card. No setup. See a working demo in under a minute.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/demo">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
                Try the demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Get in touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
