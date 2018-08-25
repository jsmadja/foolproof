const _ = require('lodash');
const moment = require('moment');
const XLSX = require('xlsx');
const EtatMisEnExamen = require('./etat-mis-en-examen');
const toHtmlRow = require('./template').toHtmlRow;

const convertRowToEtatMisEnExamen = row =>
    new EtatMisEnExamen(row['Dossier'], row['Mis en examen'], row['Nature'], moment(row['Date du mandat de dépôt initial'], 'DD/MM/YYYY'), row["Date de gestion de l’alerte"] ? moment(row["Date de gestion de l’alerte"], 'DD/MM/YYYY') : undefined);

const toHtmlRows = sheet =>
    _(sheet)
        .map(row => convertRowToEtatMisEnExamen(row))
        .orderBy(etat => etat.delaiAvantEcheanceMandatDepot)
        .map(etat => {
            const delailAvantEcheance = etat.delaiAvantEcheanceMandatDepot;
            let className = 'negative';
            let category = 'p1';
            if (delailAvantEcheance > 35) {
                className = 'warning';
                category = 'p2';
            }
            if (delailAvantEcheance > 66) {
                className = 'positive';
                category = 'p3';
            }
            return {category, html: toHtmlRow(className, etat)};
        })
        .value();

module.exports = ZonZon = {
    fill: function () {
        const reader = new FileReader();
        reader.onload = e => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const sheet = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);
            const htmlRows = toHtmlRows(sheet);
            document.getElementById('p1').innerHTML = htmlRows.filter(etat => etat.category === 'p1').map(etat => etat.html).join('');
            document.getElementById('p2').innerHTML = htmlRows.filter(etat => etat.category === 'p2').map(etat => etat.html).join('');
            document.getElementById('p3').innerHTML = htmlRows.filter(etat => etat.category === 'p3').map(etat => etat.html).join('');
        };
        reader.readAsArrayBuffer(this.files[0]);
        document.getElementById('fileinput').value = null;
    }
};
