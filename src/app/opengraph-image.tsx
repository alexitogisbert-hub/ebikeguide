import { ImageResponse } from "next/og";
import { EBG_DATA } from "@/data/ebg-data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
        <div style={{ display: "flex", fontSize: 42, fontWeight: 800, letterSpacing: -2 }}>
          <div style={{ display: "flex", color: "#ffffff" }}>eBike</div>
          <div style={{ display: "flex", color: "#0fb5a0" }}>Guide</div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 74,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.08,
            maxWidth: 920,
            letterSpacing: -2,
          }}
        >
          Encuentra tu e-bike ideal
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
          {EBG_DATA.meta.nombre} · comparador independiente de bicicletas eléctricas
        </div>
      </div>
    ),
    { ...size },
  );
}
