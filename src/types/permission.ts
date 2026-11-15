/**
 * - `granted`: we can read audio
 * - `undetermined`: never asked
 * - `denied`: refused, but we can ask again
 * - `blocked`: refused forever, only the system settings can change it
 */
export type AudioPermission = 'granted' | 'undetermined' | 'denied' | 'blocked';
