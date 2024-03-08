import { ReactNode } from "react";



export default function Section(props: {title: String, sectionClass?: string, contentClass?: string, children: ReactNode[] | ReactNode | undefined}) {

    return <section className={props.sectionClass}>
        <h4>{props.title}</h4>
        <hr></hr>
        <div className={props.contentClass}>
            {props.children}
        </div>
    </section>
}