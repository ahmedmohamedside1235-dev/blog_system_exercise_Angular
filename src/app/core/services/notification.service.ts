import { Injectable, signal } from '@angular/core';

type notification = {
  message: string;
  type: 'error' | 'success';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public message = signal<notification | null>(null);
  private hideTimer!: ReturnType<typeof setTimeout>;

  public show(message: string, type: 'success' | 'error' = 'success'): void {
    clearTimeout(this.hideTimer);
    this.message.set({ message, type });
    this.hideTimer = setTimeout(() => this.message.set(null), 4000);
  }
}
