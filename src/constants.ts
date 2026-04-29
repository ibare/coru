export const MAX_STEPS = 4
export const FULL_MASK = (1 << MAX_STEPS) - 1
export const PASSCODE_LENGTH = 4

export const STEP_COLORS = {
  0: '#2A3A42',
  1: '#FF4B4B',
  2: '#FF9600',
  3: '#FFC800',
  4: '#58CC02',
} as const

export const STEP_COLORS_DARK = {
  1: '#CC3C3C',
  2: '#CC7800',
  3: '#CCA000',
  4: '#46A302',
} as const
