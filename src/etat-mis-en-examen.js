const moment = require('moment');
const _ = require('lodash');

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
        return this.renouvellements.length;
    }

    get dateProchaineEcheance() {
        let prochaineDateEcheance = moment(this.dateMandatDepotInitiale);
        if (this.nature === 'D') {
            prochaineDateEcheance.add(4, 'M');
        } else {
            prochaineDateEcheance.add(1, 'Yconst toHtmlRows = sheet =>
');
        }
        if (this.dateDerniereGestionAlerte) {
            do {
                if (this.nature === 'D') {
                    prochaineDateEcheance.add(4, 'M');
                } else {
                    prochaineDateEcheance.add(6, 'M');
                }
            } while (prochaineDateEcheance.isBefore(this.dateDerniereGestionAlerte));
        }
        return prochaineDateEcheance;
    }

    get delaiAvantEcheanceMandatDepot() {
        return this.dateProchaineEcheance.diff(this.referenceDate, 'days');
    }

    get dateDernierRenouvellement() {
        return _.last(this.renouvellements);
    }

    get renouvellements() {
        const renouvellements = [];
        let dateProchaineEcheance = moment(this.dateMandatDepotInitiale);
        if (this.nature === 'D') {
            dateProchaineEcheance.add(4, 'M');
        } else {
            dateProchaineEcheance.add(1, 'Y');
        }
        renouvellements.push(moment(dateProchaineEcheance));
        let dateDernierRenouvellement = null;
        while (dateProchaineEcheance.isBefore(this.referenceDate)) {
            dateDernierRenouvellement = moment(dateProchaineEcheance);
            if (this.nature === 'D') {
                dateProchaineEcheance.add(4, 'M');
            } else {
                dateProchaineEcheance.add(6, 'M');
            }
            renouvellements.push(moment(dateProchaineEcheance));
        }
        return _.take(renouvellements, renouvellements.length - 1);
    }

}

module.exports = EtatMisEnExamen;