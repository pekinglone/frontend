// import { createBrowserHistory  } from "history";
// export default createBrowserHistory ();//createBrowserHistory(); 
import { createHashHistory } from 'history';
export default createHashHistory({
  hashType: 'slash' // the default
});