const STEPS = [
  { n: "1", title: "Cuéntanos qué buscas", subtitle: "Presupuesto, uso y terreno" },
  { n: "2", title: "Filtra por criterios", subtitle: "Autonomía, motor, peso, precio" },
  { n: "3", title: "Compara modelos", subtitle: "Hasta 4 bicis lado a lado" },
  { n: "4", title: "Revisa la puntuación", subtitle: "Metodología abierta y pública" },
  { n: "5", title: "Calcula tu autonomía", subtitle: "Según tu peso y tu ruta" },
  { n: "6", title: "Compra con confianza", subtitle: "Enlaces claros hacia la tienda" },
];

export function Toolbar() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 sm:px-8">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] divide-y divide-line rounded-3xl border border-line sm:divide-y-0 sm:divide-x">
        {STEPS.map((step) => (
          <div key={step.n} className="p-6">
            <span className="flex size-9 items-center justify-center rounded-full bg-acc-s text-sm font-bold text-acc-d">
              {step.n}
            </span>
            <h3 className="mt-3 text-sm font-semibold text-ink">{step.title}</h3>
            <p className="mt-1 text-sm text-mut">{step.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
