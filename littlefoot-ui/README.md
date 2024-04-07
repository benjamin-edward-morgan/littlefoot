### littlefoot-ui 
This is web UI using React that acts as the remote control and shows the camera live feet, telemetry data etc. See [README_VITE.md](README_VITE.md) for more information about vite + react. 

This expects:
- /ws to be an ioc websocket url
- /stream to be an mjpeg stream

It should be packaged with `npm run build` and placed in the `assets` directoy on the raspberry pi, alongside littlefoot.yml and the ioc binary. 

You can also use `npm run dev` and run the IOC sever locally. By default npm will proxy to `localhost:8080` but that can be configured in `vite.config.ts`

