import MainSectionScene from './main-section-scene';
import CareerCard from './career-card';
import CareerSectionScene from './career-section-scene';
import WebDeveloperScene from './web-developer-scene';
import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
} from 'framer-motion';

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.p className='text-9xl'>
      <motion.span>{display}</motion.span>
      <span>%</span>
    </motion.p>
  );
}

export default function HomePage() {
  const { progress } = useProgress();
  const [complate, setComplate] = useState(false);
  const webDeveloperRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setComplate(true);
      }, 1500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [progress]);

  return (
    <main>
      <AnimatePresence>
        {!complate && (
          <motion.div
            key='progress'
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed left-0 top-0 z-10 flex h-[100vh] w-[100vw] items-end justify-start bg-black text-start text-white'>
            <AnimatedNumber value={progress} />
          </motion.div>
        )}
      </AnimatePresence>
      <section className='p-[68px] max-md:p-[16px]'>
        <div className='relative flex h-[80vh] min-h-[400px] items-center justify-center overflow-hidden rounded-3xl'>
          <MainSectionScene />
          <div className='absolute flex flex-col items-end text-white'>
            <h1 className='text-9xl max-lg:text-7xl max-md:text-5xl'>
              Web Developer
            </h1>
            <p className='font-semibolds text-4xl'>Gyeongtae Gim</p>
          </div>
        </div>
      </section>
      <section className='relative'>
        <div className='flex flex-col items-center justify-center gap-24 px-[80px] py-[160px] max-md:px-[16px] max-md:py-[64px]'>
          <CareerCard
            company='FESCARO'
            duration='2018-2022'
            description='자율 주행 사이버 보안 서비스 개발'
            tasks={[
              '차량 해킹 탐지 능력 평가 시뮬레이터 개발 → 납품',
              '차량 해킹 관제 시스템 개발',
              '차량 통신 인증서 관리 및 모듈 인증 서비스 개발',
              '형상관리, 업무 관리 도구 및 사내 내부 클라우드 인프라 구축 및 운영',
            ]}
            image='/fescaro.png'
          />
          <CareerCard
            company='Hilokal'
            duration='3개월(파트타임)'
            description='다국어 언어 교환 서비스 개발'
            tasks={[
              '악의적 사용자 채팅 기계 학습 필터 개발',
              '글로벌 원격 근무 경험',
            ]}
            image='/students.jpg'
            reserved
          />
          <CareerCard
            company='RSQUARE'
            duration='2022-2023'
            description='상업용 부동산 서비스 개발'
            tasks={[
              '상업용 부동산 탐색 서비스(지도, 자동추천) 개발',
              '상업용 부동산 등록 서비스 개발',
              '상업용 부동산 시장 분석 서비스(지도, 분석, 통계) 개발',
              '지도 라이브러리 데모 및 개발 가이드 작성',
            ]}
            image='/rsquare.png'
          />
          <CareerCard
            company='SOCAR'
            duration='2023-2024(재직중)'
            description='웹 기술 조직 역량 강화 및 숙박 서비스 개발'
            tasks={[
              '숙박 서비스 운영 및 개발, 통합결제시스템 도입',
              '숙박 - 관공서 및 내부 프로모션 개발 및 운영',
              '기술조직 - monorepo 환경 구축 및 운영',
              '기술조직 - 로깅 자동화 시스템 개발',
              '기술조직 - 관공서 및 내부 프로모션 자동화 및 관리 어드민 개발',
              '기술조직 - 숙박 찜하기 및 지도 서비스 데모, 자체 지도 서비스 데모',
            ]}
            image='/socar.jpg'
            reserved
          />
        </div>
        <div className='sticky bottom-0 left-0 z-[-1] h-[0] w-[100vw]'>
          <div className='absolute bottom-0 left-0 h-[100vh] w-[100vw]'>
            <CareerSectionScene />
          </div>
        </div>
      </section>
      <section
        ref={webDeveloperRef}
        className='relative h-[300vh] bg-black text-white'>
        <div className='sticky left-0 top-0 h-[100vh] w-full'>
          <WebDeveloperScene container={webDeveloperRef} />
        </div>
        <div className='absolute top-0 flex h-full w-full flex-col items-center justify-center'>
          <div className='flex h-[100vh] items-center justify-center'>
            <h1 className='text-center text-9xl max-lg:text-7xl'>
              We connect the world
            </h1>
          </div>
          <div className='flex h-[80vh] w-full items-center justify-start p-24 [text-shadow:_0_1px_12px_black] max-md:p-12'>
            <div className='flex max-w-[700px] flex-col items-start'>
              <h2 className='text-4xl'>우리는 웹으로 세상을 연결합니다.</h2>
              <p>
                웹은 정보 교환의 핵심 도구입니다. 웹 브라우저를 통해 다양한
                사이트에서 정보를 검색하고 공유합니다. 최근에는 모바일 앱, 정부
                시스템, 인프라 관리 등 광범위한 분야에서 웹 기술이 활용되고
                있습니다. 심지어 게임 개발에도 웹 기술이 적용되고 있습니다.
              </p>
              <p>
                인터넷을 통해서 가게에 배달 주문을 하고, 택시를 부르고, 사랑하는
                사람들에게 안부를 전하고, 새로운 소식을 듣기도 합니다. 서로
                연결되어있지 않은 세상을 웹으로 연결합니다. 여러분들이 거대한
                서버 프레임과 클라우드 인프라 속에 점차 성장하고 있는 ChatGPT와
                연결되는 것도 모두 웹 기술 덕분입니다.
              </p>
            </div>
          </div>
          <div className='flex h-[80vh] w-full items-center justify-end p-24 [text-shadow:_0_1px_12px_black] max-md:p-12'>
            <div className='flex max-w-[700px] flex-col items-start'>
              <h2 className='text-4xl'>연결은 세상을 움직이는 힘입니다.</h2>
              <p>
                웹 개발자들이 조직이 일하는 방식을 완전히 새롭게 바꾸고
                있습니다.
              </p>
              <p>
                웹 개발자는 단순히 웹 서비스를 개발하는 것을 넘어, 조직과 제품의
                프로세스와 문화를 혁신하는 중요한 역할을 수행합니다.
                엔지니어로서 안정적인 서비스 개발과 고객 피드백의 신속한 반영을
                위해 최적의 업무 방식을 고민합니다. 업무를 작은 단위로 나누고,
                효율적인 방식을 선택하며, 반복 업무를 공통화하는 특성은 타
                직군의 업무 프로세스 개선에도 영향을 미칩니다. 이로 인해 개발자
                고용이 증가하고, 개발자들이 사용하는 업무도구(노션, 슬랙, 지라
                등)가 비개발자 직군에도 빠르게 확산되고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
