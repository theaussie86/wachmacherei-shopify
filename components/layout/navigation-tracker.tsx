'use client';

import { useNavigationTracker } from 'lib/hooks/use-navigation-tracker';

export function NavigationTracker() {
  // Dieser Hook verfolgt den Navigationsverlauf
  useNavigationTracker();

  // Diese Komponente rendert nichts sichtbares
  return null;
}
