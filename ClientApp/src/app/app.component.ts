import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  title = '100DayHabitat';

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    // Initialize notification service for reminders and encouragement
    this.notificationService.initialize();
  }
}
