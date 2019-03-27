import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { BenevoleService } from '../../services';
import { CroisementService, StandService } from '../../services';
import { DomSanitizer } from '@angular/platform-browser';
import { Benevole, Croisement, Stand } from '../../models';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnChanges {
  new: boolean;
  validation: boolean;
  nouveau: boolean;
  exist: boolean;
  choix: String;
  creneaux: Croisement[];
  stands: Stand[];
  chevauchement: boolean;
  besoins: Croisement[];

  croisements: Croisement[];
  benevole: Benevole = new Benevole;
  constructor(public benevoleService: BenevoleService,
    public croisementService: CroisementService,
    public standService: StandService,
    public sanitizer: DomSanitizer) {
    this.stands = [];
    this.besoins = [];
    this.creneaux = [];
    this.validation = false;
    this.exist = false;
    this.chevauchement = false;
    this.nouveau = false;
    this.new = true;
    this.getCreneaux();
    this.getStand();
  }

  ngOnChanges() {

  }

  find(benevole: Benevole): void {
    this.benevoleService.getByMail(benevole.email).subscribe(data => {
      console.log(data)
      this.exist = true
      this.benevole = data['benevoles'][0];
      this.updateListe(this.benevole)
      console.log(this.benevole)
    },
      error => {
        this.exist = false
        this.new = false;
        console.log('😢 Oh no!', error);
      });
  }


  subscribe(benevole: Benevole): void {
    this.benevoleService.add(benevole).subscribe(data => {
      console.log(data)
      this.benevole.id = data['benevoles'];
      this.exist = true;
      this.updateListe(this.benevole)
      console.log(this.benevole)
    },
      error => {
        this.exist = false;
        this.new = false;
        console.log('😢 Oh no!', error);
      });
  }


  update(benevole: Benevole): void {
    this.benevoleService.update(benevole).subscribe(data => {
      console.log(data)
      this.benevole.id = data['benevoles'];
      this.exist = true;
      console.log(this.benevole)
    },
      error => {
        this.exist = false;
        this.new = false;
        console.log('😢 Oh no!', error);
      });
  }


  error(benevole: Benevole): void {
    this.benevoleService.error(benevole).subscribe(data => {
      console.log(data)
      if (data['message'] == "ok") {

      }

    },
      error => {
        console.log('😢 Oh no!', error);
      });
  }


  getCreneaux(): void {
    this.croisementService.getByStand(1).subscribe(data => {
      this.creneaux = data['croisements']
    },
      error => {
        console.log('😢 Oh no!', error);
      });
  }


  updateListe(benevole: Benevole): void {
    console.log(this.creneaux)
    this.updateCroisementListe(this.creneaux, benevole.Croisements)
    console.log(this.stands)
    this.stands.forEach(stand => {
      this.updateCroisementListe(stand.croisements, benevole.Croisements)
    });
    this.getBesoin();
  }


  getBesoin(): void {
    this.creneaux.forEach(croisement => {
      if (croisement.besoin == true) {
        this.besoins.push(croisement);
      }
    })

    this.stands.forEach(stand => {
      stand.Croisements.forEach(croisement => {
        if (croisement.besoin == true) {
          this.besoins.push(croisement);
        }
      })

    });
  }


  getStand(): void {
    this.standService.getAll().subscribe(data => {
      console.log(data)
      data['stands'].forEach(stand => {
        if (stand.nom != 'tous') {
          this.croisementService.getByStand(stand.id).subscribe(data => {
            stand.croisements = data['croisements']
            this.stands.push(stand)
          },
            error => {
              console.log('😢 Oh no!', error);
            });



        }
      })
    },
      error => {
        console.log('😢 Oh no!', error);
      });
  }



  updateCroisementListe(croisements: Croisement[], croisementsbenevole: Croisement[]): void {
    console.log(croisementsbenevole)
    console.log(croisements)
    croisements.forEach(croisement => {
      console.log("croisement")
      console.log(croisement)
      croisementsbenevole.forEach(croisementbenevole => {
        console.log("croisementbenevole")
        console.log(croisementbenevole)
        if (croisement.id == croisementbenevole.id) {
          croisement.selected = true;
        } else {
          croisement.selected = false;
        }
      })
    });
  }

  choisir(croisement: Croisement): void {
    console.log(this.benevole)
    let added = false;

    for (let index = 0; index < this.benevole.Croisements.length; index++) {

      if (croisement.id == this.benevole.Croisements[index].id) {
        console.log("selected")
        croisement.selected = true;
        this.benevole.Croisements.splice(index, 1);
        added = true;
        break;
      }
    }

    if (!added) {
      croisement.selected = false;
      this.benevole.Croisements.push(croisement);
    }
    console.log(this.benevole);
    let listePlages = []

    for (let index = 0; index < this.benevole.Croisements.length; index++) {
      if (listePlages.indexOf(this.benevole.Croisements[index].Creneau.plage) > 0) {
        this.chevauchement = true;
        break;
      } else {
        listePlages.push(this.benevole.Croisements[index].Creneau.plage)
      }
    };

  }







  validate(): void {
    this.validation = true;
  }




}