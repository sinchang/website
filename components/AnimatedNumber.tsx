import useAnimatedNumber from '../hooks/useAnimatedNumber'

export function AnimatedNumber({ value }: { value: number }) {
  const newValue = useAnimatedNumber(value)

  return <span>{ Math.round(newValue).toLocaleString()}</span>
}
