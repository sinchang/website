import { FunctionComponent } from "react"

export const Card: FunctionComponent =({ children, ...props }) => {
  return <section {...props}>{children}</section>
}
