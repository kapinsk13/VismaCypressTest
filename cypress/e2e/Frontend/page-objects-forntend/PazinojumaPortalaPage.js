class PazinojumaPortalaPage {
  menuHome = '#menu-home';
  menuCreate = '#menu-create';
  titleInput = '#title';
  targetDate = '#target-date';
  textInput = '#text';
  saveButton = '#save-button > .p-ripple';
  toastSuccess = '.p-toast-message-success';
  titleDisplay = '.title';
  deleteButton = 'p-button[icon="pi pi-trash"]';
  nextPage = 'button.p-paginator-next';
  activeStatusToggle = '#active-status-toggle';

  pogaSakums() {
    return cy.get(this.menuHome);
  }

  veidotJaunuIerakstu() {
    return cy.get(this.menuCreate);
  }

  pazinojumaVirsraksts() {
    return cy.get(this.titleInput);
  }

  parslegtiesStarpAktiviemVaiNeaktiviemPazinojumiem() {
      return cy.get(this.activeStatusToggle);
    }

  merkaDatumsNakotne(daysOffset) {
    const sodiena = new Date();
    sodiena.setDate(sodiena.getDate() + daysOffset);
    const gads = sodiena.getFullYear();
    const menesis = String(sodiena.getMonth() + 1).padStart(2, '0');
    const diena = String(sodiena.getDate()).padStart(2, '0');
    const formattedDate = `${diena}.${menesis}.${gads}`;
    cy.get(this.targetDate).clear().type(formattedDate);
    return `${gads}-${menesis}-${diena}`;
  }

  pazinojumaTeksts() {
    return cy.get(this.textInput);
  }

  pogaSaglabat() {
    return cy.get(this.saveButton);
  }

  saglabatPazinojumu() {
    this.pogaSaglabat().should('not.have.class', 'p-disabled');
    this.pogaSaglabat().click();
    return cy.contains(this.toastSuccess, 'Paziņojums saglabāts!', { timeout: 6000 }).should('be.visible');
  }

  izveidotJaunuPazinojumu(virsraksts, dienasNaktone, teksts) {
    this.veidotJaunuIerakstu().click();
    this.pogaSaglabat().should('have.class', 'p-disabled');
    this.pazinojumaVirsraksts().type(virsraksts);
    const datums = this.merkaDatumsNakotne(dienasNaktone);
    this.pazinojumaTeksts().type(teksts);
    this.saglabatPazinojumu();
    return datums;
  }


    parbauditIzveidotoPazinojumu(pazinojumaVirsraksts, datums, pazinojumaTeksts) {
      cy.get('body').then($body => {
        if ($body.text().includes(pazinojumaVirsraksts) && $body.text().includes(datums) && $body.text().includes(pazinojumaTeksts)) {
          cy.contains(this.titleDisplay, pazinojumaVirsraksts).then($el => {
            const rowId = $el.attr('id').match(/row-(\d+)/)[1];
            cy.get(`#row-${rowId}-target-date`).should('be.visible').and('have.text', datums);
            cy.get(`#row-${rowId}-text`).should('be.visible').and('have.text', pazinojumaTeksts);
          });
        } else {
          cy.get('button.p-paginator-next').click();
          this.parbauditIzveidotoPazinojumu(pazinojumaVirsraksts, datums, pazinojumaTeksts);
        }
      });
    }


  dzestIerakstu(pazinojumaVirsraksts) {
    cy.contains(this.titleDisplay, pazinojumaVirsraksts).siblings('.buttons').find(this.deleteButton).click();
    cy.reload();
    cy.contains(this.titleDisplay, pazinojumaVirsraksts).should('not.exist');
  }
}

export default PazinojumaPortalaPage;
