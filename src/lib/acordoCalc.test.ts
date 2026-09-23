import { describe, expect, it } from "vitest";
import { computeAcordoCF, computeSimpleDiscount, parseBRNumber } from "./acordoCalc";

describe("computeAcordoCF", () => {
  it("aplica o desconto sobre o valor em aberto, não sobre o saldo (caso reportado)", () => {
    // Devia R$200, já pagou R$60, 10% de desconto → desconto de R$20 (10% de 200),
    // saldo de R$140, acordo final de R$120. Já ocorreu de sair R$126 (10% de 140,
    // o saldo já reduzido) — esse é o bug que este teste trava.
    const result = computeAcordoCF(200, 60, 0.1);

    expect(result.pagoExcedeAberto).toBe(false);
    expect(result.saldo).toBe(140);
    expect(result.descontoAplicado).toBe(20);
    expect(result.acordoComputed).toBe(120);
  });

  it("escala corretamente para os demais percentuais cadastrados", () => {
    expect(computeAcordoCF(1000, 0, 0.2).descontoAplicado).toBe(200);
    expect(computeAcordoCF(1000, 0, 0.5).acordoComputed).toBe(500);
    expect(computeAcordoCF(1000, 0, 0.7).acordoComputed).toBe(300);
  });

  it("não gera acordo quando o valor pago excede o valor em aberto", () => {
    const result = computeAcordoCF(100, 150, 0.1);

    expect(result.pagoExcedeAberto).toBe(true);
    expect(result.saldo).toBeNull();
    expect(result.descontoAplicado).toBeNull();
    expect(result.acordoComputed).toBeNull();
  });

  it("quando o valor pago é igual ao valor em aberto, saldo e acordo ficam negativos pelo desconto", () => {
    const result = computeAcordoCF(200, 200, 0.1);

    expect(result.pagoExcedeAberto).toBe(false);
    expect(result.saldo).toBe(0);
    expect(result.descontoAplicado).toBe(20);
    expect(result.acordoComputed).toBe(-20);
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
