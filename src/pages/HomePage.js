import React, { useState, useEffect } from 'react';
import EmbeddingChart from '../components/EmbeddingChart';

const HomePage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [datacollection, setDatacollection] = useState({ datasets: [] });

  // 使用模拟数据初始化图表
  useEffect(() => {
    const mockGraphData = getMockGraphData();
    setDatacollection(transformGraphData(mockGraphData));
  }, []);

  // 模拟从后端获取图表数据
  const getMockGraphData = () => {
    // 这里返回模拟的图表数据
    return {
      datasets: [
        {
          label: "Category 1",
          data: [
            { x: 10, y: 20, r: 5 },
            { x: 15, y: 10, r: 10 },
          ],
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
        // 添加更多的模拟数据集...
      ],
    };
  };

  // 模拟分类和嵌入向量的API调用
  const categorize = () => {
    if (!query) return; // 如果查询为空，直接返回

    // 使用模拟的分类结果
    const mockCategoriesResponse = [
      { top_category: "Electronics", category: "Smartphone", score: 0.9 },
      // 添加更多模拟分类结果...
    ];

    // 使用模拟的嵌入向量更新图表
    const mockVec = { x: 20, y: 25, r: 15 };
    updateChartData(mockVec, mockCategoriesResponse);

    setResults(mockCategoriesResponse);
  };

  // 转换模拟的图表数据格式（如果需要的话）
  const transformGraphData = (graphData) => {
    // 可能需要转换逻辑
    return graphData;
  };

  // 根据嵌入向量和分类结果更新图表（如果需要的话）
  const updateChartData = (vec, categories) => {
    // 这里可以添加逻辑来根据嵌入向量和分类结果更新图表
    // 例如，添加一个新的数据集来表示用户查询
  };

  return (
    <div>
      <h2>Categorize Product</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && categorize()}
        placeholder="Enter product name"
      />
      <div>
        <h3>Results:</h3>
        {/* 显示分类结果 */}
        {results.map((result, index) => (
          <p key={index}>{result.top_category} / {result.category} (Score: {result.score})</p>
        ))}
      </div>
      <EmbeddingChart datacollection={datacollection} />
    </div>
  );
};

export default HomePage;
