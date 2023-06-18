"use client"

// todo !悬浮按钮 !静音 !选择摄像头 权限 !webapp about

import Image from 'next/image'
import Head from 'next/head'
import Webcam from "react-webcam";
import React,{ useState, useRef, useCallback, useEffect} from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { FloatButton } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined,AudioOutlined,AudioMutedOutlined,VideoCameraOutlined} from '@ant-design/icons';


export default function Home() {
  const [deviceId, setDeviceId] = useState<any>(null);
  const [devices, setDevices] = useState<Array<any>>([]);
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [audio, setAudio] = useState(false)
  const [fullscreen, setFullscreen]=useState(false)
  const webcamRef = useRef(null);
  const handle = useFullScreenHandle();


  const handleDevices = (deviceInfos:any)=>{
    var videoDevices:Array<any>=[]
    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo:any = deviceInfos[i];
      if (deviceInfo.kind === 'videoinput') {
        // setDeviceId(deviceInfo.deviceId)
        videoDevices.push(deviceInfo)
      }
    }
    setDevices(videoDevices)

  }



  useEffect(() => {
    function handleResize() {
      setWidth(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0))
      setHeight(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0))
    }
    
    window.addEventListener("resize", handleResize)
    
    handleResize()
    navigator.mediaDevices.enumerateDevices().then(handleDevices)
    
    return () => { 
      window.removeEventListener("resize", handleResize)
    }
  }, [setWidth,setHeight,handleDevices])


  function enterFullscreen(){
    handle.enter()
    setFullscreen(true)
  }
  function exitFullscreen(){
    handle.exit()
    setFullscreen(false)
  }

  return (
    <>
      <Head>
        <title>USB webcam</title>
      </Head>
      <FloatButton.Group
        shape="square"
        trigger="hover"
        type="primary"
        style={{ right: 74 }}
        icon={<VideoCameraOutlined />}
      >
        {devices.map((device) => (
          <FloatButton shape="square" description={device.label} onClick={()=>setDeviceId(device.deviceId)}/>
      ))}
      </FloatButton.Group>
      <FloatButton.Group shape="square" style={{ right: 24, visibility:!fullscreen?"visible":"hidden"  }}>
        <FloatButton icon={<FullscreenOutlined />} onClick={enterFullscreen} />
        <FloatButton icon={audio?<AudioOutlined />:<AudioMutedOutlined/>} onClick={()=>setAudio(!audio)}/>
      </FloatButton.Group>

      <FullScreen handle={handle}>
        <FloatButton.Group
          shape="square"
          trigger="hover"
          type="primary"
          style={{ right: 74 }}
          icon={<VideoCameraOutlined />}
        >
          {devices.map((device) => (
            <FloatButton shape="square" description={device.label} onClick={()=>setDeviceId(device.deviceId)}/>
        ))}
        </FloatButton.Group>
        <FloatButton.Group shape="square" style={{ right: 24, visibility:fullscreen?"visible":"hidden"  }}>
          <FloatButton icon={<FullscreenExitOutlined />} onClick={exitFullscreen} />
          <FloatButton icon={audio?<AudioOutlined />:<AudioMutedOutlined/>} onClick={()=>setAudio(!audio)}/>
        </FloatButton.Group>
        <Webcam ref={webcamRef} height={height} width={width} audio={audio} videoConstraints={{ deviceId:deviceId }}/>
      </FullScreen>

    
    </>

  )
}
