import { setupXMLRequestProxy } from "./utils";

const prefix = '[setup]: ';
console.info(prefix, 'start');

function initialProxy() {
  console.log('initial');

  setupXMLRequestProxy();
}

// initialProxy();
export  { initialProxy };
window.abc = 123123;

console.log(prefix, 'end');
