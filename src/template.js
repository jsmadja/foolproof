const _ = require('lodash');
const formatDate = d => d ? d.format('DD/MM/YY') : '';

module.exports = {
    toHtmlRow: (className, etat) => {
        return `<tr class="${className}">
                    <td class="left aligned">${etat.nom}</td>
                    <td class="right aligned">${etat.dossier}</td>
                    <td>${etat.nature}</td>
                    <td>${formatDate(etat.dateMandatDepotInitiale)}</td>
                    <td>${formatDate(etat.dateDernierRenouvellement)}</td>
                    <td>${etat.nombreProlongations}</td>
                    <td><strong>${formatDate(etat.dateProchaineEcheance)}</strong></td>
                    <td><strong>${etat.delaiAvantEcheanceMandatDepot} jours</strong></td>
                    <td style="display: none;">${_.take(etat.renouvellements, etat.renouvellements.length - 1).map(r => formatDate(r)).join('<br/>')}</td>
            </tr>`;
    }
};