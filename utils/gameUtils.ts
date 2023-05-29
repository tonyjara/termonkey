export interface keyType {
  name: string;
  ctrl: boolean;
  shift: boolean;
}
export function handleSIGNOUT(key: keyType) {
  if (key.ctrl && key.name === "c") {
    /* onClose(); */
    process.exit();
  }
}
