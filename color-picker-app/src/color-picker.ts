/**
 * Color Picker MCP App UI ロジック（ブラウザ側）
 */

import { App } from "@modelcontextprotocol/ext-apps";

const colorInput = document.getElementById("color-input") as HTMLInputElement;
const colorPreview = document.getElementById("color-preview")!;
const hexValue = document.getElementById("hex-value")!;
const rgbValue = document.getElementById("rgb-value")!;
const hslValue = document.getElementById("hsl-value")!;

// ① App インスタンスを作成してホストに接続
const app = new App({ name: "Color Picker App", version: "1.0.0" });
app.connect();

// ② ホストからツール結果がプッシュされてきたとき（初期カラーを受け取る）
app.ontoolresult = (result) => {
  const color = result.content?.find((c) => c.type === "text")?.text;
  if (color && /^#[0-9a-fA-F]{6}$/.test(color)) {
    colorInput.value = color;
    updateDisplay(color);
  }
};

// ③ カラー変換ユーティリティ
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      case bn:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// ④ 表示更新
function updateDisplay(hex: string) {
  colorPreview.style.backgroundColor = hex;
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  hexValue.textContent = hex.toUpperCase();
  rgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
  hslValue.textContent = `hsl(${h}, ${s}%, ${l}%)`;
}

// ⑤ カラーピッカー変更イベント
colorInput.addEventListener("input", () => {
  updateDisplay(colorInput.value);
});

// ⑥ コピーボタン
document.querySelectorAll<HTMLButtonElement>(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const targetId = btn.dataset.target!;
    const text = document.getElementById(targetId)!.textContent ?? "";
    await navigator.clipboard.writeText(text);
    const orig = btn.textContent;
    btn.textContent = "コピー済み";
    setTimeout(() => (btn.textContent = orig), 1500);
  });
});

// 初期表示
updateDisplay(colorInput.value);
