// @ts-ignore
import * as Store from 'electron-store';
import { ProtoFile } from '../behaviour';
import { EditorTabs } from '../components/BloomRPC';
import { InitialRequest } from '../components/Editor';

const EditorStore = new Store({
  name: "editor",
});

const KEYS = {
  URL: "url",
  PROTOS: "protos",
  TABS: "tabs",
  REQUESTS: "requests",
  INTERACTIVE: "interactive",
};

/**
 * Store URL
 * @param url
 */
export function storeUrl(url: string) {
  EditorStore.set(KEYS.URL, url);
}

export function storeInteractive(interactive: boolean) {
  EditorStore.set(KEYS.INTERACTIVE, interactive);
}

export function getInteractive() {
  return Boolean(EditorStore.get(KEYS.INTERACTIVE));
}

/**
 * Get URL
 */
export function getUrl(): string | void {
  return EditorStore.get(KEYS.URL);
}

/**
 * Store Proto List on the sidebar
 * @param protos
 */
export function storeProtos(protos: ProtoFile[]) {
  EditorStore.set(KEYS.PROTOS, protos.map(proto => proto.proto.filePath));
}

/**
 * Get proto list
 */
export function getProtos(): string[] | void {
  return EditorStore.get(KEYS.PROTOS);
}

/**
 * Store tabs
 * @param editorTabs
 */
export function storeTabs(editorTabs: EditorTabs) {
  EditorStore.set(KEYS.TABS, {
    activeKey: editorTabs.activeKey,
    tabs: editorTabs.tabs.map((tab) => ({
      methodName: tab.methodName,
      serviceName: tab.service.serviceName,
      protoPath: tab.service.proto.filePath,
    })),
  })
}

export interface EditorTabsStorage {
  activeKey: string,
  tabs: {
    protoPath: string,
    methodName: string,
    serviceName: string,
  }[]
}

/**
 * Get tabs
 */
export function getTabs(): EditorTabsStorage | void {
  return EditorStore.get(KEYS.TABS);
}

interface TabRequestInfo extends InitialRequest {
  id: string
}

/**
 * Store editor request info
 * @param tabKey
 * @param url
 * @param inputs
 * @param metadata
 */
export function storeRequestInfo(tabKey: string, url: string, inputs: string, metadata: string, interactive: boolean) {
  const request = {
    id: tabKey,
    url,
    inputs,
    metadata,
    interactive,
    createdAt: new Date().toISOString(),
  };

  const requestList = EditorStore.get('requests', [])
    .filter((requestItem: TabRequestInfo) => requestItem.id !== tabKey);

  EditorStore.set(KEYS.REQUESTS, [...requestList, request]);
}

/**
 * Get editor request info
 * @param tabKey
 */
export function getRequestInfo(tabKey: string): InitialRequest | undefined {
  const requests = EditorStore.get(KEYS.REQUESTS, []);
  return requests.find((request: TabRequestInfo) => request.id === tabKey);
}

/**
 * Delete editor request info
 * @param tabKey
 */
export function deleteRequestInfo(tabKey: string) {
  const requests = EditorStore.get(KEYS.REQUESTS, [])
    .filter((requestItem: TabRequestInfo) => requestItem.id !== tabKey);

  EditorStore.set('requests', requests);
}

export function clearAll() {
  EditorStore.clear();
}

export { EditorStore };


