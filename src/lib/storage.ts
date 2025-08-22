// /lib/storage.ts
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';

export async function save(key: string, value: any) {
  await idbSet(key, value);
}

export async function load<T = any>(key: string): Promise<T | undefined> {
  try {
    const v = await idbGet(key);
    return v as T | undefined;
  } catch (err) {
    console.warn('idb load failed', key, err);
    return undefined;
  }
}

export async function remove(key: string) {
  try {
    await idbDel(key);
  } catch (err) {
    console.warn('idb remove fail', key, err);
  }
}
