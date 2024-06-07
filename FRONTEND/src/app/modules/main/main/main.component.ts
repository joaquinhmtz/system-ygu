import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  subscriber:any = Subscription;
  hiddenSidebar:boolean = false;

  constructor (
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit () {
    this.subscriber = this.router.events.pipe(
      filter((event:any) => event instanceof NavigationStart),
      map((event: NavigationEnd) => event.url),
    ).subscribe((event:any) => {
    });
  }

  ngOnDestroy () {
    this.subscriber?.unsubscribe();
  }
 
}
