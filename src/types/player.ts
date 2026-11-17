/**
 * What happens when a song ends by itself:
 * - 'off': play the next song; stop after the last one
 * - 'all': play the next song; after the last one start again from the first
 * - 'one': play the same song again
 */
export type RepeatMode = 'off' | 'all' | 'one';
