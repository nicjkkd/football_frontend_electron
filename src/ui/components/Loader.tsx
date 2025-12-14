interface Props {
  styles?: string;
}

function Loader({ styles = "" }: Props) {
  return (
    <div
      role="status"
      className={`inline-flex items-center justify-center ${styles}`}
    >
      <div className="relative w-6 h-6">
        <div className="absolute inset-0 rounded-full border-2 border-linear-200 dark:border-linear-800" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-linear-500 dark:border-t-linear-400 animate-spin"
          style={{ animationDuration: "0.8s" }}
        />
        <div className="absolute inset-1 rounded-full bg-linear-400/10 dark:bg-linear-400/5 animate-pulse" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Loader;
