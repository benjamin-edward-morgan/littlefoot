import Section from "../layout/Section";


export default function LiveStream(props: {streamUrl: string}) {
    return <Section sectionClass="flex-column" contentClass="contain" title="📹 Live Stream">
        <img src={props.streamUrl} className="stream" />   
    </Section>
}