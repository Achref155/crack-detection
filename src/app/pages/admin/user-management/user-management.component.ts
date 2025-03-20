import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  imports: [CommonModule]
})
export class UserManagementComponent implements OnInit {

  users: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: users => {
        console.log('Fetched users:', users);
        this.users = users;
      },
      error: err => console.error('Error loading users', err)
    });
  }

  banUser(userId: string) {
    this.adminService.banUser(userId).subscribe({
      next: () => {
        console.log('User banned successfully');
        this.loadUsers(); // Refresh list after operation
      },
      error: err => console.error('Error banning user', err)
    });
  }

  removeUser(userId: string) {
    console.log('User ID to remove:', userId);
    if (!userId) {
      console.error('No valid user ID found. Skipping operation.');
      return;
    }
    this.adminService.removeUser(userId).subscribe({
      next: () => {
        console.log('User removed successfully');
        this.loadUsers();
      },
      error: err => console.error('Error removing user', err)
    });
  }
}