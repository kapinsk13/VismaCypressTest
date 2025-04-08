import PazinojumaPortalaPage from '../page-objects-forntend/PazinojumaPortalaPage.js';

describe('Paziņojumu portāla tests', () => {
    const pazinojumaPortalaPage = new PazinojumaPortalaPage();

    beforeEach(() => {
        cy.visit(`${Cypress.env('baseUrl')}`);
        pazinojumaPortalaPage.pogaSakums().should('be.visible');
    });

    it('Izveidot jaunu ierakstu ar nākotnes datumu', () => {

        const testaDati = {
          pazinojumaVirsraksts: 'Automātiskā testa paziņojums aktīvs!',
          dienasNaktone: 30,
          pazinojumaTeksts: 'Šo tekstu rakstīja automātiskais tests'
        };

        const datums = pazinojumaPortalaPage.izveidotJaunuPazinojumu(testaDati.pazinojumaVirsraksts, testaDati.dienasNaktone, testaDati.pazinojumaTeksts);
        pazinojumaPortalaPage.pogaSakums().click();
        pazinojumaPortalaPage.parbauditIzveidotoPazinojumu(testaDati.pazinojumaVirsraksts, datums, testaDati.pazinojumaTeksts);
        pazinojumaPortalaPage.dzestIerakstu(testaDati.pazinojumaVirsraksts);
    });


    it('Izveidot jaunu ierakstu ar pagātnes datumu datumu', () => {
        const testaDati = {
            pazinojumaVirsraksts: 'Automātiskā testa paziņojums neaktīvs!',
            dienasNaktone: -5,
            pazinojumaTeksts: 'Šo tekstu rakstīja automātiskais tests'
            };

        const datums = pazinojumaPortalaPage.izveidotJaunuPazinojumu(testaDati.pazinojumaVirsraksts, testaDati.dienasNaktone, testaDati.pazinojumaTeksts);
        pazinojumaPortalaPage.pogaSakums().click();
        pazinojumaPortalaPage.parslegtiesStarpAktiviemVaiNeaktiviemPazinojumiem().click();
        pazinojumaPortalaPage.parbauditIzveidotoPazinojumu(testaDati.pazinojumaVirsraksts, datums, testaDati.pazinojumaTeksts);
        pazinojumaPortalaPage.dzestIerakstu(testaDati.pazinojumaVirsraksts);
    });


});
