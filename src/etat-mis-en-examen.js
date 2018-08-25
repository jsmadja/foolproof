const moment = require('moment');
const _ = require('lodash');

const calculeDateProlongationInitiale = (etat, dateProchaineEcheance) =>
    etat.isDelictuel() ? moment(dateProchaineEcheance).add(4, 'M') : moment(dateProchaineEcheance).add(1, 'Y');

const calculeDateProlongation = (etat, dateProchaineEcheance) =>
    etat.isDelictuel() ? dateProchaineEcheance.add(4, 'M') : dateProchaineEcheance.add(6, 'M');

class EtatMisEnExamen {
    constructor(dossier, nom, nature, dateMandatDepotInitiale, dateDerniereGestionAlerte, referenceDate = moment()) {
        this.dossier = dossier;
        this.nom = nom;
        this.nature = nature;
        this.dateMandatDepotInitiale = dateMandatDepotInitiale;
        this.dateDerniereGestionAlerte = dateDerniereGestionAlerte;
        this.referenceDate = referenceDate;
    }

    get nombreProlongations() {
        return _.filter(this.renouvellements, r => r.isBefore(this.referenceDate)).length;
    }

    get dateProchaineEcheance() {
        return _.last(this.renouvellements);
    }

    get delaiAvantEcheanceMandatDepot() {
        return this.dateProchaineEcheance.diff(this.referenceDate, 'days');
    }

    get dateDernierRenouvellement() {
        return this.renouvellements[this.renouvellements.length - 2];
    }

    get renouvellements() {
        const renouvellements = [];
        let dateProchaineEcheance = calculeDateProlongationInitiale(this, this.dateMandatDepotInitiale);
        renouvellements.push(moment(dateProchaineEcheance));
        let dateDernierRenouvellement = null;
        do {
            dateDernierRenouvellement = calculeDateProlongation(this, dateProchaineEcheance);
            if (this.dateDerniereGestionAlerte) {
                renouvellements.push(moment(dateProchaineEcheance));
            }
        } while (dateProchaineEcheance.isBefore(this.referenceDate));
        return renouvellements;
    }

    isDelictuel() {
        return this.nature === 'D'
    }

}

module.exports = EtatMisEnExamen;