import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { regionData } from '../../mocks/gwrData'; // 지역 데이터 가져오기

// API 기본 URL (환경 변수 사용)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 백엔드 DTO와 일치하는 인터페이스 정의
interface PolicyProposal {
  id: number;
  title: string;
  description: string;
  category: string;
  region: string;
  proposer: string;
  status: string;
  createdAt: string;
  targetPopulation: number;
  expectedImpact: string;
  votes: number; // agreeCount + disagreeCount
  agreeCount: number;
  disagreeCount: number;
}

const PolicyVoting = () => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'create'>('proposals');
  const [proposals, setProposals] = useState<PolicyProposal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 새 제안 폼 상태
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'exercise', // 기본값
    region: '',
    proposer: '',
    targetPopulation: '',
    expectedImpact: ''
  });

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'exercise', name: '운동/신체활동' },
    { id: 'environment', name: '환경 개선' },
    { id: 'diet', name: '식습관/영양' },
    { id: 'mental', name: '정신건강' },
    { id: 'infra', name: '의료 인프라' }
  ];

  // 1. 데이터 로드 (GET /api/proposals)
  useEffect(() => {
    if (activeTab === 'proposals') {
      fetchProposals();
    }
  }, [activeTab]);

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/proposals`);
      if (!response.ok) throw new Error('데이터 로드 실패');
      const data = await response.json();
      setProposals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 투표 처리 (POST /api/proposals/{id}/vote)
  const handleVote = async (proposalId: number, voteType: 'AGREE' | 'DISAGREE') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/proposals/${proposalId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType }),
      });
      if (!response.ok) throw new Error('투표 실패');

      const updated = await response.json();
      // 목록 상태 업데이트
      setProposals(prev => prev.map(p => p.id === proposalId ? updated : p));
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류 발생');
    }
  };

  // 3. 새 제안 등록 (POST /api/proposals)
  const handleSubmitProposal = async () => {
    // 유효성 검사
    if (!newProposal.title || !newProposal.description || !newProposal.region || !newProposal.proposer) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    try {
      const payload = {
        ...newProposal,
        targetPopulation: Number(newProposal.targetPopulation) || 0
      };

      const response = await fetch(`${API_BASE_URL}/api/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('등록 실패');

      alert('정책 제안이 등록되었습니다!');
      setActiveTab('proposals'); // 목록으로 이동
      fetchProposals(); // 목록 갱신

      // 폼 초기화
      setNewProposal({
        title: '',
        description: '',
        category: 'exercise',
        region: '',
        proposer: '',
        targetPopulation: '',
        expectedImpact: ''
      });

    } catch (err) {
      alert('정책 등록 중 오류가 발생했습니다.');
    }
  };

  // 필터링된 목록
  const filteredProposals = selectedCategory === 'all'
      ? proposals
      : proposals.filter(p => p.category === selectedCategory);

  const getVotePercentage = (p: PolicyProposal) => {
    const total = p.agreeCount + p.disagreeCount;
    if (total === 0) return { agree: 0, disagree: 0 };
    return {
      agree: (p.agreeCount / total) * 100,
      disagree: (p.disagreeCount / total) * 100,
    };
  };

  const getCategoryLabel = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : catId;
  };

  return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">정책 제안 투표</h1>
            <p className="text-lg text-gray-600">
              지역별 맞춤형 건강 정책에 투표하고, 새로운 아이디어를 제안해주세요.
            </p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex space-x-4 mb-8 border-b border-gray-200">
            <button
                className={`pb-4 px-2 font-medium transition-colors relative ${
                    activeTab === 'proposals'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('proposals')}
            >
              제안 목록
            </button>
            <button
                className={`pb-4 px-2 font-medium transition-colors relative ${
                    activeTab === 'create'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('create')}
            >
              새 제안 작성
            </button>
          </div>

          {/* === 1. 제안 목록 탭 === */}
          {activeTab === 'proposals' && (
              <>
                {/* 카테고리 필터 */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.map((category) => (
                      <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              selectedCategory === category.id
                                  ? 'bg-blue-600 text-white shadow-md'
                                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        {category.name}
                      </button>
                  ))}
                </div>

                {/* 로딩/에러/목록 */}
                {isLoading ? (
                    <div className="text-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-500">데이터를 불러오는 중...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 py-10">{error}</div>
                ) : (
                    <div className="grid gap-6">
                      {filteredProposals.map((proposal) => {
                        const pct = getVotePercentage(proposal);
                        return (
                            <div key={proposal.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                              <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                              {getCategoryLabel(proposal.category)}
                            </span>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                              {proposal.region}
                            </span>
                                  </div>
                                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                                      proposal.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                            {proposal.status === 'active' ? '진행중' : '종료됨'}
                          </span>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 mb-2">{proposal.title}</h2>
                                <p className="text-gray-600 mb-4 leading-relaxed">{proposal.description}</p>

                                {/* 상세 정보 */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm bg-gray-50 p-4 rounded-lg">
                                  <div>
                                    <span className="block text-gray-500 text-xs">제안자</span>
                                    <span className="font-medium text-gray-900">{proposal.proposer}</span>
                                  </div>
                                  <div>
                                    <span className="block text-gray-500 text-xs">제안일</span>
                                    <span className="font-medium text-gray-900">{proposal.createdAt}</span>
                                  </div>
                                  <div>
                                    <span className="block text-gray-500 text-xs">대상 인구</span>
                                    <span className="font-medium text-gray-900">{proposal.targetPopulation.toLocaleString()}명</span>
                                  </div>
                                  <div>
                                    <span className="block text-gray-500 text-xs">기대 효과</span>
                                    <span className="font-medium text-blue-600">{proposal.expectedImpact}</span>
                                  </div>
                                </div>

                                {/* 투표 막대 */}
                                <div className="mb-6">
                                  <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-green-600">찬성 {proposal.agreeCount}</span>
                                    <span className="font-medium text-gray-500">총 {proposal.votes}표</span>
                                    <span className="font-medium text-red-600">반대 {proposal.disagreeCount}</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden flex">
                                    <div className="bg-green-500 h-full" style={{ width: `${pct.agree}%` }}></div>
                                    <div className="bg-red-500 h-full" style={{ width: `${pct.disagree}%` }}></div>
                                  </div>
                                </div>

                                <div className="flex gap-3">
                                  <button
                                      onClick={() => handleVote(proposal.id, 'AGREE')}
                                      className="flex-1 bg-white border-2 border-green-500 text-green-600 py-2.5 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                                  >
                                    <i className="ri-thumb-up-line text-lg"></i> 찬성하기
                                  </button>
                                  <button
                                      onClick={() => handleVote(proposal.id, 'DISAGREE')}
                                      className="flex-1 bg-white border-2 border-red-500 text-red-600 py-2.5 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                  >
                                    <i className="ri-thumb-down-line text-lg"></i> 반대하기
                                  </button>
                                </div>
                              </div>
                            </div>
                        );
                      })}
                    </div>
                )}
              </>
          )}

          {/* === 2. 새 제안 작성 탭 === */}
          {activeTab === 'create' && (
              <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">새로운 정책 제안하기</h2>
                <div className="space-y-6">
                  {/* 제목 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      제안 제목 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={newProposal.title}
                        onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                        placeholder="예: 동네 곳곳에 무료 야외 운동기구 설치"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* 카테고리 & 지역 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        카테고리 <span className="text-red-500">*</span>
                      </label>
                      <select
                          value={newProposal.category}
                          onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        {categories.filter(c => c.id !== 'all').map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        대상 지역 <span className="text-red-500">*</span>
                      </label>
                      <select
                          value={newProposal.region}
                          onChange={(e) => setNewProposal({ ...newProposal, region: e.target.value })} // 실제 값은 지역 이름
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        <option value="">지역을 선택하세요</option>
                        {regionData.map(r => (
                            <option key={r.regionCode} value={r.regionName}>
                              {r.regionName}
                            </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 내용 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      제안 내용 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={newProposal.description}
                        onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-40 resize-none"
                        placeholder="어떤 문제를 해결하고 싶으신가요?"
                    />
                  </div>

                  {/* 상세 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        제안자 <span className="text-red-500">*</span>
                      </label>
                      <input
                          type="text"
                          value={newProposal.proposer}
                          onChange={(e) => setNewProposal({ ...newProposal, proposer: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">대상 인구</label>
                      <input
                          type="number"
                          value={newProposal.targetPopulation}
                          onChange={(e) => setNewProposal({ ...newProposal, targetPopulation: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">기대 효과</label>
                      <input
                          type="text"
                          value={newProposal.expectedImpact}
                          onChange={(e) => setNewProposal({ ...newProposal, expectedImpact: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* 가이드라인 */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                    <strong>제안 가이드라인:</strong>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      <li>구체적이고 실현 가능한 정책을 제안해주세요.</li>
                      <li>GWR 분석 결과를 참고하면 더욱 좋습니다.</li>
                    </ul>
                  </div>

                  {/* 버튼 */}
                  <div className="flex justify-end gap-4">
                    <button
                        onClick={() => setActiveTab('proposals')}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      취소
                    </button>
                    <button
                        onClick={handleSubmitProposal}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      <i className="ri-send-plane-line mr-2"></i>
                      정책 제안하기
                    </button>
                  </div>
                </div>
              </div>
          )}
        </div>
      </Layout>
  );
};

export default PolicyVoting;