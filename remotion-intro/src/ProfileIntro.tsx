import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

const COLORS = {
  bg: "#060810",
  bgCard: "#0f172a",
  cyan: "#06b6d4",
  purple: "#c084fc",
  green: "#34d399",
  amber: "#fbbf24",
  pink: "#f472b6",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  border: "#1e293b",
};

const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 0.03], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(${COLORS.cyan}${Math.round(opacity * 255).toString(16).padStart(2, "0")} 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.cyan}${Math.round(opacity * 255).toString(16).padStart(2, "0")} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </AbsoluteFill>
  );
};

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 30 }, (_, i) => {
    const x = (i * 137.5 + frame * (0.3 + i * 0.05)) % 1920;
    const y = (i * 89.3 + frame * (0.2 + i * 0.03)) % 1080;
    const size = 2 + (i % 4);
    const opacity = interpolate(
      Math.sin(frame * 0.05 + i),
      [-1, 1],
      [0.1, 0.6]
    );
    const color = i % 3 === 0 ? COLORS.cyan : i % 3 === 1 ? COLORS.purple : COLORS.green;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: color,
          opacity,
          boxShadow: `0 0 ${size * 3}px ${color}`,
        }}
      />
    );
  });
  return <AbsoluteFill>{particles}</AbsoluteFill>;
};

const ShieldIcon: React.FC<{ scale: number; opacity: number; glow: number }> = ({
  scale,
  opacity,
  glow,
}) => (
  <div
    style={{
      width: 120,
      height: 120,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `scale(${scale})`,
      opacity,
      filter: `drop-shadow(0 0 ${glow}px ${COLORS.cyan})`,
    }}
  >
    <svg viewBox="0 0 24 24" width="100" height="100" fill="none" stroke={COLORS.cyan} strokeWidth="1.5">
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
      <path d="M9 12l2 2 4-4" stroke={COLORS.green} strokeWidth="2" />
    </svg>
  </div>
);

const TypeWriter: React.FC<{
  text: string;
  startFrame: number;
  speed?: number;
  style?: React.CSSProperties;
}> = ({ text, startFrame, speed = 2, style }) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.min(
    Math.floor((frame - startFrame) / speed),
    text.length
  );
  if (frame < startFrame) return null;
  return (
    <span style={style}>
      {text.slice(0, charsToShow)}
      {charsToShow < text.length && (
        <span
          style={{
            opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
            color: COLORS.cyan,
          }}
        >
          |
        </span>
      )}
    </span>
  );
};

const ProjectCard: React.FC<{
  name: string;
  desc: string;
  color: string;
  status: string;
  delay: number;
}> = ({ name, desc, color, status, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 15 } });
  const y = interpolate(progress, [0, 1], [60, 0]);
  return (
    <div
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: "24px 28px",
        opacity: progress,
        transform: `translateY(${y}px)`,
        position: "relative",
        overflow: "hidden",
        width: 380,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: status === "LIVE" ? COLORS.green : COLORS.amber,
            boxShadow: `0 0 8px ${status === "LIVE" ? COLORS.green : COLORS.amber}`,
          }}
        />
        <span
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: 11,
            color: status === "LIVE" ? COLORS.green : COLORS.amber,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {status}
        </span>
      </div>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 22,
          fontWeight: 700,
          color: COLORS.text,
          marginBottom: 6,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 14,
          color: COLORS.textMuted,
          lineHeight: 1.5,
        }}
      >
        {desc}
      </div>
    </div>
  );
};

const TechBadge: React.FC<{ label: string; color: string; delay: number }> = ({
  label,
  color,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 12 } });
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 16px",
        borderRadius: 20,
        border: `1px solid ${color}40`,
        backgroundColor: `${color}15`,
        fontFamily: "Courier New, monospace",
        fontSize: 13,
        color,
        letterSpacing: 1,
        opacity: progress,
        transform: `scale(${progress})`,
        margin: "4px 4px",
      }}
    >
      {label}
    </span>
  );
};

