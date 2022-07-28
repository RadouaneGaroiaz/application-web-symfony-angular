# Installer Angular
- npm install -g @angular/cli

### Créer un nouveau projet
- ng new mon-projet

### Lancer le serveur Angular
- ng serve

### Installer Bootstrap & Bootswatch
- npm install bootstrap@~4.2.1 --save
- npm install bootswatch@~4.2.1 --save

01 @import "../node_modules/bootswatch/dist/NOMTHEME/variables";
02 @import "../node_modules/bootstrap/scss/bootstrap.scss";
03 @import "../node_modules/bootswatch/dist/NOMTHEME/bootswatch";

### Créer un component
- ng generate component NomComponent
ou
- ng g c NomComponent


# Data binding
- Exemple TypeScript :
'''
  info = {
    nom: "Carlos",
    mail: "carlos@univ-orleans.fr",
    tel: "06.06.06.06.06"
  };
  cours = [];

  cour = {
    nom:"",
    description: ""
  };

  newCours = false;

  constructor() { }

  ngOnInit(): void {
  }

  addCours(){
    if(this.cour.nom != ""){
      this.cours.push({
        nom:this.cour.nom,
        description:this.cour.description
      });

      this.cour.nom = "";
      this.cour.description = "";
    }
  }
'''

- Exemple Html :
'''

'''
