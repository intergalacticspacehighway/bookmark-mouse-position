import ReactDOM from "react-dom";
import { App } from "./App";
// window.api.receive("fromMain", (data) => {
//   console.log(`Received ${data} from main process`);
//   document.createElement("div").innerHTML;
// });

// window.api.send("toMain", "some data");
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
