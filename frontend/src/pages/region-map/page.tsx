import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { physicalFactors, dependentVariables, gwrCoefficients, regionData } from '../../mocks/gwrData';

const RegionMap = () => {
  const [selectedVariable, setSelectedVariable] = useState('주점업 수');
  const [selectedDependent, setSelectedDependent] = useState('obesity');
  const [mapData, setMapData] = useState<any[]>([]);

  useEffect(() => {
    // 선택된 변수에 따른 지도 데이터 업데이트
    const data = regionData.map(region => {
      const coefficient = gwrCoefficients.find(
        c => c.regionCode === region.regionCode && 
             c.variable === selectedVariable && 
             c.dependentVar === selectedDependent
      );
      
      return {
        ...region,
        coefficient: coefficient?.coefficient || 0,
        pValue: coefficient?.pValue || 1,
        localR2: coefficient?.localR2 || 0
      };
    });
    
    setMapData(data);
  }, [selectedVariable, selectedDependent]);

  const getColorIntensity = (coefficient: number) => {
    const absCoeff = Math.abs(coefficient);
    if (absCoeff >= 0.04) return coefficient > 0 ? 'bg-red-600' : 'bg-blue-600';
    if (absCoeff >= 0.03) return coefficient > 0 ? 'bg-red-500' : 'bg-blue-500';
    if (absCoeff >= 0.02) return coefficient > 0 ? 'bg-red-400' : 'bg-blue-400';
    if (absCoeff >= 0.01) return coefficient > 0 ? 'bg-red-300' : 'bg-blue-300';
    return 'bg-gray-200';
  };

  const getIntensityLabel = (coefficient: number) => {
    const absCoeff = Math.abs(coefficient);
    if (absCoeff >= 0.04) return '매우 높음';
    if (absCoeff >= 0.03) return '높음';
    if (absCoeff >= 0.02) return '보통';
    if (absCoeff >= 0.01) return '낮음';
    return '매우 낮음';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">지역별 영향력 지도</h1>
          <p className="text-lg text-gray-600">
            선택한 변수가 건강 지표에 미치는 영향력을 지역별로 시각화합니다.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                독립 변수 (물리적 요인)
              </label>
              <select
                value={selectedVariable}
                onChange={(e) => setSelectedVariable(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {physicalFactors.map((factor) => (
                  <option key={factor.id} value={factor.name}>
                    {factor.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                종속 변수 (건강 지표)
              </label>
              <select
                value={selectedDependent}
                onChange={(e) => setSelectedDependent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dependentVariables.map((variable) => (
                  <option key={variable.id} value={variable.id}>
                    {variable.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedVariable} → {dependentVariables.find(v => v.id === selectedDependent)?.name} 영향력 지도
                </h2>
              </div>

              {/* 지도 영역 (Google Maps 임베드) */}
              <div className="relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.289!2d126.9780!3d37.5665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDMzJzU5LjQiTiAxMjbCsDU4JzQwLjgiRQ!5e0!3m2!1sko!2skr!4v1234567890"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
                
                {/* 지도 오버레이 - 지역별 데이터 포인트 */}
                <div className="absolute inset-0 pointer-events-none">
                  {mapData.map((region, index) => (
                    <div
                      key={region.regionCode}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
                      style={{
                        left: `${20 + (index % 3) * 30}%`,
                        top: `${30 + Math.floor(index / 3) * 25}%`
                      }}
                      title={`${region.regionName}: β=${region.coefficient.toFixed(4)}`}
                    >
                      <div className={`w-6 h-6 rounded-full ${getColorIntensity(region.coefficient)} opacity-80 hover:opacity-100 transition-opacity`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 범례 */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">영향력 범례</h3>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span>강한 음의 영향</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-blue-300 rounded"></div>
                    <span>약한 음의 영향</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span>영향 없음</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-red-300 rounded"></div>
                    <span>약한 양의 영향</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    <span>강한 양의 영향</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Region Details */}
          <div className="space-y-6">
            {/* 통계 요약 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">통계 요약</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">분석 지역 수:</span>
                  <span className="font-medium">{mapData.length}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">평균 계수:</span>
                  <span className="font-medium">
                    {(mapData.reduce((sum, d) => sum + d.coefficient, 0) / mapData.length).toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">최대 영향 지역:</span>
                  <span className="font-medium text-sm">
                    {mapData.reduce((max, d) => Math.abs(d.coefficient) > Math.abs(max.coefficient) ? d : max, mapData[0])?.regionName?.split(' ').pop()}
                  </span>
                </div>
              </div>
            </div>

            {/* 지역별 상세 정보 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">지역별 상세 정보</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {mapData
                  .sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient))
                  .map((region) => (
                    <div
                      key={region.regionCode}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {region.regionName.split(' ').slice(-1)[0]}
                        </h4>
                        <div className={`w-3 h-3 rounded-full ${getColorIntensity(region.coefficient)}`}></div>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>GWR 계수:</span>
                          <span className="font-medium">{region.coefficient.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>p-value:</span>
                          <span className="font-medium">{region.pValue.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>영향력:</span>
                          <span className="font-medium">{getIntensityLabel(region.coefficient)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>현재 {dependentVariables.find(v => v.id === selectedDependent)?.name}:</span>
                          <span className="font-medium">
                            {selectedDependent === 'obesity' ? region.obesityRate : region.depressionRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* 해석 가이드 */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">지도 해석 가이드</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">양의 계수 (빨간색)</h3>
              <p className="text-sm text-gray-600 mb-4">
                해당 변수가 증가할 때 건강 지표(비만율/우울감)도 함께 증가하는 지역입니다. 
                예를 들어, 주점업 수가 증가하면 비만율이 높아지는 경향을 보입니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">음의 계수 (파란색)</h3>
              <p className="text-sm text-gray-600 mb-4">
                해당 변수가 증가할 때 건강 지표가 감소하는 지역입니다. 
                예를 들어, 체육시설 수가 증가하면 비만율이 낮아지는 경향을 보입니다.
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>주의사항:</strong> p-value가 0.05보다 큰 경우 통계적으로 유의하지 않을 수 있으므로 
              해석 시 신중하게 고려해야 합니다. Local R²가 높을수록 해당 지역에서의 모델 설명력이 우수합니다.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegionMap;