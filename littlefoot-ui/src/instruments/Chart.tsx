import { useEffect, useMemo, useState } from "react";
import "./Chart.css"
import * as d3 from 'd3';
import { useMeasure } from '@uidotdev/usehooks';

export interface ChartData {
    label: string,
    value: number | undefined,
    color: string,
}

export interface ChartParameters {
    xPixelsPerTick: number,
    yPixelsPerTick: number,
    margin: {left: number, right: number, top: number, bottom: number},
    range: [number, number] | undefined,
}

export const DefaultChartParams: ChartParameters = {
    xPixelsPerTick: 100,
    yPixelsPerTick: 25,
    margin: {left: 20, right: 40, top: 20, bottom: 30},
    range: undefined,
}

export interface ChartProps {
    title: String,
    historySeconds: number,
    seconds: number | undefined,
    data: ChartData[],
    params: ChartParameters,
}

export default function Chart(props: ChartProps) {

    const [svgRef, { width, height }] = useMeasure();
    const params = props.params;
    const margin = params.margin;
    const chartWidth = (width ? width : 0) - margin.left - margin.right;
    const chartHeight = (height ? height : 0) - margin.top - margin.bottom;

    const chartData = props.data;
    const seconds = props.seconds;

    const [data, setData] = useState< { [key:string]: {x: number, y: number}[]} > ( {})

    const chartState = useMemo(() => new ChartInternalState(setData), []);

    useEffect(() => {
        chartState.updateData(chartData, seconds);
    }, [chartData, seconds])

    useEffect(() => {
        chartState.startAnimation()
        return () => {
            chartState.stopAnimation();
        };
    }, []);

    const minMax = params.range ? 
    { 
        min: params.range[0],
        max: params.range[1],
    } :
    { 
        min: -1.0,
        max: 1.0,
    };

    const xScale = d3.scaleLinear().domain([-props.historySeconds,0]).range([0, chartWidth]);
    const yScale = d3.scaleLinear().domain([minMax.max, minMax.min]).range([0, chartHeight]);
    const lineBuilder = d3.line<ChartPoint>().x( (d: ChartPoint) => xScale(d.x) ).y( (d: ChartPoint) => yScale(d.y) );

    return <>
        <svg ref={svgRef} className={"chart"}>       
            <g transform={`translate(${[margin.left,margin.top].join(",")})`}>
                <text
                    style={{
                        fontSize: "12px",
                        textAnchor: "start",
                    }}
                >
                {props.title}
            </text>
            </g>

            <g transform={`translate(${[margin.left,margin.top+chartHeight].join(",")})`}
            overflow="visible">
                <XAxis scale={xScale} pixelsPerTick={params.xPixelsPerTick} />   
            </g>
           
            <g transform={`translate(${[margin.left+chartWidth,margin.top].join(",")})`}
            overflow="visible" >
                <YAxis scale={yScale} pixelsPerTick={params.yPixelsPerTick} />
            </g>

            <g width={chartWidth}
            height={chartHeight}
            transform={`translate(${[margin.left,margin.top].join(",")})`} >
                {chartData.map( (cd) => {
                    return <ChartLine key={cd.label} color={cd.color} points={data[cd.label]} lineBuilder={lineBuilder}/>
                })}
            </g>
        </svg>
    </>
}

class ChartInternalState {

    setData: (data: { [key:string]: {x: number, y: number}[]}) => void;
    constructor(dataSetter: (data: { [key:string]: {x: number, y: number}[]}) => void)  {
        this.setData = dataSetter;
    }

    timeOffset: number | undefined = undefined;
    dataSeries: { [key: string]: ChartPoint[]} = {};

    updateData = (chartData: ChartData[], seconds: number | undefined) => {
        if(seconds) {
            let now = performance.now();
            if(!this.timeOffset) {
                this.timeOffset = now - seconds*1000;
                // console.log("chart time offset: " + this.timeOffset);
            }

            for(var x of chartData) {
                if(x.value != undefined) {
                    if(this.dataSeries[x.label]) {
                        let dataSeries = this.dataSeries[x.label];
                        let lastPoint = dataSeries[0];
                        if(lastPoint.x != seconds && lastPoint.y != x.value) {
                            dataSeries.unshift({x: seconds, y: x.value})
                            while(dataSeries.length > 2 && dataSeries[dataSeries.length - 2].x * 1000 + this.timeOffset < now - 10000) {
                                dataSeries.pop();    
                            }
                        }
                    } else {
                        this.dataSeries[x.label] = [{x: seconds, y: x.value}]
                    }
                }    
            }
        }
    }

    animationFrameCancelToken = 0;
    startAnimation = () => {
        if(!this.animationFrameCancelToken) {
            // console.log("start animation!");
            this.animationFrameCancelToken = requestAnimationFrame(this.animationCallback);
        } else {
            console.log("animation already started!");
        }
    }

    animationCallback = (_t: DOMHighResTimeStamp) => {
        let time = performance.now();
        let data: { [key: string]: ChartPoint[] } = {};
        for(var k in this.dataSeries) {
            let xformed = this.dataSeries[k].map( pt => {
                return {
                    x: (pt.x * 1000 + (this.timeOffset ? this.timeOffset : 0.0) - time)/1000,
                    y: pt.y ? pt.y : 0.0,
                };
            });
            data[k] = xformed;
            
        }
        //console.log(data);
        this.setData(data);
        this.animationFrameCancelToken = requestAnimationFrame(this.animationCallback);
    }

    stopAnimation = () => {
        if(this.animationFrameCancelToken) {
            // console.log("stop animation!")
            cancelAnimationFrame(this.animationFrameCancelToken);
            this.animationFrameCancelToken = 0;
        } else {
            console.log("animation already stopped!");
        }
    }

}

interface ChartPoint {
    x: number,
    y: number
}

function ChartLine(props: { color: string | undefined, points: ChartPoint[], lineBuilder: d3.Line<ChartPoint>}) {

    const path = props.points ? props.lineBuilder(props.points) : "";
    const stroke = props.color ? props.color : "black";
    return <path d={path ? path : undefined} stroke={stroke} fill="none" strokeWidth={2} />
}


function XAxis(props: { scale: d3.ScaleLinear<number, number>, pixelsPerTick: number }) {

    const range = props.scale.range();

    const ticks = useMemo(() => {
      const width = range[1] - range[0];
      const numberOfTicksTarget = Math.floor(width / props.pixelsPerTick);
  
      return props.scale.ticks(numberOfTicksTarget).map((value: number) => ({
        value,
        xOffset: props.scale(value),
      }));
    }, [props]);
  
    return (
      <>
        {/* Main horizontal line */}
        <path
          d={["M", range[0], 0, "L", range[1], 0].join(" ")}
          fill="none"
          stroke="currentColor"
        />
  
        {/* Ticks and labels */}
        {ticks.map((o: { value: number, xOffset: number }) => (
          <g key={o.value} transform={`translate(${o.xOffset}, 0)`}>
            <line y2={5} stroke="currentColor" />
            <text
              key={o.value}
              style={{
                fontSize: "10px",
                textAnchor: "middle",
                transform: "translateY(20px)",
              }}
            >
              {o.value}
            </text>
          </g>
        ))}
      </>
    );
}


function YAxis(props: {scale: d3.ScaleLinear<number, number>, pixelsPerTick: number}) {
    const range = props.scale.range();

    const ticks = useMemo(() => {
        const height = range[1]-range[0];
        const numberOfTicksTarget = Math.floor(height / props.pixelsPerTick);

        return props.scale.ticks(numberOfTicksTarget).map((value: number) => ({
            value, yOffset: props.scale(value),
        }));
    }, [props]);

    return (
        <>
            <path 
                d={["M", 0, range[0], "L", 0, range[1]].join(" ")}
                fill="none"
                stroke="currentColor"
            />

            {ticks.map((o: { value: number, yOffset: number }) => (
                <g key={o.value} transform={`translate(0, ${o.yOffset})`}>
                <line x2={5} stroke="currentColor" />
                <text
                    key={o.value}
                    style={{
                    fontSize: "10px",
                    textAnchor: "start",
                    transform: "translateX(10px)",
                    }}
                >
                    {o.value}
                </text>
                </g>
            ))}

        </>
    )
}