/**
 * components/BackgroundFx.jsx
 * Decorative animated background — gradient orbs + grid.
 */
const BackgroundFx = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Subtle grid lines */}
    <div
      className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(200,255,87,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,87,0.4) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    />

    {/* Lime orb — top left */}
    <div
      className="absolute w-[600px] h-[600px] rounded-full"
      style={{
        top: "-200px",
        left: "-150px",
        background:
          "radial-gradient(circle, rgba(200,255,87,0.07) 0%, transparent 70%)",
        filter: "blur(40px)",
        animation: "pulse 6s ease-in-out infinite",
      }}
    />

    {/* Teal orb — bottom right */}
    <div
      className="absolute w-[500px] h-[500px] rounded-full"
      style={{
        bottom: "-150px",
        right: "-100px",
        background:
          "radial-gradient(circle, rgba(87,255,204,0.05) 0%, transparent 70%)",
        filter: "blur(40px)",
        animation: "pulse 8s ease-in-out infinite 2s",
      }}
    />

    {/* Center subtle glow */}
    <div
      className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
      style={{
        background:
          "radial-gradient(ellipse, rgba(200,255,87,0.03) 0%, transparent 70%)",
        filter: "blur(60px)",
      }}
    />
  </div>
);

export default BackgroundFx;
