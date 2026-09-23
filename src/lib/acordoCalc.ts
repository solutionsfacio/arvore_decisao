/**
 * Cálculo de acordo com desconto (calcType "acordo_cf").
 *
 * Entradas: valor já pago e valor pendente (saldo devedor atual) — os dois
 * números que o atendente tem em mãos ao falar com o cliente. O multiplier é
 * uma TAXA DE DESCONTO sobre o valor total da dívida (pago + pendente), não
 * apenas sobre o valor pendente — pagar parte da dívida não diminui o
 * percentual de desconto concedido.
 *
 * valor do acordo = valor pendente − ((valor pago + valor pendente) × taxa de desconto)
 */

export function parseBRNumber(value: string): number | null {
  if (!value.trim()) return null;
  const cleaned = value.replace(/[^\d,.-]/g, "").replace(/\./g, "");
  const normalized = cleaned.replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export type AcordoCFResult = {
  total: number;
  descontoAplicado: number;
  acordoComputed: number;
};

export function computeAcordoCF(
  paidValue: number,
  pendingValue: number,
  multiplier: number,
): AcordoCFResult {
  const total = paidValue + pendingValue;
  const descontoAplicado = total * multiplier;
  const acordoComputed = pendingValue - descontoAplicado;

  return { total, descontoAplicado, acordoComputed };
}

export function computeSimpleDiscount(
  contractValue: number,
  multiplier: number,
): number {
  return contractValue * multiplier;
}
