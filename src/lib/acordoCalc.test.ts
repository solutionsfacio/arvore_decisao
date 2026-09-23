import { describe, expect, it } from "vitest";
import { computeAcordoCF, computeSimpleDiscount, parseBRNumber } from "./acordoCalc";

describe("computeAcordoCF", () => {
  it("aplica o desconto sobre o total (pago + pendente), não só sobre o pendente (caso reportado)", () => {
    // Pago R$60, pendente R$140 (dívida total de R$200), 10% de desconto →
    // desconto de R$20 (10% de 200), acordo final de R$120. Já ocorreu de
    // sair errado quando o desconto incidia só sobre o pendente (140 × 10% = 14
    // → acordo 126) ou quando os campos eram lidos como aberto/pago em vez de
    // pago/pendente — esse é o cenário que este teste trava.
    const result = computeAcordoCF(60, 140, 0.1);

    expect(result.total).toBe(200);
    expect(result.descontoAplicado).toBe(20);
    expect(result.acordoComputed).toBe(120);
  });

  it("escala corretamente para os demais percentuais cadastrados", () => {
    expect(computeAcordoCF(0, 1000, 0.2).descontoAplicado).toBe(200);
    expect(computeAcordoCF(0, 1000, 0.5).acordoComputed).toBe(500);
    expect(computeAcordoCF(0, 1000, 0.7).acordoComputed).toBe(300);
  });

  it("quando o desconto supera o valor pendente, o acordo computado fica negativo", () => {
    const result = computeAcordoCF(180, 20, 0.5);

    expect(result.total).toBe(200);
    expect(result.descontoAplicado).toBe(100);
    expect(result.acordoComputed).toBe(-80);
  });
});

describe("computeSimpleDiscount", () => {
  it("multiplica o valor da contratação diretamente pelo multiplier do nó", () => {
    expect(computeSimpleDiscount(1000, 0.3)).toBe(300);
  });
});

describe("parseBRNumber", () => {
  it("interpreta formato brasileiro (ponto de milhar, vírgula decimal)", () => {
    expect(parseBRNumber("1.234,56")).toBeCloseTo(1234.56);
    expect(parseBRNumber("200")).toBe(200);
  });

  it("retorna null para vazio ou inválido", () => {
    expect(parseBRNumber("")).toBeNull();
    expect(parseBRNumber("   ")).toBeNull();
  });
});
