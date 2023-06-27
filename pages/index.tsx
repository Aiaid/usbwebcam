"use client"

// todo  about rotate 

import Image from 'next/image'
import Webcam from "react-webcam";
import React,{ useState, useRef, useCallback, useEffect} from 'react';
import { FullScreen, FullScreenHandle, useFullScreenHandle } from "react-full-screen";
import { Button, FloatButton , Modal, Space, Tabs, Typography} from 'antd';
import { FullscreenOutlined,InfoCircleOutlined, FullscreenExitOutlined,ReloadOutlined,
  RotateRightOutlined, AudioOutlined,AudioMutedOutlined,VideoCameraOutlined} from '@ant-design/icons';
import Head from 'next/head';
const { Title, Paragraph, Text, Link } = Typography;


export default function Home() {
  const [videoDeviceId, setVideoDeviceId] = useState<any>(null);
  const [videoDevices, setVideoDevices] = useState<Array<any>>([]);
  const [audioDeviceId, setAudioDeviceId] = useState<any>(null);
  const [audioDevices, setAudioDevices] = useState<Array<any>>([]);
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [inputWidth, setInputWidth] = useState(1920)
  const [inputHeight, setInputHeight] = useState(1080)
  const [rotate, setRotate] = useState(0)
  const [audio, setAudio] = useState(true)
  const [fullscreen, setFullscreen]=useState(false)
  const [hidden, setHidden]=useState(false)
  const [open, setOpen] = useState(false)
  const [about, setAbout] = useState(false)
  const [isIpad, setIsIpad] = useState(false)
  const [isIphone, setIsIphone] = useState(false)
  const [isInPWA, setIsInPWA] = useState(false)
  const webcamRef = useRef(null);
  const handle = useFullScreenHandle();
  const inputResolution=[[1920,1080],[1600,900],[1280,720],[848,480],[640,360],[1920,1440],[1600,1200],[1280,960],[640,480],[480,360]]
  var timeout:any;


  const handleDevices = (deviceInfos:Array<any>)=>{
    setVideoDevices(deviceInfos.filter(({ kind }) => kind === "videoinput"))
    setAudioDevices(deviceInfos.filter(({ kind }) => kind === "audioinput"))
  }



  useEffect(() => {
    function Delayhide(){
      clearTimeout(timeout)
      setHidden(false)
      timeout = setTimeout(()=>setHidden(true), 3000);
    }
    function handleResize() {
      setWidth(window.innerWidth )
      setHeight( window.innerHeight )
    }
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", Delayhide)
    handleResize()
    navigator.mediaDevices.enumerateDevices().then(handleDevices)
    setIsIphone(/iPhone/.test(navigator.platform))
    setIsIpad(/iPad/.test(navigator.platform)||navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    if(isInPWA){setRotate(270)}
    setIsInPWA(window.matchMedia('(display-mode: fullscreen)').matches)
    return () => { 
      window.removeEventListener("mousemove", Delayhide)
      window.removeEventListener("resize", handleResize)
    }
  }, [])


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
      
      <FloatButton.Group shape="square" style={{ right: 24, visibility:!fullscreen?"visible":"hidden" ,opacity:hidden?"0":"1", transition: "opacity .3s ease-in-out",  }}>
        <FloatButton icon={<InfoCircleOutlined />} onClick={()=>setAbout(true)} />
        <FloatButton icon={<VideoCameraOutlined />} onClick={()=>setOpen(true)} />
        <FloatButton icon={audio?<AudioOutlined />:<AudioMutedOutlined/>} onClick={()=>setAudio(!audio)}/>
        <FloatButton icon={<RotateRightOutlined />} onClick={()=>setRotate((rotate+90)%360)} />
        {!(isIphone||isInPWA)&&<FloatButton icon={<FullscreenOutlined />} onClick={enterFullscreen} />}
      </FloatButton.Group>
      <Modal
          open={open&&!fullscreen}
          onCancel={()=>setOpen(false)}
          // title="Camera"
          footer={[ <Button  onClick={()=>navigator.mediaDevices.enumerateDevices().then(handleDevices)}>{<ReloadOutlined />}</Button>]}
        >
          <Space direction="vertical">
            <Space align="start">
              <Space direction="vertical">
                <Title level={5}>Video Input</Title>
                {videoDevices.map((device,i) => (
                    <Button key={`${i}`} type={device.deviceId===videoDeviceId?"dashed":"default"} onClick={()=>setVideoDeviceId(device.deviceId)}>{device.label}</Button>
                  ))}

              </Space> 
              <Space direction="vertical">
                <Title level={5}>Audio Input</Title>
                {audioDevices.map((device,i) => (
                    <Button key={`${i}`} type={device.deviceId===audioDeviceId?"dashed":"default"} onClick={()=>setAudioDeviceId(device.deviceId)}>{device.label}</Button>
                  ))}

              </Space>
            </Space>
          
          <Title level={5}>Video Input Resolution</Title>
            <Space direction="vertical">
              {Array(Math.ceil(inputResolution.length/4)).fill(1).map((k,i) => (
                <Space key={`${i}`}>
                  {inputResolution.slice(i*4, i*4+4).map((res,j) => (
                    <Button key={`${i*4+j}`} type={JSON.stringify(res)==JSON.stringify([inputWidth,inputHeight])?"dashed":"default"}
                    onClick={()=>{setInputWidth(res[0]);setInputHeight(res[1])}}>{`${res[0]}x${res[1]}`}</Button>
                  ))}
                </Space>
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
          <Typography>
            <Title>USB webcam</Title>
            <Paragraph>A PWA app for viewing USB webcams or capture cards. With fellow feature:
            <ul>
              <li>
                Select Video input and resolution
              </li>
              <li>
                Select Audio input or mute
              </li>
              <li>
                Rotation
              </li>
              <li>
                PWA Offline mode
              </li>
            </ul>
            <Link href="https://github.com/Aiaid/usbwebcam">GitHub</Link>   <Link href="mailto:anend@live.com">Author</Link>
            </Paragraph>
            <Title level={2}>Known issues</Title>
            <Paragraph>
            <ul>
              <li>
              No full screen on iPhone
              <br/>
              Iphone safari and Chrome don't support fullscreen https://caniuse.com/fullscreen
              </li>
              <li>
              No full screen on IOS in PWA mode
              </li>
            </ul>
            </Paragraph>
          </Typography>
          
        </Modal>

      <FullScreen handle={handle} onChange={(state: boolean, handle: FullScreenHandle)=>{setFullscreen(state)}}>
        

        <FloatButton.Group shape="square" style={{ right: 24, visibility:fullscreen?"visible":"hidden",opacity:hidden?"0":"1", transition: "opacity .3s ease-in-out",  }}>
          <FloatButton icon={audio?<AudioOutlined />:<AudioMutedOutlined/>} onClick={()=>setAudio(!audio)}/>
          <FloatButton icon={<RotateRightOutlined />} onClick={()=>setRotate((rotate+90)%360)} />
          <FloatButton icon={<FullscreenExitOutlined />} onClick={exitFullscreen} />
        </FloatButton.Group>
   
       
        <Webcam style={{transitionDuration:"0.3s",
         transform:`rotate(${rotate}deg)  scale(${rotate%180==0?1:isIpad&&width>height?inputHeight/inputWidth:inputWidth/inputHeight})`,
         position:"absolute",top:`${rotate%180==0?0:isIpad&&width>height?(height-width*inputWidth/inputHeight)/2:(width*(inputWidth/inputHeight-inputHeight/inputWidth))/2}px`,
          display: "flex",margin:"auto", alignItems: "center"}} ref={webcamRef} height={height} width={width} audio={audio}
         videoConstraints={{ deviceId:videoDeviceId, height:{ideal:inputHeight},width:{ideal:inputWidth}}}
          audioConstraints={{ deviceId:audioDeviceId }}/>
      </FullScreen>

    
    </>

  )
}
