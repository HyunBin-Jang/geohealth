export const regionData = [
  {
    regionCode: '11010',
    regionName: '서울특별시 종로구',
    obesityRate: 24.5,
    depressionRate: 5.2,
    population: 152345,
    coordinates: [37.5735, 126.9788]
  },
  {
    regionCode: '11020',
    regionName: '서울특별시 중구',
    obesityRate: 22.8,
    depressionRate: 4.8,
    population: 134567,
    coordinates: [37.5636, 126.9970]
  },
  {
    regionCode: '11030',
    regionName: '서울특별시 용산구',
    obesityRate: 23.1,
    depressionRate: 5.0,
    population: 245678,
    coordinates: [37.5326, 127.0090]
  },
  {
    regionCode: '26010',
    regionName: '부산광역시 중구',
    obesityRate: 26.3,
    depressionRate: 6.1,
    population: 198765,
    coordinates: [35.1040, 129.0320]
  },
  {
    regionCode: '27010',
    regionName: '대구광역시 중구',
    obesityRate: 25.7,
    depressionRate: 5.8,
    population: 187432,
    coordinates: [35.8714, 128.6014]
  }
];

export const gwrCoefficients = [
  {
    regionCode: '11010',
    variable: '주점업 수',
    coefficient: 0.045,
    pValue: 0.023,
    localR2: 0.67,
    dependentVar: 'obesity'
  },
  {
    regionCode: '11010',
    variable: '체육시설 수',
    coefficient: -0.032,
    pValue: 0.015,
    localR2: 0.67,
    dependentVar: 'obesity'
  },
  {
    regionCode: '11010',
    variable: '공원 면적',
    coefficient: -0.028,
    pValue: 0.041,
    localR2: 0.67,
    dependentVar: 'obesity'
  },
  {
    regionCode: '11010',
    variable: '편의점 수',
    coefficient: 0.021,
    pValue: 0.067,
    localR2: 0.67,
    dependentVar: 'obesity'
  },
  {
    regionCode: '11020',
    variable: '주점업 수',
    coefficient: 0.038,
    pValue: 0.031,
    localR2: 0.72,
    dependentVar: 'obesity'
  },
  {
    regionCode: '11020',
    variable: '체육시설 수',
    coefficient: -0.041,
    pValue: 0.012,
    localR2: 0.72,
    dependentVar: 'obesity'
  }
];

export const physicalFactors = [
  { id: 'bars', name: '주점업 수', unit: '개소' },
  { id: 'gyms', name: '체육시설 수', unit: '개소' },
  { id: 'parks', name: '공원 면적', unit: 'm²' },
  { id: 'convenience', name: '편의점 수', unit: '개소' },
  { id: 'medical', name: '의료시설 수', unit: '개소' },
  { id: 'walkability', name: '보행 접근성', unit: '점수' }
];

export const dependentVariables = [
  { id: 'obesity', name: '비만율', unit: '%' },
  { id: 'depression', name: '우울감 경험률', unit: '%' }
];