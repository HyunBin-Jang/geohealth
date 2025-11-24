import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { regionData, physicalFactors, dependentVariables } from '../../mocks/gwrData.ts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PolicySimulator = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDependent, setSelectedDependent] = useState('obesity');
  const [selectedIndependent, setSelectedIndependent] = useState('');
  const [changeAmount, setChangeAmount] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulation = async () => {
    if (!selectedRegion || !selectedIndependent || !changeAmount) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setIsLoading(true); // 💡 로딩 시작
    setResults(null); // 이전 결과 초기화

    try {
      // 💡 2. 정적 regionData에서 시뮬레이션에 필요한 기본 정보 찾기
      const region = regionData.find(r => r.regionCode === selectedRegion);
      if (!region) {
        throw new Error('선택된 지역 정보를 regionData에서 찾을 수 없습니다.');
      }

      // 💡 3. API 호출: 백엔드에서 해당 지역의 모든 GWR 계수 가져오기
      const response = await fetch(`${API_BASE_URL}/api/gwr/coefficients/${selectedRegion}`);

      if (!response.ok) {
        throw new Error('서버에서 계수 정보를 가져오는 데 실패했습니다.');
      }

      const coefficients: any[] = await response.json(); // DTO 배열

      // 💡 4. API 결과에서 시뮬레이션에 필요한 특정 계수 찾기
      const coefficientData = coefficients.find(
          c => c.variable === selectedIndependent &&
              c.dependentVar === selectedDependent
      );

      if (!coefficientData) {
        throw new Error('해당 조건의 GWR 계수를 찾을 수 없습니다.');
      }

      // 5. 시뮬레이션 계산
      const deltaX = parseFloat(changeAmount);
      const deltaY = deltaX * coefficientData.coefficient;

      // '현재 값'은 정적 regionData에서 가져옴
      const currentValue = selectedDependent === 'obesity'
          ? region.obesityRate
          : region.depressionRate;

      const predictedValue = currentValue + deltaY;

      // '인구수'도 정적 regionData에서 가져옴
      const affectedPopulation = Math.round((Math.abs(deltaY) / 100) * region.population);

      // 6. 결과 상태 업데이트
      setResults({
        region: region.regionName,
        currentValue,
        deltaY,
        predictedValue,
        coefficient: coefficientData.coefficient,
        tValue: coefficientData.tvalue,
        localR2: coefficientData.localR2,
        affectedPopulation,
        changeAmount: deltaX,
        variable: selectedIndependent,
        dependentVar: dependentVariables.find(v => v.id === selectedDependent)?.name
      });

    } catch (error) {
      console.error("시뮬레이션 오류:", error);
      alert(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // 💡 로딩 종료
    }
  };

  const downloadData = () => {
    if (!results) return;

    const csvData = [
      ['항목', '값'],
      ['지역', results.region],
      ['변수', results.variable],
      ['변화량', `${results.changeAmount}`],
      ['현재값', `${results.currentValue}%`],
      ['예측값', `${results.predictedValue.toFixed(2)}%`],
      ['변화량(ΔY)', `${results.deltaY.toFixed(3)}%`],
      ['GWR 계수(β)', results.coefficient],
      ['t-value', results.tValue],
      ['Local R²', results.localR2],
      ['영향받는 인구', `${results.affectedPopulation}명`]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `정책시뮬레이션_결과_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">GWR 기반 정책 시뮬레이터</h1>
          <p className="text-lg text-gray-600">
            지역별 GWR 계수를 활용하여 정책 변화가 건강 지표에 미치는 영향을 예측합니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">정책 목표 입력</h2>

            <div className="space-y-6">
              {/* 지역 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  지역 선택
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">지역을 선택하세요</option>
                  {regionData.map((region) => (
                    <option key={region.regionCode} value={region.regionCode}>
                      {region.regionName}
                    </option>
                  ))}
                </select>
              </div>

              {/* 종속 변수 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종속 변수 (목표 지표)
                </label>
                <select
                  value={selectedDependent}
                  onChange={(e) => setSelectedDependent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {dependentVariables.map((variable) => (
                    <option key={variable.id} value={variable.id}>
                      {variable.name} ({variable.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* 독립 변수 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  독립 변수 (물리적 요인)
                </label>
                <select
                  value={selectedIndependent}
                  onChange={(e) => setSelectedIndependent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">변수를 선택하세요</option>
                  {physicalFactors.map((factor) => (
                    <option key={factor.id} value={factor.name}>
                      {factor.name} ({factor.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* 변화량 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  변화량 (ΔX)
                </label>
                <input
                  type="number"
                  value={changeAmount}
                  onChange={(e) => setChangeAmount(e.target.value)}
                  placeholder="변화량을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  양수: 증가, 음수: 감소
                </p>
              </div>

              {/* 시뮬레이션 버튼 */}
              <button
                onClick={handleSimulation}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium whitespace-nowrap cursor-pointer"
              >
                <i className="ri-calculator-line mr-2"></i>
                시뮬레이션 실행
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">예측 결과</h2>
              {results && (
                <button
                  onClick={downloadData}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-download-line mr-2"></i>
                  데이터 다운로드
                </button>
              )}
            </div>

            {results ? (
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">분석 대상</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">지역:</span>
                      <span className="ml-2 font-medium">{results.region}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">변수:</span>
                      <span className="ml-2 font-medium">{results.variable}</span>
                    </div>
                  </div>
                </div>

                {/* 예측 결과 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {results.currentValue}%
                    </div>
                    <div className="text-sm text-gray-600">현재 {results.dependentVar}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {results.predictedValue.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-600">예측 {results.dependentVar}</div>
                  </div>
                </div>

                {/* 변화량 */}
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-yellow-600">
                    {results.deltaY > 0 ? '+' : ''}{results.deltaY.toFixed(3)}%
                  </div>
                  <div className="text-sm text-gray-600">예상 변화량 (ΔY)</div>
                </div>

                {/* 신뢰성 지표 */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">신뢰성 지표</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {results.coefficient.toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-600">GWR 계수 (β)</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {results.tValue.toFixed(3)}
                      </div>
                      <div className="text-xs text-gray-600">t-value</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {results.localR2.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-600">Local R²</div>
                    </div>
                  </div>
                </div>

                {/* 정책 효과 직관화 */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">정책 효과 직관화</h3>
                  <p className="text-purple-800">
                    <strong>{results.variable}</strong> 정책 시행 시
                    <strong className="text-purple-600"> 주민 약 {results.affectedPopulation.toLocaleString()}명</strong>의
                    {results.dependentVar}에 영향을 미칠 것으로 예상됩니다.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="ri-calculator-line text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">
                  좌측 폼을 작성하고 시뮬레이션을 실행하면<br />
                  예측 결과가 여기에 표시됩니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 설명 섹션 */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">GWR 기반 정책 시뮬레이션이란?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-map-pin-line text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">지역별 맞춤 분석</h3>
              <p className="text-sm text-gray-600">
                지리가중회귀(GWR) 모델을 통해 각 지역의 고유한 특성을 반영한 정확한 예측을 제공합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-line-chart-line text-green-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">과학적 근거</h3>
              <p className="text-sm text-gray-600">
                통계적 유의성(t-value)과 설명력(R²)을 함께 제시하여 예측의 신뢰성을 보장합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-group-line text-purple-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">정책 효과 직관화</h3>
              <p className="text-sm text-gray-600">
                복잡한 수치를 '영향받는 주민 수'로 변환하여 정책 효과를 직관적으로 이해할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PolicySimulator;