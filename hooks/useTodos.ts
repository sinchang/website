import { useQuery } from "@tanstack/react-query";
import { request } from "../api/request";

interface Todo {
  completed: boolean
  id: number
  title: string
  userId: number
}

export const getTodos = () => request<null, Todo[]>({
  method: 'GET',
  url: '/todos'
})

export const useTodos = () => {
  return useQuery(
    { queryKey: ['todos'], queryFn: getTodos }
  );
}