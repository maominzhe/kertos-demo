import json
import os

from fastapi import FastAPI

# from goods_categorizer.categorizer import GoodsCategorizer
# from goods_categorizer.config import DATA_DIR

import sys

# 将项目根目录添加到 sys.path 中
project_root = '/Users/maomao/VisualStudioProjects/kertos-demo'
if project_root not in sys.path:
    sys.path.insert(0, project_root)
    
#from backend.categorizer import NeuralSearcher
from backend.categorizer import NeuralSearcher
from backend.categorizer import DATA_DIR
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 允许这个域名的跨域请求
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有头
)

#neural_searcher = GoodsCategorizer()
neural_searcher = NeuralSearcher(collection_name='zalando')

graph_path = os.path.join(DATA_DIR, 'graph.json')
print(os.path.join(DATA_DIR, 'graph.json'))


#@app.get("/api/categorize")
# async def categorize(q: str):
#     return {
#         "result": neural_searcher.categorize(good=q)
#     }

@app.get("/api/categorize")
async def categorize(q: str):
    return {
        "result": neural_searcher.search(text=q)
    }


@app.get("/api/embed")
async def embed(q: str):
    return {
        "result": neural_searcher.embed(good=q)
    }


@app.get("/api/graph")
async def get_graph():
    with open(graph_path) as fd:
        return json.load(fd)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)