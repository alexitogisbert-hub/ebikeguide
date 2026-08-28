import { ImageResponse } from "next/og";
import { EBG_DATA } from "@/data/ebg-data";
import { obtenerBadgePrincipal } from "@/domain/scoring";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "eBikeGuide — ficha de bicicleta";

function getCategoria(slug: string) {
  return EBG_DATA.categorias.find((c) => c.slug === slug);
}

function getBike(slug: string) {
  return EBG_DATA.bikes.find((b) => b.slug === slug);
}

export function generateStaticParams() {
  return [
    ...EBG_DATA.categorias.map((categoria) => ({ slug: categoria.slug })),
    ...EBG_DATA.bikes.map((bike) => ({ slug: bike.slug })),
  ];
}

const formatPrice = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const categoria = getCategoria(slug);
  if (categoria) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "#0b1110",
            padding: "80px",
          }}
        >
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 48,
              right: 64,
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            <div style={{ display: "flex", color: "#ffffff" }}>eBike</div>
            <div style={{ display: "flex", color: "#0fb5a0" }}>Guide</div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              color: "#0fb5a0",
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            Categoria
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 72,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.08,
              maxWidth: 920,
              letterSpacing: -2,
            }}
          >
            {`E-bikes ${categoria.nombre.toLowerCase()}`}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontSize: 30,
              color: "rgba(255,255,255,0.65)",
              maxWidth: 820,
            }}
          >
            {`${categoria.modelosCount} modelos comparados`}
          </div>
        </div>
      ),
      { ...size },
    );
  }

  const bike = getBike(slug);
  if (!bike) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#0b1110",
          }}
        >
          <div style={{ display: "flex", fontSize: 42, fontWeight: 800, letterSpacing: -2 }}>
            <div style={{ display: "flex", color: "#ffffff" }}>eBike</div>
            <div style={{ display: "flex", color: "#0fb5a0" }}>Guide</div>
          </div>
        </div>
      ),
      { ...size },
    );
  }

  const badge = obtenerBadgePrincipal(bike);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0b1110",
          padding: "80px",
        }}
      >
        {/* Branding top-right */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 48,
            right: 64,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: -1,
          }}
        >
          <div style={{ display: "flex", color: "#ffffff" }}>eBike</div>
          <div style={{ display: "flex", color: "#0fb5a0" }}>Guide</div>
        </div>

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 700,
            color: "#0fb5a0",
            textTransform: "uppercase",
            letterSpacing: 3,
          }}
        >
          {bike.marca}
        </div>

        {/* Model name */}
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 68,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.08,
            maxWidth: 920,
            letterSpacing: -2,
          }}
        >
          {bike.modelo}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            marginTop: 40,
            gap: 48,
            alignItems: "center",
          }}
        >
          {/* Price */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", fontSize: 18, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
              PRECIO
            </div>
            <div style={{ display: "flex", fontSize: 36, fontWeight: 800, color: "#ffffff" }}>
              {formatPrice.format(bike.precio)}
            </div>
          </div>

          {/* Score */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", fontSize: 18, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
              NOTA
            </div>
            <div style={{ display: "flex", fontSize: 36, fontWeight: 800, color: "#0fb5a0" }}>
              {bike.puntuacion.toFixed(1)}/10
            </div>
          </div>

          {/* Badge */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", fontSize: 18, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
              DESTACA POR
            </div>
            <div style={{ display: "flex", fontSize: 36, fontWeight: 800, color: "#ffffff", alignItems: "center", gap: 10 }}>
              <span>{badge.emoji}</span>
              <span>{badge.etiqueta}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
