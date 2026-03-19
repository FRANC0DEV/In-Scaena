import { PropsWithChildren } from "react";

export default async function BrowseLayout({ children }: PropsWithChildren) {
    return <div className="layout">
        {children}
    </div>
}