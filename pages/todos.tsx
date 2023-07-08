import type { GetServerSideProps, NextPage } from 'next'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { getTodos, useTodos } from '../hooks'
import { globalAtom } from '../store'

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({ queryKey: ['todos'], queryFn: getTodos })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

const Todos: NextPage = () => {
  const { data } = useTodos()
  const [value] = useAtom(globalAtom)

  if (!data)
    return null
  return (
    <>
      <p>Current Language: {value.language}</p>
      {data.map(item => <div key={item.id}>{item.id}: {item.title}</div>)}
    </>
  )
}

export default Todos
