import { supabase } from './client';
import { BehaviorSubject } from 'rxjs';

const RETRY_DELAY = 5000; // 5 seconds
const MAX_RETRIES = 3;

export const connectionStatus = new BehaviorSubject<'connected' | 'disconnected' | 'reconnecting'>('connected');

class SupabaseConnectionManager {
  private retryCount = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;

  async checkConnection(): Promise<boolean> {
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1);
      const isConnected = !error;
      connectionStatus.next(isConnected ? 'connected' : 'disconnected');
      return isConnected;
    } catch {
      connectionStatus.next('disconnected');
      return false;
    }
  }

  async retryConnection(): Promise<void> {
    if (this.retryCount >= MAX_RETRIES) {
      connectionStatus.next('disconnected');
      return;
    }

    connectionStatus.next('reconnecting');
    this.retryCount++;

    const isConnected = await this.checkConnection();
    if (!isConnected && this.retryCount < MAX_RETRIES) {
      this.reconnectTimer = setTimeout(() => this.retryConnection(), RETRY_DELAY);
    } else if (isConnected) {
      this.retryCount = 0;
      connectionStatus.next('connected');
    }
  }

  startMonitoring(): void {
    // Check connection every 30 seconds
    setInterval(() => {
      this.checkConnection().then(isConnected => {
        if (!isConnected) {
          this.retryConnection();
        }
      });
    }, 30000);
  }

  cleanup(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
  }
}

export const connectionManager = new SupabaseConnectionManager();