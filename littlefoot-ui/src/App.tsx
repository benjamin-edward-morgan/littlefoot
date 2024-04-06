import useIocWebsocketClient from './ioc/IocWebsocketClient';
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import ImuCharts from "./panes/ImuCharts";
import LightControls from "./panes/LightControls";
import Settings from "./panes/Settings";
import OtherSensors from "./panes/OtherSensors";
import LiveStream from "./panes/LiveStream";
import DriveLookControls from "./panes/DriveLookControls";

export default function App() {

  const websocketUrl = "ws://" + window.location.host + "/ws";
  const streamImageUrl = "http://" + window.location.host + "/stream";
  
  const [ioc, setter] = useIocWebsocketClient(websocketUrl);

  return (
    <>
      <Header title="littlefoot" />
      <div className="content">
        <div className="panela">
          <LiveStream streamUrl={streamImageUrl} />
        </div>
        <div className="panelb">
          <DriveLookControls ioc={ioc} setter={setter}/>
          <ImuCharts ioc={ioc}/>
          <OtherSensors ioc={ioc}/>
          <LightControls ioc={ioc} setter={setter}/>
          <Settings ioc={ioc} setter={setter}/>
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}