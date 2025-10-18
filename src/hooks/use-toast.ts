import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000; // Reduced from 1000000 to 5000 milliseconds (5 seconds)

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action = {
  type: ActionType["ADD_TOAST"];
  toast: ToasterToast;
} | {
  type: ActionType["UPDATE_TOAST"];
  toast: Partial<ToasterToast>;
} | {
  type: ActionType["DISMISS_TOAST"];
  toastId?: string;
} | {
  type: ActionType["REMOVE_TOAST"];
  toastId?: string;
};

interface State {
  toasts: ToasterToast[];
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // Certain toasts persist for a long time by default
      // we need to set their duration to 0 for them to be dismissable.
      // TODO: make this better
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      };
    }
    case actionTypes.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

function useToast() {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  const timedOut = React.useRef<Set<string>>(new Set());

  const addToast = React.useCallback((toast: ToasterToast) => {
    dispatch({ type: actionTypes.ADD_TOAST, toast });
  }, []);

  const updateToast = React.useCallback((toast: Partial<ToasterToast>) => {
    dispatch({ type: actionTypes.UPDATE_TOAST, toast });
  }, []);

  const dismissToast = React.useCallback((toastId?: string) => {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
  }, []);

  React.useEffect(() => {
    const toastsToDismiss = state.toasts.filter((toast) => {
      if (toast.duration !== undefined) {
        return toast.open && toast.duration === 0;
      }
      return toast.open && !timedOut.current.has(toast.id);
    });

    toastsToDismiss.forEach((toast) => {
      const { id, duration } = toast;

      if (duration === 0) return;

      setTimeout(() => {
        if (toast.onOpenChange) {
          toast.onOpenChange(false);
        }
        timedOut.current.add(id);
        dismissToast(id);
      }, duration || TOAST_REMOVE_DELAY);
    });
  }, [state.toasts, dismissToast]);

  return {
    ...state,
    toast: React.useCallback((toast: ToastProps) => {
      const id = genId();

      addToast({ ...toast, id, open: true });

      return { id };
    }, [addToast]),
  };
}

export { useToast, reducer as toastReducer };
