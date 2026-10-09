import type { ReactNode } from "react";
export default function Layout({children}:{children:ReactNode}) {
 return <html lang="en"><body style={{margin:0,fontFamily:"system-ui",background:"#101521",color:"#f5f6fa"}}>{children}</body></html>;
}
