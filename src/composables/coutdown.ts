export const useCountdown = () => {
  const countdown = ref(0)
  let timerId: undefined | number

  const start = (initalCount: number = 60) => {
    countdown.value = initalCount
    if (timerId) clearInterval(timerId)
    timerId = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--
      } else {
        clearInterval(timerId)
      }
    }, 1000)
  }

  onBeforeUnmount(() => {
    clearInterval(timerId)
  })

  return {
    countdown,
    start
  }
}
