"use client";

import { QRCodeCanvas } from "qrcode.react";

export default function QRCode({ url, size = 220 }: { url: string; size?: number }) {
  return (
    <div className="inline-block rounded-lg border border-line bg-white p-5">
      <QRCodeCanvas value={url} size={size} fgColor="#15191C" bgColor="#FFFFFF" level="M" />
    </div>
  );
}
