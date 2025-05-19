import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function try_catch<T>(
	fn: () => T
): T extends Promise<infer R> ? Promise<[R, null] | [null, Error]> : [T, null] | [null, Error] {
	try {
		const result = fn();
		if (result instanceof Promise) {
			return result.then((res) => [res, null]).catch((err) => [null, err]) as any;
		}
		return [result, null] as any;
	} catch (err) {
		return [null, err] as any;
	}
}
