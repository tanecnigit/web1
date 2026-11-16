/*
 * Připojení k databázi přihlášek (Supabase).
 * Obě hodnoty jsou veřejné – patří do webu. Data chrání pravidla v databázi (viz supabase/schema.sql):
 * návštěvník smí přihlášku jen odeslat, číst je smí jen přihlášený administrátor.
 * NIKDY sem nevkládejte klíč „service_role“ / secret.
 */
export const supabase = {
  url: 'https://gwihjcrbyrroinuqdbvz.supabase.co',
  publishableKey: 'sb_publishable_RRvH7_um0_xneKlpth-AIw_k8neid6F',
  table: 'prihlasky',
};
