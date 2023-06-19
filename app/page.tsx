"use client"

// todo !悬浮按钮 !静音 !选择摄像头 权限 !webapp about

import Image from 'next/image'
import Webcam from "react-webcam";
import React,{ useState, useRef, useCallback, useEffect} from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Button, FloatButton , Modal, Space} from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined,AudioOutlined,AudioMutedOutlined,VideoCameraOutlined} from '@ant-design/icons';
import Head from 'next/head';


export default function Home() {
  const [deviceId, setDeviceId] = useState<any>(null);
  const [devices, setDevices] = useState<Array<any>>([]);
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [audio, setAudio] = useState(false)
  const [fullscreen, setFullscreen]=useState(false)
  const [open, setOpen] = useState(false);
  const webcamRef = useRef(null);
  const handle = useFullScreenHandle();





  useEffect(() => {
    function handleResize() {
      setWidth(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0))
      setHeight(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0))
    }
    const handleDevices = (deviceInfos:Array<any>)=>{
      if(deviceInfos.length!=devices.length){
        setDevices(deviceInfos.filter(({ kind }) => kind === "videoinput"))
      }
    }
    
    window.addEventListener("resize", handleResize)
    
    handleResize()
    navigator.mediaDevices.enumerateDevices().then(handleDevices)
    return () => { 
      window.removeEventListener("resize", handleResize)
    }
  }, [setWidth,setHeight,setDevices])


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
        <link rel="manifest" href="/manifest.json" />
      </Head>
      
      <FloatButton.Group shape="square" style={{ right: 24, visibility:!fullscreen?"visible":"hidden"  }}>
        <FloatButton icon={<VideoCameraOutlined />} onClick={()=>setOpen(true)} />
        <FloatButton icon={audio?<AudioOutlined />:<AudioMutedOutlined/>} onClick={()=>setAudio(!audio)}/>
        <FloatButton icon={<FullscreenOutlined />} onClick={enterFullscreen} />
      </FloatButton.Group>
      <Modal
          open={open&&!fullscreen}
          onCancel={()=>setOpen(false)}
          title="Camera"
          footer={null}
        >
          <Space direction="vertical">
             {devices.map((device) => (
                <Button type={device.deviceId===deviceId?"dashed":"default"} onClick={()=>setDeviceId(device.deviceId)}>{device.label}</Button>
              ))}

             </Space>
        </Modal>

      <FullScreen handle={handle}>
        

        <FloatButton.Group shape="square" style={{ right: 24, visibility:fullscreen?"visible":"hidden"  }}>
          <FloatButton icon={audio?<AudioOutlined />:<AudioMutedOutlined/>} onClick={()=>setAudio(!audio)}/>
          <FloatButton icon={<FullscreenExitOutlined />} onClick={exitFullscreen} />
        </FloatButton.Group>
   
       
        <Webcam ref={webcamRef} height={height} width={width} audio={audio} videoConstraints={{ deviceId:deviceId }}/>
      </FullScreen>

    
    </>

  )
}
