import Site from "./Site";
import MemberSpace from "./MemberSpace";
export default function App(){return window.location.pathname.startsWith("/app")?<MemberSpace/>:<Site/>;}
