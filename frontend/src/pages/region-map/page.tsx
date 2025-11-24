import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Leaflet CSS 스타일 임포트
import Layout from '../../components/layout/Layout';
// 💡 regionData는 정적 데이터로 사용, gwrCoefficients는 제거(API 대체)
import { regionData, physicalFactors, dependentVariables } from '../../mocks/gwrData.ts';

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 지도 중심 좌표 변경을 위한 컴포넌트
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const RegionMap = () => {
  const [selectedVariable, setSelectedVariable] = useState('주점업 수');
  const [selectedDependent, setSelectedDependent] = useState('obesity');
  const [mapData, setMapData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 💡 [수정] API 호출을 통해 계수 데이터 로드
  useEffect(() => {
    const fetchCoefficients = async () => {
      setIsLoading(true);
      try {
        // 쿼리 파라미터 구성
        const params = new URLSearchParams({
          variable: selectedVariable,
          dependentVar: selectedDependent
        });

        // API 호출: 전체 지역의 해당 변수 계수 조회
        // (백엔드에 /api/gwr/coefficients/all 엔드포인트가 구현되어 있어야 함)
        const response = await fetch(`${API_BASE_URL}/api/gwr/coefficients/all?${params}`);

        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }

        const coefficients: any[] = await response.json();

        // 정적 지역 데이터(좌표 포함)와 API 계수 데이터 병합
        const mergedData = regionData.map(region => {
          // regionCode를 기준으로 매칭 (문자열/숫자 형변환 주의)
          const coeffData = coefficients.find(c => String(c.regionCode) === String(region.regionCode));

          return {
            ...region,
            // API 데이터가 있으면 사용, 없으면 0 (지도 표시 안 함/회색)
            coefficient: coeffData?.coefficient || 0,
            tValue: coeffData?.tvalue || 1,
            localR2: coeffData?.localR2 || 0
          };
        });

        setMapData(mergedData);

      } catch (error) {
        console.error("지도 데이터 로딩 오류:", error);
        alert("지도 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoefficients();
  }, [selectedVariable, selectedDependent]); // 변수 변경 시 재실행

  // 색상 결정 함수 (계수 값에 따라 파랑<->빨강 그라데이션)
  const getColor = (val: number) => {
    if (val > 0.5) return '#b2182b'; // 진한 빨강
    if (val > 0.1) return '#d6604d'; // 빨강
    if (val > 0.02) return '#f4a582'; // 연한 빨강
    if (val > -0.02) return '#999999'; // 회색 (영향 없음)
    if (val > -0.1) return '#92c5de'; // 연한 파랑
    if (val > -0.5) return '#4393c3'; // 파랑
    return '#2166ac'; // 진한 파랑
  };

  // 영향력 라벨
  const getIntensityLabel = (coefficient: number) => {
    const absCoeff = Math.abs(coefficient);
    if (absCoeff >= 0.5) return '매우 강함';
    if (absCoeff >= 0.1) return '강함';
    if (absCoeff >= 0.02) return '보통';
    return '약함/없음';
  };

  return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">지역별 영향력 지도</h1>
            <p className="text-lg text-gray-600">
              선택한 변수가 건강 지표에 미치는 영향력을 지도에 시각화합니다.
              (<span className="text-red-600 font-bold">빨강</span>: 증가 요인, <span className="text-blue-600 font-bold">파랑</span>: 감소 요인)
            </p>
          </div>

          {/* 컨트롤 패널 */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 z-10 relative border border-gray-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  독립 변수 (원인)
                </label>
                <select
                    value={selectedVariable}
                    onChange={(e) => setSelectedVariable(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {physicalFactors.map((factor) => (
                      <option key={factor.id} value={factor.name}>{factor.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종속 변수 (결과)
                </label>
                <select
                    value={selectedDependent}
                    onChange={(e) => setSelectedDependent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {dependentVariables.map((variable) => (
                      <option key={variable.id} value={variable.id}>{variable.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 지도 영역 */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 h-[600px] relative z-0">
              {/* 로딩 오버레이 */}
              {isLoading && (
                  <div className="absolute inset-0 z-[1000] bg-white/80 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-blue-600 font-medium">데이터를 불러오는 중...</p>
                  </div>
              )}

              <MapContainer
                  center={[36.5, 127.8]}
                  zoom={7}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
              >
                <ChangeView center={[36.5, 127.8]} zoom={7} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* 데이터 마커 렌더링 */}
                {mapData.map((region) => (
                    region.coordinates && region.coordinates.length === 2 && (
                        <CircleMarker
                            key={region.regionCode}
                            center={[region.coordinates[0], region.coordinates[1]]}
                            pathOptions={{
                              fillColor: getColor(region.coefficient),
                              color: 'white',
                              weight: 1,
                              opacity: 1,
                              fillOpacity: 0.8
                            }}
                            radius={8}
                        >
                          <Tooltip sticky>
                            <div className="text-sm p-1">
                              <p className="font-bold mb-1 text-gray-900">{region.regionName}</p>
                              <div className="space-y-1 text-gray-700">
                                <p>
                                  <span className="font-semibold">GWR 계수(β):</span>{' '}
                                  <span className={region.coefficient > 0 ? 'text-red-600' : 'text-blue-600'}>
                              {region.coefficient.toFixed(4)}
                            </span>
                                </p>
                                <p><span className="font-semibold">영향력:</span>
                                  {getIntensityLabel(region.coefficient)}</p>
                                <p><span className="font-semibold">t-value:</span> {region.tValue?.toFixed(3)}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  (절댓값 2.7 이상일 때 유의미)
                                </p>
                              </div>
                            </div>
                          </Tooltip>
                        </CircleMarker>
                    )
                ))}
              </MapContainer>

              {/* 범례 */}
              <div className="absolute bottom-6 right-6 bg-white/95 p-4 rounded-lg shadow-md z-[500] text-xs pointer-events-none border border-gray-200">
                <h4 className="font-bold mb-3 text-gray-700 border-b pb-1">영향력 범례 (GWR 계수)</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#b2182b]"></span> <span>양의 영향 (강함)</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f4a582]"></span> <span>양의 영향 (약함)</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#999999] border border-gray-300"></span> <span>영향 없음 / 미미함</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#92c5de]"></span> <span>음의 영향 (약함)</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#2166ac]"></span> <span>음의 영향 (강함)</span></div>
                </div>
              </div>
            </div>

            {/* 상세 정보 사이드바 */}
            <div className="space-y-6 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">분석 요약</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">분석 지역 수</span>
                    <span className="font-bold text-gray-900">{mapData.length}개</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">평균 계수</span>
                    <span className="font-bold text-gray-900">
                    {mapData.length > 0
                        ? (mapData.reduce((sum, d) => sum + d.coefficient, 0) / mapData.length).toFixed(4)
                        : '-'}
                  </span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-md text-blue-800 mt-4 text-xs leading-relaxed">
                    <strong>💡 해석 가이드:</strong><br/>
                    <span className="text-red-600 font-bold">빨간색</span> 지역은 <strong>{selectedVariable}</strong>가 많을수록
                    <strong>{selectedDependent === 'obesity' ? ' 비만율' : ' 우울감'}</strong>이 <ins>높아지는</ins> 경향이 있습니다.<br/>
                    <span className="text-blue-600 font-bold">파란색</span> 지역은 반대로 <ins>낮아지는</ins> 경향이 있습니다.
                  </div>
                </div>
              </div>

              {/* 지역별 리스트 */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">지역별 상세 데이터 <span className="text-xs font-normal text-gray-500">(영향력 순)</span></h3>
                <div className="space-y-0 divide-y divide-gray-100">
                  {mapData
                      .sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient))
                      .slice(0, 50)
                      .map((region) => (
                          <div key={region.regionCode} className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded transition-colors">
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {region.regionName.split(' ')[1] || region.regionName}
                                <span className="text-xs text-gray-400 ml-1">({region.regionName.split(' ')[0]})</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                t-value: <span className={Math.abs(region.tValue) >= 2.7 ? "text-green-600 font-bold" : "text-gray-400"}>
                            {region.tValue?.toFixed(2)}
                          </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold text-sm ${region.coefficient > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                                {region.coefficient > 0 ? '+' : ''}{region.coefficient.toFixed(3)}
                              </div>
                              <div className="text-[10px] text-gray-400">계수(β)</div>
                            </div>
                          </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
  );
};

export default RegionMap;