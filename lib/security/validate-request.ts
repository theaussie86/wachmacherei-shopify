import { NextRequest } from 'next/server';

/**
 * Validiert, ob eine Anfrage von unserem Frontend kommt
 * Verhindert unbefugten Zugriff auf API-Routes
 */
export function validateFrontendRequest(request: NextRequest): boolean {
  // Prüfe den Origin-Header
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Erlaubte Domains (Entwicklung und Produktion)
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://wachmacherei-shopify.vercel.app/', // Ersetze das durch deine echte Domain
    'https://admin.wachmacherei.de'
  ];

  // Prüfe Origin (primärer Check)
  if (origin && allowedOrigins.includes(origin)) {
    return true;
  }

  // Prüfe Referer (Fallback für ältere Browser)
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const isAllowed = allowedOrigins.some(
        (allowed) => refererUrl.origin === allowed || refererUrl.hostname === 'localhost'
      );
      if (isAllowed) {
        return true;
      }
    } catch (error) {
      // Ungültiger Referer - als nicht autorisiert behandeln
      return false;
    }
  }

  // Keine gültigen Header gefunden
  return false;
}

/**
 * Erstellt eine standardisierte Unauthorized-Response
 */
export function createUnauthorizedResponse() {
  return new Response(
    JSON.stringify({
      error: 'Unauthorized - Nur Frontend-Zugriff erlaubt',
      code: 'FRONTEND_ONLY'
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    }
  );
}
