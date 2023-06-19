"use client"

// todo  about fill/contain/cover pwa-offline

import Image from 'next/image'
import Webcam from "react-webcam";
import React,{ useState, useRef, useCallback, useEffect} from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Button, FloatButton , Modal, Space, Tabs, Typography} from 'antd';
import { FullscreenOutlined,InfoCircleOutlined, FullscreenExitOutlined,AudioOutlined,AudioMutedOutlined,VideoCameraOutlined} from '@ant-design/icons';
import Head from 'next/head';
const { Title } = Typography;


export default function Home() {
  const [videoDeviceId, setVideoDeviceId] = useState<any>(null);
  const [videoDevices, setVideoDevices] = useState<Array<any>>([]);
  const [audioDeviceId, setAudioDeviceId] = useState<any>(null);
  const [audioDevices, setAudioDevices] = useState<Array<any>>([]);
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [audio, setAudio] = useState(true)
  const [fullscreen, setFullscreen]=useState(false)
  const [open, setOpen] = useState(false);
  const [about, setAbout] = useState(false);
  const webcamRef = useRef(null);
  const handle = useFullScreenHandle();



  const handleDevices = (deviceInfos:Array<any>)=>{
    setVideoDevices(deviceInfos.filter(({ kind }) => kind === "videoinput"))
    setAudioDevices(deviceInfos.filter(({ kind }) => kind === "audioinput"))
  }

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth )
      setHeight( window.innerHeight )
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
      
      <FloatButton.Group shape="square" style={{ right: 24, visibility:!fullscreen?"visible":"hidden"  }}>
        <FloatButton icon={<InfoCircleOutlined />} onClick={()=>setAbout(true)} />
        <FloatButton icon={<VideoCameraOutlined />} onClick={()=>setOpen(true)} />
        <FloatButton icon={audio?<AudioOutlined />:<AudioMutedOutlined/>} onClick={()=>setAudio(!audio)}/>
        <FloatButton icon={<FullscreenOutlined />} onClick={enterFullscreen} />
      </FloatButton.Group>
      <Modal
          open={open&&!fullscreen}
          onCancel={()=>setOpen(false)}
          // title="Camera"
          footer={null}
        >
          <Space direction="vertical">
          <Title level={5}>Video Input</Title>
            <Space direction="vertical">
              {videoDevices.map((device,i) => (
                  <Button  type={device.deviceId===videoDeviceId?"dashed":"default"} onClick={()=>setVideoDeviceId(device.deviceId)}>{device.label}</Button>
                ))}

            </Space>
            <Title level={5}>Audio Input</Title>
            <Space direction="vertical">
              {audioDevices.map((device,i) => (
                  <Button  type={device.deviceId===audioDeviceId?"dashed":"default"} onClick={()=>setAudioDeviceId(device.deviceId)}>{device.label}</Button>
                ))}

            </Space>
          </Space>
          
        </Modal>
        <Modal
          open={about&&!fullscreen}
          onCancel={()=>setAbout(false)}
          // title="About"
          footer={null}
        >
          <Tabs
            defaultActiveKey="1"
            centered
            items={[ 
              {
                label: `About`,
                key: "about",
                children: `Content of Tab Pane 1`,
              },
              {
                label: `FAQ`,
                key: "faq",
                children: `Content of Tab Pane 1`,
              },
              {
                label: `LICENSE`,
                key: "LICENSE",
                children: `Content of Tab Pane 1`,
              },
            ]}
          />
          
        </Modal>

      <FullScreen handle={handle}>
        

        <FloatButton.Group shape="square" style={{ right: 24, visibility:fullscreen?"visible":"hidden"  }}>
          <FloatButton icon={audio?<AudioOutlined />:<AudioMutedOutlined/>} onClick={()=>setAudio(!audio)}/>
          <FloatButton icon={<FullscreenExitOutlined />} onClick={exitFullscreen} />
        </FloatButton.Group>
   
       
        <Webcam  ref={webcamRef} height={height} width={width} audio={audio} videoConstraints={{ deviceId:videoDeviceId }} audioConstraints={{ deviceId:audioDeviceId }}/>
      </FullScreen>

    
    </>

  )
}
