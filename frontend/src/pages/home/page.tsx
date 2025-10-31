import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

const Home = () => {
  const features = [
    {
      title: 'GWR 기반 정책 시뮬레이터',
      description: '지역별 GWR 계수를 활용하여 정책 변화가 건강 지표에 미치는 영향을 예측하고 시뮬레이션합니다.',
      icon: 'ri-calculator-line',
      href: '/policy-simulator',
      color: 'bg-blue-500'
    },
    {
      title: '지역별 영향력 지도',
      description: '선택한 변수가 건강 지표에 미치는 영향력을 지역별로 시각화하여 인터랙티브 지도로 제공합니다.',
      icon: 'ri-map-2-line',
      href: '/region-map',
      color: 'bg-green-500'
    },
    {
      title: '우리 동네 건강 진단',
      description: '주소 검색을 통해 해당 지역의 건강 현황을 진단하고 맞춤형 정책 제언을 제공합니다.',
      icon: 'ri-heart-pulse-line',
      href: '/health-dashboard',
      color: 'bg-red-500'
    },
    {
      title: '지역 정책 제안 투표',
      description: '지역 주민들이 직접 정책을 제안하고 투표할 수 있는 참여형 플랫폼을 제공합니다.',
      icon: 'ri-vote-line',
      href: '/policy-voting',
      color: 'bg-purple-500'
    }
  ];

  const stats = [
    { label: '분석 가능 지역', value: '229개', description: '전국 시군구' },
    { label: 'GWR 계수', value: '1,374개', description: '지역별 변수 계수' },
    { label: '물리적 요인', value: '6개', description: '건강 영향 변수' },
    { label: '예측 정확도', value: '87%', description: '평균 R² 값' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20data%20visualization%20dashboard%20with%20interactive%20maps%20and%20charts%20showing%20health%20statistics%20and%20policy%20analysis%2C%20clean%20professional%20interface%20with%20blue%20and%20white%20color%20scheme%2C%20high-tech%20analytics%20platform%2C%20sophisticated%20data%20science%20visualization&width=1920&height=800&seq=hero-bg&orientation=landscape')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-blue-900/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              GWR 기반 정책 분석 플랫폼
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              지리가중회귀(GWR) 모델을 활용하여 지역별 건강 정책의 효과를 예측하고 
              데이터 기반 의사결정을 지원하는 통합 분석 시스템
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/policy-simulator"
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                정책 시뮬레이션 시작하기
              </Link>
              <Link
                to="/health-dashboard"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors whitespace-nowrap cursor-pointer"
              >
                우리 동네 건강 진단
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              주요 기능
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              GWR 모델 기반의 정교한 분석 도구들로 지역별 건강 정책의 효과를 
              과학적으로 예측하고 최적의 정책 방향을 제시합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.href}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <i className={`${feature.icon} text-white text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-4 flex items-center text-blue-600 font-medium">
                      <span>자세히 보기</span>
                      <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            데이터 기반 정책 결정을 시작하세요
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            과학적 근거에 기반한 정책 분석으로 더 효과적인 지역 건강 정책을 수립하고 
            주민들의 삶의 질을 향상시킬 수 있습니다.
          </p>
          <Link
            to="/policy-simulator"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap cursor-pointer inline-block"
          >
            지금 시작하기
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;