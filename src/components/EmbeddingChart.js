import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Bubble } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function generateColors(numColors) {
  let colors = [];
  for (let i = 0; i < numColors; i++) {
    // 将色相平均分布在360度颜色轮上
    const hue = Math.round((360 * i) / numColors);
    // 选择一个饱和度和亮度值，这里我们选择70%的饱和度和50%的亮度
    const saturation = 70;
    const lightness = 50;
    // 创建HSL颜色字符串
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colors.push(color);
  }
  return colors;
}

// 使用函数生成30个颜色
const ChartComponent = (props) => {
  const [datacollection, setDatacollection] = useState({
    datasets: [],
  });
  const [graphLoaded, setGraphLoaded] = useState(true);
  //const palette = generateColors(20);

  const palette = [
    "#db5f57aa",
    "#db9057aa",
    "#dbc257aa",
    "#c3db57aa",
    "#91db57aa",
    "#5fdb57aa",
    "#57db80aa",
    "#57dbb2aa",
    "#57d3dbaa",
    "#57a2dbaa",
    "#5770dbaa",
    "#6f57dbaa",
    "#a157dbaa",
    "#d357dbaa",
    "#db57b2aa",
    "#db5780aa"
  ];

  useEffect(() => {
    const loadInitialData = async () => {
      setGraphLoaded(true);
      try {
        const response = await axios.get("http://localhost:8000/api/graph");
        const graphData = response.data;

        const blogPostIds = new Set();

        const uniqueGraphData = [];

        graphData.forEach(
          item => {
            if (blogPostIds.has(item.blog_post_id)){
              console.log(`Duplicate found: ${item.blog_post_id}`);
            }
          }
        )

        const groupedCategories = _.groupBy(graphData, 'top_category');
        
        // 创建一个映射，用于存储类别到颜色的映射
        const categoryToColor = {};

        const categoriesDatasets = _.map(groupedCategories, (categories, top_category, index) => {
          // 确保每个类别都有一个唯一的颜色
          if (!categoryToColor[top_category]) {
              // 分配颜色，并确保颜色是循环的
              categoryToColor[top_category] = palette[Object.keys(groupedCategories).indexOf(top_category) % palette.length];
          }
          
          const backgroundColor = categoryToColor[top_category];
          
          // 假设这里的category已经包含了从props.datacollection传入的r值
          return {
              label: top_category,
              data: categories.map(category => ({
                  x: category.vec[0] + (Math.random() * 0.001 - 0.0005),
                  y: category.vec[1] + (Math.random() * 0.001 - 0.0005),
                  r: 5, // 使用传入的r值而不是硬编码值
                  title: category.title,
                  content_url: category.content_url
              })),
              backgroundColor,
          };
      });
      

        setDatacollection(prevState => ({
          ...prevState,
          datasets: [...prevState.datasets, ...categoriesDatasets],
        }));

        setGraphLoaded(true);
      } catch (error) {
        console.error("Failed to load initial graph data:", error);
      }
    };

    loadInitialData();
  }, [props.datacollection]); // 空依赖数组，确保仅在组件挂载时执行



  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            // 返回你想在 tooltip 中显示的内容
            const title = context.raw.title || '';
            return title;
          }
        }
      },
    },
    onClick: (event, elements, chart) => {
      if (elements.length > 0) {
        const firstElementIndex = elements[0].index;
        const datasetIndex = elements[0].datasetIndex;
        const url = chart.data.datasets[datasetIndex].data[firstElementIndex].content_url; // 获取content_url
        if (url) window.open(url, '_blank'); // 在新标签页打开URL
      }
    },
  };
  
  if (!graphLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chart-container">
      <h2>Bubble Chart Example</h2>
      <Bubble data={datacollection} options={options} />
    </div>
  );
};

export default ChartComponent;
