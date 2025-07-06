import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/transaction')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/transaction"!</div>
}
