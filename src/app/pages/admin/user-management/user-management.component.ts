import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  imports: [CommonModule]
})
export class UserManagementComponent implements OnInit {

  users: any[] = [];

  constructor(private adminService: AdminService, private router: Router) {}

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

    // Show SweetAlert2 confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.removeUser(userId).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'User has been deleted successfully.',
              'success'
            );
            this.router.navigate(['/admin/users']); // Navigate to /admin/users after deletion
            this.loadUsers();
          },
          error: err => {
            Swal.fire(
              'Error!',
              'Failed to delete user. Please try again.',
              'error'
            );
            console.error('Error removing user', err)
          }
        });
      }
    });
  }
}