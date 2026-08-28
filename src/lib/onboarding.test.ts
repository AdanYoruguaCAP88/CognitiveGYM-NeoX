import { describe, expect, it } from 'vitest';
import { toPersistenceArchetype } from './onboarding';

describe('archetype persistence mapping', () => {
  it('maps every engine archetype to the canonical storage value', () => {
    expect(toPersistenceArchetype('Táctico')).toBe('tactico');
    expect(toPersistenceArchetype('Divergente')).toBe('divergente');
    expect(toPersistenceArchetype('Exploración')).toBe('exploracion');
    expect(toPersistenceArchetype('Lineal')).toBe('lineal');
  });
});