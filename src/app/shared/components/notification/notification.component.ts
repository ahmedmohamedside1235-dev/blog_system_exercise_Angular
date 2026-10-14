import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [NgClass],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  public notificationService = inject(NotificationService);
}
