import React from 'react';
import { Bubble } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const EmbeddingChart = ({ datacollection }) => {
  // 如果你不需要在组件内部进行额外的数据加载，可以删除不必要的状态和效果
  // 假设datacollection已经包含了两个datasets：一个常规的，一个是需要放大的数据点

  const options = {
    plugins: {
      legend: {
        display: true, // 如果你想显示图例，以帮助区分两个datasets
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            // 自定义提示，以提供额外信息
            //const label = context.raw.title || '';
            const title = context.raw.title || '';
            return `${title}`;
          }
        }
      },
    },
    onClick: (event, elements, chart) => {
      if (elements.length > 0) {
        const firstElementIndex = elements[0].index;
        const datasetIndex = elements[0].datasetIndex;
        const url = chart.data.datasets[datasetIndex].data[firstElementIndex].content_url; // 获取content_url
        if (url) {
          window.open(url, '_blank'); // 在新标签页打开URL
        }
      }
    },
    // 根据需要添加其他配置
  };

  return (
    <div className="chart-container">
      <h2>Bubble Chart Example</h2>
      <Bubble data={datacollection} options={options} />
    </div>
  );
};

export default EmbeddingChart;
