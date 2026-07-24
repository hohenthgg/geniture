import { createRoot } from "react-dom/client";
import Genitura from "../genitura.jsx";

const loader = document.getElementById("loader");
if (loader) loader.remove();

createRoot(document.getElementById("root")).render(<Genitura />);