const StatsCounter: React.FC<{
  value: string;
  label: string;
  color: string;
  delay: number;
}> = ({ value, label, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 15 } });
  return (
    <div style={{ textAlign: "center", opacity: progress, transform: `scale(${interpolate(progress, [0, 1], [0.5, 1])})` }}>
      <div style={{ fontFamily: "system-ui", fontSize: 48, fontWeight: 800, color }}>{value}</div>
      <div
        style={{
          fontFamily: "Courier New, monospace",
          fontSize: 11,
          color: COLORS.textMuted,
          textTransform: "uppercase",
          letterSpacing: 3,
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const ProfileIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene 1: Shield + Name (0-90 frames = 0-3s)
  const scene1Opacity = interpolate(frame, [0, 15, 80, 95], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 2: Stats (90-160 frames = 3-5.3s)
  const scene2Opacity = interpolate(frame, [85, 100, 150, 165], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 3: Projects (160-240 frames = 5.3-8s)
  const scene3Opacity = interpolate(frame, [155, 170, 230, 245], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 4: CTA (240-300 frames = 8-10s)
  const scene4Opacity = interpolate(frame, [235, 250, 295, 300], [0, 1, 1, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shieldScale = spring({ frame, fps, config: { damping: 10, mass: 0.8 } });
  const shieldGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [10, 30]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <GridBackground />
      <Particles />

      {/* Scene 1: Shield + Name intro */}
      <Sequence from={0} durationInFrames={95}>
        <AbsoluteFill
          style={{
            opacity: scene1Opacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShieldIcon scale={shieldScale} opacity={1} glow={shieldGlow} />
          <div style={{ marginTop: 30 }}>
            <TypeWriter
              text="David Moya"
              startFrame={15}
              speed={3}
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 64,
                fontWeight: 800,
                color: COLORS.text,
              }}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <TypeWriter
              text="Cybersecurity & AI Platform Engineer"
              startFrame={35}
              speed={1.5}
              style={{
                fontFamily: "Courier New, monospace",
                fontSize: 22,
                color: COLORS.cyan,
              }}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <TypeWriter
              text="Founder @ Riskitera S.L.U."
              startFrame={55}
              speed={2}
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 20,
                color: COLORS.purple,
              }}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Stats */}
      <Sequence from={90} durationInFrames={75}>
        <AbsoluteFill
          style={{
            opacity: scene2Opacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Courier New, monospace",
              fontSize: 14,
              color: COLORS.textMuted,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 40,
            }}
          >
            Building at Scale
          </div>
          <div style={{ display: "flex", gap: 80 }}>
            <StatsCounter value="9+" label="Projects" color={COLORS.purple} delay={95} />
            <StatsCounter value="6" label="Live" color={COLORS.green} delay={100} />
            <StatsCounter value="12+" label="AI Agents" color={COLORS.cyan} delay={105} />
            <StatsCounter value="5" label="Domains" color={COLORS.amber} delay={110} />
          </div>
          <div style={{ marginTop: 50, display: "flex", flexWrap: "wrap", justifyContent: "center", maxWidth: 800 }}>
            {[
              { l: "FastAPI", c: COLORS.green },
              { l: "Next.js", c: COLORS.text },
              { l: "LangGraph", c: COLORS.cyan },
              { l: "Supabase", c: COLORS.green },
              { l: "vLLM", c: COLORS.purple },
              { l: "Qdrant", c: COLORS.pink },
              { l: "Hetzner", c: COLORS.amber },
              { l: "Docker", c: COLORS.cyan },
              { l: "ENS Alto", c: COLORS.amber },
            ].map((t, i) => (
              <TechBadge key={t.l} label={t.l} color={t.c} delay={100 + i * 3} />
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Featured Projects */}
      <Sequence from={160} durationInFrames={85}>
        <AbsoluteFill
          style={{
            opacity: scene3Opacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Courier New, monospace",
              fontSize: 14,
              color: COLORS.textMuted,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 30,
            }}
          >
            Featured Projects
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <ProjectCard
              name="Riskitera"
              desc="B2B GRC/SOC/CTI Platform with multi-agent AI and sovereign infrastructure"
              color={COLORS.purple}
              status="LIVE"
              delay={165}
            />
            <ProjectCard
              name="MalwareIntel"
              desc="Threat Intelligence with knowledge graph, 13 CTI feeds, MITRE ATT&CK"
              color={COLORS.cyan}
              status="LIVE"
              delay={172}
            />
            <ProjectCard
              name="Trigr"
              desc="B2B Sales Signal Radar powered by 5 LangGraph AI agents"
              color={COLORS.amber}
              status="DEV"
              delay={179}
            />
            <ProjectCard
              name="st4rtup.com"
              desc="Academy for founders with AI productivity courses and Stripe payments"
              color={COLORS.green}
              status="LIVE"
              delay={186}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: CTA */}
      <Sequence from={240} durationInFrames={60}>
        <AbsoluteFill
          style={{
            opacity: scene4Opacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShieldIcon
            scale={spring({ frame: frame - 245, fps, config: { damping: 12 } })}
            opacity={1}
            glow={interpolate(Math.sin(frame * 0.15), [-1, 1], [15, 40])}
          />
          <div
            style={{
              marginTop: 30,
              fontFamily: "system-ui, sans-serif",
              fontSize: 42,
              fontWeight: 800,
              color: COLORS.text,
            }}
          >
            github.com/pedri77
          </div>
          <div
            style={{
              marginTop: 16,
              fontFamily: "Courier New, monospace",
              fontSize: 18,
              color: COLORS.cyan,
              letterSpacing: 2,
            }}
          >
            Sovereign AI for Cybersecurity
          </div>
          <div
            style={{
              marginTop: 30,
              display: "flex",
              gap: 20,
            }}
          >
            {["riskitera.com", "pedri77.github.io", "linkedin.com/in/david-moya-garcia"].map(
              (url, i) => (
                <span
                  key={url}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: COLORS.bgCard,
                    fontFamily: "Courier New, monospace",
                    fontSize: 14,
                    color: [COLORS.purple, COLORS.cyan, COLORS.green][i],
                    opacity: spring({
                      frame: frame - 255 - i * 5,
                      fps,
                      config: { damping: 12 },
                    }),
                  }}
                >
                  {url}
                </span>
              )
            )}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scanlines overlay */}
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(6,8,16,0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
