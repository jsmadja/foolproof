const EtatMisEnExamen = require('../src/etat-mis-en-examen');
const moment = require('moment');
const assert = require('assert');
const _ = require('lodash');

describe('Etat Mis en Examen Criminel', function () {
    it('should create object', function () {
        const e = new EtatMisEnExamen('5674', 'Julien Bobby', 'C', moment('01/01/2018', 'DD/MM/YYYY'), undefined, moment('2018-04-01'));

        assert.equal(e.dateProchaineEcheance.format('DD/MM/YYYY'), '01/01/2019');
        assert.equal(e.dateMandatDepotInitiale.format('DD/MM/YYYY'), '01/01/2018');
        assert.equal(e.dateDerniereGestionAlerte, undefined);
        assert.equal(e.delailAvantEcheanceMandatDepot, 275);
        assert.equal(e.nombreProlongations, 0);
        assert.deepEqual(
            _.omit(e, ['dateMandatDepotInitiale', 'referenceDate', 'dateDerniereGestionAlerte']),
            {
                dossier: '5674',
                nom: 'Julien Bobby',
                nature: 'C',
            });
    });

    it('should generate next criminel date with 1 renewal foreseen', function () {
        const e = new EtatMisEnExamen('5674', 'Julien Bobby', 'C', moment('01/01/2018', 'DD/MM/YYYY'), moment('01/04/2018', 'DD/MM/YYYY'), moment('2018-04-01'));

        assert.equal(e.dateProchaineEcheance.format('DD/MM/YYYY'), '01/07/2019');
        assert.equal(e.dateMandatDepotInitiale.format('DD/MM/YYYY'), '01/01/2018');
        assert.equal(e.dateDerniereGestionAlerte.format('DD/MM/YYYY'), '01/04/2018');
        assert.equal(e.delailAvantEcheanceMandatDepot, 456);
        assert.equal(e.nombreProlongations, 0);
        assert.deepEqual(
            _.omit(e, ['dateMandatDepotInitiale', 'referenceDate', 'dateDerniereGestionAlerte']),
            {
                dossier: '5674',
                nom: 'Julien Bobby',
                nature: 'C',
            });
    });

    it('should generate next criminel date with 1 renewal foreseen (past)', function () {
        const e = new EtatMisEnExamen('5674', 'Julien Bobby', 'C', moment('01/01/2018', 'DD/MM/YYYY'), moment('01/04/2018', 'DD/MM/YYYY'), moment('2018-06-02'));

        assert.equal(e.dateProchaineEcheance.format('DD/MM/YYYY'), '01/07/2019');
        assert.equal(e.dateMandatDepotInitiale.format('DD/MM/YYYY'), '01/01/2018');
        assert.equal(e.dateDerniereGestionAlerte.format('DD/MM/YYYY'), '01/04/2018');
        assert.equal(e.delailAvantEcheanceMandatDepot, 394);
        assert.equal(e.nombreProlongations, 0);
        assert.deepEqual(
            _.omit(e, ['dateMandatDepotInitiale', 'referenceDate', 'dateDerniereGestionAlerte']),
            {
                dossier: '5674',
                nom: 'Julien Bobby',
                nature: 'C',
            });
    });
});