export default function debounce<
  F extends (...args: Parameters<F>) => ReturnType<F>,
>(func: F, waitFor: number): (...args: Parameters<F>) => ReturnType<F> {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): any => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}
