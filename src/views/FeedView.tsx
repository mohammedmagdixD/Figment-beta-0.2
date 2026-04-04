import React from 'react';

export function FeedView() {
  return (
    <div className="flex flex-col items-center justify-center h-full flex-1 px-4 text-center">
      <h2 className="font-serif text-2xl font-semibold text-[var(--label)] mb-2">
        Available Soon xD
      </h2>
      <p className="font-sans text-sm text-[var(--secondary-label)] max-w-[250px]">
        We're working hard to bring you a personalized feed of updates from your friends.
      </p>
    </div>
  );
}
