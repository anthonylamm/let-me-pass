import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { OnInit, OnDestroy, ElementRef, ViewChild, Component} from '@angular/core';
import * as THREE from 'three';
import VANTA from 'vanta/dist/vanta.net.min';


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
    this.vantaEffect = VANTA.NET({
      el: this.vantaBackground.nativeElement,
      THREE: THREE,
      color: 0x1976d2,
      backgroundColor: 0x1a1a2e,
      points: 10.0,
      maxDistance: 20.0,
      spacing: 15.0
    });
  }

  ngOnDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }
  
}
