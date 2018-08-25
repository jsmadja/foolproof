const Foolproof = require('../src/index');
const assert = require('assert');
const moment = require('moment');

describe('Foolproof Delictuel Tests', function () {
    it('should generate next delictuel date', function () {
        const row = {
            Dossier: '5674',
            'Mis en examen': 'Julien Bobby',
            Nature: 'D',
            'Date du mandat de dépôt initial': '01/01/2018',
            'Date de gestion de l’alerte': '',
        };
        const day = moment("2018-04-01");
        const generatedRow = Foolproof.getCalendarFor(row, day);
        assert.deepEqual(generatedRow,
            {
                Dossier: row['Dossier'],
                'Mis en examen': row['Mis en examen'],
                Nature: row['Nature'],
                'Date de gestion de l’alerte': row[ 'Date de gestion de l’alerte'],
                'Date du mandat de dépôt initial': row['Date du mandat de dépôt initial'],
                'Dernier renouvellement': "-",
                'Nombre de prolongations à ce jour': 0,
                "Date d'échéance MD": '01/05/18',
                'Délai avant échéance MD': 30,
                'today': '01/04/18',
            });
    });

    it('should generate next delictuel date with 1 renewal foreseen', function () {
        const row = {
            Dossier: '5674',
            'Mis en examen': 'Julien Bobby',
            Nature: 'D',
            'Date du mandat de dépôt initial': '01/01/2018',
            'Date de gestion de l’alerte': '01/04/2018',
        };
        const day = moment("2018-04-01");
        const generatedRow = Foolproof.getCalendarFor(row, day);
        assert.deepEqual(generatedRow,
            {
                Dossier: row['Dossier'],
                'Mis en examen': row['Mis en examen'],
                Nature: row['Nature'],
                'Date de gestion de l’alerte': row[ 'Date de gestion de l’alerte'],
                'Date du mandat de dépôt initial': row['Date du mandat de dépôt initial'],
                'Dernier renouvellement': "-",
                'Nombre de prolongations à ce jour': 0,
                "Date d'échéance MD": '01/09/18',
                'Délai avant échéance MD': 153,
                'today': '01/04/18',
            });
    });

    it('should generate next delictuel date with 1 renewal foreseen (past)', function () {
        const row = {
            Dossier: '5674',
            'Mis en examen': 'Julien Bobby',
            Nature: 'D',
            'Date du mandat de dépôt initial': '01/01/2018',
            'Date de gestion de l’alerte': '01/04/2018',
        };
        const day = moment("2018-06-02");
        const generatedRow = Foolproof.getCalendarFor(row, day);
        assert.deepEqual(generatedRow,
            {
                Dossier: row['Dossier'],
                'Mis en examen': row['Mis en examen'],
                Nature: row['Nature'],
                'Date de gestion de l’alerte': row[ 'Date de gestion de l’alerte'],
                'Date du mandat de dépôt initial': row['Date du mandat de dépôt initial'],
                'Dernier renouvellement': "01/05/18",
                'Nombre de prolongations à ce jour': 1,
                "Date d'échéance MD": '01/09/18',
                'Délai avant échéance MD': 91,
                'today': '02/06/18',
            });
    });

});