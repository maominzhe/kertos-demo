import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from 'lodash';
import EmbeddingChart from "../components/EmbeddingChart";

const HomePage = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [datacollection, setDatacollection] = useState({
    //     datasets: [{
    //         data: [],
    //         backgroundColor: 'rgba(255, 99, 132, 0.5)',
    //     }]
    // });

    const [datacollection, setDatacollection] = useState({ datasets: [] });

    const palette = [
        "#db5f57aa", "#db9057aa", "#dbc257aa", "#c3db57aa", "#91db57aa",
        "#5fdb57aa", "#57db80aa", "#57dbb2aa", "#57d3dbaa", "#57a2dbaa",
        "#5770dbaa", "#6f57dbaa", "#a157dbaa", "#d357dbaa", "#db57b2aa",
        "#db5780aa"
    ];

    useEffect(() => {
        loadInitialGraphData();
    }, []);

    const loadInitialGraphData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/api/graph");
            const graphData = response.data;
            processData(graphData, []); // Initially process without highlighting
        } catch (error) {
            console.error("Failed to load initial graph data:", error);
        } finally {
            setLoading(false);
        }
    };

    const categorize = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const categorizeResponse = await axios.get("http://localhost:8000/api/categorize", { params: { q: query } });
            const idsToHighlight = categorizeResponse.data.result.map(item => item.id);

            // Re-fetch or use cached data to process with highlighting
            const response = await axios.get("http://localhost:8000/api/graph");
            const graphData = response.data;
            processData(graphData, idsToHighlight);

            setResults(categorizeResponse.data.result);
        } catch (error) {
            console.error("Error during categorization:", error);
        } finally {
            setLoading(false);
        }
    };

    const processData = (graphData, idsToHighlight) => {
        const categoryToColor = {};
        const categoryDatasets = {}; // 用于存储每个类别的数据点集合

        console.log(idsToHighlight);
    
        graphData.forEach(item => {
            if (!categoryToColor[item.top_category]) {
                const colorIndex = Object.keys(categoryToColor).length % palette.length;
                categoryToColor[item.top_category] = palette[colorIndex];
            }
    
            const isHighlighted = idsToHighlight.includes(item.blog_post_id);
            const dataPoint = {
                label: item.top_category,
                x: item.vec[0],
                y: item.vec[1],
                r: isHighlighted ? 15 : 5,
                borderColor: categoryToColor[item.top_category],
                borderWidth: isHighlighted ? 2 : 0,
                backgroundColor: isHighlighted ? categoryToColor[item.top_category] : 'rgba(0, 0, 0, 0)',
                title: item.title,
                content_url: item.content_url,
                blog_post_id: item.blog_post_id
            };
    
            // 将数据点分配到对应类别的数据集中
            if (!categoryDatasets[item.top_category]) {
                categoryDatasets[item.top_category] = {
                    label: item.top_category,
                    data: [],
                    backgroundColor: categoryToColor[item.top_category],
                };
            }
            categoryDatasets[item.top_category].data.push(dataPoint);
        });
    
        // 将对象转换为数组，因为数据集需要是一个数组
        const datasets = Object.values(categoryDatasets);
    
        setDatacollection({ datasets });
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
                {results.map((result, content_url,index) => (
                    <p key={index}>
                        <a href={content_url} target="_blank" rel="noopener noreferrer">
                        {result.title}
                        </a>
                    </p>
                ))}
            </div>
            <EmbeddingChart datacollection={datacollection} />
        </div>
    );
};

export default HomePage;
