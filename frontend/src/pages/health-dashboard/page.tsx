import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { regionData, gwrCoefficients } from '../../mocks/gwrData';

const HealthDashboard = () => {
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const searchRegion = () => {
    if (!searchAddress.trim()) {
      alert('주소를 입력해주세요.');
      return;
    }

    // 간단한 주소 매칭 (실제로는 더 정교한 지오코딩 필요)
    const region = regionData.find(r => 
      r.regionName.includes(searchAddress) || 
      searchAddress.includes(r.regionName.split(' ').pop() || '')
    );

    if (!region) {
      alert('해당 지역을 찾을 수 없습니다. 다른 주소로 시도해보세요.');
      return;
    }

    setSelectedRegion(region);

    // 해당 지역의 GWR 계수 중 절댓값이 큰 순으로 추천
    const regionCoeffs = gwrCoefficients.filter(c => c.regionCode === region.regionCode);
    const sortedRecommendations = regionCoeffs
      .sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient))
      .slice(0, 3)
      .map(coeff => ({
        ...coeff,
        impact: Math.abs(coeff.coefficient),
        direction: coeff.coefficient > 0 ? 'increase' : 'decrease',
        recommendation: generateRecommendation(coeff.variable, coeff.coefficient, coeff.dependentVar)
      }));

    setRecommendations(sortedRecommendations);
  };

  const generateRecommendation = (variable: string, coefficient: number, dependentVar: string) => {
    const isObesity = dependentVar === 'obesity';
    const healthIndicator = isObesity ? '비만' : '우울감';
    const direction = coefficient > 0 ? '증가' : '감소';
    
    const recommendations: { [key: string]: string } = {
      '주점업 수': coefficient > 0 
        ? `주점업 밀도가 높아 ${healthIndicator} 위험이 증가합니다. 건강한 식음료 업소 확대를 권장합니다.`
        : `주점업 수 조절이 ${healthIndicator} 개선에 도움이 됩니다.`,
      '체육시설 수': coefficient < 0 
        ? `체육시설 확충이 ${healthIndicator} 감소에 매우 효과적입니다. 지역 내 운동시설 확대를 권장합니다.`
        : `체육시설 이용 활성화 프로그램이 필요합니다.`,
      '공원 면적': coefficient < 0 
        ? `녹지 공간 확대가 ${healthIndicator} 개선에 도움이 됩니다. 공원 조성 및 확장을 권장합니다.`
        : `기존 공원의 활용도 제고가 필요합니다.`,
      '편의점 수': coefficient > 0 
        ? `편의점 밀도가 높아 건강하지 않은 식품 접근성이 높습니다. 건강식품 코너 확대를 권장합니다.`
        : `편의점의 건강식품 판매 확대가 도움이 됩니다.`
    };

    return recommendations[variable] || `${variable} 관리를 통한 ${healthIndicator} 개선이 가능합니다.`;
  };

  const getGrade = (value: number, type: 'obesity' | 'depression') => {
    const thresholds = type === 'obesity' 
      ? { A: 20, B: 23, C: 26, D: 30 }
      : { A: 4, B: 5.5, C: 7, D: 9 };

    if (value <= thresholds.A) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-50' };
    if (value <= thresholds.B) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (value <= thresholds.C) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (value <= thresholds.D) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const calculateImpactPopulation = (coefficient: number, population: number) => {
    // 1단위 변화 시 영향받는 인구 수 계산
    const impactRate = Math.abs(coefficient) * 0.1; // 10% 변화 가정
    return Math.round(impactRate * population);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">우리 동네 건강 진단</h1>
          <p className="text-lg text-gray-600">
            주소를 검색하여 해당 지역의 건강 현황을 진단하고 맞춤형 정책 제언을 받아보세요.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="예: 종로구, 중구, 용산구 등"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                onKeyPress={(e) => e.key === 'Enter' && searchRegion()}
              />
            </div>
            <button
              onClick={searchRegion}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium whitespace-nowrap cursor-pointer"
            >
              <i className="ri-search-line mr-2"></i>
              지역 검색
            </button>
          </div>
        </div>

        {selectedRegion ? (
          <div className="space-y-8">
            {/* 지역 정보 및 건강 등급 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedRegion.regionName}</h2>
                <div className="text-sm text-gray-500">
                  인구: {selectedRegion.population.toLocaleString()}명
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 비만율 */}
                <div className="text-center">
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {selectedRegion.obesityRate}%
                    </div>
                    <div className="text-lg text-gray-600">비만율</div>
                  </div>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full ${getGrade(selectedRegion.obesityRate, 'obesity').bg}`}>
                    <span className={`text-2xl font-bold ${getGrade(selectedRegion.obesityRate, 'obesity').color}`}>
                      {getGrade(selectedRegion.obesityRate, 'obesity').grade}등급
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    전국 평균: 24.2%
                  </div>
                </div>

                {/* 우울감 경험률 */}
                <div className="text-center">
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {selectedRegion.depressionRate}%
                    </div>
                    <div className="text-lg text-gray-600">우울감 경험률</div>
                  </div>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full ${getGrade(selectedRegion.depressionRate, 'depression').bg}`}>
                    <span className={`text-2xl font-bold ${getGrade(selectedRegion.depressionRate, 'depression').color}`}>
                      {getGrade(selectedRegion.depressionRate, 'depression').grade}등급
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    전국 평균: 5.7%
                  </div>
                </div>
              </div>
            </div>

            {/* GWR 기반 맞춤 제언 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                <i className="ri-lightbulb-line mr-2 text-yellow-500"></i>
                GWR 기반 맞춤 제언
              </h2>

              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            rec.direction === 'decrease' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <i className={`${
                              rec.direction === 'decrease' ? 'ri-arrow-down-line text-green-600' : 'ri-arrow-up-line text-red-600'
                            }`}></i>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{rec.variable}</h3>
                            <div className="text-sm text-gray-500">
                              영향력: {rec.impact.toFixed(4)} | p-value: {rec.pValue.toFixed(3)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            우선순위 {index + 1}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{rec.recommendation}</p>
                      
                      {/* 정책 효과 직관화 */}
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-sm text-blue-800">
                          <strong>예상 효과:</strong> 해당 정책 시행 시 주민 약{' '}
                          <strong className="text-blue-600">
                            {calculateImpactPopulation(rec.coefficient, selectedRegion.population).toLocaleString()}명
                          </strong>
                          의 {rec.dependentVar === 'obesity' ? '비만' : '우울감'}에 영향을 미칠 것으로 예상됩니다.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="ri-information-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">해당 지역의 GWR 계수 데이터가 부족합니다.</p>
                </div>
              )}
            </div>

            {/* 지역 비교 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">전국 평균 대비 현황</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">비만율 비교</h3>
                  <div className="relative">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>우수</span>
                      <span>전국 평균 (24.2%)</span>
                      <span>개선 필요</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          selectedRegion.obesityRate <= 24.2 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((selectedRegion.obesityRate / 35) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-center mt-2">
                      <span className={`text-sm font-medium ${
                        selectedRegion.obesityRate <= 24.2 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        전국 평균보다 {Math.abs(selectedRegion.obesityRate - 24.2).toFixed(1)}%p{' '}
                        {selectedRegion.obesityRate <= 24.2 ? '낮음' : '높음'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">우울감 경험률 비교</h3>
                  <div className="relative">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>우수</span>
                      <span>전국 평균 (5.7%)</span>
                      <span>개선 필요</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          selectedRegion.depressionRate <= 5.7 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((selectedRegion.depressionRate / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-center mt-2">
                      <span className={`text-sm font-medium ${
                        selectedRegion.depressionRate <= 5.7 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        전국 평균보다 {Math.abs(selectedRegion.depressionRate - 5.7).toFixed(1)}%p{' '}
                        {selectedRegion.depressionRate <= 5.7 ? '낮음' : '높음'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <i className="ri-map-pin-line text-6xl text-gray-300 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">지역을 검색해보세요</h2>
            <p className="text-gray-600 mb-8">
              위의 검색창에 지역명을 입력하면 해당 지역의 건강 현황과<br />
              맞춤형 정책 제언을 확인할 수 있습니다.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-gray-50 rounded-lg p-4">
                <i className="ri-heart-pulse-line text-2xl text-red-500 mb-3"></i>
                <h3 className="font-semibold text-gray-900 mb-2">건강 현황 진단</h3>
                <p className="text-sm text-gray-600">
                  지역별 비만율과 우울감 경험률을 전국 평균과 비교하여 등급으로 제시
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <i className="ri-lightbulb-line text-2xl text-yellow-500 mb-3"></i>
                <h3 className="font-semibold text-gray-900 mb-2">맞춤형 제언</h3>
                <p className="text-sm text-gray-600">
                  GWR 계수 분석을 통한 지역별 건강 개선 방안 우선순위 제시
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <i className="ri-group-line text-2xl text-blue-500 mb-3"></i>
                <h3 className="font-semibold text-gray-900 mb-2">정책 효과 예측</h3>
                <p className="text-sm text-gray-600">
                  정책 시행 시 영향받을 주민 수를 구체적 수치로 제시
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HealthDashboard;