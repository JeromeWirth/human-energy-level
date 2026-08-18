export function batteryIcon(size: number) {
  const outlineWidth = Math.max(2, Math.round(size * 0.08));
  const bodyWidth = size * 0.6;
  const bodyHeight = size * 0.34;
  const pad = size * 0.05;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#16a34a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: bodyWidth,
          height: bodyHeight,
          border: `${outlineWidth}px solid white`,
          borderRadius: size * 0.09,
          display: "flex",
          alignItems: "center",
          padding: pad,
        }}
      >
        <div
          style={{
            width: "70%",
            height: "100%",
            background: "white",
            borderRadius: size * 0.03,
          }}
        />
      </div>
    </div>
  );
}
