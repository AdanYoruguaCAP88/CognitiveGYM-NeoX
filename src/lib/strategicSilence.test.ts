import { describe, expect, it } from 'vitest';
import { strategicSilence } from './strategicSilence';
describe('strategicSilence',()=>{it('blocks below 40',()=>expect(strategicSilence(39)).toBe('blocked'));it('warns from 40 to 59',()=>expect(strategicSilence(40)).toBe('warning'));it('cleans from 60',()=>expect(strategicSilence(60)).toBe('clean'));});