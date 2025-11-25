import { twMerge } from "tailwind-merge"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={twMerge("bg-accent animate-pulse ", className)}
      {...props}
    />
  )
}

export { Skeleton }
