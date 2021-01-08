import { Croisement } from "./croisement";



export class Benevole {
  id: number;
  prenom: string;
  nom: string;
  enfants: string;
  classes: string;
  classe: string;
  email: string;
  telephone: string;
  limite: number;
  Croisements: Croisement[];
  commentaire: string;
  reponse: string;
  gateaux: string;

  constructor(){
    this.Croisements = []
  }
}