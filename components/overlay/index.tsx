import Image, { StaticImageData } from 'next/image';
import { PropsWithChildren } from 'react';

function BackgroundOverlay({ img, children }: PropsWithChildren<{ img?: StaticImageData }>) {
  return (
    <div className="relative isolate overflow-hidden pt-14">
      {img && (
        <Image
          src={img}
          alt="Hero Abschnitt Hintergrundbild"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      )}
      <div
        className="-z-15 absolute inset-0 bg-primary/70 blur-3xl sm:-top-80"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

export default BackgroundOverlay;
