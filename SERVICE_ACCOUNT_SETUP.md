# Google Calendar Service Account Setup

## Problem

Der aktuelle OAuth2-Ansatz mit Client ID, Client Secret und Refresh Token führt zu `invalid_grant` Fehlern. Service Account Authentifizierung ist die bessere Lösung für Server-zu-Server-Kommunikation.

## Service Account Einrichtung

### 1. Service Account erstellen

1. Gehe zur [Google Cloud Console](https://console.cloud.google.com/)
2. Wähle dein Projekt aus oder erstelle ein neues
3. Aktiviere die Google Calendar API
4. Gehe zu "IAM & Admin" > "Service Accounts"
5. Klicke "Create Service Account"
6. Gib einen Namen ein (z.B. "wachmacherei-calendar-service")
7. Klicke "Create and Continue"

### 2. Service Account Key erstellen

1. Klicke auf den erstellten Service Account
2. Gehe zum Tab "Keys"
3. Klicke "Add Key" > "Create new key"
4. Wähle "JSON" als Format
5. Lade die JSON-Datei herunter

### 3. Environment Variables setzen

Erstelle folgende Environment Variables aus der JSON-Datei:

```bash
# Service Account Credentials
GOOGLE_SERVICE_ACCOUNT_PROJECT_ID=dein-project-id
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID=private_key_id_aus_json
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_CLIENT_ID=client_id_aus_json

# Calendar ID (bleibt gleich)
GOOGLE_CALENDAR_ID=dein-kalender-id@gmail.com
```

### 4. Kalender freigeben

1. Öffne Google Calendar
2. Gehe zu Einstellungen > Kalender freigeben
3. Füge die Service Account E-Mail hinzu
4. Gib "Besitzer" oder "Bearbeiter" Berechtigung

### 5. Alte OAuth Variables entfernen

Diese können entfernt werden:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_REDIRECT_URI`

## Vorteile der Service Account Lösung

- ✅ Keine Refresh Token Probleme
- ✅ Server-zu-Server Authentifizierung
- ✅ Keine Benutzerinteraktion erforderlich
- ✅ Stabile, langfristige Lösung
- ✅ Bessere Sicherheit

## Testing

Nach der Einrichtung sollte die Kalender-API wieder funktionieren ohne `invalid_grant` Fehler.
