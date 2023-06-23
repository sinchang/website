interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function Avatar({ className, alt, ...props }: AvatarProps) {
  return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={`rounded-full ${className}`}
        alt={alt}
        {...props}
      />
  )
}
