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
import SchoolLifeScene from './school-life-scene';

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
                웹은 정보 교환의 핵심 도구입니다. 웹 브라우저를 통해 정보를
                검색하고 공유합니다. 최근에는 모바일 앱, 정부 시스템, 인프라
                관리, 심지어 게임 개발에도 웹 기술이 활용되고 있습니다.
              </p>
              <p>
                웹은 인터넷을 통해 일상생활의 다양한 활동을 연결합니다. 배달
                주문, 택시 호출, 소통, 정보 공유 등이 가능해졌습니다.
                ChatGPT와의 연결도 웹 기술 덕분입니다.
              </p>
            </div>
          </div>
          <div className='flex h-[80vh] w-full items-center justify-end p-24 [text-shadow:_0_1px_12px_black] max-md:p-12'>
            <div className='flex max-w-[700px] flex-col items-start'>
              <h2 className='text-4xl'>웹은 세상을 변화시키고 있습니다.</h2>
              <p>웹 개발자들은 조직의 업무 방식을 혁신하고 있습니다.</p>
              <p>
                웹 개발자는 서비스 개발을 넘어 조직의 프로세스와 문화를
                변화시킵니다. 안정적인 서비스와 신속한 고객 피드백 반영을 위해
                최적의 업무 방식을 고안합니다. 업무의 세분화, 효율적 방식 선택,
                반복 작업 공통화는 타 직군의 프로세스 개선에도 영향을 줍니다.
                이로 인해 개발자 고용이 늘고, 개발자 업무도구가 비개발 직군에도
                확산되고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className='relative flex min-h-[100vh] items-center justify-center p-16 max-md:px-10 max-md:py-16'>
        <div className='absolute left-0 top-0 z-[-1] h-full w-full'>
          <SchoolLifeScene />
        </div>
        <div className='grid grid-cols-[max-content_1fr] gap-x-12 gap-y-16 max-lg:grid-cols-1 max-md:gap-y-6'>
          <h2 className='text-5xl max-md:text-2xl'>
            그래픽 아티스트로 시작해,
            <br />웹 개발자가 되다.
          </h2>
          <ul>
            <li>유년 시절 프로그래밍과 게임 개발을 간접적으로 경험</li>
            <li>중학교때 게임 그래픽 아티스트를 꿈꾸고 학교에 진학</li>
            <li>다양한 공모전 활동으로 웹 개발에 흥미를 느끼기 시작</li>
            <li>3D 그래픽 아티스트에서 웹 개발자로 진로 변경</li>
          </ul>
          <h3 className='text-end text-3xl max-lg:text-start max-md:text-2xl'>
            출전 및 외부 활동
          </h3>
          <ul>
            <li>2017 SK Planet SmarteenAppChallenge</li>
            <li>2018 SK Planet SmarteenAppChallenge</li>
            <li>2017~2019 공간정보 컨퍼런스</li>
            <li>해외 문화 체험 프로그램</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
