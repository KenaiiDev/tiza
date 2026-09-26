"use client";

import { useId, useState } from "react";

interface DismissibleNoticeProps {
  message: string;
  title: string;
}

export function DismissibleNotice({
  message,
  title,
}: DismissibleNoticeProps) {
  const [isVisible, setIsVisible] = useState(true);
  const titleId = useId();

  if (!isVisible) {
    return null;
  }

  return (
    <section
      aria-labelledby={titleId}
      className="max-w-md rounded-xl border border-sky-200 bg-sky-50 p-5 text-sky-950 shadow-sm"
      role="status"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold" id={titleId}>
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-sky-800">{message}</p>
        </div>
        <button
          aria-label="Dismiss notice"
          className="rounded-md px-2 py-1 text-sm font-medium hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          onClick={() => setIsVisible(false)}
          type="button"
        >
          Dismiss
        </button>
      </div>
    </section>
  );
}
