export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-arc-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(77,142,233,0.16),_transparent_60%)]" />
      <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-arc-blue/20 blur-[120px] animate-drift" />
      <div
        className="absolute top-1/3 -right-24 h-[460px] w-[460px] rounded-full bg-arc-violet/20 blur-[120px] animate-drift"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute bottom-0 left-1/4 h-[420px] w-[420px] rounded-full bg-arc-green/10 blur-[130px] animate-drift"
        style={{ animationDelay: "6s" }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M42 0H0V42" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
