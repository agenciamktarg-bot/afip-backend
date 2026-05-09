var data = {
  CantReg: 1,
  PtoVta: 1,
  CbteTipo: 6,
  Concepto: 1,
  DocTipo: 99,
  DocNro: 0,
  CbteDesde: ultimoNro + 1,
  CbteHasta: ultimoNro + 1,
  CbteFch: parseInt(fecha),
  ImpTotal: importe,
  ImpTotConc: 0,
  ImpNeto: importe,
  ImpOpEx: 0,
  ImpIVA: 0,
  ImpTrib: 0,
  MonId: 'PES',
  MonCotiz: 1,
  CondicionIVAReceptorId: condicionIVA,
  Iva: [
    {
      Id: 3,
      BaseImp: importe,
      Importe: 0
    }
  ]
};
