import { storageProxy } from '@eslym/svelte-utility-stores/reactive-storage';

export const local = import.meta.env.SSR ? {} : storageProxy(localStorage);
