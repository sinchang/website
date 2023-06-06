
interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const Avatar = ({className, ...props}: AvatarProps) => {
  return (
      <img
        className={`rounded-full ${className}`}
        {...props}
      />
  )
}
