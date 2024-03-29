import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';

import { Calendar } from '../pages/calendar/calendar'; 
import { Settings } from '../pages/settings/settings';
import { Login } from '../pages/login/login';
import { Tutorial } from '../pages/tutorial/tutorial';
import { TutorialList } from '../pages/tutorial-list/tutorial-list';
import { Schedule } from '../pages/schedule/schedule';
import { Filter } from '../pages/filter/filter';

import {AngularFire} from 'angularfire2';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Calendar;

  pages: Array<{title: string, component: any}>;

  constructor(public af: AngularFire,
    public platform: Platform,
    public statusBar: StatusBar
    ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Calendario', component: Calendar },
      { title: 'Ver mi horario', component: Schedule },
      { title: 'Pedir tutoría', component: Tutorial },
      { title: 'Filtrar eventos', component: Filter },
      { title: 'Ajustes', component: Settings },
      { title: 'Cerrar Sesión', component: null}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.overlaysWebView(false);
      this.statusBar.styleDefault();
    });

    this.af.auth.subscribe((auth) => {
      if(auth && auth.uid){
        this.af.database.object('/users/'+auth.uid)
        .subscribe(obj => {
          if(obj.type=='student'){
            console.log('Student detected');
            // Default case!
            // this.pages[2] = {title: 'Pedir tutoría', component: Tutorial};
          }
          if(obj.type=='teacher'){
            console.log('Teacher detected');
            this.pages[2] = {title: 'Solicitudes de tutoría', component: TutorialList};
          }
        });
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.title==='Cerrar Sesión'){
      this.af.auth.logout().then(() => this.rootPage=Login)
    }
    else{
      this.nav.setRoot(page.component);
    }
  }
}
