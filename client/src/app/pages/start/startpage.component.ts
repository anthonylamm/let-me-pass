import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { OnInit, OnDestroy, ElementRef, ViewChild, Component} from '@angular/core';



Component
@Component({
  selector: 'app-startpage',
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  templateUrl: './start.html',
  styleUrl: './start.scss'
})
export class StartpageComponent implements OnInit, OnDestroy {
  @ViewChild('vantaBackground', { static: true }) vantaBackground!: ElementRef;
  vantaEffect: any;

  ngOnInit() {
  
  }

  ngOnDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }
  
}
