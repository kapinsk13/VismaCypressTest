describe('Pilnais paziņojuma dzīvescikls (izveidots-izgūts-izdzēsts) scenārijs', () => {

  const baseUrl = `${Cypress.env('baseUrl')}/api/documents`;

  const izgutNakosNedelasDatumu = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  const testaDati = {
    title: 'Automātiskā testa paziņojums API',
    targetDate: izgutNakosNedelasDatumu(),
    text: 'Šo tekstu ievietoja automātiskais tests iekš API'
  };

  it('izveidot, izgūt un izdzēsts paziņojumu', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      body: testaDati,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(200)

      cy.request('GET', baseUrl).then((getResponse) => {
        expect(getResponse.status).to.equal(200);

        const document = getResponse.body.find(doc =>
          doc.title === testaDati.title &&
          doc.targetDate === testaDati.targetDate &&
          doc.text === testaDati.text
        );
        expect(document).to.exist;
        const documentId = document.id;

        cy.request({
          method: 'DELETE',
          url: `${baseUrl}/${documentId}`,
          failOnStatusCode: false
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.equal(200);

          cy.request('GET', baseUrl).then((finalGetResponse) => {
            const deletedDocument = finalGetResponse.body.find(doc =>
              doc.id === documentId
            );
            expect(deletedDocument).to.not.exist;
          });
        });
      });
    });
  });
});
