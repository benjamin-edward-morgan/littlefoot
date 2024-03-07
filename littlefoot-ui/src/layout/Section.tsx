import { ReactNode } from "react";



export default function Section(props: {title: String, children: ReactNode[] | ReactNode | undefined}) {

    return <section>
        <h4>{props.title}</h4>
        <hr></hr>
        <div className="sectionContent">
            {props.children}
        </div>
    </section>
}