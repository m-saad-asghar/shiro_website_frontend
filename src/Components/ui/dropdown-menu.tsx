import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import Icons from "@/Constants/Icons";
import { twMerge } from "tailwind-merge";

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      className={twMerge(
        "h-[44px] px-[13px] border border-primary outline-0 text-[14px] font-NeueHaasGrotesk font-[400] text-primary  rounded-[6px] cursor-pointer flex-center gap-[12px] capitalize",
        className
      )}
      {...props}
    >
      {props.children}
      <Icons.FaAngleDown size={12} />
    </DropdownMenuPrimitive.Trigger>
  );
}

function DropdownMenuContent({
  children,
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={twMerge(
          "bg-light p-0 border border-primary py-[8px] shadow-md rounded-[8px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-[99999] max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto",
          className
        )}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}
function DropdownMenuItem({
  className,
  onSelect,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={twMerge("cursor-pointer rounded-md outline-none", className)}
      {...props}
      onSelect={(event) => {
        onSelect?.(event);
        document.dispatchEvent(new Event("close-dropdown-menu"));
      }}
    />
  );
}
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
};
