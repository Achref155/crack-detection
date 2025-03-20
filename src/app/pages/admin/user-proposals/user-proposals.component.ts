import { Component, OnInit } from '@angular/core';
import { ProposalService } from '../../../core/services/proposal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-proposals',
  templateUrl: './user-proposals.component.html',
  styleUrls: ['./user-proposals.component.css'],
  imports: [CommonModule]
})
export class UserProposalsComponent implements OnInit {

  proposals: any[] = [];

  constructor(private proposalService: ProposalService) {}

  ngOnInit(): void {
    this.loadProposals();
  }

  loadProposals() {
    this.proposalService.getAllProposals().subscribe({
      next: proposals => this.proposals = proposals,
      error: err => console.error('Error loading proposals', err)
    });
  }
}