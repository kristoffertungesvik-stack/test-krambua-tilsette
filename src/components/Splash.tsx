export default function Splash() {
  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          border: "1px solid var(--color-accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--color-accent)" }} />
      </div>
    </div>
  );
}
