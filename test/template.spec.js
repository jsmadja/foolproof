const Template = require('../src/template');
const EtatMisEnExamen = require('../src/etat-mis-en-examen');
const assert = require('assert');
const moment = require('moment');

describe('HTML Template', () => {
    it('should create html row', () => {
        const etat = new EtatMisEnExamen('765', 'Kurt Cobain', 'D', moment('01/01/15', 'DD/MM/YY'), moment('01/07/18', 'DD/MM/YY'), moment('25/08/18', 'DD/MM/YY'));
        const row = Template.toHtmlRow('p1', etat);
        assert.equal(row, `<tr class="p1">
                    <td class="left aligned">Kurt Cobain</td>
                    <td class="right aligned">765</td>
                    <td>D</td>
                    <td>01/01/15</td>
                    <td>01/05/18</td>
                    <td>10</td>
                    <td><strong>01/09/18</strong></td>
                    <td><strong>7 jours</strong></td>
                    <td>01/05/15<br/>01/09/15<br/>01/01/16<br/>01/05/16<br/>01/09/16<br/>01/01/17<br/>01/05/17<br/>01/09/17<br/>01/01/18<br/>01/05/18</td>
            </tr>`);
    });
});