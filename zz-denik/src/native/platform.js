import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

export const isNativePlatform = Capacitor.isNativePlatform();

/* ── Systémové tlačidlo Späť (Android) ─────────────────────────────
   Vrstvy (dialógy, menu, košík…) sa registrujú do LIFO zásobníka.
   Handler vráti `false`, ak Späť nespracoval — potom dostane šancu
   nižšia vrstva a nakoniec sa aplikácia minimalizuje (Android
   konvencia pre koreň aplikácie). Na desktope plní rovnakú rolu
   klávesa Escape. */

const backHandlers = [];

export function registerBackHandler(handler) {
    backHandlers.push(handler);
    return () => {
        const index = backHandlers.lastIndexOf(handler);
        if (index !== -1) backHandlers.splice(index, 1);
    };
}

function dispatchBack() {
    for (let i = backHandlers.length - 1; i >= 0; i--) {
        if (backHandlers[i]() !== false) return true;
    }
    return false;
}

export function exitApp() {
    if (isNativePlatform) CapacitorApp.exitApp();
}

export function initNativePlatform() {
    if (isNativePlatform) {
        CapacitorApp.addListener('backButton', () => {
            if (!dispatchBack()) CapacitorApp.minimizeApp();
        });
    }

    window.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || event.defaultPrevented) return;
        if (dispatchBack()) event.preventDefault();
    });
}

/* ── Stavový riadok / gestá ────────────────────────────────────────
   Na Androide 15+ kreslí aplikácia edge-to-edge; ikony systémových
   líšt musia sledovať aktívnu tému aplikácie, nie tému systému. */

export function syncSystemBars(isDark) {
    if (!isNativePlatform) return;
    SystemBars.setStyle({ style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light }).catch(() => {});
}

/* ── Haptika ───────────────────────────────────────────────────────
   Krátke potvrdenie dotyku; vyžaduje android.permission.VIBRATE. */

export function hapticTick(durationMs = 15) {
    try {
        navigator.vibrate?.(durationMs);
    } catch {
        /* haptika je vždy len bonus */
    }
}
