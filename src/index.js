const _ = require('lodash');
const moment = require('moment');
const XLSX = require('xlsx');

const f = (d) => d.format('DD/MM/YY');

const nextDateEcheanceMD = (mandatDepotInitialDate, lastGestionAlerteDate, nature) => {
    let nextEcheanceDate = moment(mandatDepotInitialDate);
    do {
        if(nature === 'D') {
            nextEcheanceDate.add(4, 'M');
        } else {
            nextEcheanceDate.add(1, 'Y');
        }
    } while (nextEcheanceDate.isBefore(lastGestionAlerteDate));
    if (lastGestionAlerteDate.isValid() && lastGestionAlerteDate.isAfter(nextEcheanceDate) ) {
        if(nature === 'D') {
            nextEcheanceDate.add(4, 'M');
        } else {
            nextEcheanceDate.add(6, 'M');
        }
    }
    return nextEcheanceDate;

};

const renewalCount = (mandatDepotInitialDate, referenceDate, nature) => {
    let nextEcheanceDate = moment(mandatDepotInitialDate);
    if(nature === 'D') {
        nextEcheanceDate.add(4, 'M');
    } else {
        nextEcheanceDate.add(1, 'Y');
    }
    let count = 0;
    while (nextEcheanceDate.isBefore(referenceDate)) {
        if(nature === 'D') {
            nextEcheanceDate.add(4, 'M');
        } else {
            nextEcheanceDate.add(6, 'M');
        }
        count++;
    }
    return count;
};

const previousRenewalDate = (mandatDepotInitialDate, referenceDate, nature) => {
    let nextEcheanceDate = moment(mandatDepotInitialDate);
    if(nature === 'D') {
        nextEcheanceDate.add(4, 'M');
    } else {
        nextEcheanceDate.add(1, 'Y');
    }
    let previousEcheanceDate = null;
    while (nextEcheanceDate.isBefore(referenceDate)) {
        previousEcheanceDate = moment(nextEcheanceDate);
        if(nature === 'D') {
            nextEcheanceDate.add(4, 'M');
        } else {
            nextEcheanceDate.add(6, 'M');
        }
    }
    return previousEcheanceDate;
};

const getCalendarFor = (row, referenceDate) => {
    const newRow = _.assign({}, row);
    newRow['today'] = f(referenceDate);
    const nature = row['Nature'];
    const mandatDepotInitialDate = moment(row['Date du mandat de dépôt initial'], 'DD/MM/YYYY');
    const lastGestionAlerteDate = moment(row["Date de gestion de l’alerte"], 'DD/MM/YYYY');
    newRow['Dernier renouvellement'] = previousRenewalDate(mandatDepotInitialDate, referenceDate, nature) ? f(previousRenewalDate(mandatDepotInitialDate, referenceDate, nature)) : '-';

    newRow['Nombre de prolongations à ce jour'] = renewalCount(mandatDepotInitialDate, referenceDate, nature);
    const nextDateEcheance = nextDateEcheanceMD(mandatDepotInitialDate, lastGestionAlerteDate, nature);
    newRow["Date d'échéance MD"] = f(nextDateEcheance);
    newRow['Délai avant échéance MD'] = nextDateEcheance.diff(referenceDate, 'days');
    return newRow;
};

module.exports = ZonZon = {
    getCalendarFor,

    fill: function () {
        const reader = new FileReader();
        const f = this.files[0];
        reader.onload = e => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const json = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);
            console.log(json);
            const rows = _(json)
                .map(row => getCalendarFor(row, moment()))
                .map(row => {
                    const delailAvantEcheance = row['Délai avant échéance MD'];
                    let className = 'negative';
                    row.category = 'p1';

                    if (delailAvantEcheance > 35) {
                        className = 'warning';
                        row.category = 'p2';
                    }
                    if (delailAvantEcheance > 66) {
                        className = 'positive';
                        row.category = 'p3';
                    }
                    row.html =`<tr class="${className}">
                                                    <td class="left aligned">${row['Mis en examen']}</td>
                                                    <td class="right aligned">${row['Dossier']}</td>
                                                    <td>${row['Nature']}</td>
                                                    <td>${row['Date du mandat de dépôt initial']}</td>
                                                    <td>${row['Dernier renouvellement']}</td>
                                                    <td>${row['Nombre de prolongations à ce jour']}</td>
                                                    <td><strong>${row['Date d\'échéance MD']}</strong></td>
                                                    <td><strong>${delailAvantEcheance} jours</strong></td>
                                                    </tr>`;
                    return row;
                })
                .orderBy(r => r['Délai avant échéance MD'])
                .value();
            document.getElementById('p1').innerHTML = rows.filter(r => r.category === 'p1').map(r => r.html).join('');
            document.getElementById('p2').innerHTML = rows.filter(r => r.category === 'p2').map(r => r.html).join('');
            document.getElementById('p3').innerHTML = rows.filter(r => r.category === 'p3').map(r => r.html).join('');
        };
        reader.readAsArrayBuffer(f);
        document.getElementById('fileinput').value= null;
    }
};
