import React, { useState, useEffect } from "react";
import axios from "axios";
import EmbeddingChart from "../components/EmbeddingChart";

const HomePage = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [datacollection, setDatacollection] = useState({ datasets: [] });
    

    // 示例：加载初始图表数据
    useEffect(() => {
        // 这里可以根据需要请求初始图表数据
        loadInitialGraphData();
    }, []);

    const loadInitialGraphData = async () => {
        try {
            // const response = await axios.get("http://localhost:8000/api/graph");
            setDatacollection({ datasets: [] });
        } catch (error) {
            console.error("Failed to load initial graph data:", error);
        }
    };

    const categorize = async () => {
        if (!query) return; // 如果查询为空，直接返回
        setLoading(true);
        try {
            // 请求嵌入向量
            const embedResponse = await axios.get("http://localhost:8000/api/embed", {
                params: { q: query },
            });
            const vec = embedResponse.data.result.embedding;

            // 请求分类结果
            const categorizeResponse = await axios.get("http://localhost:8000/api/categorize", {
                params: { q: query },
            });
            // console.log(categorizeResponse.data.result.tags);
            setResults(categorizeResponse.data.result);
            console.log(results);

            // 更新图表数据
            //updateChartData(vec, categorizeResponse.data.result.categories);

            setLoading(false);
        } catch (error) {
            console.error("Error during categorization:", error);
            setLoading(false);
        }
    };

    //将API响应转换为图表可用的数据格式
    const transformGraphData = (graphData) => {
        // Transform logic here
        return { datasets: [] }; // 返回转换后的数据
    };

    // 根据嵌入向量和分类结果更新图表
    const updateChartData = () => {
        // 假设每个分类结果包含 top_category 和其他你需要的字段
        
    };


    return (
        <div>
            <h2>Categorize Product</h2>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && categorize()}
                placeholder="Enter product name"
            />
            {loading && <p>Loading...</p>}
            <div>
                <h3>Results:</h3>
                {/* 显示分类结果 */}
                {results.map((result, index) => (
                    <p key={index}>
                        {/* {result.top_category} / {result.category} */}
                        {result.title} / {result.top_category}
                    </p>
                ))}
            </div>
            <EmbeddingChart datacollection={datacollection} />
        </div>
    );
};

export default HomePage;
