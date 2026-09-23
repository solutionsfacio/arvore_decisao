/**
 * Cálculo de acordo com desconto (calcType "acordo_cf").
 *
 * Regra de negócio: o multiplier é uma TAXA DE DESCONTO sobre o valor total
 * em aberto original — não sobre o saldo já reduzido pelo valor pago.
 * Pagar parte da dívida não diminui o percentual de desconto concedido.
 *
 * valor do acordo = (valor em aberto − valor pago) − (valor em aberto × taxa de desconto)
 */

export function parseBRNumber(value: string): number | null {
  if (!value.trim()) return null;
  const cleaned = value.replace(/[^\d,.-]/g, "").replace(/\./g, "");
  const normalized = cleaned.replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export type AcordoCFResult = {
  pagoExcedeAberto: boolean;
  saldo: number | null;
  descontoAplicado: number | null;
  acordoComputed: number | null;
};

export function computeAcordoCF(
  openValue: number,
  paidValue: number,
  multiplier: number,
): AcordoCFResult {
  const pagoExcedeAberto = paidValue > openValue;

  if (pagoExcedeAberto) {
    return {
      pagoExcedeAberto,
      saldo: null,
      descontoAplicado: null,
      acordoComputed: null,
    };
  }

  const saldo = openValue - paidValue;
  const descontoAplicado = openValue * multiplier;
  const acordoComputed = saldo - descontoAplicado;

  return { pagoExcedeAberto, saldo, descontoAplicado, acordoComputed };
}

export function computeSimpleDiscount(
  contractValue: number,
  multiplier: number,
): number {
  return contractValue * multiplier;
}
