import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Wifi, WifiOff } from 'lucide-react';

export function NetworkStatus() {
  const { isOnline, wasOffline } = useOnlineStatus();

  return (
    <>
      {/* Offline banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white py-2 px-4 flex items-center justify-center gap-2 shadow-lg">
          <WifiOff className="w-4 h-4" />
          <span className="font-medium text-sm">You are offline. Please check your internet connection.</span>
        </div>
      )}

      {/* Back online notification */}
      {isOnline && wasOffline && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white py-2 px-4 rounded-full flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <Wifi className="w-4 h-4" />
          <span className="font-medium text-sm">Back online!</span>
        </div>
      )}
    </>
  );
}
