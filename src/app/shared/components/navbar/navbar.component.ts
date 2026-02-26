import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { faArrowRightFromBracket, faCartShopping, faBars, faXmark, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UpperCasePipe, FontAwesomeModule, TranslocoModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  auth = inject(AuthService);
  carrito = inject(CarritoService);
  theme = inject(ThemeService);
  transloco = inject(TranslocoService);

  availableLangs = this.transloco.getAvailableLangs() as string[];
  activeLang = this.transloco.getActiveLang();

  // Icons
  faArrowRightFromBracket = faArrowRightFromBracket;
  faCartShopping = faCartShopping;
  faBars = faBars;
  faXmark = faXmark;
  faSun = faSun;
  faMoon = faMoon;

  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  changeLang(lang: string) {
    this.transloco.setActiveLang(lang);
    this.activeLang = lang;
  }

  logout() {
    this.auth.logout();
    window.location.reload();
  }
}
