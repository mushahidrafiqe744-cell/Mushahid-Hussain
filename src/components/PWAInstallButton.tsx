'use client';

import React, { useState, useEffect } from 'react';
import { Download, Sparkles, Smartphone, Monitor, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed on PC or mobile)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) {
      // If browser hasn't fired beforeinstallprompt yet, give a helpful native prompt instructions modal
      alert("To download and install this portfolio app:\n\n• On Chrome / Edge (PC & Android): Click the install icon (🖥️ / 📥) in your browser address bar or menu.\n• On iPhone / iPad: Tap the Share button and select 'Add to Home Screen'.");
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
    }
  };

  if (isInstalled) {
    return null; // Hide if already installed as PWA
  }

  return (
    <>
      {/* Install App Button */}
      <button
        onClick={handleInstallClick}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#C5A059] hover:bg-[#b0893f] text-[#11261B] text-[11px] font-black uppercase tracking-wider rounded-lg shadow-sm hover:scale-105 transition-all cursor-pointer animate-shimmer"
        title="Download / Install Portfolio App on PC or Mobile"
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        <span>Install App</span>
      </button>

      {/* iOS Installation Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#C5A059]" />
                <span>Install on iOS Device</span>
              </h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-gray-600 space-y-2 leading-relaxed">
              <p>To install this portfolio app on your iPhone or iPad home screen:</p>
              <ol className="list-decimal pl-4 space-y-1.5 font-medium text-gray-800">
                <li>Tap the <strong>Share</strong> button <span className="text-blue-600 font-bold">⎋</span> at the bottom of your Safari browser.</li>
                <li>Scroll down and tap <strong>Add to Home Screen ⊞</strong>.</li>
                <li>Tap <strong>Add</strong> at the top right to complete installation!</li>
              </ol>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#11261B] text-[#DFC285] font-bold text-xs hover:bg-[#1A3828] cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#11261B] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#C5A059] flex items-center gap-3 animate-bounce">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#DFC285]">Portfolio App Installed!</div>
            <div className="text-[10px] text-gray-300">You can now launch it directly from your device home screen.</div>
          </div>
        </div>
      )}
    </>
  );
};
