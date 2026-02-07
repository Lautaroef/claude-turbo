"use client";

import Image from "next/image";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <Image
        src="/boba-empty.png"
        alt="Cute boba tea waiting for notes"
        width={297}
        height={296}
        priority
      />
      <p className="mt-4 text-2xl text-[var(--text-heading)] font-normal">
        I&apos;m just here waiting for your charming notes...
      </p>
    </div>
  );
}
