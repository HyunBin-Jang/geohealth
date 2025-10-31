import { useState } from 'react';
import Layout from '../../components/layout/Layout';

interface PolicyProposal {
  id: string;
  title: string;
  description: string;
  category: string;
  region: string;
  proposer: string;
  votes: number;
  status: 'active' | 'completed' | 'pending';
  createdAt: string;
  targetPopulation: number;
  expectedImpact: string;
}

const PolicyVoting = () => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'create'>('proposals');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [votedProposals, setVotedProposals] = useState<Set<string>>(new Set());

  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: '',
    region: '',
    targetPopulation: '',
    expectedImpact: ''
  });

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'exercise', name: '운동시설' },
    { id: 'nutrition', name: '영양/식품' },
    { id: 'environment', name: '환경개선' },
    { id: 'mental', name: '정신건강' },
    { id: 'community', name: '커뮤니티' }
  ];

  const mockProposals: PolicyProposal[] = [
    {
      id: '1',
      title: '동네 곳곳에 무료 야외 운동기구 설치',
      description: '공원과 아파트 단지 내 무료로 이용할 수 있는 야외 운동기구를 설치하여 주민들의 운동 접근성을 높이고 비만율을 감소시키는 정책입니다.',
      category: 'exercise',
      region: '서울특별시 종로구',
      proposer: '김건강',
      votes: 247,
      status: 'active',
      createdAt: '2024-01-15',
      targetPopulation: 15000,
      expectedImpact: '비만율 2.3% 감소 예상'
    },
    {
      id: '2',
      title: '편의점 건강식품 코너 의무화',
      description: '지역 내 편의점에서 건강한 식품 코너를 의무적으로 운영하도록 하여 건강하지 않은 가공식품 섭취를 줄이는 정책입니다.',
      category: 'nutrition',
      region: '서울특별시 중구',
      proposer: '이영양',
      votes: 189,
      status: 'active',
      createdAt: '2024-01-12',
      targetPopulation: 12000,
      expectedImpact: '비만율 1.8% 감소 예상'
    },
    {
      id: '3',
      title: '주민 정신건강 상담센터 확대',
      description: '지역 내 정신건강 상담센터를 확대하고 무료 상담 프로그램을 운영하여 우울감 경험률을 낮추는 정책입니다.',
      category: 'mental',
      region: '부산광역시 중구',
      proposer: '박마음',
      votes: 156,
      status: 'active',
      createdAt: '2024-01-10',
      targetPopulation: 8500,
      expectedImpact: '우울감 경험률 1.5% 감소 예상'
    },
    {
      id: '4',
      title: '녹지 공간 확대 및 산책로 조성',
      description: '기존 공원을 확장하고 새로운 산책로를 조성하여 주민들의 야외 활동을 촉진하고 정신건강을 개선하는 정책입니다.',
      category: 'environment',
      region: '대구광역시 중구',
      proposer: '최자연',
      votes: 203,
      status: 'completed',
      createdAt: '2024-01-08',
      targetPopulation: 18000,
      expectedImpact: '우울감 경험률 2.1% 감소'
    }
  ];

  const filteredProposals = selectedCategory === 'all' 
    ? mockProposals 
    : mockProposals.filter(p => p.category === selectedCategory);

  const handleVote = (proposalId: string) => {
    if (votedProposals.has(proposalId)) {
      alert('이미 투표하신 정책입니다.');
      return;
    }
    
    setVotedProposals(prev => new Set([...prev, proposalId]));
    alert('투표가 완료되었습니다!');
  };

  const handleSubmitProposal = () => {
    if (!newProposal.title || !newProposal.description || !newProposal.category || !newProposal.region) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    alert('정책 제안이 성공적으로 등록되었습니다! 검토 후 투표에 반영됩니다.');
    setNewProposal({
      title: '',
      description: '',
      category: '',
      region: '',
      targetPopulation: '',
      expectedImpact: ''
    });
    setActiveTab('proposals');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { text: '투표 진행중', color: 'bg-green-100 text-green-800' },
      completed: { text: '투표 완료', color: 'bg-blue-100 text-blue-800' },
      pending: { text: '검토중', color: 'bg-yellow-100 text-yellow-800' }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">지역 정책 제안 및 투표</h1>
          <p className="text-lg text-gray-600">
            지역 주민들이 직접 건강 정책을 제안하고 투표하여 우선순위를 결정하는 참여형 플랫폼입니다.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('proposals')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'proposals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-vote-line mr-2"></i>
                정책 투표
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-add-line mr-2"></i>
                정책 제안
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'proposals' ? (
          <div>
            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{mockProposals.length}</div>
                <div className="text-sm text-gray-600">총 제안 수</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {mockProposals.filter(p => p.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">투표 진행중</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {mockProposals.reduce((sum, p) => sum + p.votes, 0)}
                </div>
                <div className="text-sm text-gray-600">총 투표 수</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {mockProposals.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">완료된 투표</div>
              </div>
            </div>

            {/* Proposals List */}
            <div className="space-y-6">
              {filteredProposals.map((proposal) => (
                <div key={proposal.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{proposal.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(proposal.status).color}`}>
                          {getStatusBadge(proposal.status).text}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>
                          <i className="ri-map-pin-line mr-1"></i>
                          {proposal.region}
                        </span>
                        <span>
                          <i className="ri-price-tag-3-line mr-1"></i>
                          {getCategoryName(proposal.category)}
                        </span>
                        <span>
                          <i className="ri-user-line mr-1"></i>
                          {proposal.proposer}
                        </span>
                        <span>
                          <i className="ri-calendar-line mr-1"></i>
                          {proposal.createdAt}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{proposal.votes}</div>
                      <div className="text-sm text-gray-600">투표</div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{proposal.description}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-sm text-blue-600 font-medium mb-1">대상 인구</div>
                      <div className="text-lg font-bold text-blue-800">
                        {proposal.targetPopulation.toLocaleString()}명
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-sm text-green-600 font-medium mb-1">예상 효과</div>
                      <div className="text-lg font-bold text-green-800">
                        {proposal.expectedImpact}
                      </div>
                    </div>
                  </div>

                  {proposal.status === 'active' && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        이 정책이 우리 지역에 필요하다고 생각하시나요?
                      </div>
                      <button
                        onClick={() => handleVote(proposal.id)}
                        disabled={votedProposals.has(proposal.id)}
                        className={`px-6 py-2 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                          votedProposals.has(proposal.id)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <i className="ri-thumb-up-line mr-2"></i>
                        {votedProposals.has(proposal.id) ? '투표 완료' : '찬성 투표'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">새로운 정책 제안하기</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  정책 제목 *
                </label>
                <input
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                  placeholder="정책의 핵심 내용을 간단히 요약해주세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상세 설명 *
                </label>
                <textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                  placeholder="정책의 구체적인 내용, 실행 방법, 기대 효과 등을 자세히 설명해주세요"
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {newProposal.description.length}/500자
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    정책 분야 *
                  </label>
                  <select
                    value={newProposal.category}
                    onChange={(e) => setNewProposal({...newProposal, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">분야를 선택하세요</option>
                    {categories.slice(1).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    대상 지역 *
                  </label>
                  <input
                    type="text"
                    value={newProposal.region}
                    onChange={(e) => setNewProposal({...newProposal, region: e.target.value})}
                    placeholder="예: 서울특별시 종로구"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    예상 대상 인구 (명)
                  </label>
                  <input
                    type="number"
                    value={newProposal.targetPopulation}
                    onChange={(e) => setNewProposal({...newProposal, targetPopulation: e.target.value})}
                    placeholder="정책의 영향을 받을 예상 인구 수"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    예상 효과
                  </label>
                  <input
                    type="text"
                    value={newProposal.expectedImpact}
                    onChange={(e) => setNewProposal({...newProposal, expectedImpact: e.target.value})}
                    placeholder="예: 비만율 2% 감소 예상"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <i className="ri-information-line text-yellow-600 text-lg mr-3 mt-0.5"></i>
                  <div className="text-sm text-yellow-800">
                    <strong>제안 가이드라인:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>구체적이고 실현 가능한 정책을 제안해주세요</li>
                      <li>지역 특성을 고려한 맞춤형 정책이 더 효과적입니다</li>
                      <li>제안된 정책은 검토 후 투표에 반영됩니다</li>
                      <li>GWR 분석 결과를 참고하여 제안하시면 더욱 좋습니다</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setActiveTab('proposals')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitProposal}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
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