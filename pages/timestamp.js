export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/timestamp', {
    next: { revalidate: 10 }, // Revalidate every 10 seconds
  })
  const data = await res.json()

  return {
    props: {
      timestamp: data.timestamp,
    },
  }
}

export default function Page({ timestamp }) {
  return (
    <div>
      <h1>Timestamp</h1>
      <p>{timestamp}</p>
    </div>
  )
}
