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

### GWR 기반 정책 시뮬레이터

| 기능 명 | 상세 설명 | 기술적 구현 (Spring/Thymeleaf) |
| --- | --- | --- |
| **정책 목표 입력** | 지역, 종속 변수(비만율/우울감), 독립 변수(물리적 요인), **변화량(ΔX)**을 입력받는 폼. | **Thymeleaf Forms:** 드롭다운 및 입력 필드로 구성. `POST` 요청을 Controller로 전송. |
| **예측 계산 및 결과** | Service Layer에서 DB에 저장된 **지역별 GWR 계수(β)**를 조회하여 ΔY=ΔX×β 공식을 이용해 예측 변화량을 계산. | **Spring Service:** `GwrCoefficientRepository`를 통한 DB 조회 후, Java 로직으로 예측 변화량(`DeltaY`)과 정책 후 예상 값(`Y_Predicted`) 계산. |
| **신뢰성 지표 제시** | 예측 결과와 함께, 해당 계수의 t**-value** 및 해당 지역 GWR 모델의 **Local R2**를 출력하여 통계적 신뢰성을 입증. | **Thymeleaf Fragments:** 계산된 `t_value`와 `LocalR2`를 전문적인 UI/UX에 맞춰 텍스트와 그래프로 출력. |
| **데이터 다운로드** | 시뮬레이션에 사용된 현재 데이터와 예측 데이터를 포함하여, 상세 GWR 계수 데이터를 CSV 파일로 제공. | **Spring Controller:** `ResponseEntity`를 활용하여 DB 데이터를 CSV 포맷으로 변환 후 파일 다운로드 기능 구현. |

### 지역별 영향력 지도 시각화

| 기능 명 | 상세 설명 | 기술적 구현 (Spring/Thymeleaf) |
| --- | --- | --- |
| **변수별 계수 맵** | 사용자가 선택한 독립 변수(예: '주점업 수')가 종속 변수(예: '비만율')에 미치는 **GWR 계수(β)의 크기**를 시군구별 색상 농도로 표현. | **Spring Controller:** 선택된 변수의 모든 지역 β 값을 JSON 형태로 `Model`에 담아 View로 전달. |
| **인터랙티브 툴팁** | 지도 상의 특정 시군구를 클릭하거나 마우스를 올리면, 해당 지역의 β 값, p-value, 현재 비만율 등을 팝업으로 상세 표시. | **Leaflet.js (Client-Side):** 전달받은 JSON 데이터와 GeoJSON 경계 데이터를 결합하여 Choropleth Map 구현. `bindPopup` 기능을 활용하여 통계 정보 표시. |

### 우리 동네 건강 진단 대시보드

| 기능 명 | 상세 설명 | 기술적 구현 (Spring/Thymeleaf) |
| --- | --- | --- |
| **지역 검색 및 진단** | 사용자가 주소를 입력하면 해당 지역의 현재 비만율, 우울감 경험률 데이터를 조회하고 전국 평균 대비 **등급**으로 변환하여 표시. | **Thymeleaf/JS Search:** 주소 검색 시 `region_code`를 기반으로 `REGION_DATA` 테이블 조회. **Spring Service**에서 등급 변환 로직(`A, B, C` 등) 수행. |
| **GWR 기반 맞춤 제언** | 해당 지역에서 비만율/우울감 개선에 **가장 큰 영향**을 주는 물리적 요인을 GWR 계수 크기(β) 순으로 자동 추천. | **Spring Service:** `GWR_COEFFICIENTS` 테이블에서 해당 지역의 β 값 중 **절댓값이 가장 큰 요인**을 추출하여, 이를 기반으로 **직관적인 문구** 생성. |
| **정책 효과 직관화** | "OO 정책 시행 시 주민 **100명 중 X명**의 비만이 감소"와 같이, 복잡한 ΔY 수치를 **체감 가능한 수치**로 변환하여 제시. | **Spring Service:** ΔY 값을 인구수에 비례한 **'수혜 인구'**로 환산하는 로직 구현. (게이미피케이션 요소) |

### 지역 정책 제안 및 투표 시스템 (Voting System)

| 기능 명 | 상세 설명 | 기술적 구현 (Spring/Thymeleaf) |
| --- | --- | --- |
| **추천 정책 목록** | 시스템이 GWR 분석 결과에 따라 가장 효과가 높을 것으로 예측되는 3가지 정책 제안을 제시. | **Spring Service:** `GWR_COEFFICIENTS` 테이블과 `REGION_DATA`를 조합하여 가장 시급한 개선 요인 기반으로 정책 제안 목록 생성. |
| **투표 및 결과 시각화** | 사용자가 선호하는 정책에 투표하고, 투표 결과를 실시간 막대 그래프로 확인. | **DB Table:** `POLICY_VOTES` 테이블 별도 구축. **Spring Data JPA**를 이용해 투표 데이터 기록 및 실시간 조회. **Thymeleaf/Chart.js**를 이용해 투표율 시각화. |
| **정책 공론화** | 투표 결과를 소셜 미디어로 공유하거나, 지방자치단체에 대한 의견 제출 폼과 연결. |  |

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

## UI / UX 설계

[geohealth-demo.s3-website.ap-northeast-2.amazonaws.com](http://geohealth-demo.s3-website.ap-northeast-2.amazonaws.com/)

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
