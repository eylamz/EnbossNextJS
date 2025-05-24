'use client';

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 right-0 z-[100] dir-rtl flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-[300px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
"group pointer-events-auto relative flex w-full max-w-[300px] items-start justify-between space-x-4 overflow-hidden rounded-lg  shadow-[0_0_20px_0_rgba(0,0,0,0.12)] dark:shadow-[0_0_20px_0_rgba(0,0,0,0.35)] transition-all",
  {
    variants: {
      variant: {
        default: "bg-white text-[#4f525a] dark:bg-[#2d2e31] dark:text-[#e0e0e0]",
        success: "bg-[#C3F3D7] text-[#51a775]  dark:bg-[#1a3d2a] dark:text-[#51a775]",
        error: "bg-[#f3c3c3 text-[#a75151] dark:bg-[#3d1a1a] dark:text-[#ff6b6b]",
        info: "bg-[#d0eaff] text-[#6097b8] dark:bg-[#1a2d3d] dark:text-[#6097b8]",
        dark: "bg-[#2d2e31]text-[#2d2e31] dark:bg-[#1a1a1a] dark:text-[#e0e0e0]",
        warning: "bg-[#efe4c3]text-[#a97651] dark:bg-[#3d2a1a] dark:text-[#ffa366]",
        destructive:
          "border-error-border/20 dark:border-error-border-dark/50 bg-error-bg text-error dark:bg-error-bg-dark dark:text-error-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  const borderColor = {
    default: "border-purple-500",
    success: "border-[#51a775]",
    error: "border-[#a75151]",
    info: "border-[#6097b8]",
    dark: "border-[#2d2e31]",
    warning: "border-[#a97651]",
    destructive: "border-error-border"
  }[variant || "default"];

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        toastVariants({ variant }),
        "data-[state=open]:animate-slideIn",
        "data-[state=closed]:animate-scaleDownFade",
        "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
        "data-[swipe=cancel]:translate-x-0",
        "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
        className
      )}
      {...props}
    >
      <div className={cn("w-full h-full p-[10px] rtl:border-r-4 ltr:border-l-4", borderColor)}>
        <div className="flex-1 animate-slideUp">
          {props.children}
        </div>
      </div>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors",
      "hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30",
      "group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground",
      "group-[.destructive]:focus:ring-destructive",
      "animate-fadeIn",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute -right-14 -top-4 rounded-md p-1.5 text-foreground/50 invisible translate-x-2 opacity-0 transition-all duration-300 ease-in-out",
      "hover:text-foreground hover:bg-slate-100 focus:outline-none focus:ring-2",
      "group-hover:visible group-hover:translate-x-0 group-hover:opacity-100 group-focus:visible group-focus:translate-x-0 group-focus:opacity-100",
      "group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50",
      "group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      "animate-fadeIn",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-base font-semibold animate-slideUp", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 animate-slideUp", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}; 