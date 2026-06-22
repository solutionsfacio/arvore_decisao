-- ============================================================
-- Sprint 18 — Adiciona coluna calc_type em flow_nodes
-- Rodar APÓS 0005_collection_flow_seed.sql e ANTES de 0007_update_flow_calcs.sql.
-- Idempotente.
-- ============================================================

alter table public.flow_nodes
  add column if not exists calc_type text
    check (calc_type in ('antecipacao', 'acordo_cf'));
