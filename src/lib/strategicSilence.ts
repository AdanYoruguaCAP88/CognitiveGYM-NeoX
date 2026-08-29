export type SilenceState = 'blocked'|'warning'|'clean';
export function strategicSilence(score:number): SilenceState {
 if(score<40)return 'blocked';
 if(score<60)return 'warning';
 return 'clean';
}