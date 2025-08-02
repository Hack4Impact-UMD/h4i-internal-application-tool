import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export async function clearQueryCache() {
  await queryClient.cancelQueries();
  await queryClient.invalidateQueries();
  await queryClient.resetQueries();
}
