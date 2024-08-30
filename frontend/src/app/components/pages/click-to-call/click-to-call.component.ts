import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-click-to-call',
  templateUrl: './click-to-call.component.html',
  styleUrls: ['./click-to-call.component.css'],
})
export class ClickToCallComponent implements OnInit {
  longcode: any = '';
  constructor(private router: ActivatedRoute) {}
  ngOnInit(): void {
    this.router.queryParams.subscribe((params) => {
      this.longcode = params['registration_no'];
    });
  }
}
