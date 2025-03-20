import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  userCount: number = 0;
  proposalCount: number = 0;
  aiModelStatus: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.adminService.getAllUsers().subscribe({
      next: users => this.userCount = users.length,
      error: err => console.error('Error loading users', err)
    });

    // Dummy logic for proposals and AI status, replace with real service calls
    this.proposalCount = 42; // Example static data
    this.aiModelStatus = 'Running'; // Example static status
  }
}