import Image from 'next/image'

export const Avatar = () => {
  return (
    <div>
      <Image
        src="https://unavatar.io/twitter/xingchangwen"
        className="avatar"
        width={100}
        height={100}
        alt="jeff wen"
      />
    </div>
  )
}
