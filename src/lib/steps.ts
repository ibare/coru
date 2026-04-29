// completedSteps 필드는 비트마스크로 저장된다.
// bit 0 = step 1, bit 1 = step 2, bit 2 = step 3, bit 3 = step 4
// 모두 완료 = 0b1111 = 15

export const stepBit = (step: number) => 1 << (step - 1)

export const isStepOn = (mask: number, step: number) => (mask & stepBit(step)) !== 0

export const toggleStep = (mask: number, step: number) => mask ^ stepBit(step)

export const popcount = (mask: number) => {
  let n = mask
  n = n - ((n >> 1) & 0x55555555)
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
  return (((n + (n >> 4)) & 0x0f0f0f0f) * 0x01010101) >> 24
}

export const highestStep = (mask: number) => (mask === 0 ? 0 : 32 - Math.clz32(mask))
