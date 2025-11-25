# 💡 프로젝트 목표

✅ 선행연구를 통해 도출된 **비만율 및 우울감 경험률에 미치는 물리적 환경 요인(주점업, 공원 면적 등)의 GWR(지리 가중 회귀분석) 결과를 디지털 정책 도구로 전환**

✅ **선행연구** - [개별연구**(다양한 관점에서의 보건영양데이터 분석 및 결과 도출)**](https://orange-twilight-7a2.notion.site/1c10034183238067a30fe79c73133909?pvs=74) 

✅ 궁극적으로 **지역별 특성을 반영한 예측 모델**을 웹 서비스 형태로 구현하여, 정책 입안자에게 **데이터 기반의 정책 의사결정 근거**를 제공하고, 일반 대중에게는 **건강과 환경의 상호작용**에 대한 인식을 제고하는 참여형 플랫폼을 구축

<img width="600" height="600" alt="Image" src="https://github.com/user-attachments/assets/54d671ed-7160-4df7-9304-37847b724cc2" />
<img width="600" height="600" alt="Image" src="https://github.com/user-attachments/assets/8c52c991-77cc-4702-80d2-31d8ce5ff556" />
<img width="600" height="600" alt="Image" src="https://github.com/user-attachments/assets/2dd261e8-d919-481c-afed-627c5bf37367" />
<img width="600" height="600" alt="Image" src="https://github.com/user-attachments/assets/21480379-0cf6-4363-b879-0f412dbcd2b1" />
<img width="600" height="600" alt="Image" src="https://github.com/user-attachments/assets/2bbafc0a-fe1e-4fee-a5a8-5936ffffc17d" />


# 📝 프로젝트 개요

| 구분 | 내용 |
| --- | --- |
| **서비스 명** | GeoHealth |
| **핵심 분석 근거** | 비만율, 우울감 경험률, 인구천명당 주점업소/패스트푸드점 수, 공원 면적 등을 활용한 **회귀분석 및 GWR 분석 결과** |
| **개발 환경** | **백엔드:** Spring Boot (Java) |
|  | **프론트엔드/뷰:** React (CSR 기반) |
| **주요 타겟** | **정책 입안자:** 정량적 데이터 및 정책 예측 시뮬레이션 활용 |
|  | **일반 대중:** 지역 진단 및 정책 참여/공론화 |

# ✨ 주요 기능

| **기능** | **상세 설명** | **기술적 구현 (Frontend / Backend)** |
| --- | --- | --- |
| **1. 지역별 영향력 지도** | - GWR 분석 결과를 지도에 시각화
- 선택한 독립/종속 변수에 따른 영향력(계수)을 색상(빨강/파랑)과 강도로 표현
- 마우스 오버 시 T-value 등 신뢰성 지표 확인 | **Frontend (`region-map/page.tsx`):**
- `react-leaflet`, `OpenStreetMap` 사용
- 정적 좌표 데이터(`gwrData.ts`)와 동적 계수 데이터(API) 병합
- `CircleMarker`로 시각화
**Backend:**
- `GET /api/gwr/coefficients/all`
- 전체 지역 계수 조회 API 제공 |
| **2. 우리 동네 건강 진단** | - 거주 지역 검색 및 건강 상태 진단
- 비만율/우울감 경험률 등급 평가 (A~F)
- GWR 분석 기반 맞춤형 정책 제언 제공 | **Frontend (`health-dashboard/page.tsx`):**
- 스마트 검색 알고리즘 (다중 키워드 매칭)
- 제언 생성 로직 (계수 크기 및 부호 기반 템플릿 매칭)
**Backend:**
- `GET /api/gwr/coefficients/{regionCode}`
- 특정 지역 상세 계수 조회 API 제공 |
| **3. 정책 시뮬레이터** | - 가상 정책 시나리오에 따른 건강 지표 변화 예측
- 변화량($\Delta X$) 입력 시 예상 결과($\Delta Y$) 및 영향 인구수 계산 | **Frontend (`policy-simulator/page.tsx`):**
- 하이브리드 데이터 처리 (정적 데이터 + 동적 API)
- 클라이언트 사이드 실시간 예측 연산
**Backend:**
- 대시보드와 동일한 상세 조회 API 재사용 |
| **4. 정책 제안 투표** | - 시민 참여형 정책 제안 및 투표 커뮤니티
- 제안 등록, 목록 조회, 찬성/반대 투표 기능
- 실시간 투표 현황 시각화 | **Frontend (`policy-voting/page.tsx`):**
- CRUD 인터페이스 (목록/작성 탭)
- 실시간 UI 업데이트 (낙관적 업데이트 등)
**Backend:**
- `PolicyProposal` 엔터티 및 관련 API (`GET`, `POST`)
- 데이터 무결성을 위한 트랜잭션 처리 |

# 📄 프로젝트 설계

## DB 설계

### Region (지역 정보)

시스템의 기준이 되는 지역 마스터 데이터입니다.

| **컬럼명 (DB)** | **필드명 (Java)** | **타입** | **제약 조건** | **설명** |
| --- | --- | --- | --- | --- |
| **`region_code`** | `regionCode` | `BIGINT` | **PK** | 지역 고유 코드 (법정동/행정동 코드) |
| `province` | `province` | `VARCHAR(50)` | `NOT NULL` | 시도 명 (예: 서울특별시) |
| `sigungu` | `sigungu` | `VARCHAR(100)` | `NOT NULL` | 시군구 명 (예: 종로구) |
| `population` | `population` | `BIGINT` |  | 인구 수 (정책 효과 산출용) |
| `wkt_geometry` | `wktGeometry` | `TEXT` |  | 지도 시각화를 위한 WKT 공간 정보 |

### GwrAnalysisResult (GWR 분석 결과)

`Region`과 `1:N` 관계입니다. 하나의 지역은 여러 개의 지표(우울감, 비만율 등)에 대한 분석 결과를 가질 수 있습니다.

| **컬럼명 (DB)** | **필드명 (Java)** | **타입** | **제약 조건** | **설명** |
| --- | --- | --- | --- | --- |
| **`analysis_id`** | `id` | `BIGINT` | **PK**, Auto Inc | 분석 결과 고유 ID |
| **`region_code`** | `region` | `BIGINT` | **FK** | `region` 테이블 참조 |
| `indicator` | `indicator` | `VARCHAR(50)` | `NOT NULL` | 분석 지표 (OBESITY, DEPRESSION) |
| `raw_value` | `rawValue` | `DOUBLE` |  | 종속변수 원본 값 (비만율%) |
| `local_r2` | `localR2` | `DOUBLE` |  | 국지적 결정계수 ($R^2$) |
| `intercept_coef` | `interceptCoef` | `DOUBLE` |  | 절편 계수 |
| `intercept_t_value` | `interceptTValue` | `DOUBLE` |  | 절편 T-Value |
| `jujum_coef` | `jujumCoef` | `DOUBLE` |  | 주점업 수 계수 |
| `jujum_t_value` | `jujumTValue` | `DOUBLE` |  | 주점업 수 T-Value |
| `pappu_coef` | `pappuCoef` | `DOUBLE` |  | 패스트푸드점 수 계수 |
| `pappu_t_value` | `pappuTValue` | `DOUBLE` |  | 패스트푸드점 수 T-Value |
| `gongwon_su_coef` | `gongwonSuCoef` | `DOUBLE` |  | 공원 수 계수 |
| `gongwon_su_t_value` | `gongwonSuTValue` | `DOUBLE` |  | 공원 수 T-Value |
| `gongwon_myeonjeok_coef` | `gongwonMyeonjeokCoef` | `DOUBLE` |  | 공원 면적 계수 |
| `gongwon_myeonjeok_t_value` | `gongwonMyeonjeokTValue` | `DOUBLE` |  | 공원 면적 T-Value |
| `traffic_coef` | `trafficCoef` | `DOUBLE` |  | 대중교통 만족도 계수 |
| `traffic_t_value` | `trafficTValue` | `DOUBLE` |  | 대중교통 만족도 T-Value |

### PolicyProposal (정책 제안)

사용자 참여형 데이터입니다. `Region`과는 텍스트(`region` 컬럼)로 느슨하게 연결됩니다.

| **컬럼명 (DB)** | **필드명 (Java)** | **타입** | **제약 조건** | **설명** |
| --- | --- | --- | --- | --- |
| **`id`** | `id` | `BIGINT` | **PK**, Auto Inc | 제안 고유 ID |
| `title` | `title` | `VARCHAR(255)` | `NOT NULL` | 제안 제목 |
| `description` | `description` | `TEXT` |  | 제안 상세 내용 |
| `category` | `category` | `VARCHAR(50)` | `NOT NULL` | 카테고리 (exercise, diet 등) |
| `region` | `region` | `VARCHAR(100)` | `NOT NULL` | 대상 지역명 (예: 서울특별시 종로구) |
| `proposer` | `proposer` | `VARCHAR(50)` | `NOT NULL` | 제안자 이름 |
| `status` | `status` | `VARCHAR(20)` | `NOT NULL` | 상태 (active, completed) |
| `created_at` | `createdAt` | `DATE` | `NOT NULL` | 생성 일자 |
| `target_population` | `targetPopulation` | `BIGINT` | `NOT NULL` | 대상 인구 수 |
| `expected_impact` | `expectedImpact` | `VARCHAR(255)` | `NOT NULL` | 기대 효과 요약 |
| `agree_count` | `agreeCount` | `BIGINT` | Default 0 | 찬성 투표 수 |
| `disagree_count` | `disagreeCount` | `BIGINT` | Default 0 | 반대 투표 수 |



## API 설계

## 1. GWR 분석 데이터 API (Read-Only)

GWR 분석 결과(회귀 계수, 신뢰성 지표)를 조회하는 API입니다.

### 1-1. 전체 지역 계수 조회 (지도 시각화용)

**`지역별 영향력 지도`** 페이지에서 사용자가 변수를 선택했을 때, 지도에 색상을 입히기 위해 호출합니다.

- **Endpoint:** `GET /api/gwr/coefficients/all`
- **Description:** 특정 종속 변수와 독립 변수에 대한 **전국 209개 지역**의 계수 데이터를 반환합니다.
- **Query Parameters:**
    - `variable`: 독립 변수명 (예: `주점업 수`, `공원 수`, `체육시설 수` 등)
    - `dependentVar`: 종속 변수 ID (`obesity`, `depression`)
- **Response Body (JSON List):**

```json
[
  {
    "regionCode": "11010",
    "coefficient": 0.384,  // 회귀 계수 
    "tValue": 2.85,        // Local T-Value (신뢰성 판단, |t| >= 2.7)
    "localR2": 0.532       // 설명력
  },
  { "regionCode": "11020", "coefficient": -0.12, "pValue": 1.2, "localR2": 0.45 },
  ...
]
```

### 1-2. 특정 지역 상세 계수 조회 (대시보드/시뮬레이터용)

**`우리 동네 건강 진단`** 및 **`정책 시뮬레이터`** 페이지에서 특정 지역을 선택했을 때 호출합니다.

- **Endpoint:** `GET /api/gwr/coefficients/{regionCode}`
- **Description:** 특정 지역(`regionCode`)의 **모든 독립 변수**에 대한 계수 정보를 반환합니다.
- **Path Variable:** `regionCode` (예: `1`, `11010`)
- **Response Body (JSON List):**

```json
[
  {
    "regionCode": "11010",
    "variable": "주점업 수",
    "dependentVar": "obesity",
    "coefficient": 0.384,
    "pValue": 2.85, // T-Value
    "localR2": 0.532
  },
  {
    "regionCode": "11010",
    "variable": "공원 수",
    "dependentVar": "obesity",
    "coefficient": -1.25,
    "pValue": -3.12,
    "localR2": 0.532
  },
  ... (모든 변수 포함)
]
```

## 2. 정책 제안 및 투표 API (Read/Write)

사용자 참여형 기능을 위한 API입니다.

### 2-1. 정책 제안 목록 조회

**`정책 제안 투표`** 페이지 진입 시 호출합니다.

- **Endpoint:** `GET /api/proposals`
- **Description:** 등록된 모든 정책 제안 목록을 최신순(또는 ID순)으로 반환합니다.
- **Response Body (JSON List):**

```json
[
  {
    "id": 1,
    "title": "동네 곳곳에 무료 야외 운동기구 설치",
    "description": "공원과 아파트 단지 내...",
    "category": "exercise",
    "region": "서울특별시 종로구",
    "proposer": "김건강",
    "status": "active",
    "createdAt": "2024-01-15",
    "targetPopulation": 15000,
    "expectedImpact": "비만율 2.3% 감소 예상",
    "agreeCount": 120,
    "disagreeCount": 15,
    "votes": 135
  },
  ...
]
```

### 2-2. 정책 제안 등록

**`새 제안 작성`** 탭에서 폼을 제출할 때 호출합니다.

- **Endpoint:** `POST /api/proposals`
- **Description:** 새로운 정책 제안을 DB에 저장합니다.
- **Request Body (JSON):**

```json
{
  "title": "우리 동네 산책로 조성",
  "description": "하천변을 따라 산책로를...",
  "category": "environment",
  "region": "서울특별시 종로구",
  "proposer": "이시민",
  "targetPopulation": 5000,
  "expectedImpact": "우울감 1% 감소"
}
```

- **Response:** 생성된 `PolicyProposal` 객체 (2-1과 동일한 구조)

### 2-3. 투표하기

사용자가 **`찬성`** 또는 **`반대`** 버튼을 눌렀을 때 호출합니다.

- **Endpoint:** `POST /api/proposals/{proposalId}/vote`
- **Description:** 특정 제안의 찬성/반대 카운트를 1 증가시킵니다.
- **Request Body (JSON):**

```json
{
  "voteType": "AGREE"  // 또는 "DISAGREE"
}
```


## 프로젝트 배포 URL

[geohealth-demo.s3-website.ap-northeast-2.amazonaws.com](http://geohealth-demo.s3-website.ap-northeast-2.amazonaws.com/)
