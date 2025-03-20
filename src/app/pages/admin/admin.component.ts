import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  adminData: any;

  constructor(private router: Router, private _adminService: AdminService) {}

  ngOnInit(): void {
    this._adminService.getAdminDetails().subscribe({
      next: adminData => {
        console.log('Admin data loaded', adminData);
        this.adminData = adminData;      
      },
      error: err => console.error('Error fetching admin data', err)
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}