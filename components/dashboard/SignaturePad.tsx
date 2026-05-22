"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

type SignaturePadProps = {
  name: string;
};

export function SignaturePad({ name }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [signature, setSignature] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);

  function setupCanvas() {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2.5);
    const width = Math.max(Math.round(rect.width), 320);
    const height = Math.round(width * 0.32);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#142019";
    context.lineWidth = 1.8;
  }

  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, []);

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    const { x, y } = point(event);
    lastPointRef.current = { x, y };
    context.beginPath();
    context.moveTo(x, y);
    context.lineWidth = event.pointerType === "touch" ? 2.2 : 1.8;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#17211b";
    setIsDrawing(true);
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const { x, y } = point(event);
    const previous = lastPointRef.current ?? { x, y };
    const midPoint = {
      x: (previous.x + x) / 2,
      y: (previous.y + y) / 2,
    };
    context.quadraticCurveTo(previous.x, previous.y, midPoint.x, midPoint.y);
    context.stroke();
    lastPointRef.current = { x, y };
  }

  function stop() {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    lastPointRef.current = null;
    if (canvas) setSignature(canvas.toDataURL("image/png"));
  }

  function clear() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setupCanvas();
    lastPointRef.current = null;
    setSignature("");
  }

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={signature} />
      <div ref={containerRef} className="rounded-md border border-slate-300 bg-white p-2">
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={stop}
          onPointerCancel={stop}
          onPointerLeave={stop}
          className="block w-full touch-none rounded-sm bg-[linear-gradient(to_bottom,transparent_calc(100%-2.25rem),#d8dee8_calc(100%-2.25rem),#d8dee8_calc(100%-2.18rem),transparent_calc(100%-2.18rem))]"
        />
      </div>
      <p className="text-xs leading-5 text-slate-500">Mit Finger oder Apple Pencil unterschreiben. Die Linie wird hochauflösend gespeichert.</p>
      <button type="button" onClick={clear} className="focus-ring inline-flex min-h-10 w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Zurücksetzen
      </button>
    </div>
  );
}
