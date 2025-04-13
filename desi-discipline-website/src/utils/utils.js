import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"


export const getErrorMessage = (
    error,
    defaultMessage = 'An error occurred. Please try again later.'
) => {
    console.error(error);
    let errorMessage = defaultMessage;
    if (error instanceof Error && error.message.length < 100) {
        errorMessage = error.message;
    }
    return errorMessage
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseStringify = (value) => JSON.parse(JSON.stringify(value));


export function cn(...inputs) {
    return twMerge(clsx(inputs))
  }
  