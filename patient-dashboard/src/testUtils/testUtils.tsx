import { QueryClient, QueryClientConfig, QueryClientProvider } from "@tanstack/react-query"
import { PropsWithChildren } from "react"

export const createQueryClientWrapper = (defaultOptions?: QueryClientConfig['defaultOptions']) => {
  function TestQueryClientWrapper ({ children }: PropsWithChildren) {
    const queryClient = new QueryClient({ defaultOptions: defaultOptions ?? { queries: { retry: false } } })
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
  return TestQueryClientWrapper
}

